import type {NextApiRequest, NextApiResponse} from 'next'
import clientPromise from "../../../lib/mongodb";
import {getSession} from "next-auth/react";
import {ModProfile} from "../../../types/modProfile";
import {Role} from "../../../types/role";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.status(405).send({ message: "Only POST requests allowed" })
        return
    }
    const session = await getSession(res)
    const collection = (await clientPromise).db().collection("profiles")
    const profile = req.body as ModProfile
    if (session) {
        if (profile._id && profile.id && profile.name && profile.mods && profile.mods.length > 0 && profile.minecraftVersion) {
            let document
            if (profile.oldkey && session.user.role !== Role.DEFAUL) {
                document = await collection.findOne({_id: profile.oldkey}) as ModProfile | undefined | null
            } else {
                document = await collection.findOne({_id: profile._id}) as ModProfile | undefined | null
            }
            if (document) {
                if (document.creator != session.user.id && session.user.role !== Role.ADMIN) {
                    res.status(403).end()
                    return
                }
                if (profile.oldkey) {
                    await collection.deleteOne({_id: profile.oldkey})
                } else {
                    await collection.deleteOne({_id: profile._id})
                }
            }
            profile.creator = session.user.id
            // @ts-ignore
            await collection.insertOne(profile)
            res.status(200).end()
        } else {
            res.status(406).end()
        }
    } else {
        res.status(401).end()
    }
}
