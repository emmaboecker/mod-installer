import {Space, Text, useMantineTheme} from "@mantine/core";
import {useEffect} from "react";
import {ContentFrame} from "../../ContentFrame/ContentFrame";
import {useAppState} from "../../../pages/_app";
import {useDragMinecraftFolderContext} from "../../../context/MinecraftFolderStateContextProvider";

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
        <ContentFrame
            borderColor={!context.hoveringWithFile ? theme.colors.dark[6] : theme.colors.green[5]}
            leftColumn={
                <>
                    <Text size="xl"
                          style={{
                              color: "white",
                              fontWeight: "bold"
                          }}
                    >
                        Let&apos;s find Minecraft!
                    </Text>
                    <Space h="xs" />
                    <Text color="gray">
                        Type in <b>%appdata%</b> in your File Explorer and drag your <b>.minecraft</b> Folder onto this
                        website
                    </Text>

                </>
            }
            rightColumn={
                <>
                    <video src="/assets/drop-minecraft-folder.webm" controls={false} loop={true} autoPlay={true}
                           style={{
                               width: "100%",
                               transform: "translateY(10%)",
                           }}
                    />
                </>
            }
        />
    )
}


