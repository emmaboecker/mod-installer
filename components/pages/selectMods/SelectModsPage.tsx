import {AppState, useAppState} from "../../../pages/_app";
import {Button, Group, Space, Text, Title} from "@mantine/core";
import Link from "next/link";
import {useProfileContext} from "../../../context/ProfileContextProvider";
import {LoadingPage} from "../loading/LoadingPage";
import {ModSelectionContainer} from "../../mods/ModSelectionContainer/ModSelectionContainer";

export function SelectModsPage() {
    const modProfileContext = useProfileContext()

    if (modProfileContext.profile) {
        return (
            <>
                <Group spacing="xl" align="flex-start">
                    <div style={{height: "100%"}}>
                        <Title>{modProfileContext.profile.name}</Title>
                        <Space h="md" />
                        <Text color="gray" style={{width: "50vmin"}}>
                            This installer will create a new Minecraft Launcher Profile and install all needed mods for
                            you and the mods you select on the right
                        </Text>
                        <div style={{width: "80%", margin: "auto", marginTop: "40vmin"}}>
                            <NextStepButton/>
                            <Space h="xs"/>
                            <ManualInstallButton/>
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

function ManualInstallButton() {
    return (
        <Link href={"/manual"} passHref prefetch>
            <Button
                color="dark"
                variant="subtle"
                fullWidth
            >
                Manual Install
            </Button>
        </Link>
    )
}
