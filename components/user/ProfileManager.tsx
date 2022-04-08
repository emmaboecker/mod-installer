import {signOut, useSession} from "next-auth/react";
import {Button, Image, Menu, Skeleton, Text} from "@mantine/core";
import React from "react";
import {Logout} from "tabler-icons-react";

export function ProfileManager() {
    const {data: session} = useSession()

    if (session) {
        return (
            <TopRightCorner>
                <Menu size="sm" control={
                    <Button color="gray" variant="light" radius={100} style={{height: "fit-content", padding: "0"}}
                            compact>
                        <Image
                            height={"5vmin"}
                            src={session.user.image}
                            alt="Profile Picture"
                            radius={100}
                            withPlaceholder
                        />
                    </Button>
                }>
                    <Menu.Label>
                        <Text size="sm">{session.user?.username}</Text>
                    </Menu.Label>
                    <Menu.Item color="red" icon={<Logout/>} onClick={() => signOut()}>
                        Log Out
                    </Menu.Item>
                </Menu>
            </TopRightCorner>
        )
    }
    return (
        <TopRightCorner>
            <Skeleton height={50} width={50}/>
        </TopRightCorner>
    )
}

type TopRightCornerProps = {
    children: React.ReactNode
}

function TopRightCorner({children}: TopRightCornerProps) {
    return (
        <div style={{position: "fixed", top: "3vmin", right: "3vmin"}}>
            {children}
        </div>
    )
}
