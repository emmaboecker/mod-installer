import {getSession, signIn, useSession} from "next-auth/react";
import {Button, Center} from "@mantine/core";
import {ProfileManager} from "../components/user/ProfileManager";
import {ModListContainer} from "../components/user/modlist/ModListContainer";
import {GetServerSideProps} from "next";
import {ModProfile} from "../types/modProfile";
import clientPromise from "../lib/mongodb";

type Props = {
    fetchedModProfiles?: ModProfile[]
}

export default function Home({fetchedModProfiles}: Props) {
    const {data: session} = useSession()

    if (session) {
        return (
            <>
                <ModListContainer modProfiles={fetchedModProfiles}/>
                <ProfileManager/>
            </>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)

    if (!session) {
        return {props: {}}
    }

    const client = await clientPromise
    const profileCollection = client.db().collection("profiles")

    const profiles = profileCollection.find({creator: session.user.id})

    const list = [] as ModProfile[]

    await profiles.forEach(doc => {
        // @ts-ignore
        list.push(doc)
    })

    return {
        props: {fetchedModProfiles: list}
    }
}
