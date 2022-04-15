import {ScrollArea, Text, useMantineTheme} from "@mantine/core";
import React, {Dispatch, SetStateAction} from "react";
import {Mod} from "../../../types/modProfile";
import {useProfileContext} from "../../../context/ProfileContextProvider";
import {sortMods} from "../../../lib/install/sortMods";
import {SelectButton} from "./SelectButton";
import {ModTypeContainer} from "../ModTypeContainer/ModTypeContainer";

type ModSelectionContainerProps = {
    mods: Mod[]
}

export function ModSelectionContainer({mods}: ModSelectionContainerProps) {
    const theme = useMantineTheme()

    const profileContext = useProfileContext()

    const modsSorted = sortMods(mods)
    const elements: React.ReactNode[] = []

    function getElementsForMods(mods: Mod[], modStates: Map<Mod, boolean>, setModStates: Dispatch<SetStateAction<Map<Mod, boolean>>>) {
        const modElements: React.ReactNode[] = []

        mods.forEach(value => {
            let active = modStates.get(value)
            modElements.push((
                <div style={{
                    width: "90%",
                    margin: "1.2vmin",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
                >
                    <Text color={theme.white} style={{fontWeight: "bold"}}>{value.name}</Text>
                    <SelectButton mod={value} modStates={modStates} setModStates={setModStates} active={active!!}
                                  required={value.required}/>
                </div>
            ))
        })

        return modElements
    }

    modsSorted.forEach((value, key) => {
        elements.push((
            <>
                <ModTypeContainer type={key}/>
                {getElementsForMods(value, profileContext.modStates, profileContext.setModStates)}
            </>
        ))
    })

    return <ScrollArea type="auto" style={{height: "80vh", width: "70vmin"}}> {elements} </ScrollArea>
}


