import {getSession, signIn, useSession} from "next-auth/react";
import {Button, Center, Title} from "@mantine/core";
import {ProfileManager} from "../components/user/ProfileManager";
import {ModListContainer} from "../components/user/modlist/ModListContainer";
import {GetServerSideProps} from "next";
import {ModProfile} from "../types/modProfile";
import clientPromise from "../lib/mongodb";
import {Role} from "../types/role";

type Props = {
    fetchedModProfiles?: ModProfile[]
    allowUserModLists: boolean
}

export default function Home({fetchedModProfiles, allowUserModLists}: Props) {
    const {data: session} = useSession()

    if (session) {
        if (allowUserModLists || session.user.role === Role.ADMIN) {
            return (
                <>
                    <ModListContainer fetchedModProfiles={fetchedModProfiles}/>
                    <ProfileManager/>
                </>
            )
        } else {
            return (
                <Center>
                    <Title order={2}>You are not allowed to create or edit Mod-Lists</Title>
                </Center>
            )
        }
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

    const client = await clientPromise()
    const profileCollection = client.db().collection("profiles")

    const allowUserModLists = (process.env.ALLOW_USER_MOD_LISTS ?? "true") === "true"

    const profiles = allowUserModLists ? profileCollection.find({creator: session.user.id}) : profileCollection.find()

    const list = [] as ModProfile[]

    await profiles.forEach(doc => {
        // @ts-ignore
        list.push(doc)
    })

    return {
        props: {
            fetchedModProfiles: list,
            allowUserModLists
        }
    }
}
