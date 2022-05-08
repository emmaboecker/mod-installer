import {Box, Button, Center, Space, Text, Title, useMantineTheme} from "@mantine/core";
import {useProfileContext} from "../../../context/ProfileContextProvider";
import {InstallType, useAppState} from "../../../pages/_app";
import Head from "next/head";
import {useEffect, useState} from "react";
import {Copy} from "tabler-icons-react";
import {useDragMinecraftFolderContext} from "../../../context/MinecraftFolderStateContextProvider";

export function InstallationDonePage() {
    const profileContext = useProfileContext()

    const minecraftFolderContext = useDragMinecraftFolderContext()

    const appState = useAppState()

    return (
        <>
            <Head>
                <title>Installation done</title>
            </Head>
            <Space h="xl"/>
            <Center>
                <Title>Installation completed!</Title>
            </Center>
            <Space h="xl"/>

            <Center>
                {!appState.useAutomaticInstaller ? <Explanation/> :
                    <Text size="lg">You may now close this page and
                        launch <b>{profileContext.modProfile?.profileName}</b> from your {
                            appState.installType === InstallType.MINECRAFT_LAUNCHER ? "Minecraft Launcher" :
                                minecraftFolderContext.minecraftDir?.name.toLocaleLowerCase().includes("polymc") ? "PolyMC Launcher" :
                                    "MultiMC Launcher"
                        }!
                    </Text>
                }
            </Center>
        </>
    )
}

function Explanation() {
    const theme = useMantineTheme()

    const [minecraftFolder, setMinecraftFolder] = useState("%appdata%/.minecraft")

    const profileContext = useProfileContext()

    useEffect(() => {
        const platform = navigator.platform.toLocaleLowerCase()
        setMinecraftFolder(
            platform.includes("win") ? "%appdata%\\.minecraft" : platform.includes("mac") ? "~/Library/Application Support/minecraft" : "~/.minecraft"
        )
    }, [])

    const getServerCopyButtons = () => {
        const buttons: JSX.Element[] = []
        profileContext.modProfile?.servers.forEach(server => {
            buttons.push(
                <Button
                    key={server.name}
                    leftIcon={<Copy/>}
                    variant="light"
                    onClick={() => {
                        navigator.clipboard.writeText(server.ip)
                    }}
                >
                    {server.ip}
                </Button>
            )
        })
        return buttons
    }

    return (
        <Box style={{backgroundColor: theme.colors.dark[8], borderRadius: "2vmin"}} p="md">
            <Title order={2}>Manual Installation with the ZIP file:</Title>
            <Space h="xs"/>
            <Text size="xl">1. Close your Minecraft Launcher, if opened</Text>
            <Text size="xl">
                2. Download the Fabric Installer from <a href="https://fabricmc.net/use/installer/" target="_blank"
                                                         rel="noreferrer">here</a>
            </Text>
            <Text size="xl">
                3. Run the Installer and Install Fabric for <b>Minecraft {profileContext.modProfile?.minecraftVersion}</b>
            </Text>
            <Text size="xl">
                4. Navigate to <b>{minecraftFolder}</b> in your File Explorer and create a new folder named <b>mods</b>.
                If there is already one, make sure it&apos;s empty
            </Text>
            <Text size="xl">
                5. Extract the mods from the ZIP file you just downloaded into the folder you previously created
            </Text>
            <Text size="xl">
                6. Open your Minecraft Launcher and launch the newly created profile
            </Text>
            {
                (profileContext.modProfile?.servers && profileContext.modProfile.servers.length > 0) &&
                <>
                    <Text size="xl">
                        7. Add the server address{profileContext.modProfile.servers.length > 1 && "es"} below to your
                        server list
                    </Text>
                    <Space h="xs"/>
                    {getServerCopyButtons()}
                </>
            }
        </Box>
    )
}
