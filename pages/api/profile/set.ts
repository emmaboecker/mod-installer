import type {NextApiRequest, NextApiResponse} from 'next'
import clientPromise from "../../../lib/mongodb";
import {getSession} from "next-auth/react";
import {ModProfile} from "../../../types/modProfile";
import {Role} from "../../../types/role";
import {makeid} from "../../../lib/makeid";

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

    const collection = (await clientPromise()).db().collection("profiles")

    let profile = JSON.parse(req.body) as ModProfile
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
        profile.id = (profile.id + session.user.id)
        if (session.user.role !== Role.ADMIN) {
            profile._id = makeid(24)
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

    let id = profile.name.toLowerCase().replaceAll(/[^\w]/g,"-")
    if (!(await collection.findOne({id: id}))) {
        id = id + session.user.username.toLowerCase().replaceAll(/[^\w]/g,"-")
    }
    profile.id = id
    profile.creator = session.user.id
    if (session.user.role === Role.DEFAULT) {
        profile.verified = false
    } else if (profile.verified === undefined) {
        profile.verified = true
    }

    // @ts-ignore
    await collection.insertOne(profile)
    res.status(200).json(profile)
}

