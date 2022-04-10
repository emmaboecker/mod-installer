import {useModEditorContext} from "../ModEditor";
import {TextInput} from "@mantine/core";
import {useState} from "react";

export function ModListIconEditor() {
    const modProfileContext = useModEditorContext()

    const [value, setValue] = useState(modProfileContext.modProfile.icon)

    return (
        <TextInput
            placeholder="The Icon of your Mod-List"
            label="Mod-List Icon"
            size="md"
            description="The Icon of your Mod-List shown in the Minecraft Launcher. Can be an Base64-encoded image or one of the default icons of the Launcher (e.g. `Crafting_Table`)"
            value={value}
            onChange={(event) => {
                modProfileContext.modProfile.icon = event.currentTarget.value
                setValue(event.currentTarget.value)
            }}
            required
            autoComplete="off"
        />
    )
}
