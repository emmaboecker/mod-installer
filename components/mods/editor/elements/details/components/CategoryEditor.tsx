import {TextInput} from "@mantine/core";
import {Dispatch, SetStateAction} from "react";

type Props = {
    type: string,
    setType: Dispatch<SetStateAction<string>>
}

export function CategoryEditor({type, setType}: Props) {
    return (
        <TextInput
            label="Category"
            placeholder="Category"
            size="md"
            description="The Category this mod will be shown with"
            value={type}
            onChange={(event) => {
                setType(event.currentTarget.value)
            }}
            required
            autoComplete="off"
        />
    )
}
