import React, {Dispatch, ReactNode, SetStateAction, useState} from "react";
import {ModProfile} from "../../../types/modProfile";
import {
    Badge,
    Box,
    Button,
    Center,
    MantineTheme,
    SimpleGrid,
    Skeleton,
    Space,
    Text,
    Title,
    useMantineTheme
} from "@mantine/core";
import {Edit, Plus, TrashX} from "tabler-icons-react";
import Link from "next/link"
import {useNotifications} from "@mantine/notifications";
import {NotificationsContextProps} from "@mantine/notifications/lib/types";

type Props = {
    fetchedModProfiles?: ModProfile[]
}

export function ModListContainer({fetchedModProfiles}: Props) {

    const theme = useMantineTheme()

    const notifications = useNotifications()

    const [modProfiles, setModProfiles] = useState(fetchedModProfiles)

    if (modProfiles) {
        return (
            <>
                <Center>
                    <Title>Your Mod-Lists</Title>
                </Center>
                <Space h="xl"/>
                <ContainerGrid>{getModContainers(modProfiles, theme, notifications, setModProfiles)}</ContainerGrid>
            </>
        )
    }
    return (
        <ContainerGrid>

            <Skeleton height={50} width={200}/>
            <Skeleton height={50} width={200}/>
            <Skeleton height={50} width={200}/>
            <Skeleton height={50} width={200}/>
            <Skeleton height={50} width={200}/>
            <Skeleton height={50} width={200}/>

        </ContainerGrid>
    )
}

function getModContainers(modProfiles: ModProfile[], theme: MantineTheme, notifications: NotificationsContextProps, setModProfiles: Dispatch<SetStateAction<ModProfile[] | undefined>>) {
    const elements = [] as ReactNode[]


    elements.push(
        modProfiles.map(value =>
            <div key={value._id}>
                <Box style={{
                    backgroundColor: theme.colors.dark[8],
                    borderRadius: "1vmin",
                    padding: "5%",
                    overflow: "auto"
                }}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Text size="xl">{value.name}</Text>
                        <Space w="xs"/>
                        {value.verified && (
                            <Badge color="blue">
                                Verified
                            </Badge>
                        )}
                    </div>
                    <Space h="xs"/>
                    <div style={{display: "flex", width: "100%"}}>
                        <div style={{display: "flex"}}>
                            <Link href={`/install/${value._id}`} passHref>
                                <Button variant="light" title={"Go to Install Page"}>
                                    Go to install
                                </Button>
                            </Link>
                            <Space w="xs"/>
                            <Link href={`/edit/${value._id}`} passHref>
                                <Button variant="light" title={"Edit Mod-List"}>
                                    <Edit/>
                                </Button>
                            </Link>
                        </div>
                        <div style={{display: "flex", marginLeft: "auto"}}>
                            <Button
                                variant="light"
                                color="red"
                                title={"Delete Mod-List"}
                                onClick={() => {
                                    let shouldDelete = confirm(`Are you sure you want to permanently delete ${value.name}?`);
                                    if (shouldDelete) {
                                        fetch(`/api/profile/delete/${value._id}`, {method: "DELETE"}).then(response => {
                                            if (response.status === 200) {
                                                const newModProfiles: ModProfile[] = []
                                                modProfiles.map(profile => {
                                                    if (profile !== value) {
                                                        newModProfiles.push(profile)
                                                    }
                                                })
                                                setModProfiles(newModProfiles)
                                                notifications.showNotification({
                                                    color: "green",
                                                    message: `Your Mod-List ${value.name} was deleted!`
                                                })
                                            } else {
                                                notifications.showNotification({
                                                    color: "red",
                                                    message: `There was an error deleting this Mod-List. Got ${response.status}`
                                                })
                                            }
                                        })
                                    }
                                }}
                            >
                                <TrashX/>
                            </Button>
                        </div>
                    </div>
                </Box>
            </div>
        )
    )
    elements.push(
        <div style={{display: "flex", alignItems: "center"}} key={"new mod-list"}>
            <Link href={"/new"} passHref>
                <Button
                    size="lg"
                >
                    <Plus/>
                </Button>
            </Link>
        </div>
    )
    return elements
}

type ContainerGridProps = {
    children: React.ReactNode
}

function ContainerGrid({children}: ContainerGridProps) {
    return (
        <Center style={{width: "65%", margin: "auto"}}>
            <SimpleGrid
                cols={3}
                style={{width: "100%", margin: "auto"}}
                spacing="xl"
            >
                {children}
            </SimpleGrid>
        </Center>
    )
}
