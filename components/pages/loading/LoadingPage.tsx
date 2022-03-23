import {ContentFrame} from "../../ContentFrame/ContentFrame";
import {Skeleton, Space, useMantineTheme} from "@mantine/core";

export function LoadingPage() {

    const theme = useMantineTheme()

    return (
        <ContentFrame
            borderColor={theme.colors.dark[6]}
            leftColumn={
                <>
                    <Skeleton height={20}/>
                    <Skeleton height={10} width="100%" mt={30}/>
                    <Skeleton height={10} width="100%" mt={10}/>
                    <Skeleton height={10} width="80%" mt={10}/>
                </>
            }
            rightColumn={
                <>
                    <Skeleton height={10} width="10%" mt={20} p={10} style={{marginTop: "30px", marginLeft: "25px"}}/>
                    <Skeleton height={10} width="80%" mt={20} style={{marginLeft: "25px"}} />
                    <Skeleton height={10} width="70%" mt={15} style={{marginLeft: "25px"}}/>
                </>
            }
        />
    )
}