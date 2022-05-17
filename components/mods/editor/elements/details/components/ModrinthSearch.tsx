import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Avatar, Button, ScrollArea, Space, Text, TextInput} from "@mantine/core";
import {useDebouncedValue} from "@mantine/hooks";
import {useModEditorContext} from "../../../ModEditor";
import {Loader} from "../../../../../../types/modProfile";
import {PackgeImport} from "tabler-icons-react";
import {useError} from "../../../../../../context/ErrorContextProvider";

const modrinthApiBase = "https://api.modrinth.com/v2"

type ModrinthSearchProps = {
    setName: Dispatch<SetStateAction<string>>
    setDownloadLink: Dispatch<SetStateAction<string>>
}

export function ModrinthSearch({setName, setDownloadLink}: ModrinthSearchProps) {
    const profileContext = useModEditorContext()

    const [disabled, setDisabled] = useState(false)

    const [value, setValue] = useState<string>()
    const [debounced] = useDebouncedValue(value, 500);

    const [data, setData] = useState<ModrinthModItem[]>([])

    useEffect(() => {
        fetch(
            modrinthApiBase +
            `/search?query=${debounced ?? ""}` +
            `&limit=25` +
            `&filters=categories="fabric"${profileContext.modProfile.loader === Loader.QUILT ? ` OR categories="quilt"` : ""}`
        ).then(async (response) => {
            if (response.status === 200) {
                const body = await response.json()
                setData(
                    body.hits.map((hit: any) => {
                        return {
                            id: hit.project_id,
                            name: hit.title,
                            image: hit.icon_url,
                            description: hit.description,
                            minecraftVersion: hit.versions.find((version: string) => version === profileContext.modProfile.minecraftVersion)
                        } as ModrinthModItem
                    })
                )
            }
        })
    }, [debounced, profileContext.modProfile.loader, profileContext.modProfile.minecraftVersion])

    return (
        <>
            <TextInput
                label="Search"
                placeholder="Modrinth Mod Search"
                size="md"
                description="Search for a Mod on Modrinth here. Only Mods that are compatible will be shown"
                value={value}
                onChange={(event) => {
                    setValue(event.currentTarget.value)
                }}
                autoComplete="off"
            />
            <Space h="lg"/>
            <ScrollArea style={{height: "486px"}}>
                {data.filter(current => current.minecraftVersion === profileContext.modProfile.minecraftVersion).map(current => {
                    return (
                        <div key={current.id} style={{display: "flex", padding: "3%"}}>
                            <Avatar size="lg" src={current.image}/>
                            <Space w="md"/>
                            <div style={{display: "inline-flex", width: "100%"}}>
                                <div style={{width: "100%"}}>
                                    <Text size="lg" style={{fontWeight: "bold"}}>{current.name}</Text>
                                    <Text size="sm" color="gray">{current.description}</Text>
                                </div>
                                <Space w="md"/>
                                <div style={{alignSelf: "center"}}>
                                    <ImportButton
                                        modrinthItem={current}
                                        setDisabled={setDisabled}
                                        disabled={disabled}
                                        setName={setName}
                                        setDownloadLink={setDownloadLink}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}

            </ScrollArea>
        </>
    )
}

type ModrinthModItem = {
    name?: string
    id?: string
    image?: string
    description?: string
    downloadLink?: string
    version?: string
    minecraftVersion?: string
}

type ImportButtonProps = {
    modrinthItem: ModrinthModItem,
    disabled: boolean
    setDisabled: Dispatch<SetStateAction<boolean>>
    setName: Dispatch<SetStateAction<string>>
    setDownloadLink: Dispatch<SetStateAction<string>>
}

function ImportButton({modrinthItem, disabled, setDisabled, setName, setDownloadLink}: ImportButtonProps) {
    const context = useModEditorContext()

    const [loading, setLoading] = useState(disabled)

    const errorContext = useError()

    return (
        <Button
            variant="light" title="Import"
            style={{float: "right", marginRight: "15%", marginLeft: "15%"}}
            disabled={disabled}
            loading={loading}
            onClick={async () => {
                setLoading(true)
                setDisabled(true)
                const projectResponse = (await fetch(modrinthApiBase +
                    `/project/` + modrinthItem.id
                ))

                if (projectResponse.status !== 200) {
                    errorContext.setError("Failed to import mod")
                    return
                }

                const projectBody = await projectResponse.json()

                versions: for (const version of projectBody.versions.reverse()) {
                    const versionResponse = await (await fetch(modrinthApiBase +
                        `/version/` + version
                    )).json()

                    for (const gameVersion of versionResponse.game_versions) {
                        if (context.modProfile.minecraftVersion.includes(gameVersion)) {
                            setName(projectBody.title)
                            setDownloadLink(versionResponse.files[0].url)
                            setLoading(false)
                            setDisabled(false)
                            break versions
                        }
                    }
                }
            }}
        >
            <PackgeImport/>
        </Button>
    )
}
