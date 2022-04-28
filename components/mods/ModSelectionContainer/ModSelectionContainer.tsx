import {ScrollArea, Text, useMantineTheme} from "@mantine/core";
import React from "react";
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

    modsSorted.forEach((value, key) => {
        elements.push((
            <>
                <ModTypeContainer type={key}/>
                {
                    value.map((mod, index) =>
                        <div
                            style={{
                                width: "90%",
                                margin: "1.2vmin",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}
                            key={index}
                        >
                            <Text color={theme.white} style={{fontWeight: "bold"}}>{mod.name}</Text>
                            <SelectButton mod={mod} modStates={profileContext.modStates}
                                          setModStates={profileContext.setModStates}
                                          active={profileContext.modStates.get(mod)!!}
                                          required={mod.required}/>
                        </div>
                    )
                }
            </>
        ))
    })

    return <ScrollArea type="auto" style={{height: "80vh", width: "70vmin"}}> {elements} </ScrollArea>
}


