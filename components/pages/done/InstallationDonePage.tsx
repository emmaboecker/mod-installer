import {ContentFrame} from "../../ContentFrame/ContentFrame";
import {Text, useMantineTheme} from "@mantine/core";
import {useProfileContext} from "../../../context/ProfileContextProvider";

export function InstallationDonePage() {
    const theme = useMantineTheme()

    const profileContext = useProfileContext()

    return (
        <ContentFrame
            borderColor={theme.colors.dark[6]}
            leftColumn={
                <>
                    <Text size="xl" style={{fontWeight: "bolder"}}>Installation finished!</Text>
                    <Text>That&apos;s it!</Text>
                    <Text>Start your Minecraft Launcher and Launch the newly created Profile <b>{profileContext.profile?.name}</b></Text>
                </>
            }
            rightColumn={
                <>
                </>
            }
        />
    )
}