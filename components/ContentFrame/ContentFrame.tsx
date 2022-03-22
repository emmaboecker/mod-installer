import {Card, Grid, MantineColor, useMantineTheme} from "@mantine/core";
import React, {useState} from "react";
import ErrorCard from "../ErrorCard/ErrorCard";
import {useError} from "../../context/ErrorContextProvider";

type ContentFrameProps = {
    borderColor: MantineColor
    leftColumn: React.ReactNode
    rightColumn: React.ReactNode
}

export function ContentFrame({borderColor, leftColumn, rightColumn}: ContentFrameProps) {
    const theme = useMantineTheme()

    const errorContext = useError()

    return (
        <Card
            style={{
                position: "absolute",
                backgroundColor: theme.colors.dark[7],
                transition: "0.15s",
                border: `2px solid ${borderColor}`,
                borderRadius: "15px",
                top: "48%",
                transform: "translateY(-50%)",
                width: "948px",
                height: "532px",
                padding: "0"
            }}
            p="md"
        >
            <Grid px={0} grow>
                <Grid.Col span={1} style={{padding: "40px"}}>
                    {leftColumn}
                    <div style={{position: "absolute", bottom: "30px", maxWidth: "325px",}}>
                        {renderErrorCard(errorContext.error)}
                    </div>
                </Grid.Col>
                <div style={{borderLeft: `1.5px solid ${theme.colors.dark[6]}`, height: "100vmin", marginTop: "-3%"}} />
                <Grid.Col span={3} style={{height: "10", padding: "0"}}>
                    <div style={{marginLeft: "-1px"}}>{rightColumn}</div>
                </Grid.Col>
            </Grid>
        </Card>
    )
}

function renderErrorCard(error: string | undefined) {
    if (error) {
        return <ErrorCard error={error} />
    }
}
