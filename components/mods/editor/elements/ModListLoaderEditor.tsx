import {useModEditorContext} from "../ModEditor";
import React, {forwardRef, useState} from "react";
import {Avatar, Group, Select, Text} from "@mantine/core";
import {Loader} from "../../../../types/modProfile";

const loaders = [
    {
        image: 'https://fabricmc.net/assets/logo.png',
        label: 'FabricMC',
        value: 'fabric',
        description: "Fabric is a lightweight, experimental modding toolchain for Minecraft.",
    },
    {
        image: 'https://quiltmc.org/assets/img/logo.svg',
        label: 'QuiltMC',
        value: 'quilt',
        description: 'Quilt is a Caring, Modular and Powerful fork of Fabric',
    }
]

export function ModListLoaderEditor() {
    const modProfileContext = useModEditorContext()

    const [value, setValue] = useState(modProfileContext.modProfile.loader)

    const [data] = useState(loaders)

    return (
        <Select
            label="Mod Loader"
            description="The Mod Loader that should be installed on the user's pc"
            size="md"
            itemComponent={SelectItem}
            searchable
            required
            value={value === Loader.QUILT ? "quilt" : "fabric"}
            onChange={newLoader => {
                modProfileContext.modProfile.loader = newLoader === "quilt" ? Loader.QUILT : Loader.FABRIC
                setValue(newLoader === "quilt" ? Loader.QUILT : Loader.FABRIC)
            }}
            data={data}
        />
    )
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
    description: string;
}

// eslint-disable-next-line react/display-name
const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, description, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <Avatar src={image} />

                <div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" color="dimmed">
                        {description}
                    </Text>
                </div>
            </Group>
        </div>
    )
);
