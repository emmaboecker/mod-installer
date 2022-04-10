import {Center, Space, Switch, Text} from "@mantine/core";
import {useState} from "react";
import {useModEditorContext} from "../ModEditor";

export function ModListVerifiedEditor() {
    const modProfileContext = useModEditorContext()

    const [value, setValue] = useState(modProfileContext.modProfile.verified)

    return (
        <div>
            <Center>
                <Text>Should this Mod-List be verified</Text>
            </Center>
            <Space h="xl"/>
            <Center>
                <Switch
                    checked={value}
                    label="Verified"
                    onChange={(event) => {
                        modProfileContext.modProfile.verified = event.currentTarget.checked
                        setValue(event.currentTarget.checked)
                    }}
                />
            </Center>
        </div>
    )
}
