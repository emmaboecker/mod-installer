import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {MantineProvider, MantineThemeOverride} from "@mantine/core";
import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {SizeNotSupportedPage} from "../components/pages/sizeNotSupported/SizeNotSupportedPage";
import {Footer} from "../components/Footer/Footer";
import {MinecraftFolderStateContextProvider} from "../context/MinecraftFolderStateContextProvider";
import {ErrorContextProvider} from "../context/ErrorContextProvider";
import Head from "next/head";
import {LoadingPage} from "../components/pages/loading/LoadingPage";
import {NotificationsProvider} from '@mantine/notifications';
import {ProfileContextProvider} from "../context/ProfileContextProvider";
import {useRouter} from "next/router";

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

export type AppStateContextProps = {
    appState: AppState
    setAppState: Dispatch<SetStateAction<AppState>>
    useAutomaticInstaller: boolean
    setUseAutomaticInstaller: Dispatch<SetStateAction<boolean>>
}

const AppStateContext = React.createContext({} as AppStateContextProps)

export default function MyApp({Component, pageProps}: AppProps) {
    const [appState, setAppState] = useState(AppState.SELECT_MODS)
    const [useAutomaticInstaller, setUseAutomaticInstaller] = useState(typeof FileSystemHandle !== "undefined")

    const {width, height} = useWindowDimensions();

    const router = useRouter()

    const {id} = router.query

    if (width && width > 786 && height && height > 524) {
        return (
            <>
                <Head>
                    <title>Online Installer</title>
                </Head>
                <MantineProvider theme={themeOverride} withGlobalStyles>
                    <NotificationsProvider position="bottom-center">
                        <AppStateContext.Provider value={{appState, setAppState, useAutomaticInstaller, setUseAutomaticInstaller} as AppStateContextProps}>
                            <ErrorContextProvider>
                                <MinecraftFolderStateContextProvider>
                                    {
                                        router.isReady && id ?
                                            <ProfileContextProvider><Component {...pageProps} /></ProfileContextProvider> :
                                            router.isReady && !id ? <Component {...pageProps} /> :
                                                <LoadingPage/>
                                    }
                                </MinecraftFolderStateContextProvider>
                            </ErrorContextProvider>
                        </AppStateContext.Provider>
                    </NotificationsProvider>
                    <Footer/>
                </MantineProvider>
            </>
        )
    } else {
        return (
            <>
                <Head>
                    <title>Size not Supported | Online Installer</title>
                </Head>
                <MantineProvider theme={themeOverride} withGlobalStyles>
                    <SizeNotSupportedPage/>
                    <Footer/>
                </MantineProvider>
            </>
        )
    }
}

export function useWindowDimensions() {
    const hasWindow = typeof window !== 'undefined';

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    function getWindowDimensions() {
        const width = hasWindow ? window.innerWidth : null;
        const height = hasWindow ? window.innerHeight : null;
        return {
            width,
            height,
        };
    }

    function handleResize() {
        setWindowDimensions(getWindowDimensions());
    }

    useEffect(() => {
        if (hasWindow) {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [hasWindow]);

    return windowDimensions;
}

export function useAppState() {
    return useContext(AppStateContext)
}
