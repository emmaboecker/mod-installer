import {AppState, useAppState} from "../../../pages/_app";
import {Button, Group, Space, Text, Title, useMantineTheme} from "@mantine/core";
import {useProfileContext} from "../../../context/ProfileContextProvider";
import {LoadingPage} from "../loading/LoadingPage";
import {ModSelectionContainer} from "../../mods/ModSelectionContainer/ModSelectionContainer";
import Head from "next/head";

export function SelectModsPage() {
    const modProfileContext = useProfileContext()

    const supported = typeof FileSystemHandle !== "undefined"

    const theme = useMantineTheme()

    if (modProfileContext.profile) {
        return (
            <>
                <Head>
                    <title>{modProfileContext.profile.name} | Select Mods</title>
                </Head>
                <Group spacing="xl" align="flex-start" noWrap>
                    <div style={{position: "relative", height: "80vmin"}}>
                        <Title>{modProfileContext.profile.name}</Title>
                        <Space h="md"/>
                        <Text color="gray" style={{width: "50vmin"}}>
                            This installer will create a new Minecraft Launcher Profile and install all needed mods for
                            you and the mods you select on the right
                        </Text>
                        {!supported &&
                            <>
                                <Space h="xl"/>
                                <Text color={theme.colors.red[5]} size="xl" style={{width: "50vmin"}}>
                                    Your Browser doesn&apos;t support the automated installer. Use a chromium-based
                                    browser like Google Chrome to use it.
                                </Text>
                            </>
                        }
                        <div style={{width: "80%", marginLeft: "10%", marginTop: "10vh"}}>
                            <NextStepButton/>
                        </div>
                    </div>
                    <>
                        <ModSelectionContainer mods={modProfileContext.profile.mods}/>
                    </>
                </Group>

            </>
        )
    } else {
        return <LoadingPage/>
    }
}

function NextStepButton() {
    const appState = useAppState()

    return (
        <Button
            color="green"
            variant="light"
            onClick={() => {
                appState.setAppState(AppState.DRAG_DOT_MINECRAFT)
            }}
            style={{height: "56px"}}
            fullWidth
        >
            Next Step
        </Button>
    )
}

