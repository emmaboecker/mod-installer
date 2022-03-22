import {Center, Text} from "@mantine/core";

export function SizeNotSupportedPage() {
    return (
        <>
            <Center>
                <Text size="xl">Size Unsupported</Text>
            </Center>
            <Center>
                <Text size="md">The Size of your Browser Window is too small, try resizing</Text>
            </Center>
        </>
    )
}