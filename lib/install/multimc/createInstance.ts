import {ProfileContextProps} from "../../../context/ProfileContextProvider";
import {getDat} from "../serverDat";
import {ModProfile} from "../../../types/modProfile";

export async function createInstanceWithFabric(multimcDir: FileSystemDirectoryHandle, profileContext: ProfileContextProps) {
    const instance = await (await multimcDir.getDirectoryHandle("instances", {create: true})).getDirectoryHandle(profileContext.modProfile!!.id, {create: true});
    // @ts-ignore
    const mmcPack = await (await instance.getFileHandle("mmc-pack.json", {create: true})).createWritable();
    await mmcPack.write(JSON.stringify(await mmcPackData(profileContext.modProfile!!)))
    await mmcPack.close();
    // @ts-ignore
    const instanceCfg = await (await instance.getFileHandle("instance.cfg", {create: true})).createWritable();
    await instanceCfg.write(instanceCfgText(profileContext.modProfile!!.profileName));
    await instanceCfg.close()
    if (profileContext.modProfile!!.servers && profileContext.modProfile!!.servers.length > 0) {
        const instanceMcDir = await instance.getDirectoryHandle(".minecraft", {create: true});
        // @ts-ignore
        const serverDat = await (await instanceMcDir.getFileHandle("servers.dat", {create: true})).createWritable();
        await serverDat.write(getDat(profileContext.modProfile!!.servers));
        await serverDat.close();
    }
}

async function mmcPackData(profile: ModProfile) {
    const response = await fetch(`https://meta.fabricmc.net/v2/versions/loader/${profile.minecraftVersion}`).then(value => value.json());
    return {
        components: [
            {
                cachedName: "LWJGL 3",
                cachedVersion: "3.2.2",
                cachedVolatile: true,
                dependencyOnly: true,
                uid: "org.lwjgl3",
                version: "3.2.2"
            },
            {
                cachedName: "Minecraft",
                cachedRequires: [
                    {
                        equals: "3.2.2",
                        suggests: "3.2.2",
                        uid: "org.lwjgl3"
                    }
                ],
                cachedVersion: profile.minecraftVersion,
                important: true,
                uid: "net.minecraft",
                version: profile.minecraftVersion
            },
            {
                cachedName: "Intermediary Mappings",
                cachedRequires: [
                    {
                        equals: profile.minecraftVersion,
                        uid: "net.minecraft"
                    }
                ],
                cachedVersion: profile.minecraftVersion,
                cachedVolatile: true,
                dependencyOnly: true,
                uid: "net.fabricmc.intermediary",
                version: profile.minecraftVersion
            },
            {
                cachedName: "Fabric Loader",
                cachedRequires: [
                    {
                        uid: "net.fabricmc.intermediary"
                    }
                ],
                cachedVersion: response[0].loader.version,
                uid: "net.fabricmc.fabric-loader",
                version: response[0].loader.version
            }
        ],
        formatVersion: 1
    }
}

function instanceCfgText(name: string) {
    return new TextEncoder().encode("InstanceType=OneSix\n" + "iconKey=default\n" + `name=${name}\n`)
}
