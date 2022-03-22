import {Text, useMantineTheme} from "@mantine/core";
import {InstallingButton} from "./InstallingButton";
import {cloneMap} from "../../../../lib/cloneMap";
import {installMod, ModInstallState} from "../modInstallFunctions";
import React, {useEffect, useState} from "react";
import {useModInstallStateContext} from "../../../pages/installing/InstallingModsPage";
import {useDragMinecraftFolderContext} from "../../../../context/MinecraftFolderStateContextProvider";
import {useError} from "../../../../context/ErrorContextProvider";
import {AppState, useAppState} from "../../../../pages/_app";
import {Mod} from "../../../../lib/type/modProfile";
import {useProfileContext} from "../../../../context/ProfileContextProvider";

type Props = {
    mods: Mod[]
    mod: Mod
}

export function ModInstallingContainer({mods, mod}: Props) {
    const theme = useMantineTheme()

    const appStateContext = useAppState()

    const errorContext = useError()

    const modInstallStatesContext = useModInstallStateContext()
    const minecraftDir = useDragMinecraftFolderContext()

    const profileContext = useProfileContext()

    const [state, setState] = useState(modInstallStatesContext.modInstallStates.get(mod)!!)

    useEffect(() => {
        setState(modInstallStatesContext.modInstallStates.get(mod)!!)
        if (modInstallStatesContext.modInstallStates.get(mod) === ModInstallState.INSTALLING) {
            installMod(minecraftDir.minecraftDir as FileSystemDirectoryHandle, profileContext.profile!!, mod, errorContext.setError).then(newState => {
                const newMap = cloneMap(modInstallStatesContext.modInstallStates).set(mod, newState)
                modInstallStatesContext.setModInstallStates(newMap)
                for (let i = mods.indexOf(mod); i < mods.length; i++) {
                    if (mods[i + 1]) {
                        if (newMap.get(mods[i + 1]) === ModInstallState.PENDING) {
                            modInstallStatesContext.setModInstallStates(cloneMap(newMap).set(mods[i + 1], ModInstallState.INSTALLING))
                            break
                        } else if (newMap.get(mods[i + 1]) === ModInstallState.SKIPPED) {

                        }
                    }
                }
                let done = true
                newMap.forEach((value, key) => {
                    if (value !== ModInstallState.DONE && value !== ModInstallState.SKIPPED) {
                        done = false
                    }
                })
                if (done) {
                    appStateContext.setAppState(AppState.DONE)
                }
            })
        }

    }, [appStateContext, errorContext.setError, minecraftDir.minecraftDir, mod, modInstallStatesContext, modInstallStatesContext.modInstallStates, modInstallStatesContext, mods])

    return (
        <div style={{width: "100%", marginBottom: "15px", paddingLeft: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "30px"}}>
            <Text color={theme.white} style={{fontWeight: "bold"}}>{mod.name}</Text>
            <InstallingButton state={state}/>
        </div>
    )
}