import {ContentFrame} from "../../ContentFrame/ContentFrame";
import {Space, Text, useMantineTheme} from "@mantine/core";
import {ModInstallingContainer} from "../../mods/ModInstallingContainer/ModInstallingContainer";
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {ModInstallState} from "../../mods/ModInstallingContainer/modInstallFunctions";
import {useProfileContext} from "../../../context/ProfileContextProvider";
import {Mod} from "../../../lib/type/modProfile";

export type InstallStateContextProps = {
    modInstallStates: Map<Mod, ModInstallState>
    setModInstallStates: Dispatch<SetStateAction<Map<Mod, ModInstallState>>>
}

const InstallStateContext = React.createContext({} as InstallStateContextProps)

export function InstallingModsPage() {
    const theme = useMantineTheme()

    const profileContext = useProfileContext()

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
            <ContentFrame
                borderColor={theme.colors.dark[6]}
                leftColumn={
                    <>
                        <Text size="xl" style={{
                            color: "white",
                            fontWeight: "bold"
                        }}>
                            Installing...
                        </Text>
                        <Space h="xs"/>
                        <Text color="gray">This shouldn&apos;t take too long</Text>
                    </>
                }
                rightColumn={
                    <>
                        <Text style={{
                            fontWeight: "bold",
                            marginTop: "23px",
                            marginBottom: "10px",
                            marginLeft: "10px"
                        }}
                              size="lg"
                        >
                            Installing
                        </Text>
                        <InstallStateContext.Provider value={{modInstallStates, setModInstallStates}}>
                            <ModInstallingContainer/>
                        </InstallStateContext.Provider>
                    </>
                }
            />
        )
    } else {
        return <Text>Loading Mods...</Text>
    }
}

export function useModInstallStateContext() {
    return useContext(InstallStateContext)
}
