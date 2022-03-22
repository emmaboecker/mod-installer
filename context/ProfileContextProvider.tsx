import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {cloneMap} from "../lib/cloneMap";
import {Mod, ModProfile} from "../lib/type/modProfile";

type Props = {
    children: React.ReactNode
}

export type ProfileContextProps = {
    profile: ModProfile | undefined
    modStates: Map<Mod, boolean>
    setModStates: Dispatch<SetStateAction<Map<Mod, boolean>>>
}

const ModStatesContext = React.createContext({} as ProfileContextProps)

export function ProfileContextProvider({children}: Props) {
    const [profile, setProfile] = useState(undefined as (ModProfile | undefined))

    const [modStates, setModStates] = useState(new Map<Mod, boolean>())

    useEffect(() => {
        fetch("/api/abc").then(response => {
            response.json().then(element => {
                setProfile(element as ModProfile)
                const newModStates = new Map<Mod, boolean>()
                for (let mod of (element as ModProfile).mods) {
                    newModStates.set(mod, mod.defaultActivated)
                }
                setModStates(newModStates)
            })
        })
    }, [])

    return (
        <ModStatesContext.Provider value={{profile, modStates, setModStates}}>
            {children}
        </ModStatesContext.Provider>
    )
}

export function useProfileContext() {
    return useContext(ModStatesContext)
}