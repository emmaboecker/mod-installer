import {useModDetailsContext} from "./ModListDetailsEditor";
import {Button, Space, Text} from "@mantine/core";
import {Mod} from "../../../../../types/modProfile";
import {useState} from "react";
import {Edit, TrashX} from "tabler-icons-react";
import {ModDetailsModal} from "./ModDetailsModal";

type Props = {
    mod: Mod
}

export function ModDetailsEditor({mod}: Props) {
    const context = useModDetailsContext()

    const [open, setOpen] = useState(false)

    return (
        <>
            <ModDetailsModal mod={mod} open={open} setOpen={setOpen} saveButtonText={"Update Mod"}/>
            <div style={{display: "flex", width: "80%", margin: "auto"}}>
                <Text style={{margin: "auto", overflowWrap: "anywhere"}}>{mod.name}</Text>
                <Space w="xl"/>
                <div style={{marginLeft: "auto", display: "flex"}}>
                    <Button
                        onClick={() => {
                            setOpen(true)
                        }}
                        variant="light"
                    >
                        <Edit/>
                    </Button>
                    <Space w="xs"/>
                    <Button
                        onClick={() => {
                            context.updateMod(mod, undefined)
                        }}
                        variant="light"
                        color="red"
                    >
                        <TrashX/>
                    </Button>
                </div>
            </div>
        </>
    )
}
