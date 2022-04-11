import {useAppState} from "../_app";
import {Center, Stepper, Title} from "@mantine/core";
import {SelectModsPage} from "../../components/pages/selectMods/SelectModsPage";
import {DropMinecraftFolderPage} from "../../components/pages/drop/DropMinecraftFolderPage";
import {InstallingModsPage} from "../../components/pages/installing/InstallingModsPage";
import {InstallationDonePage} from "../../components/pages/done/InstallationDonePage";
import React, {useEffect, useState} from "react";
import {ProfileContextProvider} from "../../context/ProfileContextProvider";
import {ModProfile} from "../../types/modProfile";
import {GetServerSideProps} from "next";
import clientPromise from "../../lib/mongodb";

type Props = {
    modProfile: ModProfile | undefined
}

export default function AutomaticPage({modProfile}: Props) {
    const appState = useAppState()

    const current = appState.appState;

    const [supported, setSupported] = useState(undefined as boolean | undefined)

    useEffect(() => {
        setSupported(typeof FileSystemHandle !== "undefined")
    }, [])

    if (supported !== undefined) {
        return (
            <ProfileContextProvider modProfile={modProfile}>
                <Center style={{height: "100%"}}>
                    <Stepper
                        active={current}
                        onStepClick={idx => appState.setAppState(idx)}
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
                        <Stepper.Step label={appState.useAutomaticInstaller ? "Install" : "Download ZIP"}
                                      allowStepSelect={current > 2}>
                            <Center style={{height: "100%"}}>
                                <InstallingModsPage/>
                            </Center>
                        </Stepper.Step>
                        <Stepper.Completed>
                            <InstallationDonePage/>
                        </Stepper.Completed>
                    </Stepper>
                </Center>
            </ProfileContextProvider>
        )
    }

    return (
        <Title>Checking compatibility...</Title>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {key} = context.query
    const client = await clientPromise()
    const collection = await client.db().collection("profiles")

    const content = await collection.findOne({_id: key})
    return {
        props: {modProfile: content}
    }

}

