import {signIn, signOut, useSession} from "next-auth/react";
import {Role} from "../types/role";

export default function Home() {
    const { data: session } = useSession()

    if(session) {
        console.log(session.user.role)
        return <>
            Signed in as {session.user.id} {session.user.role === Role.VERIFIED ? "Verified" : "Not Verified"}<br/>
            <button onClick={() => signOut()}>Sign out</button>
        </>
    }
    return <>
        Not signed in <br/>
        <button onClick={() => signIn("discord")}>Sign in</button>
    </>
}
