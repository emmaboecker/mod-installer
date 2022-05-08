import {Button, Modal, Space, TextInput} from "@mantine/core";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Server} from "../../../../../types/modProfile";
import {useServerDetailsContext} from "./ServerListDetailsEditor";

type Props = {
    server: Server
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    saveButtonText: string
}

export function ServerDetailsModal({server, open, setOpen, saveButtonText}: Props) {
    const context = useServerDetailsContext()

    const [name, setName] = useState(server.name)
    const [ip, setIp] = useState(server.ip)

    useEffect(() => {
        setName(server.name)
        setIp(server.ip)
    }, [context.servers, server.ip, server.name])

    return (
        <Modal
            opened={open}
            onClose={() => setOpen(false)}
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
                    setOpen(false)
                }}
            >
                {saveButtonText}
            </Button>
            <Button
                style={{float: "right"}}
                variant="light"
                color="gray"
                onClick={() => {
                    setName(server.name)
                    setIp(server.ip)
                    setOpen(false)
                }}
            >
                Discard
            </Button>
        </Modal>
    )
}
