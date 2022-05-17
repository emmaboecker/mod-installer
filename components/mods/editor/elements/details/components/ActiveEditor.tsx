import {Center, Space, Switch} from "@mantine/core";
import {Dispatch, SetStateAction} from "react";

type Props = {
    required: boolean,
    setRequired: Dispatch<SetStateAction<boolean>>,
    defaultActivated: boolean,
    setDefaultActivated: Dispatch<SetStateAction<boolean>>,
}

export function ActiveEditor({required, setRequired, defaultActivated, setDefaultActivated}: Props) {
    return (
        <Center>
            <Switch
                checked={required}
                label="Required"
                onChange={(event) => {
                    setRequired(event.currentTarget.checked)
                    setDefaultActivated(event.currentTarget.checked)
                }}
            />
            <Space w="xl"/>
            <Switch
                checked={
                    required ? true : defaultActivated
                }
                disabled={required}
                label="Activated by default"
                onChange={(event) => setDefaultActivated(event.currentTarget.checked)}
            />
        </Center>
    )
}
