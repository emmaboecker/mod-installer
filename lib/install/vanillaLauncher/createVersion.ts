import {Loader, ModProfile} from "../../../types/modProfile";
import {getFabricLibraries, getQuiltLibraries} from "../../fetchLibraries";

export async function createVersion(dir: FileSystemDirectoryHandle, profile: ModProfile) {
    const versionDir = await (await dir.getDirectoryHandle(`versions`, {create: true})).getDirectoryHandle(profile.id, {create: true})
    const versionFileHandle = await versionDir.getFileHandle(`${profile.id}.json`, {create: true})
    // @ts-ignore
    const writeable = await versionFileHandle.createWritable()
    await writeable.write((new window.TextEncoder()).encode(JSON.stringify({
        id: profile.id,
        inheritsFrom: profile.minecraftVersion,
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
        libraries: (profile.loader === Loader.QUILT ? await getQuiltLibraries(profile) : await getFabricLibraries(profile))
    })))
    await writeable.close()
}
