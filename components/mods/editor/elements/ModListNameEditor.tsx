import {useModEditorContext} from "../ModEditor";
import {TextInput} from "@mantine/core";
import {useState} from "react";

export function ModListNameEditor() {
    const modProfileContext = useModEditorContext()

    const [value, setValue] = useState(modProfileContext.modProfile.name)

    return (
        <TextInput
            placeholder="The Name of your Mod-List"
            label="Mod-List Name"
            size="md"
            description="The Name of your Mod-List shown on this website"
            value={value}
            onChange={(event) => {
                modProfileContext.modProfile.name = event.currentTarget.value
                setValue(event.currentTarget.value)
            }}
            required
            autoComplete="off"
        />
    )
}
