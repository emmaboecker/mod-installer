import React, {useEffect, useState} from "react";
import {useModInstallStateContext} from "../../pages/installing/InstallingModsPage";
import {Mod} from "../../../types/modProfile";
import {useDragMinecraftFolderContext} from "../../../context/MinecraftFolderStateContextProvider";
import {useProfileContext} from "../../../context/ProfileContextProvider";
import {Stepper, Title} from "@mantine/core";
import {InstallType, useAppState} from "../../../pages/_app";
import {useError} from "../../../context/ErrorContextProvider";
import JSZip from "jszip";
import {installToModZip} from "../../../lib/install/manual/installToModZip";
import {ModInstallState} from "../../../lib/install/ModInstallState";
import Head from "next/head";
import {Installer} from "./installer";

type Props = {
    installAutomatically: boolean
}

export function ModInstallingElements({installAutomatically}: Props) {
    const minecraftDirContext = useDragMinecraftFolderContext()

    const errorContext = useError()
    const appStateContext = useAppState()

    const profileContext = useProfileContext()
    const modInstallStatesContext = useModInstallStateContext()

    const [installing, setInstalling] = useState(false)

    const [activeMod, setActiveMod] = useState(0)

    const [zip] = useState(new JSZip())

    const [mods, setMods] = useState<Mod[]>([])

    const [installer, setInstaller] = useState<Installer>()

    useEffect(() => {
        const newMods: Mod[] = []
        modInstallStatesContext.modInstallStates.forEach((value, key) => {
            if (value !== ModInstallState.SKIPPED) {
                newMods.push(key)
            }
        })
        setMods(newMods)

        const installer = new Installer(
            newMods,
            modInstallStatesContext,
            minecraftDirContext.minecraftDir!!,
            profileContext,
            errorContext,
            appStateContext,
            zip
        )
        setInstaller(installer)

        mods.forEach((value, index) => {
            if (modInstallStatesContext.modInstallStates.get(value) === ModInstallState.INSTALLING) {
                setActiveMod(index)
            }
        })
        if (!installing) {
            if (installAutomatically && !minecraftDirContext.minecraftDir) {
                errorContext.setError("No minecraft directory selected")
                return
            }
            if (installAutomatically) {
                installer.prepareInstallation(appStateContext.installType).then(undefined)
            }
            installer.findFirstMod().then(() => {
                setInstalling(true)
            })
        } else {
            const mod = mods[activeMod]
            if (installAutomatically) {
                if (appStateContext.installType === InstallType.MINECRAFT_LAUNCHER) {
                    installer.installInMinecraftLauncher(mod).then(newState => installer.setNewState(mod, newState, setActiveMod))
                } else if (appStateContext.installType === InstallType.MULTIMC) {
                    installer.installInMultiMc(mod).then(newState => installer.setNewState(mod, newState, setActiveMod))
                }
            } else {
                installToModZip(mod, zip).then(newState => installer.setNewState(mod, newState, setActiveMod))
            }
        }
    }, [installing, activeMod, minecraftDirContext.minecraftDir])


    if (installer && mods && mods.length > 0) {
        return (
            <>
                <Head>
                    <title>Installing {mods[activeMod].name}</title>
                </Head>
                <Stepper
                    active={activeMod}
                    color="violet" orientation="vertical"
                    style={{
                        marginTop: "1.5vmin"
                    }}
                >
                    {installer.getElementsForMods(mods)}
                </Stepper>
            </>
        )
    } else {
        return <Title order={2}>Loading Mods</Title>
    }
}
