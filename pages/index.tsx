import {signIn, useSession} from "next-auth/react";
import {Button, Center} from "@mantine/core";
import {ProfileManager} from "../components/user/ProfileManager";

export default function Home() {
    const {data: session} = useSession()

    if (session) {
        console.log(session.user.role)
        return (
            <ProfileManager />
        )
    }

    return (
        <Center>
            <Button color="violet" onClick={() => signIn("discord")}>
                Login to manage your Mod-Lists
            </Button>
        </Center>
    )
}
