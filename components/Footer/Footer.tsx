import {Center, Text} from "@mantine/core";
import Link from "next/link";

export function Footer() {
    return (
        <Center>
            <span style={{position: "fixed", bottom: "5px"}}>
                <Text color="gray">
                    Made with ❤️ by <Link href="https://twitter.com/StckOverflw">@StckOverflw</Link>
                </Text>
            </span>
        </Center>
    )
}