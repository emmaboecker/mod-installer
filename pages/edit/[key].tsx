import {Dispatch, SetStateAction, useState} from "react";
import {Mod, ModProfile, Server} from "../../types/modProfile";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";
import {Role} from "../../types/role";
import Custom404 from "../404";
import {ModEditor} from "../../components/mods/editor/ModEditor";
import {makeId} from "../../lib/makeId";

type Props = {
    fetchedProfile?: ModProfile
}

export default function EditModList({fetchedProfile}: Props) {
    const [modProfile, setModProfile] = useState(fetchedProfile)

    if (modProfile) {
        return <ModEditor modProfile={modProfile} setModProfile={setModProfile as Dispatch<SetStateAction<ModProfile>>} />
    }

    return <Custom404 />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {key} = context.query
    const url = process.env.NEXTAUTH_URL
    const response = await fetch(`${url}/api/profile/${key}`)
    const session = await getSession(context)
    if (response.status === 200) {
        const profile = (await response.json()) as ModProfile

        profile.mods = profile.mods.map(value => ({
            id: makeId(12),
            ...value
        } as Mod))
        profile.servers = profile.servers.map(value => ({
            id: makeId(12),
            ...value
        } as Server))

        if (session && (session.user.id === profile.creator || session.user.role === Role.ADMIN)) {
            return {props: {fetchedProfile: profile}}
        } else return {props: {fetchedProfile: null}}
    } else return {props: {fetchedProfile: null}}

}
