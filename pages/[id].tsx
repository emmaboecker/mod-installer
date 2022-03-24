import type {NextPage} from 'next'
import {Center, Stepper, Text} from "@mantine/core";
import {DropMinecraftFolderPage} from "../components/pages/drop/DropMinecraftFolderPage";
import React from "react";
import {AppState, useAppState} from "./_app";
import {SelectModsPage} from "../components/pages/selectMods/SelectModsPage";
import {InstallingModsPage} from "../components/pages/installing/InstallingModsPage";
import {useRouter} from "next/router";
import {ProfileContextProvider} from "../context/ProfileContextProvider";
import {LoadingPage} from "../components/pages/loading/LoadingPage";
import {InstallationDonePage} from "../components/pages/done/InstallationDonePage";

const Home: NextPage = () => {
    const appState = useAppState()

    const router = useRouter()
    const {id} = router.query

    if (typeof FileSystemHandle !== "undefined") {
        if (id) {
            return (
                <Center style={{height: "100%"}}>
                    <ProfileContextProvider id={id as string}>
                        <Stepper
                            active={
                                appState.appState === AppState.SELECT_MODS ? 0 :
                                    appState.appState === AppState.DRAG_DOT_MINECRAFT ? 1 :
                                        appState.appState === AppState.INSTALLING ? 2 : 3
                            }
                            style={{marginTop: "2vmin", width: "70%"}}
                            breakpoint="sm"
                            color="violet"
                        >
                            <Stepper.Step label="Select Mods" allowStepSelect={false}>
                                <Center style={{height: "100%"}}>
                                    <SelectModsPage/>
                                </Center>
                            </Stepper.Step>
                            <Stepper.Step label="Find Minecraft" allowStepSelect={false}>
                                <Center style={{height: "100%"}}>
                                    <DropMinecraftFolderPage/>
                                </Center>
                            </Stepper.Step>
                            <Stepper.Step label="Install" allowStepSelect={false}>
                                <Center style={{height: "100%"}}>
                                    <InstallingModsPage/>
                                </Center>
                            </Stepper.Step>
                            <Stepper.Completed>
                                <InstallationDonePage />
                            </Stepper.Completed>
                        </Stepper>
                    </ProfileContextProvider>
                </Center>
            )
        } else {
            return <LoadingPage/>
        }
    } else {
        return <Text>Browser not supported</Text>
    }
}

export default Home
