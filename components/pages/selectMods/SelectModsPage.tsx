import {AppState, useAppState} from "../../../pages/_app";
import {Anchor, Badge, Button, Center, Group, Popover, Space, Text, Title, useMantineTheme} from "@mantine/core";
import {useProfileContext} from "../../../context/ProfileContextProvider";
import {ModSelectionContainer} from "../../mods/ModSelectionContainer/ModSelectionContainer";
import Head from "next/head";
import {AuthorComponent} from "../../user/AuthorComponent";
import React, {useEffect, useState} from "react";

export function SelectModsPage() {
    const modProfileContext = useProfileContext()

    const supported = typeof FileSystemHandle !== "undefined"

    const theme = useMantineTheme()

    const [popOverOpened, setPopOverOpened] = useState(false)

    const [ready, setReady] = useState(undefined as boolean | undefined)

    useEffect(() => {
        setReady(true)
    }, [])

    return (
        <>
            <Head>
                <title>{modProfileContext.modProfile!!.name} | Select Mods</title>
            </Head>
            <Group spacing="xl" align="flex-start" noWrap>
                <div style={{position: "relative", height: "80vmin"}}>
                    <div style={{display: "inline-flex"}}>
                        <Title>
                            {modProfileContext.modProfile!!.name}
                        </Title>
                        <Space w="md"/>
                        <div style={{alignSelf: "center"}}>
                            {modProfileContext.modProfile?.verified ?
                                <Popover
                                    opened={popOverOpened}
                                    onClose={() => setPopOverOpened(false)}
                                    target={
                                        <Badge
                                            component="button"
                                            color="blue"
                                            style={{cursor: "pointer"}}
                                            onClick={() => setPopOverOpened((o) => !o)}
                                        >
                                            Verified
                                        </Badge>
                                    }
                                    width={260}
                                    position="bottom"
                                    withArrow
                                >
                                    <Text>
                                        This is a verified Mod-List trusted by the Admins
                                    </Text>
                                </Popover> :
                                <Popover
                                    opened={popOverOpened}
                                    onClose={() => setPopOverOpened(false)}
                                    target={
                                        <Badge
                                            component="button"
                                            color="red"
                                            style={{cursor: "pointer"}}
                                            onClick={() => setPopOverOpened((o) => !o)}
                                        >
                                            Not Verified
                                        </Badge>
                                    }
                                    position="bottom"
                                    radius="md"
                                    width={260}
                                    withArrow
                                >
                                    <Text>
                                        This Mod-List was created by a user and not verified by an Admin, it can
                                        include harmful mods
                                    </Text>
                                </Popover>

                            }
                        </div>
                    </div>
                    <Space h="md"/>
                    <AuthorComponent userId={modProfileContext.modProfile!!.creator}/>
                    <Space h="md"/>
                    <Text color="gray" style={{width: "50vmin"}}>
                        This installer will create a new Minecraft Launcher Profile and install all needed mods for
                        you and the mods you select on the right
                    </Text>
                    {ready && !supported &&
                        <>
                            <Space h="xl"/>
                            <Text color={theme.colors.red[5]} size="xl" style={{width: "50vmin"}}>
                                Your Browser doesn&apos;t support the automated installer. Use a modern
                                chromium-based
                                browser like <Anchor size="xl" href="https://google.com/chrome" target="_blank">Google
                                Chrome</Anchor> to use it.
                            </Text>
                        </>
                    }
                    {ready ?
                        <Center style={{width: "80%", margin: "auto"}}>
                            <NextStepButton/>
                        </Center>
                        : <Center style={{width: "80%", margin: "auto"}}>
                            <Button
                                color="green"
                                variant="light"
                                style={{height: "56px", marginTop: "15%"}}
                                disabled={true}
                                fullWidth
                            >
                                Getting ready..
                            </Button>
                        </Center>
                    }
                </div>
                <>
                    <ModSelectionContainer mods={modProfileContext.modProfile!!.mods}/>
                </>
            </Group>
        </>
    )
}

function NextStepButton() {
    const appState = useAppState()

    const profileContext = useProfileContext()

    function disabled() {
        for (const [, value] of profileContext.modStates.entries()) {
            if (value) {
                return false
            }
        }
        return true
    }

    return (
        <Button
            color="green"
            variant="light"
            onClick={() => {
                appState.setAppState(AppState.DRAG_DOT_MINECRAFT)
            }}
            style={{height: "56px", marginTop: "15%"}}
            disabled={disabled()}
            fullWidth
        >
            Next Step
        </Button>
    )
}

