import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {Mod} from "../../../../../types/modProfile";
import {useModEditorContext} from "../../ModEditor";
import {ModDetailsEditor} from "./ModDetailsEditor";
import {Box, Button, Center, Space, Title, useMantineTheme} from "@mantine/core";
import {Plus} from "tabler-icons-react";
import {useListState} from "@mantine/hooks";
import {UseListStateHandlers} from "@mantine/hooks/lib/use-list-state/use-list-state";
import {makeId} from "../../../../../lib/makeId";
import {ModDetailsModal} from "./ModDetailsModal";

type ContextProps = {
    mods: Mod[]
    updateMod(mod: Mod, newMod?: Mod): void
}

const ModDetailsContext = React.createContext({} as ContextProps)

export function ModListDetailsEditor() {
    const modEditorContext = useModEditorContext()
    const [mods, modsHandlers] = useListState(modEditorContext.modProfile.mods)

    const [modalOpen, setModalOpen] = useState(false)

    const theme = useMantineTheme()

    function updateMod(mod: Mod, newMod?: Mod) {
        if (newMod) {
            if (mods.includes(mod)) {
                modsHandlers.applyWhere((m) => m === mod, () => newMod)
            } else {
                modsHandlers.append(newMod)
            }
        } else {
            modsHandlers.remove(mods.indexOf(mod))
        }
    }

    useEffect(() => {
        modEditorContext.modProfile.mods = mods
    }, [modEditorContext.modProfile, mods])

    return (
        <ModDetailsContext.Provider value={{mods, updateMod}}>
            <Box style={{backgroundColor: theme.colors.dark[8], padding: "2%", borderRadius: "2vmin"}}>
                <Center style={{marginTop: "3%"}}>
                    <Title order={3}>Mods</Title>
                </Center>
                <Space h="md"/>
                {getEditors(mods, modsHandlers, modalOpen, setModalOpen)}
            </Box>
        </ModDetailsContext.Provider>
    )
}

export function useModDetailsContext() {
    return useContext(ModDetailsContext)
}

function getEditors(mods: Mod[], modsHandlers: UseListStateHandlers<Mod>, modalOpen: boolean, setModalOpen: Dispatch<SetStateAction<boolean>>) {
    return (
        <>
            {mods.map((value, index) =>
                <div key={value.id}>
                    <ModDetailsEditor mod={value} key={index}/>
                    <Space h="md"/>
                </div>
            )}
            <ModDetailsModal mod={{
                id: makeId(12),
                name: "Untitled Mod",
                type: "untitled",
                required: false,
                defaultActivated: false
            } as Mod} open={modalOpen} setOpen={setModalOpen} saveButtonText={"Add Mod"}/>
            <div>
                <Center>
                    <Button
                        variant="light"
                        onClick={() => {
                            setModalOpen(true)
                        }}
                    >
                        <Plus/>
                    </Button>
                </Center>
                <Space h="md"/>
            </div>
        </>
    )
}
