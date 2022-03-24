import {Badge, Box, Center, Group, Text, Title, useMantineTheme} from "@mantine/core";
import {useEffect, useState} from "react";
import {useAppState} from "../../../pages/_app";
import {useDragMinecraftFolderContext} from "../../../context/MinecraftFolderStateContextProvider";
import {Popover} from "@mantine/core";

export function DropMinecraftFolderPage() {
    const theme = useMantineTheme();

    const appState = useAppState()
    const context = useDragMinecraftFolderContext()

    useEffect(() => {
        if (!context.listenersRegistered && appState) {
            console.log("register")
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


    return (
        <Group spacing="xl" style={{height: "40vmin"}}>
            <Center>
                <Box style={{
                    borderRadius: "1vmin",
                    borderStyle: "solid",
                    borderColor: !context.hoveringWithFile ? theme.colors.dark[6] : theme.colors.green[7],
                    maxWidth: "80%"
                }} p="xl">
                    <Group direction="row"><Title>Let&apos;s find Minecraft!</Title><ExplanationVideo/></Group>
                    <Text color="gray">
                        Type in <b>%appdata%</b> in your <b>File Explorer</b> and drag your <b>.minecraft</b> Folder onto this
                        website
                    </Text>
                    <Text color="gray">
                        For the installation to work you have press <i>&apos;Save Changes&apos;</i> after you dropped your Minecraft Folder
                    </Text>
                    <Text color="gray">
                        <b>Make sure your Minecraft Launcher is closed</b>
                    </Text>
                </Box>
            </Center>
        </Group>
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
