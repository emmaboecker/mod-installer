import {cloneMap} from "../../../../lib/cloneMap";
import {Button, Tooltip} from "@mantine/core";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Mod} from "../../../../lib/type/modProfile";

type Props = {
    mod: Mod
    active: boolean
    required: boolean
    modStates: Map<Mod, boolean>
    setModStates: Dispatch<SetStateAction<Map<Mod, boolean>>>
}

export function SelectButton({mod, active, required, modStates, setModStates}: Props) {
    const [incompatibleWith, setIncompatibleWith] = useState([] as Mod[])

    useEffect(() => {
        const newList = [] as Mod[]
        modStates.forEach((value, key) => {
            if (value && mod.incompatible?.map(it => it.toLowerCase()).includes(key.name.toLowerCase())) {
                newList.push(key)
            }
        })
        if (newList.length > 0 && active) {
            setModStates(cloneMap(modStates).set(mod, false))
        }
        setIncompatibleWith(newList)
    }, [modStates])

    function getToolTip(children: React.ReactNode, show: boolean) {
        if (show) {
            return (
                <Tooltip
                    position="left"
                    placement="center"
                    withArrow
                    transition="pop-top-left"
                    width={260}
                    wrapLines
                    label={`This Mod is incompatible with: ${incompatibleWith.map(value => value.name).join(", ")}`}
                >
                    {children}
                </Tooltip>
            )
        } else {
            return children
        }
    }

    return getToolTip((
        <Button
            variant="light"
            color={active ? "green" : "red"}
            disabled={required || incompatibleWith.length > 0}
            onClick={() => {
                setModStates(cloneMap(modStates).set(mod, !active))
            }}
            radius="lg"
        >
            {
                required ? "Required" :
                    incompatibleWith.length > 0 ? "Incompatible" :
                        (active ? "Enabled" : "Disabled")
            }
        </Button>
    ), incompatibleWith.length > 0)
}