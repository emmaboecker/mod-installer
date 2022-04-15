import {copySettings} from "./copySettings";
import {createLauncherProfile} from "./createLauncherProfile";
import {createVersion} from "./createVersion";
import {ProfileContextProps} from "../../../context/ProfileContextProvider";
import {Mod} from "../../../types/modProfile";

export async function installVanillaLauncher(mods: Mod[], minecraftDir: FileSystemDirectoryHandle, profileContext: ProfileContextProps) {
    await copySettings(minecraftDir, profileContext.modProfile!!)
    await createLauncherProfile(minecraftDir, profileContext.modProfile!!)
    await createVersion(minecraftDir, profileContext.modProfile!!)
}
