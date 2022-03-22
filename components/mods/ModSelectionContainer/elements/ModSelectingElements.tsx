import {Text, useMantineTheme} from "@mantine/core";
import React, {Dispatch, SetStateAction} from "react";
import {ModTypeContainer} from "../../ModTypeContainer/ModTypeContainer";
import {SelectButton} from "./SelectButton";
import {useProfileContext} from "../../../../context/ProfileContextProvider";
import {sortMods} from "../../../../lib/sortMods";
import {Mod} from "../../../../lib/type/modProfile";

type Props = {
    mods: Mod[]
}

export function ModSelectingElements({mods}: Props) {
    const theme = useMantineTheme()

    const profileContext = useProfileContext()

    const modsSorted = sortMods(mods)
    const elements: React.ReactNode[] = []

    function getElementsForMods(mods: Mod[], modStates: Map<Mod, boolean>, setModStates: Dispatch<SetStateAction<Map<Mod, boolean>>>) {
        const modElements: React.ReactNode[] = []

        mods.forEach(value => {
            const active = modStates.get(value)
            modElements.push((
                <div style={{width: "100%", marginBottom: "15px", paddingLeft: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "30px"}}>
                    <Text color={theme.white} style={{fontWeight: "bold"}}>{value.name}</Text>
                    <SelectButton mod={value} modStates={modStates} setModStates={setModStates} active={active!!} required={value.required} />
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

    return <> {elements} </>
}