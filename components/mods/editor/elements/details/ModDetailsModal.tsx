import {Mod} from "../../../../../types/modProfile";
import {Avatar, Button, Modal, MultiSelect, Space, Tabs} from "@mantine/core";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useModDetailsContext} from "./ModListDetailsEditor";
import {NameEditor} from "./components/NameEditor";
import {CategoryEditor} from "./components/CategoryEditor";
import {DownloadLinkEditor} from "./components/DownloadLinkEditor";
import {ActiveEditor} from "./components/ActiveEditor";
import {ModrinthSearch} from "./components/ModrinthSearch";

type Props = {
    mod: Mod
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    saveButtonText: string
}

export function ModDetailsModal({mod, open, setOpen, saveButtonText}: Props) {
    const context = useModDetailsContext()

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
        <Modal
            opened={open}
            onClose={() => setOpen(false)}
            withCloseButton={false}
            closeOnClickOutside={false}
            closeOnEscape={false}
            title={name}
        >
            <Tabs>
                <Tabs.Tab label="Manual">
                    <Space h="sm"/>
                    <NameEditor name={name} setName={setName}/>
                    <Space h="sm"/>
                    <CategoryEditor type={type} setType={setType}/>
                    <Space h="sm"/>
                    <DownloadLinkEditor downloadLink={downloadLink} setDownloadLink={setDownloadLink}/>
                    <Space h="md"/>
                    <ActiveEditor required={required} setRequired={setRequired} defaultActivated={defaultActivated}
                                  setDefaultActivated={setDefaultActivated}/>
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
                            newMod.downloadLink = downloadLink
                            newMod.type = type
                            newMod.requires = requires
                            newMod.incompatible = incompatible
                            newMod.required = required
                            newMod.defaultActivated = defaultActivated
                            context.updateMod(mod, newMod)
                            setOpen(false)
                        }}
                    >
                        {saveButtonText}
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
                            setType(mod.type)
                            setOpen(false)
                        }}
                    >
                        Discard
                    </Button>
                </Tabs.Tab>
                <Tabs.Tab label="Import from Modrinth" icon={<Avatar src="https://github.com/modrinth.png" alt="Modrinth logo" size="sm"/>}>
                    <ModrinthSearch setName={setName} setDownloadLink={setDownloadLink}/>
                </Tabs.Tab>
            </Tabs>

        </Modal>
    )
}
