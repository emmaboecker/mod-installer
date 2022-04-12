import {Anchor, Center, Text} from "@mantine/core";

export function Footer() {
    return (
        <Center>
            <span style={{position: "fixed", bottom: "5px"}}>
                <Text color="gray">
                    Made with ❤️ by <Anchor href="https://twitter.com/StckOverflw" target="_blank" style={{textDecoration: "none"}}>@StckOverflw</Anchor>
                </Text>
            </span>
        </Center>
    )
}
