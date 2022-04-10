import {useModEditorContext} from "../ModEditor";
import {TextInput} from "@mantine/core";
import {useEffect, useState} from "react";

export function ModListKeyEditor() {
    const modProfileContext = useModEditorContext()

    useEffect(() => {
        modProfileContext.modProfile.oldkey = modProfileContext.modProfile._id
    }, [])

    const [value, setValue] = useState(modProfileContext.modProfile._id)

    return (
        <TextInput
            placeholder="The key of your Mod-List"
            label="Mod-List Key"
            size="md"
            description="The Key of the url after /install/"
            value={value}
            onChange={(event) => {
                modProfileContext.modProfile._id = event.currentTarget.value
                setValue(event.currentTarget.value)
            }}
            required
            autoComplete="off"
        />
    )
}
