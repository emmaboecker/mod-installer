import {Card, Text, useMantineTheme} from "@mantine/core";
import {memo} from "react";

export type ErrorCardProps = {
    error: string | undefined
}

function ErrorCard({error}: ErrorCardProps) {
    const theme = useMantineTheme()

    if (error) {
        return (
            <Card sx={{backgroundColor: "rgba(255,21,21,0.23)"}} radius="sm" p="xs">
                <Text color={theme.colors.red[6]} size="md" style={{fontWeight: "bold"}}>{error}</Text>
            </Card>
        )
    } else {
        return (
            <></>
        )
    }
}

export default memo(ErrorCard);
