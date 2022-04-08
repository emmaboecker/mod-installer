import {Avatar, Skeleton, Space, Text} from "@mantine/core";
import {useEffect, useState} from "react";
import {User} from "next-auth";

type Props = {
    userId: string
}

export function AuthorComponent({userId}: Props) {
    const [user, setUser] = useState(undefined as undefined | User)

    useEffect(() => {
        fetch(`/api/user/${userId}`).then(response => {
            if (response.status === 200) {
                response.json().then(json => {
                    setUser(json as User)
                })
            } else {
                setUser(undefined)
            }
        })
    }, [userId])

    if (user) {
        return (
            <div style={{display: "flex", alignItems: "center"}}>
                <Text>Made by </Text>
                <Space w={5} />
                <Avatar src={user.image} radius="lg" size="sm"/>
                <Space w={5} />
                <Text style={{fontWeight: "bold"}}>{user.name}</Text>
            </div>
        )
    }

    return (
        <Skeleton/>
    )
}
