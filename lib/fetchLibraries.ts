import {ModProfile} from "../types/modProfile";

export async function getFabricLibraries(profile: ModProfile): Promise<Library[]> {
    const libraries: Library[] = [];
    const response = await fetch(`https://meta.fabricmc.net/v2/versions/loader/${profile.minecraftVersion}`).then(value => value.json())
    const meta = response.find((value: { loader: { stable: boolean; }; }) => value.loader.stable)

    libraries.push({
        name: meta.loader.maven,
        url: "https://maven.fabricmc.net/"
    })
    libraries.push({
        name: meta.intermediary.maven,
        url: "https://maven.fabricmc.net/"
    })
    meta.launcherMeta.libraries.common.forEach((library: Library) => {
        libraries.push({
            name: library.name,
            url: library.url
        })
    })
    return libraries;
}

export async function getQuiltLibraries(profile: ModProfile): Promise<Library[]> {
    const libraries: Library[] = [];
    const quiltResponse = await fetch(`https://meta.quiltmc.org/v3/versions/loader/${profile.minecraftVersion}`).then(value => value.json())
    const fabricResponse = await fetch(`https://meta.fabricmc.net/v2/versions/loader/${profile.minecraftVersion}`).then(value => value.json())
    const quiltMeta = quiltResponse[0]
    const fabricMeta = fabricResponse.find((value: { loader: { stable: boolean; }; }) => value.loader.stable)

    libraries.push({
        name: quiltMeta.loader.maven,
        url: "https://maven.quiltmc.org/repository/release/"
    })
    libraries.push({
        name: fabricMeta.intermediary.maven,
        url: "https://maven.fabricmc.net/"
    })
    quiltMeta.launcherMeta.libraries.common.forEach((library: Library) => {
        libraries.push({
            name: library.name,
            url: library.url
        })
    })
    return libraries;
}

export type Library = {
    name: string
    url: string
}
