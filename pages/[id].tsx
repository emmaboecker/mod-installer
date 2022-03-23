import type {NextPage} from 'next'
import {Center, Text} from "@mantine/core";
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
                        {getStateComponent(appState.appState)}
                    </ProfileContextProvider>
                </Center>
            )
        } else {
            return <LoadingPage />
        }
    } else {
        return <Text>Browser not supported</Text>
    }
}

function getStateComponent(appState: AppState) {
    switch (appState) {
        case AppState.SELECT_MODS:
            return <SelectModsPage/>
        case AppState.DRAG_DOT_MINECRAFT:
            return <DropMinecraftFolderPage/>
        case AppState.INSTALLING:
            return <InstallingModsPage/>
        case AppState.DONE:
            return <InstallationDonePage />
    }
}

export default Home
