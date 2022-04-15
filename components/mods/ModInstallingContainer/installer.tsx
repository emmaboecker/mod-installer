import {InstallStateContextProps} from "../../pages/installing/InstallingModsPage";
import {ModInstallState} from "../../../lib/install/ModInstallState";
import {cloneMap} from "../../../lib/cloneMap";
import {Mod} from "../../../types/modProfile";
import {AppState, AppStateContextProps, InstallType} from "../../../pages/_app";
import {installVanillaLauncher} from "../../../lib/install/vanillaLauncher/installVanillaLauncher";
import {createInstanceWithFabric} from "../../../lib/install/multimc/createInstance";
import {ProfileContextProps} from "../../../context/ProfileContextProvider";
import {installMod} from "../../../lib/install/installMod";
import {ErrorContextProps} from "../../../context/ErrorContextProvider";
import JSZip from "jszip";
import React, {Dispatch, SetStateAction} from "react";
import {Stepper, Text} from "@mantine/core";
import {CircleCheck, CircleX} from "tabler-icons-react";

export class Installer {
    modInstallStatesContext: InstallStateContextProps;
    mods: Mod[]
    minecraftDir: FileSystemDirectoryHandle
    profileContext: ProfileContextProps
    errorContext: ErrorContextProps
    appStateContext: AppStateContextProps
    zip: JSZip

    installingDir?: FileSystemDirectoryHandle
    installAutomatically?: boolean

    constructor(
        mods: Mod[],
        modInstallStatesContext: InstallStateContextProps,
        minecraftDir: FileSystemDirectoryHandle,
        profileContext: ProfileContextProps,
        errorContext: ErrorContextProps,
        appStateContext: AppStateContextProps,
        zip: JSZip
    ) {
        this.modInstallStatesContext = modInstallStatesContext
        this.mods = mods
        this.minecraftDir = minecraftDir
        this.profileContext = profileContext
        this.errorContext = errorContext
        this.appStateContext = appStateContext
        this.zip = zip
    }

    async findFirstMod() {
        for (let mod of this.mods) {
            const modState = this.modInstallStatesContext.modInstallStates.get(mod)
            if (modState === ModInstallState.PENDING) {
                this.modInstallStatesContext.setModInstallStates(cloneMap(this.modInstallStatesContext.modInstallStates).set(mod, ModInstallState.INSTALLING))
                break
            }
        }
    }

    async prepareInstallation(installType: InstallType) {
        switch (installType) {
            case InstallType.MINECRAFT_LAUNCHER:
                this.installingDir = await this.minecraftDir.getDirectoryHandle(this.profileContext.modProfile!!.id, {create: true})
                await installVanillaLauncher(
                    this.mods,
                    this.minecraftDir,
                    this.profileContext
                )
                break
            case InstallType.MULTIMC:
                const dir = await this.minecraftDir.getDirectoryHandle("instances")
                const instanceDir = await dir.getDirectoryHandle(this.profileContext.modProfile!!.id, {create: true})
                this.installingDir = await instanceDir.getDirectoryHandle(".minecraft", {create: true})
                await createInstanceWithFabric(this.minecraftDir, this.profileContext)
                break
        }
    }

    async installInMultiMc(mod: Mod): Promise<ModInstallState> {
        return installMod(this.installingDir ?? this.minecraftDir, this.profileContext.modProfile!!, mod, this.errorContext.setError)
    }

    async installInMinecraftLauncher(mod: Mod): Promise<ModInstallState> {
        return installMod(this.installingDir ?? this.minecraftDir, this.profileContext.modProfile!!, mod, this.errorContext.setError)
    }

    isDone(newMap: Map<Mod, ModInstallState>): boolean {
        let done = true
        newMap.forEach((value) => {
            if (value !== ModInstallState.DONE && value !== ModInstallState.SKIPPED) {
                done = false
            }
        })
        return done
    }

    setNewState(mod: Mod, newState: ModInstallState, setActiveMod: Dispatch<SetStateAction<number>>) {
        const newMap = cloneMap(this.modInstallStatesContext.modInstallStates).set(mod, newState)
        this.modInstallStatesContext.setModInstallStates(newMap)
        for (let i = this.mods.indexOf(mod); i < this.mods.length; i++) {
            if (this.mods[i + 1]) {
                if (newMap.get(this.mods[i + 1]) === ModInstallState.PENDING) {
                    setActiveMod(i + 1)
                    this.modInstallStatesContext.setModInstallStates(cloneMap(newMap).set(this.mods[i + 1], ModInstallState.INSTALLING))
                    break
                }
            }
        }
        if (this.isDone(newMap)) {
            if (!this.installAutomatically) {
                this.zip.generateAsync({type: "blob"}).then(blob => {
                    const link = document.createElement('a');
                    const url = URL.createObjectURL(blob)
                    link.href = url;
                    link.download = this.profileContext.modProfile!!.name.replaceAll(/\W/g, "-") + ".zip";
                    link.click();
                    URL.revokeObjectURL(url);
                    link.remove();
                })
            }
            this.appStateContext.setAppState(AppState.DONE)
        }
    }

    getElementsForMods(mods: Mod[]) {
        const modElements: React.ReactNode[] = []

        mods.forEach((value) => {
            const state = this.modInstallStatesContext.modInstallStates.get(value)
            modElements.push(
                <Stepper.Step
                    label={<Text size="lg">{value.name}</Text>}
                    style={state === ModInstallState.SKIPPED ? {color: "indianred"} : undefined}
                    description={
                        state === ModInstallState.SKIPPED ? "Skipped" :
                            state === ModInstallState.INSTALLING ? "Installing" :
                                state === ModInstallState.PENDING ? "Pending" : "Done"
                    }
                    completedIcon={
                        state === ModInstallState.SKIPPED ? <CircleX/> :
                            <CircleCheck/>
                    }
                    icon={state === ModInstallState.SKIPPED ? <CircleX/> : undefined}
                    loading={state === ModInstallState.INSTALLING}
                />
            )
        })

        return modElements
    }
}
