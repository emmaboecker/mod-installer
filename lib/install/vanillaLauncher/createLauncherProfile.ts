import {ModProfile} from "../../../types/modProfile";
import {LauncherProfiles} from "../../../types/launcherProfiles";
import {cloneMap} from "../../cloneMap";

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
