import {Center, Text} from "@mantine/core";
import Head from "next/head";

export function SizeNotSupportedPage() {
    return (
        <>
            <Head>
                <title>Browser Size not Supported</title>
            </Head>
            <Center>
                <Text size="xl">Window Size Unsupported</Text>
            </Center>
            <Center>
                <Text size="md">The Size of your Browser Window is too small, try resizing</Text>
            </Center>
        </>
    )
}