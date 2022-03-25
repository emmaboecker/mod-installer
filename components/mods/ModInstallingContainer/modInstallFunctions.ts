import {Dispatch, SetStateAction} from "react";
import {LauncherProfiles} from "../../../lib/type/launcherProfiles";
import {Mod, ModProfile} from "../../../lib/type/modProfile";
import {cloneMap} from "../../../lib/cloneMap";
import {getFabricLibraries} from "../../../lib/fabricLibraries";
import {getDat} from "./serverDat";

export enum ModInstallState {
    SKIPPED,
    PENDING,
    INSTALLING,
    DONE,
    FAILED
}

export async function createLauncherProfile(dir: FileSystemDirectoryHandle, profile: ModProfile) {
    const launcherProfilesHandle = await dir.getFileHandle("launcher_profiles.json", {create: true})
    const profileWritable = await launcherProfilesHandle.createWritable()
    const launcherProfiles = await launcherProfilesHandle.getFile()
    const text = await launcherProfiles.text()
    const json: LauncherProfiles = text.length > 0 ? JSON.parse(text) : {profiles: {}}
    let newMap = new Map(Object.entries(json.profiles))
    const currentDate = (new Date()).toISOString()
    // @ts-ignore
    json.profiles = Object.fromEntries(cloneMap(newMap).set(profile.id, {
        created: currentDate,
        icon: profile.icon,
        lastUsed: currentDate,
        lastVersionId: profile.id,
        type: "custom",
        name: profile.profileName
    }))
    console.log(json)
    await profileWritable.write((new window.TextEncoder()).encode(JSON.stringify(json)))
    await profileWritable.close()
}

export async function copySettings(dir: FileSystemDirectoryHandle, profile: ModProfile) {
    const optionsFile = await dir.getFileHandle("options.txt", {create: true})
    const newOptionsFile = await (await dir.getDirectoryHandle(`${profile.id}`, {create: true})).getFileHandle("options.txt", {create: true})
    const file = await optionsFile.getFile()
    const optionsWriteable = await newOptionsFile.createWritable()
    await optionsWriteable.write(await file.text())
    await optionsWriteable.close()
    const newServerDataFile = await (await dir.getDirectoryHandle(`${profile.id}`, {create: true})).getFileHandle("servers.dat", {create: true})
    const serverFileWriteable = await newServerDataFile.createWritable()
    if (!profile.servers || profile.servers.length === 0) {
        const serverDataFile = await dir.getFileHandle("servers.dat", {create: true})
        const serverFile = await serverDataFile.getFile()
        await serverFileWriteable.write(await serverFile.arrayBuffer())
    } else {
        await serverFileWriteable.write(getDat(profile.servers))
    }
    await serverFileWriteable.close()
}

export async function createVersion(dir: FileSystemDirectoryHandle, profile: ModProfile) {
    const versionDir = await (await dir.getDirectoryHandle(`versions`, {create: true})).getDirectoryHandle(profile.id, {create: true})
    const versionFileHandle = await versionDir.getFileHandle(`${profile.id}.json`, {create: true})
    const writeable = await versionFileHandle.createWritable()
    await writeable.write((new window.TextEncoder()).encode(JSON.stringify({
        id: profile.id,
        inheritsFrom: "1.18.2",
        type: "release",
        mainClass: "net.fabricmc.loader.impl.launch.knot.KnotClient",
        arguments: {
            game: [
                "--gameDir",
                profile.id
            ],
            jvm: [
                "-DFabricMcEmu= net.minecraft.client.main.Main"
            ]
        },
        libraries: getFabricLibraries()
    })))
    await writeable.close()
}

export async function installMod(dir: FileSystemDirectoryHandle, profile: ModProfile, mod: Mod, setError: Dispatch<SetStateAction<string | undefined>>): Promise<ModInstallState> {
    const modsDir = await (await dir.getDirectoryHandle(`${profile.id}`, {create: true})).getDirectoryHandle("mods", {create: true})
    return new Promise<ModInstallState>(resolve => {
        fetch(mod.downloadLink, {
            mode: "cors"
        }).then(response => {
            if (response.status === 200) {
                modsDir.getFileHandle(mod.path, {create: true}).then(handle => {
                    handle.createWritable().then(writableStream => {
                        response.body!!.pipeTo(writableStream)
                        resolve(ModInstallState.DONE)
                    })
                })
            } else {
                setError(`There was an error requesting, got ${response.status} status-code`)
                resolve(ModInstallState.FAILED)
            }
        })
    })

}