import {useAppState} from "../_app";
import {Center, Stepper} from "@mantine/core";
import {SelectModsPage} from "../../components/pages/selectMods/SelectModsPage";
import {DropMinecraftFolderPage} from "../../components/pages/drop/DropMinecraftFolderPage";
import {InstallingModsPage} from "../../components/pages/installing/InstallingModsPage";
import {InstallationDonePage} from "../../components/pages/done/InstallationDonePage";
import React from "react";

export default function AutomaticPage() {
    const appState = useAppState()

    const supported = typeof FileSystemHandle !== "undefined"
    const current = appState.appState;
    return (
        <Center style={{height: "100%"}}>
            <Stepper
                active={current}
                onStepClick={idx=>appState.setAppState(idx)}
                style={{marginTop: "2vmin", width: "70%"}}
                breakpoint="sm"
                color="violet"
            >
                <Stepper.Step label="Select Mods" allowStepSelect={current > 0}>
                    <Center style={{height: "100%"}}>
                        <SelectModsPage/>
                    </Center>
                </Stepper.Step>
                {supported &&
                        <Stepper.Step
                            label="Find Minecraft" allowStepSelect={current > 1}>
                            <Center style={{height: "100%"}}>
                                <DropMinecraftFolderPage/>
                            </Center>
                        </Stepper.Step>
                }
                <Stepper.Step label={appState.useAutomaticInstaller ? "Install": "Download ZIP"} allowStepSelect={current > 2}>
                    <Center style={{height: "100%"}}>
                        <InstallingModsPage/>
                    </Center>
                </Stepper.Step>
                <Stepper.Completed>
                    <InstallationDonePage/>
                </Stepper.Completed>
            </Stepper>
        </Center>
    )
}