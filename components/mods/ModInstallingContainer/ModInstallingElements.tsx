import React, {useEffect, useState} from "react";
import {cloneMap} from "../../../lib/cloneMap";
import {useModInstallStateContext} from "../../pages/installing/InstallingModsPage";
import {installMod} from "../../../lib/install/vanillaLauncher/installMod";
import {Mod} from "../../../lib/type/modProfile";
import {useDragMinecraftFolderContext} from "../../../context/MinecraftFolderStateContextProvider";
import {useProfileContext} from "../../../context/ProfileContextProvider";
import {Stepper, Text} from "@mantine/core";
import {CircleCheck, CircleX} from "tabler-icons-react";
import {AppState, useAppState} from "../../../pages/_app";
import {useError} from "../../../context/ErrorContextProvider";
import JSZip from "jszip";
import {generateModZip} from "../../../lib/generateModZip";
import {ModInstallState} from "../../../lib/install/ModInstallState";
import {installVanillaLauncher} from "../../../lib/install/vanillaLauncher/installVanillaLauncher";

type Props = {
    installAutomatically: boolean;
}

export function ModInstallingElements({installAutomatically}: Props) {
    const minecraftDir = useDragMinecraftFolderContext()

    const errorContext = useError()
    const appStateContext = useAppState()

    const profileContext = useProfileContext()
    const modInstallStatesContext = useModInstallStateContext()

    const [startedInstallCircle, setStartedInstallCircle] = useState(false)

    const [activeMod, setActiveMod] = useState(0)

    const [zip] = useState(new JSZip())

    useEffect(() => {
        mods.forEach((value, index) => {
            if (modInstallStatesContext.modInstallStates.get(value) === ModInstallState.INSTALLING) {
                setActiveMod(index)
            }
        })
        if (!startedInstallCircle) {
            if (installAutomatically) {
                if (minecraftDir.minecraftDir) {
                    installVanillaLauncher(mods, minecraftDir.minecraftDir as FileSystemDirectoryHandle, profileContext, modInstallStatesContext, setStartedInstallCircle)
                } else {
                    errorContext.setError("No minecraft directory selected")
                }
            } else {
                for (let mod of mods) {
                    const modState = modInstallStatesContext.modInstallStates.get(mod)
                    if (modState === ModInstallState.PENDING) {
                        modInstallStatesContext.setModInstallStates(cloneMap(modInstallStatesContext.modInstallStates).set(mod, ModInstallState.INSTALLING))
                        setStartedInstallCircle(true)
                        break
                    }
                }
            }
        } else {
            const mod = mods[activeMod]
            if (installAutomatically) {
                installMod(minecraftDir.minecraftDir as FileSystemDirectoryHandle, profileContext.profile!!, mod, errorContext.setError).then(newState => setNewState(mod, newState))
            } else {
                generateModZip(mod, zip).then(newState => setNewState(mod, newState))
            }
        }
    }, [startedInstallCircle, activeMod, minecraftDir.minecraftDir])

    function setNewState(mod: Mod, newState: ModInstallState) {
        const newMap = cloneMap(modInstallStatesContext.modInstallStates).set(mod, newState)
        modInstallStatesContext.setModInstallStates(newMap)
        for (let i = mods.indexOf(mod); i < mods.length; i++) {
            if (mods[i + 1]) {
                if (newMap.get(mods[i + 1]) === ModInstallState.PENDING) {
                    setActiveMod(i + 1)
                    modInstallStatesContext.setModInstallStates(cloneMap(newMap).set(mods[i + 1], ModInstallState.INSTALLING))
                    break
                }
            }
        }
        let done = true
        newMap.forEach((value) => {
            if (value !== ModInstallState.DONE && value !== ModInstallState.SKIPPED) {
                done = false
            }
        })
        if (done) {
            if (!installAutomatically) {
                zip.generateAsync({ type: "blob" }).then(blob => {
                    const link = document.createElement('a');
                    const url = URL.createObjectURL(blob)
                    link.href = url;
                    link.download = encodeURIComponent(profileContext.profile!!.name) + ".zip";
                    link.click();
                    URL.revokeObjectURL(url);
                    link.remove();
                })
            }
            appStateContext.setAppState(AppState.DONE)
        }
    }

    function getElementsForMods(mods: Mod[]) {
        const modElements: React.ReactNode[] = []

        mods.forEach((value) => {
            const state = modInstallStatesContext.modInstallStates.get(value)
            modElements.push(
                <Stepper.Step
                    label={<Text size="lg">{value.name}</Text>}
                    style={state === ModInstallState.SKIPPED ? {color: "indianred"} : undefined}
                    description={
                        state === ModInstallState.SKIPPED ? "Skipped" :
                            state === ModInstallState.INSTALLING ? "Installing" :
                                state === ModInstallState.PENDING ? "Pending" : "Done"
                    }
                    completedIcon={
                        state === ModInstallState.SKIPPED ? <CircleX/> :
                            <CircleCheck/>
                    }
                    icon={state === ModInstallState.SKIPPED ? <CircleX/> : undefined}
                    loading={state === ModInstallState.INSTALLING}
                />
            )
        })

        return modElements
    }

    const mods: Mod[] = []
    modInstallStatesContext.modInstallStates.forEach((value, key) => {
        if (value !== ModInstallState.SKIPPED) {
            mods.push(key)
        }
    })

    return (
        <>
            <Stepper
                active={activeMod}
                color="violet" orientation="vertical"
                style={{
                    marginTop: "1.5vmin"
                }}
            >
                {getElementsForMods(mods)}
            </Stepper>
        </>
    )
}