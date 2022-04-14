import {useModEditorContext} from "../ModEditor";
import {TextInput} from "@mantine/core";
import {useState} from "react";

export function ModListDescriptionEditor() {
    const modProfileContext = useModEditorContext()

    const [value, setValue] = useState(modProfileContext.modProfile.description)

    return (
        <TextInput
            placeholder="The Description of your Mod-List"
            label="Mod-List Description"
            size="md"
            description="The Description of your Mod-List shown on this website"
            value={value}
            onChange={(event) => {
                modProfileContext.modProfile.description = event.currentTarget.value
                setValue(event.currentTarget.value)
            }}
            autoComplete="off"
        />
    )
}
