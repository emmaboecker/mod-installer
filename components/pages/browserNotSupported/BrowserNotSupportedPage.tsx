import {Center, Text, Title} from "@mantine/core";
import Head from "next/head";

export function BrowserNotSupportedPage() {
    return (
        <>
            <Head>
                <title>Browser not supported</title>
            </Head>
            <Center style={{marginTop: "5vmin"}}>
                <div style={{maxWidth: "100vmin"}}>
                    <Title>Your Browser does not support the automatic installer</Title>
                    <Text size="xl">
                        Please use a Chromium-based Browser like Google Chrome or use the Manual Installer
                    </Text>
                </div>
            </Center>
        </>
    )
}