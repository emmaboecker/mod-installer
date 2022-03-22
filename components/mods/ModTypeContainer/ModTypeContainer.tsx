import {Container, Text, useMantineTheme} from "@mantine/core";
import React from "react";

type Props = {
    type: string
}

export function ModTypeContainer({ type }: Props) {
    const theme = useMantineTheme()

    return (
        <Container style={{background: theme.colors.dark[6], marginLeft: "-10px"}}>
            <Text
                style={{
                    color: theme.white,
                    textTransform: "uppercase",
                    fontWeight: "bolder",
                    padding: "5px",
                    marginBottom: "15px"
                }}
                size="xs"
            >
                {type}
            </Text>
        </Container>
    )
}