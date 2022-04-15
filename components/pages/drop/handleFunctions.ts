import {Dispatch, SetStateAction} from "react";
import {AppState, AppStateContextProps, InstallType} from "../../../pages/_app";

export async function handleDrop(event: DragEvent, setHoveringWithFile: Dispatch<SetStateAction<boolean>>, setShouldUnregister: Dispatch<SetStateAction<boolean>>, setError: Dispatch<SetStateAction<string | undefined>>, appState: AppStateContextProps, setMiecraftDir: Dispatch<SetStateAction<FileSystemDirectoryHandle | undefined>>) {
    event.stopPropagation()
    event.preventDefault()
    event.stopImmediatePropagation()
    setHoveringWithFile(false)
    if (event.dataTransfer == null || event.dataTransfer.files.length == 0) return;
    console.log(event.dataTransfer.files)
    const item = event.dataTransfer.items[0]
    if (item.kind === "file") {
        // @ts-ignore
        const handle = (await item.getAsFileSystemHandle())!!
        if (handle.kind === "directory") {
            if (handle.name === ".minecraft") {
                await initializeInstalling(InstallType.MINECRAFT_LAUNCHER, handle)
            } else if (handle.name.toLocaleLowerCase().includes("multimc")) {
                await initializeInstalling(InstallType.MULTIMC, handle)
            } else {
                setError("That doesn't look like a directory of an launcher we support")
            }
        } else {
            setError("That isn't a directory")
        }
    }

    async function initializeInstalling(installType: InstallType, handle: FileSystemHandle) {
        if (await verifyPermission(handle, true)) {
            setShouldUnregister(true)
            setMiecraftDir(handle!! as FileSystemDirectoryHandle)
            appState.setInstallType(installType)
            appState.setAppState(AppState.INSTALLING)
        } else {
            setError("Please grant Permission to access the directory")
        }
    }
}

export function handleDragOver(event: DragEvent, setHoveringWithFile: Dispatch<SetStateAction<boolean>>) {
    event.preventDefault();
    setHoveringWithFile(true)
}

export function handleDragLeave(event: DragEvent, setHoveringWithFile: Dispatch<SetStateAction<boolean>>) {
    event.preventDefault();
    setHoveringWithFile(false)
}

async function verifyPermission(fileHandle: FileSystemHandle, withWrite: boolean) {
    const opts = {};
    // @ts-ignore
    if (withWrite) opts.mode = 'readwrite'
    // @ts-ignore
    if (await fileHandle.queryPermission(opts) === 'granted') return true
    // @ts-ignore
    return await fileHandle.requestPermission(opts) === 'granted';
}
