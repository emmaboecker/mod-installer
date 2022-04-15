import {Mod} from "../../../types/modProfile";
import {ProfileContextProps} from "../../../context/ProfileContextProvider";
import {createInstanceWithFabric} from "./createInstance";

export async function installMultiMC(mods: Mod[], minecraftDir: FileSystemDirectoryHandle, profileContext: ProfileContextProps) {
    await createInstanceWithFabric(minecraftDir, profileContext)
}
