import {useModEditorContext} from "../ModEditor";
import {Select} from "@mantine/core";
import {useState} from "react";

const minecraftVersions = [
    "1.18.2",
    "1.18.1",
    "1.18",
    "1.17.1",
    "1.17",
    "1.16.5",
    "1.16.4",
    "1.16.3",
    "1.16.2",
    "1.16.1",
    "1.16",
    "1.15.2",
    "1.15.1",
    "1.14.4",
    "1.14.3",
    "1.14.2",
    "1.14.1",
    "1.14",
]

export function ModListMinecraftVersionEditor() {
    const modProfileContext = useModEditorContext()

    const [value, setValue] = useState(modProfileContext.modProfile.minecraftVersion)

    const [data, setData] = useState(minecraftVersions)

    return (
        <Select
            label="Minecraft Version"
            description="The Minecraft Version of your Mod-List. All your configured Mods should be compatible with this Version. The Version should be valid."
            size="md"
            searchable
            creatable
            required
            value={value ?? minecraftVersions[0]}
            onChange={newVersion => {
                modProfileContext.modProfile.minecraftVersion = newVersion ?? minecraftVersions[0]
                setValue(newVersion ?? minecraftVersions[0])
            }}
            data={data}
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => setData((current) => [...current, query])}
        />
    )
}
