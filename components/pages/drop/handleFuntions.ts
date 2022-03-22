import {Dispatch, SetStateAction} from "react";
import {AppState} from "../../../pages/_app";

export async function handleDrop(event: DragEvent, setHoveringWithFile: Dispatch<SetStateAction<boolean>>, setShouldUnregister: Dispatch<SetStateAction<boolean>>, setError: Dispatch<SetStateAction<string | undefined>>, setAppState: Dispatch<SetStateAction<AppState>>, setMiecraftDir: Dispatch<SetStateAction<FileSystemHandle | undefined>>) {
    event.stopPropagation()
    event.preventDefault()
    event.stopImmediatePropagation()
    setHoveringWithFile(false)
    setShouldUnregister(true)
    const item = event.dataTransfer!!.items[0]
    if (event.dataTransfer!!.files[0].name === ".minecraft") {
        if (item.kind === "file") {
            const handle = (await item.getAsFileSystemHandle())!!
            if (handle.kind === "directory") {
                if (await verifyPermission(handle, true)) {
                    setMiecraftDir(handle!!)
                    setAppState(AppState.INSTALLING)
                } else {
                    setError("Please grant Permission to access the directory")
                }
            } else {
                setError("That isn't a directory")
            }
        }
    } else {
        setError("That doesn't look like a Minecraft Folder")
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
    if (await fileHandle.queryPermission(opts) === 'granted') return true
    return await fileHandle.requestPermission(opts) === 'granted';
}
