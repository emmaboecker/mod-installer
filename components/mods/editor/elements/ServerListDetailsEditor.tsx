import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import {Server} from "../../../../types/modProfile";
import {useModEditorContext} from "../ModEditor";
import {Box, Button, Center, Space, Text, Title, useMantineTheme} from "@mantine/core";
import {Plus} from "tabler-icons-react";
import {cloneList} from "../../../../lib/cloneList";
import {ServerDetailsEditor} from "./ServerDetailsEditor";

type ContextProps = {
    servers: Server[]
    updateServer(server: Server, newServer?: Server): void
}

const ServerDetailsContext = React.createContext({} as ContextProps)

export function ServerListDetailsEditor() {
    const modEditorContext = useModEditorContext()
    const [servers, setServers] = useState(modEditorContext.modProfile.servers ?? [])

    const [newServer, setNewServer] = useState(undefined as undefined | Server)

    const theme = useMantineTheme()

    function updateServer(server: Server, newServer?: Server) {
        const newServers: Server[] = []
        servers.forEach(value => {
            if (value !== server) {
                newServers.push(value)
            } else {
                if (newServer) {
                    newServers.push(newServer)
                }
            }
        })
        modEditorContext.modProfile.servers = newServers
        setServers(newServers)
    }

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
                {getEditors(servers, newServer, setServers, setNewServer)}
            </Box>
        </ServerDetailsContext.Provider>
    )
}

export function useServerDetailsContext() {
    return useContext(ServerDetailsContext)
}

function getEditors(servers: Server[], newServer: Server | undefined, setServers: Dispatch<SetStateAction<Server[]>>, setNewServer: Dispatch<SetStateAction<Server | undefined>>) {
    const elements: React.ReactNode[] = []

    servers.forEach(value => {
        elements.push(
            <>
                <ServerDetailsEditor server={value} openPopUp={value === newServer}/>
                <Space h="md"/>
            </>
        )
    })

    elements.push(
        <>
            <Center>
                <Button
                    variant="light"
                    onClick={() => {
                        const newServer = {
                            name: "New Server",
                            ip: "stckoverflw.net"
                        } as Server
                        const newServers = cloneList(servers)
                        newServers.push(newServer)
                        setServers(newServers)
                        setNewServer(newServer)
                    }}
                >
                    <Plus/>
                </Button>
            </Center>
            <Space h="md"/>
        </>
    )


    return elements
}
