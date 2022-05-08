import {Button, Space, Text} from "@mantine/core";
import {Server} from "../../../../../types/modProfile";
import {useState} from "react";
import {Edit, TrashX} from "tabler-icons-react";
import {useServerDetailsContext} from "./ServerListDetailsEditor";
import {ServerDetailsModal} from "./ServerDetailsModal";

type Props = {
    server: Server
}

export function ServerDetailsEditor({server}: Props) {
    const context = useServerDetailsContext()

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <ServerDetailsModal server={server} open={modalOpen} setOpen={setModalOpen} saveButtonText={"Update Server"} />
            <div style={{display: "flex", width: "80%", margin: "auto"}}>
                <Text style={{margin: "auto", overflowWrap: "anywhere"}}>{server.name}</Text>
                <Space w="xl"/>
                <div style={{marginLeft: "auto", display: "flex"}}>
                    <Button
                        onClick={() => {
                            setModalOpen(true)
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
