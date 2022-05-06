import {Button, Modal, Space, Text, TextInput} from "@mantine/core";
import {Server} from "../../../../../types/modProfile";
import {useEffect, useState} from "react";
import {Edit, TrashX} from "tabler-icons-react";
import {useServerDetailsContext} from "./ServerListDetailsEditor";

type Props = {
    server: Server,
    openPopUp: boolean
}

export function ServerDetailsEditor({server, openPopUp}: Props) {
    const context = useServerDetailsContext()

    const [opened, setOpened] = useState(openPopUp);

    const [name, setName] = useState(server.name)
    const [ip, setIp] = useState(server.ip)

    useEffect(() => {
        setName(server.name)
        setIp(server.ip)
    }, [context.servers, server.ip, server.name])

    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
                title={name}
            >
                <TextInput
                    placeholder="Name"
                    size="md"
                    description="The Name of this Server"
                    value={name}
                    onChange={(event) => {
                        setName(event.currentTarget.value)
                    }}
                    required
                    autoComplete="off"
                />
                <Space h="sm"/>
                <TextInput
                    placeholder="Server IP"
                    size="md"
                    description="The IP of this Server"
                    value={ip}
                    onChange={(event) => {
                        setIp(event.currentTarget.value)
                    }}
                    required
                    autoComplete="off"
                />
                <Space h="md"/>
                <Button
                    variant="outline"
                    onClick={() => {
                        context.updateServer(server, {
                            name: name,
                            ip: ip
                        })
                        setOpened(false)
                    }}
                >
                    Update Server
                </Button>
                <Button
                    style={{float: "right"}}
                    variant="light"
                    color="gray"
                    onClick={() => {
                        setName(server.name)
                        setIp(server.ip)
                        setOpened(false)
                    }}
                >
                    Discard
                </Button>
            </Modal>
            <div style={{display: "flex", width: "80%", margin: "auto"}}>
                <Text style={{margin: "auto", overflowWrap: "anywhere"}}>{name}</Text>
                <Space w="xl"/>
                <div style={{marginLeft: "auto", display: "flex"}}>
                    <Button
                        onClick={() => {
                            setOpened(true)
                        }}
                        variant="light"
                    >
                        <Edit />
                    </Button>
                    <Space w="xs"/>
                    <Button
                        onClick={() => {
                            context.updateServer(server, undefined)
                        }}
                        variant="light"
                        color="red"
                    >
                        <TrashX />
                    </Button>
                </div>
            </div>
        </>
    )
}
