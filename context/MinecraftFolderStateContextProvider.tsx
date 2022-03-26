import {handleDragLeave, handleDragOver, handleDrop} from "../components/pages/drop/handleFuntions";
import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import {useAppState} from "../pages/_app";
import {useError} from "./ErrorContextProvider";

export type DragMinecraftFolderStateContextProps = {
    hoveringWithFile: boolean
    setHoveringWithFile: Dispatch<SetStateAction<boolean>>
    listenersRegistered: boolean
    setListenersRegistered: Dispatch<SetStateAction<boolean>>
    shouldUnregister: boolean
    setShouldUnregister: Dispatch<SetStateAction<boolean>>
    minecraftDir: FileSystemHandle | undefined,
    setMinecraftDir: Dispatch<SetStateAction<FileSystemHandle | undefined>>
    dragOver(event: DragEvent): void
    dragLeave(event: DragEvent): void
    dragDrop(event: DragEvent): void
}

const DragMinecraftFolderStateContext = React.createContext({} as DragMinecraftFolderStateContextProps)

type Props = {
    children: React.ReactNode
}

export function MinecraftFolderStateContextProvider({children}: Props) {
    const appState = useAppState()

    const errorContext = useError()

    const [hoveringWithFile, setHoveringWithFile] = useState(false)

    const [listenersRegistered, setListenersRegistered] = useState(false)
    const [shouldUnregister, setShouldUnregister] = useState(false)

    const [minecraftDir, setMinecraftDir] = useState(undefined as (FileSystemHandle | undefined))

    return (
        <DragMinecraftFolderStateContext.Provider value={{
            hoveringWithFile,
            setHoveringWithFile,
            listenersRegistered,
            setListenersRegistered,
            shouldUnregister,
            setShouldUnregister,
            minecraftDir,
            setMinecraftDir,
            dragOver: (event: DragEvent) => handleDragOver(event, setHoveringWithFile),
            dragLeave: (event: DragEvent) => handleDragLeave(event, setHoveringWithFile),
            dragDrop: (event: DragEvent) => handleDrop(event, setHoveringWithFile, setShouldUnregister, errorContext.setError, appState, setMinecraftDir)
        }}>
            {children}
        </DragMinecraftFolderStateContext.Provider>
    )
}

export function useDragMinecraftFolderContext() {
    return useContext(DragMinecraftFolderStateContext)
}
