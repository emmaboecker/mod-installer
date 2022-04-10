import {copySettings} from "./copySettings";
import {createLauncherProfile} from "./createLauncherProfile";
import {createVersion} from "./createVersion";
import {ModInstallState} from "../ModInstallState";
import {cloneMap} from "../../cloneMap";
import {ProfileContextProps} from "../../../context/ProfileContextProvider";
import {Mod} from "../../../types/modProfile";
import {InstallStateContextProps} from "../../../components/pages/installing/InstallingModsPage";
import {Dispatch, SetStateAction} from "react";

export function installVanillaLauncher(mods: Mod[], minecraftDir: FileSystemDirectoryHandle, profileContext: ProfileContextProps, modInstallStatesContext: InstallStateContextProps, setStartedInstallCircle: Dispatch<SetStateAction<boolean>>) {
    copySettings(minecraftDir as FileSystemDirectoryHandle, profileContext.modProfile!!).then(() => {
        createLauncherProfile(minecraftDir as FileSystemDirectoryHandle, profileContext.modProfile!!).then(() => {
            createVersion(minecraftDir as FileSystemDirectoryHandle, profileContext.modProfile!!).then(() => {
                for (let mod of mods) {
                    const modState = modInstallStatesContext.modInstallStates.get(mod)
                    if (modState === ModInstallState.PENDING) {
                        modInstallStatesContext.setModInstallStates(cloneMap(modInstallStatesContext.modInstallStates).set(mod, ModInstallState.INSTALLING))
                        setStartedInstallCircle(true)
                        break
                    }
                }
            })
        })
    })
}
