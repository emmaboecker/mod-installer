import {TextInput} from "@mantine/core";
import {Dispatch, SetStateAction} from "react";

type Props = {
    name: string,
    setName: Dispatch<SetStateAction<string>>
}

export function NameEditor({name, setName}: Props) {
    return (
        <TextInput
            label="Name"
            placeholder="Name"
            size="md"
            description="The Name of this Mod"
            value={name}
            onChange={(event) => {
                setName(event.currentTarget.value)
            }}
            required
            autoComplete="off"
        />
    )
}
