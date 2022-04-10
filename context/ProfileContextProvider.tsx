import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {Mod, ModProfile} from "../types/modProfile";
import {Center, Group, Text, Title} from "@mantine/core";

type Props = {
    children: React.ReactNode,
    modProfile: ModProfile | undefined
}

export type ProfileContextProps = {
    modProfile: ModProfile | undefined
    modStates: Map<Mod, boolean>
    setModStates: Dispatch<SetStateAction<Map<Mod, boolean>>>
}

const ModStatesContext = React.createContext({} as ProfileContextProps)

export function ProfileContextProvider({children, modProfile}: Props) {
    const [modStates, setModStates] = useState(new Map<Mod, boolean>())

    useEffect(() => {
        if (modProfile) {
            const newModStates = new Map<Mod, boolean>()
            for (let mod of modProfile.mods) {
                newModStates.set(mod, mod.defaultActivated)
            }
            setModStates(newModStates)
        }
    }, [modProfile, modProfile?.mods])

    if (modProfile) {
        return (
            <ModStatesContext.Provider value={{modProfile, modStates, setModStates}}>
                {children}
            </ModStatesContext.Provider>
        )
    } else {
        return (
            <Group direction="column">
                <Center style={{marginTop: "50px"}}>
                    <Title>Profile not Found</Title>
                </Center>
                <Center>
                    <Text size="lg">This Profile wasn&apos;t found</Text>
                </Center>
            </Group>
        )
    }
}

export function useProfileContext() {
    return useContext(ModStatesContext)
}
