import {Center, Group, Skeleton} from "@mantine/core";

export function LoadingPage() {
    return (
        <Center style={{width: "80%", margin: "auto", height: "100%", marginTop: "20%"}}>
            <Group style={{width: "100%"}}>
                <Skeleton height={20}/>
                <Skeleton height={10} width="100%" mt={30}/>
                <Skeleton height={10} width="100%" mt={10}/>
                <Skeleton height={10} width="80%" mt={10}/>
            </Group>
        </Center>
    )
}