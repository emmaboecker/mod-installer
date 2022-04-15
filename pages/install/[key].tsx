import {useAppState} from "../_app";
import {Center, Stepper} from "@mantine/core";
import {SelectModsPage} from "../../components/pages/selectMods/SelectModsPage";
import {DropMinecraftFolderPage} from "../../components/pages/drop/DropMinecraftFolderPage";
import {InstallingModsPage} from "../../components/pages/installing/InstallingModsPage";
import {InstallationDonePage} from "../../components/pages/done/InstallationDonePage";
import React from "react";
import {ProfileContextProvider} from "../../context/ProfileContextProvider";
import {ModProfile} from "../../types/modProfile";
import {GetServerSideProps} from "next";
import clientPromise from "../../lib/mongodb";
import Head from "next/head";

type Props = {
    modProfile: ModProfile | undefined
    allowUserModLists: boolean
}

export default function InstallPage({modProfile, allowUserModLists}: Props) {
    const appState = useAppState()

    const current = appState.appState;

    const supported = typeof FileSystemHandle !== "undefined"
    return (
        <>
            <Head>
                <title>{modProfile?.name}</title>
                <meta name="description" content={`Automatic Installer for Fabric Mods: ${modProfile?.description}`} />
                <meta property="og:title" content={`${modProfile?.name}: Online Installer`} />
                <meta name="og:description" content={`Automatic Installer for Fabric Mods: ${modProfile?.description}`} />
            </Head>
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
                                <SelectModsPage showVerify={allowUserModLists}/>
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
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {key} = context.query
    const client = await clientPromise()
    const collection = await client.db().collection("profiles")

    const content = await collection.findOne({_id: key})
    return {
        props: {
            modProfile: content,
            allowUserModLists: (process.env.ALLOW_USER_MOD_LISTS ?? "true") === "true"
        }
    }

}

