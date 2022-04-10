import {useModEditorContext} from "../ModEditor";
import {useState} from "react";
import {TextInput} from "@mantine/core";

export function ModListLauncherNameEditor() {
    const modProfileContext = useModEditorContext()

    const [value, setValue] = useState(modProfileContext.modProfile.profileName)

    return (
        <TextInput
            placeholder="The Minecraft Launcher Name of your Mod-List"
            label="Mod-List Minecraft Launcher Name"
            size="md"
            description="The Name of your Mod-List shown on in the Minecraft Launcher"
            value={value}
            onChange={(event) => {
                modProfileContext.modProfile.profileName = event.currentTarget.value
                setValue(event.currentTarget.value)
            }}
            required
            autoComplete="off"
        />
    )
}
