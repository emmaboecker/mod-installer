import {ModEditor} from "../components/mods/editor/ModEditor";
import {useState} from "react";
import {ModProfile} from "../types/modProfile";
import {useSession} from "next-auth/react";
import {makeid} from "../lib/makeid";
import {Role} from "../types/role";

export default function NewModList() {
    const {data: session} = useSession({required: true})

    const [modProfile, setModProfile] = useState({
        name: "Untitled Mod-List",
        mods: [],
        _id: makeid(24),
        icon: "Crafting_Table",
        id: "untitled",
        verified: session?.user.role !== Role.DEFAULT,
        creator: session?.user.id,
        minecraftVersion: "1.18.2",
        profileName: "Untitled Profile",
        servers: []
    } as ModProfile)

    return <ModEditor modProfile={modProfile} setModProfile={setModProfile}/>
}
