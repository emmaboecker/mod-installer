import {ModProfile} from "../../../types/modProfile";
import {getDat} from "../serverDat";

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
