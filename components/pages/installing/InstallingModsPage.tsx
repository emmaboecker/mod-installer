import {Text} from "@mantine/core";
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {useProfileContext} from "../../../context/ProfileContextProvider";
import {Mod} from "../../../lib/type/modProfile";
import {ModInstallingElements} from "../../mods/ModInstallingContainer/ModInstallingElements";
import {useAppState} from "../../../pages/_app";
import {ModInstallState} from "../../../lib/install/ModInstallState";

export type InstallStateContextProps = {
    modInstallStates: Map<Mod, ModInstallState>
    setModInstallStates: Dispatch<SetStateAction<Map<Mod, ModInstallState>>>
}

const InstallStateContext = React.createContext({} as InstallStateContextProps)

export function InstallingModsPage() {
    const profileContext = useProfileContext()

    const appState = useAppState()

    useEffect(() => {
        const newMap = new Map<Mod, ModInstallState>()
        profileContext.modStates.forEach((value, key) => {
            newMap.set(key, value ? ModInstallState.PENDING : ModInstallState.SKIPPED)
        })
        setModInstallStates(newMap)
    }, [profileContext.modStates])

    const [modInstallStates, setModInstallStates] = useState(new Map<Mod, ModInstallState>())

    if (modInstallStates.size > 0) {
        return (
            <InstallStateContext.Provider value={{modInstallStates, setModInstallStates}}>
                <ModInstallingElements installAutomatically={appState.useAutomaticInstaller} />
            </InstallStateContext.Provider>
        )
    } else {
        return <Text>Loading Mods...</Text>
    }
}

export function useModInstallStateContext() {
    return useContext(InstallStateContext)
}