import {ProfileContextProps} from "../../../context/ProfileContextProvider";
import {getDat} from "../serverDat";

export async function createInstanceWithFabric(multimcDir: FileSystemDirectoryHandle, profileContext: ProfileContextProps) {
    const instance = await (await multimcDir.getDirectoryHandle("instances", {create: true})).getDirectoryHandle(profileContext.profile!!.id, {create: true});
    const mmcPack = await (await instance.getFileHandle("mmc-pack.json", {create: true})).createWritable();
    await mmcPack.write(JSON.stringify(mmcPackData()))
    await mmcPack.close();
    const instanceCfg = await (await instance.getFileHandle("instance.cfg", {create: true})).createWritable();
    await instanceCfg.write(instanceCfgText(profileContext.profile!!.profileName));
    await instanceCfg.close()
    if (profileContext.profile!!.servers && profileContext.profile!!.servers.length > 0) {
        const instanceMcDir = await instance.getDirectoryHandle(".minecraft", {create: true});
        const serverDat = await (await instanceMcDir.getFileHandle("servers.dat", {create: true})).createWritable();
        await serverDat.write(getDat(profileContext.profile!!.servers));
        await serverDat.close();
    }
}

function mmcPackData() {
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
                cachedVersion: "1.18.2",
                important: true,
                uid: "net.minecraft",
                version: "1.18.2"
            },
            {
                cachedName: "Intermediary Mappings",
                cachedRequires: [
                    {
                        equals: "1.18.2",
                        uid: "net.minecraft"
                    }
                ],
                cachedVersion: "1.18.2",
                cachedVolatile: true,
                dependencyOnly: true,
                uid: "net.fabricmc.intermediary",
                version: "1.18.2"
            },
            {
                cachedName: "Fabric Loader",
                cachedRequires: [
                    {
                        uid: "net.fabricmc.intermediary"
                    }
                ],
                cachedVersion: "0.13.3",
                uid: "net.fabricmc.fabric-loader",
                version: "0.13.3"
            }
        ],
        formatVersion: 1
    }
}

function instanceCfgText(name: string) {
    return new TextEncoder().encode("InstanceType=OneSix\n" + "iconKey=default\n" + `name=${name}\n`)
}