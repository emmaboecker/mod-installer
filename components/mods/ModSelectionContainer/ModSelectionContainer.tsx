import {ScrollArea} from "@mantine/core";
import React from "react";
import {ModSelectingElements} from "./elements/ModSelectingElements";
import {Mod} from "../../../lib/type/modProfile";

type ModSelectionContainerProps = {
    mods: Mod[]
}

export function ModSelectionContainer({mods}: ModSelectionContainerProps) {
    return (
        <ScrollArea type="auto" style={{height: "80vh", width: "70vmin"}}>
            <ModSelectingElements mods={mods}/>
        </ScrollArea>
    )
}


