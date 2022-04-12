import '../styles/globals.css'
import type {AppProps, NextWebVitalsMetric} from 'next/app'
import {MantineProvider, MantineThemeOverride} from "@mantine/core";
import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import {Footer} from "../components/Footer/Footer";
import {MinecraftFolderStateContextProvider} from "../context/MinecraftFolderStateContextProvider";
import {ErrorContextProvider} from "../context/ErrorContextProvider";
import Head from "next/head";
import {NotificationsProvider} from '@mantine/notifications';
import {SessionProvider} from "next-auth/react"

export function reportWebVitals(metric: NextWebVitalsMetric) {
    console.log(metric)
}

const themeOverride: MantineThemeOverride = {
    colorScheme: "dark",
    primaryColor: "violet"
}

export enum AppState {
    SELECT_MODS = 0,
    DRAG_DOT_MINECRAFT = 1,
    INSTALLING = 2,
    DONE = 3
}

export enum InstallType {
    MINECRAFT_LAUNCHER,
    MULTIMC
}

export type AppStateContextProps = {
    appState: AppState
    setAppState: Dispatch<SetStateAction<AppState>>
    useAutomaticInstaller: boolean
    setUseAutomaticInstaller: Dispatch<SetStateAction<boolean>>
    installType: InstallType,
    setInstallType: Dispatch<SetStateAction<InstallType>>
}

const AppStateContext = React.createContext({} as AppStateContextProps)

export default function MyApp({Component, pageProps: {session, ...pageProps}}: AppProps) {
    const [appState, setAppState] = useState(AppState.SELECT_MODS)
    const [useAutomaticInstaller, setUseAutomaticInstaller] = useState(typeof FileSystemHandle !== "undefined")
    const [installType, setInstallType] = useState(InstallType.MINECRAFT_LAUNCHER)

    return (
        <>
            <Head>
                <title>Online Installer</title>
            </Head>
            <SessionProvider session={session}>
                <MantineProvider theme={themeOverride} withGlobalStyles withNormalizeCSS>
                    <NotificationsProvider position="bottom-center">
                        <AppStateContext.Provider value={{
                            appState,
                            setAppState,
                            useAutomaticInstaller,
                            setUseAutomaticInstaller,
                            installType,
                            setInstallType
                        }}>
                            <ErrorContextProvider>
                                <MinecraftFolderStateContextProvider>
                                    <Component {...pageProps} />
                                </MinecraftFolderStateContextProvider>
                            </ErrorContextProvider>
                        </AppStateContext.Provider>
                    </NotificationsProvider>
                    <Footer/>
                </MantineProvider>
            </SessionProvider>
        </>
    )
}

export function useAppState() {
    return useContext(AppStateContext)
}
