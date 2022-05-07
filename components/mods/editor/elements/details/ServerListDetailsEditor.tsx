import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {Server} from "../../../../../types/modProfile";
import {useModEditorContext} from "../../ModEditor";
import {Box, Button, Center, Space, Text, Title, useMantineTheme} from "@mantine/core";
import {Plus} from "tabler-icons-react";
import {ServerDetailsEditor} from "./ServerDetailsEditor";
import {useListState} from "@mantine/hooks";
import {UseListStateHandler} from "@mantine/hooks/lib/use-list-state/use-list-state";

type ContextProps = {
    servers: Server[]
    updateServer(server: Server, newServer?: Server): void
}

const ServerDetailsContext = React.createContext({} as ContextProps)

export function ServerListDetailsEditor() {
    const modEditorContext = useModEditorContext()
    const [servers, serversHandlers] = useListState(modEditorContext.modProfile.servers)

    const [newServer, setNewServer] = useState<Server>()

    const theme = useMantineTheme()

    function updateServer(server: Server, newServer?: Server) {
        if (newServer) {
            serversHandlers.applyWhere((s) => s === server, () => newServer)
        } else {
            serversHandlers.remove(servers.indexOf(server))
        }
    }

    useEffect(() => {
        modEditorContext.modProfile.servers = servers
    }, [modEditorContext.modProfile, servers])

    return (
        <ServerDetailsContext.Provider value={{servers, updateServer}}>
            <Box style={{backgroundColor: theme.colors.dark[8], padding: "2%", borderRadius: "2vmin"}}>
                <Center style={{marginTop: "3%"}}>
                    <Title order={3}>Servers</Title>
                </Center>
                <Center style={{marginTop: "3%"}}>
                    <Text
                        size="md"
                        style={{
                            textAlign: "center"
                        }}
                    >
                        The Servers that will be added to the users Server-List
                    </Text>
                </Center>
                <Space h="md"/>
                {getEditors(servers, newServer, serversHandlers, setNewServer)}
            </Box>
        </ServerDetailsContext.Provider>
    )
}

export function useServerDetailsContext() {
    return useContext(ServerDetailsContext)
}

function getEditors(servers: Server[], newServer: Server | undefined, serversHandlers: UseListStateHandler<Server>, setNewServer: Dispatch<SetStateAction<Server | undefined>>) {
    const elements: React.ReactNode[] = []

    elements.push(
        servers.map((value, index) =>
            <div key={index}>
                <ServerDetailsEditor server={value} openPopUp={value === newServer}/>
                <Space h="md"/>
            </div>
        )
    )


    elements.push(
        <div key={elements.length}>
            <Center>
                <Button
                    variant="light"
                    onClick={() => {
                        const newServer = {
                            name: "New Server",
                            ip: "stckoverflw.net"
                        } as Server
                        serversHandlers.append(newServer)
                        setNewServer(newServer)
                    }}
                >
                    <Plus/>
                </Button>
            </Center>
            <Space h="md"/>
        </div>
    )


    return elements
}
