import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import {Mod} from "../../../../types/modProfile";
import {useModEditorContext} from "../ModEditor";
import {ModDetailsEditor} from "./ModDetailsEditor";
import {Box, Button, Center, Space, Title, useMantineTheme} from "@mantine/core";
import {Plus} from "tabler-icons-react";
import {useListState} from "@mantine/hooks";
import {UseListStateHandler} from "@mantine/hooks/lib/use-list-state/use-list-state";

type ContextProps = {
    mods: Mod[]
    updateMod(mod: Mod, newMod?: Mod): void
}

const ModDetailsContext = React.createContext({} as ContextProps)

export function ModListDetailsEditor() {
    const modEditorContext = useModEditorContext()
    const [mods, modsHandlers] = useListState(modEditorContext.modProfile.mods)

    const [newMod, setNewMod] = useState(undefined as undefined | Mod)

    const theme = useMantineTheme()

    function updateMod(mod: Mod, newMod?: Mod) {
        if (newMod) {
            modsHandlers.applyWhere( (m) => m === mod, () => newMod)
        } else {
            mods.forEach((value, index) => {
                if (value === mod) {
                    modsHandlers.remove(index)
                }
            })
        }
    }

    return (
        <ModDetailsContext.Provider value={{mods, updateMod}}>
            <Box style={{backgroundColor: theme.colors.dark[8], padding: "2%", borderRadius: "2vmin"}}>
                <Center style={{marginTop: "3%"}}>
                    <Title order={3}>Mods</Title>
                </Center>
                <Space h="md"/>
                {getEditors(mods, newMod, modsHandlers, setNewMod)}
            </Box>
        </ModDetailsContext.Provider>
    )
}

export function useModDetailsContext() {
    return useContext(ModDetailsContext)
}

function getEditors(mods: Mod[], newMod: Mod | undefined, modsHandlers: UseListStateHandler<Mod>, setNewMod: Dispatch<SetStateAction<Mod | undefined>>) {
    const elements: React.ReactNode[] = []

    mods.forEach(value => {
        elements.push(
            <>
                <ModDetailsEditor mod={value} openPopUp={value === newMod}/>
                <Space h="md"/>
            </>
        )
    })

    elements.push(
        <>
            <Center>
                <Button
                    variant="light"
                    onClick={() => {
                        const newMod = {
                            name: "Untitled Mod",
                            type: "untitled",
                            required: false,
                            defaultActivated: false
                        } as Mod
                        modsHandlers.append(newMod)
                        setNewMod(newMod)
                    }}
                >
                    <Plus/>
                </Button>
            </Center>
            <Space h="md"/>
        </>
    )


    return elements
}
