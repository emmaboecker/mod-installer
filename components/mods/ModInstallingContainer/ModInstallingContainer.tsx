import {ScrollArea} from "@mantine/core";
import {ModInstallingElements} from "./elements/ModInstallingElements";

export function ModInstallingContainer() {
    return (
        <ScrollArea type="auto" style={{height: "470px"}}>
            <ModInstallingElements />
        </ScrollArea>
    )
}


