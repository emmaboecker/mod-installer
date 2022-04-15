import {cloneMap} from "../../../lib/cloneMap";
import {Button, Tooltip} from "@mantine/core";
import React, {Dispatch, ReactElement, SetStateAction, useEffect, useState} from "react";
import {Mod} from "../../../types/modProfile";

type Props = {
    mod: Mod
    active: boolean
    required: boolean
    modStates: Map<Mod, boolean>
    setModStates: Dispatch<SetStateAction<Map<Mod, boolean>>>
}

export function SelectButton({mod, active, required, modStates, setModStates}: Props) {
    const [incompatibleWith, setIncompatibleWith] = useState([] as Mod[])
    const [requiredBy, setRequiredBy] = useState([] as Mod[])

    useEffect(() => {
        const newIncompatibilities = [] as Mod[]
        const newRequirements = [] as Mod[]
        modStates.forEach((value, key) => {
            if (value) {
                modStates.forEach((enabled, current) => {
                    if (!newIncompatibilities.includes(current)) {
                        if (enabled && current.incompatible?.map(it => it.toLowerCase()).includes(mod.name.toLowerCase())) {
                            newIncompatibilities.push(current)
                        }
                    }
                })
            }
            if (!newIncompatibilities.includes(key)) {
                if (value && mod.incompatible?.map(it => it.toLowerCase()).includes(key.name.toLowerCase())) {
                    newIncompatibilities.push(key)
                } else if (value && key.requires?.map(it => it.toLowerCase()).includes(mod.name.toLowerCase())) {
                    newRequirements.push(key)
                }
            }
        })
        if (newIncompatibilities.length > 0 && active) {
            setModStates(cloneMap(modStates).set(mod, false))
        }
        if (newRequirements.length > 0 && !active) {
            setModStates(cloneMap(modStates).set(mod, true))
        }
        setIncompatibleWith(newIncompatibilities)
        setRequiredBy(newRequirements)
    }, [active, mod, modStates, setModStates])

    function getToolTip(children: ReactElement) {
        if (incompatibleWith.length > 0 || requiredBy.length > 0) {
            return (
                <Tooltip
                    position="left"
                    placement="center"
                    withArrow
                    transition="pop-top-left"
                    width={260}
                    wrapLines
                    label={
                        incompatibleWith.length > 0 ? `This Mod is incompatible with: ${incompatibleWith.map(value => value.name).join(", ")}` :
                            requiredBy.length > 0 ? `This Mod is Required by: ${requiredBy.map(value => value.name).join(", ")}` : ""
                    }
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
            disabled={required || incompatibleWith.length > 0 || requiredBy.length > 0}
            onClick={() => {
                setModStates(cloneMap(modStates).set(mod, !active))
            }}
            radius="lg"
        >
            {
                required ? "Required" :
                    incompatibleWith.length > 0 ? "Incompatible" :
                        requiredBy.length > 0 ? "Required" :
                            (active ? "Enabled" : "Disabled")
            }
        </Button>
    ))
}
