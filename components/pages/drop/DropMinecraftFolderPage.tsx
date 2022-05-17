import {Badge, Box, Button, Group, Modal, Popover, Space, Text, Title, useMantineTheme} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {AppState, useAppState} from "../../../pages/_app";
import {useDragMinecraftFolderContext} from "../../../context/MinecraftFolderStateContextProvider";
import Head from "next/head";
import {useProfileContext} from "../../../context/ProfileContextProvider";

export function DropMinecraftFolderPage() {
    const theme = useMantineTheme();

    const appState = useAppState()
    const context = useDragMinecraftFolderContext()
    const modProfileContext = useProfileContext()

    const [modalOpened, setModalOpened] = useState(false);

    useEffect(() => {
        if (!context.listenersRegistered && appState) {
            document.addEventListener('dragover', context.dragOver, false)
            document.addEventListener('dragleave', context.dragLeave, false)
            document.addEventListener('drop', context.dragDrop, false)
            context.setListenersRegistered(true)
        }
        if (context.shouldUnregister) {
            document.removeEventListener('dragover', context.dragOver, false)
            document.removeEventListener('dragleave', context.dragLeave, false)
            document.removeEventListener('drop', context.dragDrop, false)
        }
    }, [appState, context, context.listenersRegistered, context.shouldUnregister])

    const [appData, setAppData] = useState("%appdata%")
    const [minecraftFolder, setMinecraftFolder] = useState(".minecraft")

    useEffect(() => {
        const platform = navigator.platform.toLocaleLowerCase()
        setAppData(
            platform.includes("win") ? "%appdata%" : platform.includes("mac") ? "~/Library/Application Support/" : "~"
        )
        setMinecraftFolder(
            platform.includes("mac") ? "minecraft" : ".minecraft"
        )
    }, [])

    return (
        <>
            <Head>
                <title>{modProfileContext.modProfile!!.name} | Finding Minecraft</title>
            </Head>
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={<Title order={2}>Are you sure?</Title>}
                centered
            >
                <Text>
                    You&apos;ll have to manually install Fabric and extract the mods yourself
                </Text>
                <Space h="xl"/>
                <Button
                    variant="outline"
                    onClick={() => {
                        setModalOpened(false)
                        appState.setUseAutomaticInstaller(false);
                        appState.setAppState(AppState.INSTALLING);
                    }}
                >
                    Yes
                </Button>
                <Button style={{float: "right"}} onClick={() => setModalOpened(false)}>
                    No, take me back to the automatic installer
                </Button>

            </Modal>
            <Group spacing="xl" style={{height: "40vmin"}} direction="column">
                <Box style={{
                    borderRadius: "1vmin",
                    borderStyle: "solid",
                    borderColor: !context.hoveringWithFile ? theme.colors.dark[6] : theme.colors.green[7],
                    maxWidth: "80%",
                    margin: "auto",
                    marginBottom: "0"
                }} p="xl">
                    <Group direction="row"><Title>Let&apos;s find Minecraft!</Title><ExplanationVideo/></Group>
                    <Space h="xs"/>
                    <Text color="gray">
                        Type in <b>{appData}</b> in your <b>File Explorer</b> and drag
                        your <b>{minecraftFolder}</b> Folder
                        onto this
                        website
                    </Text>
                    <Text color="gray">
                        For the installation to work you have press <i>&apos;Save Changes&apos;</i> after you
                        dropped
                        your Minecraft Folder
                    </Text>
                    <Text color="gray">
                        <b>Make sure your Minecraft Launcher is closed</b>
                    </Text>
                    <Space h="xs"/>
                    <div style={{display: "flex"}}>
                        <div style={{alignSelf: "center"}}>
                            <MultiMCSupport/>
                        </div>
                        <div style={{alignSelf: "flex-end", marginLeft: "auto"}}>
                            <OpenFileExplorerButton/>
                        </div>
                    </div>
                </Box>
                <Button
                    onClick={() => setModalOpened(true)}
                    style={{
                        margin: "auto",
                        marginTop: "0"
                    }}
                    color="gray"
                    variant="outline"
                >
                    No thanks, give me a .zip instead.
                </Button>
            </Group>
        </>
    )
}

function ExplanationVideo() {
    const [opened, setOpened] = useState(false);

    return (
        <Popover
            opened={opened}
            onClose={() => setOpened(false)}
            position="right"
            placement="center"
            withArrow
            trapFocus={false}
            closeOnEscape={false}
            transition="pop-top-left"
            width={512}
            styles={{body: {pointerEvents: 'none'}}}
            target={
                <Badge color="gray" onMouseEnter={() => setOpened(true)} onMouseLeave={() => setOpened(false)}>
                    How?
                </Badge>
            }
        >
            <video src={"/assets/drop-minecraft-folder.webm"} controls={false} loop={true} autoPlay={true}
                   style={{
                       width: "100%"
                   }}
            />
        </Popover>
    );
}

function MultiMCSupport() {
    const [opened, setOpened] = useState(false);

    return (
        <Popover
            opened={opened}
            onClose={() => setOpened(false)}
            position="right"
            placement="center"
            withArrow
            trapFocus={false}
            closeOnEscape={false}
            transition="pop-top-left"
            width={512}
            styles={{body: {pointerEvents: 'none'}}}
            target={
                <Badge py="sm" color="gray" onMouseEnter={() => setOpened(true)} onMouseLeave={() => setOpened(false)}>
                    <Text size="sm">Are you using MultiMC/PolyMC?</Text>
                </Badge>
            }
        >
            <Text>
                Feel free to find your MultiMC/PolyMC Folder and drag it onto this website instead, we will create a new
                Instance for you.
            </Text>
            <Text style={{fontWeight: "bold"}}>
                Make sure your MultiMC/PolyMC Launcher is closed!
            </Text>
        </Popover>
    );
}

function OpenFileExplorerButton() {
    const context = useDragMinecraftFolderContext()

    return (
        <>
            <Button
                variant="light"
                title="Select Minecraft Folder from directory chooser"
                onClick={async () => {
                    try {
                        const fileSystemDirectoryHandle = await window.showDirectoryPicker();

                        context.dragDrop({
                            dataTransfer: {
                                // @ts-ignore
                                items: [fileSystemDirectoryHandle]
                            },
                            preventDefault() {
                            },
                            stopPropagation() {
                            },
                            stopImmediatePropagation() {
                            }
                        })
                    } catch (e) {
                        return
                    }
                }}
            >
                Open Directory Picker
            </Button>
        </>
    )

}
