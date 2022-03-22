import React, {useEffect, useState} from "react";
import {ModTypeContainer} from "../../ModTypeContainer/ModTypeContainer";
import {sortMods} from "../../../../lib/sortMods";
import {cloneMap} from "../../../../lib/cloneMap";
import {useModInstallStateContext} from "../../../pages/installing/InstallingModsPage";
import {createLauncherProfile, createVersion, ModInstallState} from "../modInstallFunctions";
import {ModInstallingContainer} from "./ModInstallingContainer";
import {Mod} from "../../../../lib/type/modProfile";
import {useDragMinecraftFolderContext} from "../../../../context/MinecraftFolderStateContextProvider";
import {useProfileContext} from "../../../../context/ProfileContextProvider";
import {useError} from "../../../../context/ErrorContextProvider";


export function ModInstallingElements() {
    const errorContext = useError()

    const minecraftDir = useDragMinecraftFolderContext()

    const profileContext = useProfileContext()
    const modInstallStatesContext = useModInstallStateContext()

    const [startedInstallCircle, setStartedInstallCircle] = useState(false)

    const elements: React.ReactNode[] = []

    useEffect(() => {
        if (!startedInstallCircle) {
            if (minecraftDir.minecraftDir) {
                createLauncherProfile(minecraftDir.minecraftDir as FileSystemDirectoryHandle, profileContext.profile!!, errorContext.setError).then(() => {
                    createVersion(minecraftDir.minecraftDir as FileSystemDirectoryHandle, profileContext.profile!!, errorContext.setError).then(() => {
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
            }
        }
    }, [startedInstallCircle, minecraftDir.minecraftDir])

    function getElementsForMods(mods: Mod[], wholeMods: Mod[]) {
        const modElements: React.ReactNode[] = []

        mods.forEach(value => {
            modElements.push(<ModInstallingContainer mod={value} mods={wholeMods}/>)
        })

        return modElements
    }

    const mods: Mod[] = []
    modInstallStatesContext.modInstallStates.forEach((value, key) => {
        mods.push(key)
    })

    sortMods(mods).forEach((value, key) => {
        elements.push((
            <>
                <ModTypeContainer type={key}/>
                {getElementsForMods(value, mods)}
            </>
        ))
    })

    return <> {elements} </>
}