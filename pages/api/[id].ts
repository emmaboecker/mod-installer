// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {ModProfile} from "../../lib/type/modProfile";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ModProfile>
) {
    const {id} = req.query
    res.status(200).json({
        key: "abcdefg",
        id: String(id),
        name: "Optimizations",
        profileName: "Optimizations",
        icon: "Crafting_Table",
        mods: [
            {
                name: "Sodium",
                downloadLink: "https://cdn.modrinth.com/data/AANobbMI/versions/mc1.18.2-0.4.1/sodium-fabric-mc1.18.2-0.4.1%2Bbuild.15.jar",
                path: "sodium.jar",
                required: true,
                defaultActivated: true,
                type: "required"
            },
            {
                name: "Fabric API",
                downloadLink: "https://cdn.modrinth.com/data/P7dR8mSH/versions/0.48.0+1.18.2/fabric-api-0.48.0%2B1.18.2.jar",
                path: "fabric-api.jar",
                required: true,
                defaultActivated: true,
                type: "required"
            },
            {
                name: "Lithium",
                downloadLink: "https://cdn.modrinth.com/data/gvQqBUqZ/versions/mc1.18.2-0.7.9/lithium-fabric-mc1.18.2-0.7.9.jar",
                path: "lithium.jar",
                required: false,
                defaultActivated: true,
                type: "optimization"
            },
            {
                name: "LazyDFU",
                downloadLink: "https://cdn.modrinth.com/data/hvFnDODi/versions/0.1.2/lazydfu-0.1.2.jar",
                path: "lazydfu.jar",
                required: false,
                defaultActivated: true,
                type: "optimization"
            },
            {
                name: "Starlight",
                downloadLink: "https://cdn.modrinth.com/data/H8CaAYZC/versions/1.0.2+1.18.2/starlight-1.0.2+fabric.89b8d9f.jar",
                path: "starlight.jar",
                required: false,
                defaultActivated: true,
                type: "optimization"
            },
            {
                name: "Mod Menu",
                downloadLink: "https://cdn.modrinth.com/data/mOgUt4GM/versions/3.1.0/modmenu-3.1.0.jar",
                path: "mod-menu.jar",
                required: false,
                defaultActivated: true,
                type: "enhancement"
            },
            {
                name: "OK Zoomer",
                downloadLink: "https://cdn.modrinth.com/data/aXf2OSFU/versions/5.0.0-beta.5+1.18.2/okzoomer-5.0.0-beta.5%2B1.18.2.jar",
                path: "ok-zoomer.jar",
                required: false,
                defaultActivated: true,
                type: "enhancement"
            },
            {
                name: "Sodium Extras",
                downloadLink: "https://cdn.modrinth.com/data/PtjYWJkn/versions/mc1.18.2-0.4.2/sodium-extra-mc1.18.2-0.4.2.jar",
                path: "sodium-extras.jar",
                required: false,
                defaultActivated: true,
                type: "enhancement"
            },
            {
                name: "Iris",
                downloadLink: "https://cdn.modrinth.com/data/YL57xq9U/versions/1.18.x-v1.2.2/iris-mc1.18.2-1.2.2-build.32.jar",
                path: "iris.jar",
                required: false,
                defaultActivated: false,
                type: "enhancement"
            },
            {
                name: "Dynamic FPS",
                downloadLink: "https://cdn.modrinth.com/data/LQ3K71Q1/versions/v2.1.0/dynamic-fps-2.1.0.jar",
                path: "dynamic-fps.jar",
                required: false,
                defaultActivated: true,
                type: "enhancement"
            }
        ],
        servers: []
    })
}
