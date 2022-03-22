import type {NextPage} from 'next'
import {Center, Text} from "@mantine/core";
import {DropMinecraftFolderPage} from "../components/pages/drop/DropMinecraftFolderPage";
import React from "react";
import {AppState, useAppState} from "./_app";
import {SelectModsPage} from "../components/pages/selectMods/SelectModsPage";
import {InstallingModsPage} from "../components/pages/installing/InstallingModsPage";

const Home: NextPage = () => {
    const appState = useAppState()

    if (typeof FileSystemHandle !== "undefined") {
        return (
            <Center style={{height: "100%"}}>
                {getStateComponent(appState.appState)}
            </Center>
        )
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
            return <Text>Done</Text>
    }
}

export default Home
