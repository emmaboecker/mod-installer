import React, {useEffect, useState} from "react";
import {cloneMap} from "../../../lib/cloneMap";
import {useModInstallStateContext} from "../../pages/installing/InstallingModsPage";
import {copySettings, createLauncherProfile, createVersion, installMod, ModInstallState} from "./modInstallFunctions";
import {Mod} from "../../../lib/type/modProfile";
import {useDragMinecraftFolderContext} from "../../../context/MinecraftFolderStateContextProvider";
import {useProfileContext} from "../../../context/ProfileContextProvider";
import {Stepper, Text} from "@mantine/core";
import {CircleCheck, CircleX} from "tabler-icons-react";
import {AppState, useAppState} from "../../../pages/_app";
import {useError} from "../../../context/ErrorContextProvider";


export function ModInstallingElements() {
    const minecraftDir = useDragMinecraftFolderContext()

    const errorContext = useError()
    const appStateContext = useAppState()

    const profileContext = useProfileContext()
    const modInstallStatesContext = useModInstallStateContext()

    const [startedInstallCircle, setStartedInstallCircle] = useState(false)

    const [activeMod, setActiveMod] = useState(0)

    useEffect(() => {
        mods.forEach((value, index) => {
            if (modInstallStatesContext.modInstallStates.get(value) === ModInstallState.INSTALLING) {
                setActiveMod(index)
            }
        })
        if (!startedInstallCircle) {
            if (minecraftDir.minecraftDir) {
                copySettings(minecraftDir.minecraftDir as FileSystemDirectoryHandle, profileContext.profile!!).then(() => {
                    createLauncherProfile(minecraftDir.minecraftDir as FileSystemDirectoryHandle, profileContext.profile!!).then(() => {
                        createVersion(minecraftDir.minecraftDir as FileSystemDirectoryHandle, profileContext.profile!!).then(() => {
                            for (let mod of mods) {
                                const modState = modInstallStatesContext.modInstallStates.get(mod)
                                if (modState === ModInstallState.PENDING) {
                                    modInstallStatesContext.setModInstallStates(cloneMap(modInstallStatesContext.modInstallStates).set(mod, ModInstallState.INSTALLING))
                                    setStartedInstallCircle(true)
                                    break
                                }
                            }
                        })
                    })
                })
            }
        } else {
            const mod = mods[activeMod]
            installMod(minecraftDir.minecraftDir as FileSystemDirectoryHandle, profileContext.profile!!, mod, errorContext.setError).then(newState => {
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
                    appStateContext.setAppState(AppState.DONE)
                }
            })
        }
    }, [startedInstallCircle, activeMod, minecraftDir.minecraftDir])

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