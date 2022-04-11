import {Button} from "@mantine/core";
import {useModEditorContext} from "../ModEditor";
import {useRouter} from "next/router";
import {useNotifications} from "@mantine/notifications";
import {useState} from "react";

export function UpdateModListButton() {
    const modStateContext = useModEditorContext()

    const router = useRouter()

    const notifications = useNotifications()

    const [updating, setUpdating] = useState(false)

    function updateModList() {
        setUpdating(true)
        fetch("/api/profile/set", {method: "POST", body: JSON.stringify(modStateContext.modProfile)}).then(response => {
            if (response.status === 200) {
                if (modStateContext.modProfile._id !== modStateContext.modProfile.oldkey || router.route.startsWith("/new")) {
                    response.json().then(value => {
                        router.replace(`/edit/${value._id}`).then(() => {
                            modStateContext.setModProfile(value)
                        })
                    })
                }
                notifications.showNotification({
                    color: "green",
                    message: `Your Mod-List ${modStateContext.modProfile.name} was updated`
                })
            } else if (response.status === 406) {
                notifications.showNotification({
                    color: "red",
                    message: `You haven't filled out all required values yet`
                })
            } else {
                notifications.showNotification({
                    color: "red",
                    message: `There was an error. Got response code: ${response.status}`
                })
            }
            setUpdating(false)
        })
    }

    return (
        <Button variant="light" style={{position: "fixed", bottom: "3%", left: "3%"}} onClick={updateModList}
                loading={updating}>
            Save Changes
        </Button>
    )
}
