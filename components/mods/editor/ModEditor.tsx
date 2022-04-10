import {ModProfile} from "../../../types/modProfile";
import React, {Dispatch, SetStateAction, useContext} from "react";
import {useSession} from "next-auth/react";
import {ModListKeyEditor} from "./elements/ModListKeyEditor";
import {Role} from "../../../types/role";
import {Grid, SimpleGrid, Space} from "@mantine/core";
import {UpdateModListButton} from "./elements/UpdateModListButton";
import {ModListNameEditor} from "./elements/ModListNameEditor";
import {ModListDetailsEditor} from "./elements/ModListDetailsEditor";
import {ModListIconEditor} from "./elements/ModListIconEditor";
import {ModListMinecraftVersionEditor} from "./elements/ModListMinecraftVersionEditor";
import {ModListVerifiedEditor} from "./elements/ModListVerifiedEditor";
import {ModListLauncherNameEditor} from "./elements/ModListLauncherNameEditor";

type Props = {
    modProfile: ModProfile
    setModProfile: Dispatch<SetStateAction<ModProfile>>
}

const ModEditorContext = React.createContext({} as Props)

export function ModEditor({modProfile, setModProfile}: Props) {
    const {data: session} = useSession()

    if (session) {
        return (
            <ModEditorContext.Provider value={{modProfile, setModProfile}}>
                <Grid style={{width: "80%", margin: "auto"}}>
                    <Grid.Col span={8}>
                        <SimpleGrid cols={1} style={{marginLeft: "10%"}}>
                            {
                                (session.user.role !== Role.DEFAULT) && <ModListVerifiedEditor/>
                            }
                            {
                                session.user.role === Role.ADMIN && <ModListKeyEditor/>
                            }
                            <ModListNameEditor/>
                            <ModListLauncherNameEditor/>
                            <ModListIconEditor/>
                            <ModListMinecraftVersionEditor/>
                        </SimpleGrid>
                    </Grid.Col>
                    <Space w="xl"/>
                    <Grid.Col span={3}>
                        <SimpleGrid cols={1}>
                            <ModListDetailsEditor/>
                        </SimpleGrid>
                    </Grid.Col>
                </Grid>
                <UpdateModListButton/>
            </ModEditorContext.Provider>
        )
    } else {
        return <></>
    }
}

export function useModEditorContext() {
    return useContext(ModEditorContext)
}
