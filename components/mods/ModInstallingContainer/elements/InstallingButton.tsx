import {Button} from "@mantine/core";
import React from "react";
import {ModInstallState} from "../modInstallFunctions";

type Props = {
    state: ModInstallState
}

export function InstallingButton({state}: Props) {
    return (
        <Button
            variant="light"
            color={
                state === ModInstallState.SKIPPED ? "red" :
                    state === ModInstallState.DONE ? "green" :
                        state === ModInstallState.FAILED ? "red" : "orange"
            }
            radius="lg"
        >
            {
                (
                    state === ModInstallState.SKIPPED ? "Skipped" :
                        state === ModInstallState.DONE ? "Installed" :
                            state === ModInstallState.PENDING ? "Pending..." :
                                state === ModInstallState.INSTALLING ? "Installing..." : "Failed"
                )
            }
        </Button>
    )
}