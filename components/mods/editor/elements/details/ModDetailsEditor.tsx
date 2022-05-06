import {useModDetailsContext} from "./ModListDetailsEditor";
import {Button, Center, Modal, MultiSelect, Space, Switch, Text, TextInput} from "@mantine/core";
import {Mod} from "../../../../../types/modProfile";
import {useEffect, useState} from "react";
import {Edit, TrashX} from "tabler-icons-react";

type Props = {
    mod: Mod,
    openPopUp: boolean
}

export function ModDetailsEditor({mod, openPopUp}: Props) {
    const context = useModDetailsContext()

    const [opened, setOpened] = useState(openPopUp);
    const [selectData, setSelectData] = useState([] as any[])

    const [name, setName] = useState(mod.name)
    const [type, setType] = useState(mod.type)
    const [downloadLink, setDownloadLink] = useState(mod.downloadLink)

    const [required, setRequired] = useState(mod.required);
    const [defaultActivated, setDefaultActivated] = useState(mod.defaultActivated);

    const [requires, setRequires] = useState(mod.requires)
    const [incompatible, setIncompatible] = useState(mod.incompatible)

    useEffect(() => {
        const data: any[] = []
        context.mods.forEach(value => {
            if (value.name !== mod.name) {
                data.push(
                    {
                        value: value.name,
                        label: value.name
                    }
                )
            }
        })
        setSelectData(data)
        setRequires(mod.requires)
        setIncompatible(mod.incompatible)
    }, [context.mods, mod.incompatible, mod.name, mod.requires])

    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
                title={name}
            >
                <TextInput
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
                <Space h="sm"/>
                <TextInput
                    placeholder="Type"
                    size="md"
                    description="The Category this mod will be shown with"
                    value={type}
                    onChange={(event) => {
                        setType(event.currentTarget.value)
                    }}
                    required
                    autoComplete="off"
                />
                <Space h="sm"/>
                <TextInput
                    placeholder="Download Link"
                    size="md"
                    description="The Download Link of this Mod"
                    value={downloadLink}
                    onChange={(event) => {
                        setDownloadLink(event.currentTarget.value)
                    }}
                    required
                    autoComplete="off"
                />
                <Space h="sm"/>
                <Center>
                    <Switch
                        checked={required}
                        label="Required"
                        onChange={(event) => setRequired(event.currentTarget.checked)}
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
                <Space h="md"/>
                <MultiSelect
                    data={selectData}
                    value={requires}
                    onChange={value => {
                        const newValue: string[] = []
                        value.forEach(modName => {
                            if (context.mods.map(currentMod => currentMod.name).includes(modName)) {
                                newValue.push(modName)
                            }
                        })
                        setRequires(newValue)
                    }}
                    label="Required Mods"
                    placeholder="Pick all Mods that this Mod requires"
                    clearButtonLabel="Clear selection"
                    clearable
                />
                <Space h="sm"/>
                <MultiSelect
                    data={selectData}
                    value={incompatible}
                    onChange={value => {
                        const newValue: string[] = []
                        value.forEach(modName => {
                            if (context.mods.map(currentMod => currentMod.name).includes(modName)) {
                                newValue.push(modName)
                            }
                        })
                        setIncompatible(newValue)
                    }}
                    label="Incompatible Mods"
                    placeholder="Pick all Mods that this Mod is incompatible with"
                    clearButtonLabel="Clear selection"
                    clearable
                />
                <Space h="md"/>
                <Button
                    variant="light"
                    onClick={() => {
                        const newMod = mod
                        context.mods.forEach(current => {
                            const newRequires: string[] = []
                            let newIncompatibles: string[] = []
                            current.requires?.forEach(value => {
                                if (value === mod.name) {
                                    newRequires.push(name)
                                } else {
                                    newRequires.push(value)
                                }
                            })
                            current.incompatible?.forEach(value => {
                                if (value === mod.name) {
                                    newIncompatibles.push(name)
                                } else {
                                    newIncompatibles.push(value)
                                }
                            })
                            if (!newIncompatibles.includes(name)) {
                                if (incompatible?.includes(current.name)) {
                                    newIncompatibles.push(name)
                                }
                            } else {
                                const old = newIncompatibles
                                newIncompatibles = []
                                old.forEach(value => {
                                    if (incompatible?.includes(value)) {
                                        newIncompatibles.push(value)
                                    }
                                })
                            }
                            current.requires = newRequires
                            current.incompatible = newIncompatibles
                            context.updateMod(current, current)
                        })
                        newMod.name = name
                        newMod.path = name.toLowerCase().replaceAll(/[^\w]/g, "-") + ".jar"
                        newMod.downloadLink = downloadLink
                        newMod.type = type
                        newMod.requires = requires
                        newMod.incompatible = incompatible
                        newMod.required = required
                        newMod.defaultActivated = defaultActivated
                        context.updateMod(mod, newMod)
                        setOpened(false)
                    }}
                >
                    Update Mod
                </Button>
                <Button
                    style={{float: "right"}}
                    variant="light"
                    color="gray"
                    onClick={() => {
                        setName(mod.name)
                        setDownloadLink(mod.downloadLink)
                        setType(mod.type)
                        setRequires(mod.requires)
                        setIncompatible(mod.incompatible)
                        setRequired(mod.required)
                        setDefaultActivated(mod.defaultActivated)
                        setOpened(false)
                    }}
                >
                    Discard
                </Button>
            </Modal>
            <div style={{display: "flex", width: "80%", margin: "auto"}}>
                <Text style={{margin: "auto", overflowWrap: "anywhere"}}>{name}</Text>
                <Space w="xl"/>
                <div style={{marginLeft: "auto", display: "flex"}}>
                    <Button
                        onClick={() => {
                            setOpened(true)
                        }}
                        variant="light"
                    >
                        <Edit/>
                    </Button>
                    <Space w="xs"/>
                    <Button
                        onClick={() => {
                            context.updateMod(mod, undefined)
                        }}
                        variant="light"
                        color="red"
                    >
                        <TrashX/>
                    </Button>
                </div>
            </div>
        </>
    )
}
