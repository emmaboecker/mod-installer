import {Button} from "@mantine/core";
import {Home} from "tabler-icons-react";
import Link from "next/link";

export function GoHomeButton() {
    return (
        <Link href="/" prefetch passHref>
            <Button leftIcon={<Home/>} variant="light">
                Go Home
            </Button>
        </Link>
    )
}
