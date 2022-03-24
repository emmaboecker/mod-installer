import {Center, Container, Text, useMantineTheme} from "@mantine/core";
import React from "react";

type Props = {
    type: string
}

export function ModTypeContainer({type}: Props) {
    const theme = useMantineTheme()

    return (
        <Container style={{background: theme.colors.dark[6], width: "max-content", borderRadius: "1vmin"}}>
            <Center>
                <Text
                    style={{
                        color: theme.white,
                        textTransform: "uppercase",
                        fontWeight: "bolder",
                        margin: "1vmin",
                    }}
                    size="xs"
                >
                    {type}
                </Text>
            </Center>
        </Container>
    )
}