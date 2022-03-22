import {AppState, useAppState} from "../../../pages/_app";
import {Button, Space, Text, useMantineTheme} from "@mantine/core";
import {ContentFrame} from "../../ContentFrame/ContentFrame";
import Link from "next/link";
import {ModSelectionContainer} from "../../mods/ModSelectionContainer/ModSelectionContainer";
import {useProfileContext} from "../../../context/ProfileContextProvider";

export function SelectModsPage() {
    const theme = useMantineTheme()
    const modProfileContext = useProfileContext()

    if (modProfileContext.profile) {
        return (
            <ContentFrame
                borderColor={theme.colors.dark[6]}
                leftColumn={
                    <>
                        <Text size="xl" style={{
                            color: "white",
                            fontWeight: "bold"
                        }}>
                            {modProfileContext.profile.name}
                        </Text>
                        <Space h="xs"/>
                        <Text color="gray">
                            This installer will create a new Minecraft Launcher Profile and install all needed mods for
                            you
                            and the mods you select on the right
                        </Text>
                        <div style={{position: "absolute", bottom: "25px", width: "33%"}}>
                            <NextStepButton/>
                            <Space h="xs"/>
                            <ManualInstallButton/>
                        </div>
                    </>
                }
                rightColumn={
                    <>
                        <Text style={{
                            fontWeight: "bold",
                            marginTop: "23px",
                            marginBottom: "10px",
                            marginLeft: "10px"
                        }}
                              size="lg"
                        >
                            Mods
                        </Text>
                        <ModSelectionContainer
                            mods={modProfileContext.profile.mods}
                        />
                    </>
                }
            />
        )
    } else {
        return <Text>Loading Profile..</Text>
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
        <Link href="/manual" passHref prefetch>
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
