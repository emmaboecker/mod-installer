import {Mod} from "../../../types/modProfile";
import {ProfileContextProps} from "../../../context/ProfileContextProvider";
import {InstallStateContextProps} from "../../../components/pages/installing/InstallingModsPage";
import {Dispatch, SetStateAction} from "react";
import {createInstanceWithFabric} from "./createInstance";
import {ModInstallState} from "../ModInstallState";
import {cloneMap} from "../../cloneMap";

export function installMultiMC(mods: Mod[], minecraftDir: FileSystemDirectoryHandle, profileContext: ProfileContextProps, modInstallStatesContext: InstallStateContextProps, setStartedInstallCircle: Dispatch<SetStateAction<boolean>>) {
    createInstanceWithFabric(minecraftDir, profileContext).then(() => {
        for (let mod of mods) {
            const modState = modInstallStatesContext.modInstallStates.get(mod)
            if (modState === ModInstallState.PENDING) {
                modInstallStatesContext.setModInstallStates(cloneMap(modInstallStatesContext.modInstallStates).set(mod, ModInstallState.INSTALLING))
                setStartedInstallCircle(true)
                break
            }
        }
    })
}
