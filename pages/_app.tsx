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

const themeOverride: MantineThemeOverride = {
    colorScheme: "dark",
    primaryColor: "green",
    fontSizes: {
        xl: 30,
    }
}

export enum AppState {
    SELECT_MODS,
    DRAG_DOT_MINECRAFT,
    INSTALLING,
    DONE
}

export type AppStateContextProps = {
    appState: AppState
    setAppState: Dispatch<SetStateAction<AppState>>
}

const AppStateContext = React.createContext({} as AppStateContextProps)

export default function MyApp({Component, pageProps}: AppProps) {
    const [appState, setAppState] = useState(AppState.DONE)

    const {width, height} = useWindowDimensions();

    const [pageLoaded, setPageLoaded] = useState(false)

    useEffect(() => {
        setPageLoaded(true)
    }, [pageLoaded])

    if (pageLoaded) {
        if (width && width > 786 && height && height > 524) {
            return (
                <>
                    <Head>
                        <title>Online Installer</title>
                    </Head>
                    <MantineProvider theme={themeOverride} withGlobalStyles>
                        <AppStateContext.Provider value={{appState, setAppState} as AppStateContextProps}>
                            <ErrorContextProvider>
                                <MinecraftFolderStateContextProvider>
                                    <Component {...pageProps} />
                                </MinecraftFolderStateContextProvider>
                            </ErrorContextProvider>
                        </AppStateContext.Provider>
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
    } else {
        return <LoadingPage/>
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
