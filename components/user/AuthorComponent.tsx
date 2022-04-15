import {Avatar, Popover, Skeleton, Space, Text, useMantineTheme} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {User} from "next-auth";
import {Role} from "../../types/role";
import {CircleCheck} from "tabler-icons-react";

type Props = {
    userId: string
}

export function AuthorComponent({userId}: Props) {
    const [user, setUser] = useState(undefined as undefined | User)

    const theme = useMantineTheme()

    const [popOverOpened, setPopOverOpened] = useState(false)

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
                <Space w={5}/>
                <Avatar src={user.image} alt="Creator's Profile Picture" radius="lg" size="sm"/>
                <Space w={5}/>
                <Text style={{fontWeight: "bold"}}>{user.name}</Text>
                <Space w={3}/>
                {user.role !== Role.DEFAULT &&
                    <div style={{height: "20px"}}>
                        <Popover
                            opened={popOverOpened}
                            onClose={() => setPopOverOpened(false)}
                            target={
                                <CircleCheck
                                    size={20}
                                    color={(user.role === Role.ADMIN ? theme.colors.violet[4] : theme.colors.teal[4])}
                                    style={{cursor: "pointer"}}
                                    onClick={() => setPopOverOpened((o) => !o)}
                                />
                            }
                            width={260}
                            position="bottom"
                            withArrow
                        >
                            <Text>
                                {user.role === Role.ADMIN ? "This is an Admin" : "This is a verified User, trusted by the Admins"}
                            </Text>
                        </Popover>
                    </div>
                }
            </div>
        )
    }

    return (
        <Skeleton height={15} width={250}/>
    )
}
