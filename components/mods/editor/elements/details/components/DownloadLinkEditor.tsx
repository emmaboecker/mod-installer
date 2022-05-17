import {TextInput} from "@mantine/core";
import {Dispatch, SetStateAction} from "react";

type Props = {
    downloadLink: string,
    setDownloadLink: Dispatch<SetStateAction<string>>
}

export function DownloadLinkEditor({downloadLink, setDownloadLink}: Props) {
    return (
        <TextInput
            label="Download Link"
            placeholder="Download Link"
            size="md"
            description="The Download Link of this Mod"
            value={downloadLink}
            onChange={(event) => {
                setDownloadLink(event.currentTarget.value)
            }}
            required
            autoComplete="off"
        />
    )
}
