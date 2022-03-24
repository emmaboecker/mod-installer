import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {Mod, ModProfile} from "../lib/type/modProfile";
import {LoadingPage} from "../components/pages/loading/LoadingPage";
import {Center, Group, Text, Title} from "@mantine/core";

type Props = {
    id: string
    children: React.ReactNode
}

export type ProfileContextProps = {
    profile: ModProfile | undefined
    modStates: Map<Mod, boolean>
    setModStates: Dispatch<SetStateAction<Map<Mod, boolean>>>
}

enum ProfileState {
    LOADING,
    FOUND,
    NOT_FOUND
}

const ModStatesContext = React.createContext({} as ProfileContextProps)

export function ProfileContextProvider({id, children}: Props) {
    const [profile, setProfile] = useState(undefined as (ModProfile | undefined))
    const [profileState, setProfileState] = useState(ProfileState.LOADING)

    const [modStates, setModStates] = useState(new Map<Mod, boolean>())

    useEffect(() => {
        fetch(`/api/${id}`).then(response => {
            response.json().then(element => {
                if (response.status === 200) {
                    setProfile(element as ModProfile)
                    const newModStates = new Map<Mod, boolean>()
                    for (let mod of (element as ModProfile).mods) {
                        newModStates.set(mod, mod.defaultActivated)
                    }
                    setModStates(newModStates)
                    setProfileState(ProfileState.FOUND)
                } else {
                    setProfile(undefined)
                    setProfileState(ProfileState.NOT_FOUND)
                }
            })
        })
    }, [])

    if (profile && profileState === ProfileState.FOUND) {
        return (
            <ModStatesContext.Provider value={{profile, modStates, setModStates}}>
                {children}
            </ModStatesContext.Provider>
        )
    } else if (!profile && profileState === ProfileState.LOADING) {
        return <LoadingPage/>
    } else if (!profile && profileState === ProfileState.NOT_FOUND) {
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
    } else {
        return <LoadingPage/>
    }
}

export function useProfileContext() {
    return useContext(ModStatesContext)
}