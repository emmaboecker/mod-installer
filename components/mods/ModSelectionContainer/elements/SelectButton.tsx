import {cloneMap} from "../../../../lib/cloneMap";
import {Button} from "@mantine/core";
import React, {Dispatch, SetStateAction} from "react";
import {Mod} from "../../../../lib/type/modProfile";

type Props = {
    mod: Mod
    active: boolean
    required: boolean
    modStates: Map<Mod, boolean>
    setModStates: Dispatch<SetStateAction<Map<Mod, boolean>>>
}

export function SelectButton({mod, active, required, modStates, setModStates}: Props) {
    return (
        <Button
            variant="light"
            color={active ? "green" : "red"}
            disabled={required}
            onClick={() => {
                setModStates(cloneMap(modStates).set(mod, !active))
            }}
            radius="lg"
        >
            {
                required ? "Required" : (active ? "Enabled" : "Disabled")
            }
        </Button>
    )
}