import type {NextApiRequest, NextApiResponse} from 'next'
import clientPromise from "../../../lib/mongodb";
import {getSession} from "next-auth/react";
import {Loader, Mod, ModProfile, Server} from "../../../types/modProfile";
import {Role} from "../../../types/role";
import {makeId} from "../../../lib/makeId";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(405).send({message: "Only POST requests allowed"})
        return
    }

    const session = await getSession(res)

    if (!session) {
        res.status(401).end()
        return
    }

    if ((process.env.ALLOW_USER_MOD_LISTS ?? "true") !== "true" && session.user.role !== Role.ADMIN) {
        res.status(403).end()
        return
    }

    const collection = (await clientPromise()).db().collection("profiles")

    let profile = typeof req.body !== "object" ? JSON.parse(req.body) as ModProfile : req.body as ModProfile
    if (!(profile.name && profile.profileName && profile.mods && profile.mods.length > 0 && profile.minecraftVersion)) {
        res.status(406).end()
        return
    }

    let document
    if (profile.oldkey && session.user.role === Role.ADMIN) {
        document = await collection.findOne({_id: profile.oldkey}) as ModProfile | undefined | null
    } else {
        document = await collection.findOne({_id: profile._id}) as ModProfile | undefined | null
    }

    if (!document) {
        if (session.user.role !== Role.ADMIN) {
            profile._id = makeId(24)
        }
    } else {
        if (document.creator != session.user.id && session.user.role !== Role.ADMIN) {
            res.status(403).end()
            return
        }
        if (profile.oldkey && session.user.role === Role.ADMIN) {
            await collection.deleteOne({_id: profile.oldkey})
        } else {
            await collection.deleteOne({_id: profile._id})
        }
    }

    if (!profile.id || profile.id !== document?.id) {
        let id = profile.name.toLowerCase().replaceAll(/[^\w]/g, "-")
        if (await collection.findOne({id: id})) {
            id = id + "-" + session.user.username.toLowerCase().replaceAll(/[^\w]/g, "-")
        }
        profile.id = id
    }
    profile.creator = document?.creator ?? session.user.id
    if (session.user.role === Role.DEFAULT) {
        profile.verified = false
    } else if (profile.verified === undefined) {
        profile.verified = true
    }

    // @ts-ignore
    await collection.insertOne({
        _id: profile._id,
        name: profile.name,
        profileName: profile.profileName,
        creator: profile.creator,
        description: profile.description,
        icon: profile.icon,
        minecraftVersion: profile.minecraftVersion,
        verified: profile.verified,
        loader: profile.loader ?? Loader.FABRIC,
        servers: profile.servers.map(value => ({
            name: value.name,
            ip: value.ip
        } as Server)),
        mods: profile.mods.map(value => ({
            name: value.name,
            required: value.required,
            defaultActivated: value.defaultActivated,
            downloadLink: value.downloadLink,
            type: value.type,
            path: value.path,
            incompatible: value.incompatible,
            requires: value.requires
        } as Mod)),
        oldkey: profile.oldkey
    } as ModProfile)
    res.status(200).json(profile)
}

