import {ModProfile} from "../types/modProfile";

export async function getFabricLibraries(profile: ModProfile): Promise<Library[]> {
    const libraries: Library[] = [];
    const response = await fetch(`https://meta.fabricmc.net/v2/versions/loader/${profile.minecraftVersion}`).then(value => value.json())
    libraries.push({
        name: response[0].loader.maven,
        url: "https://maven.fabricmc.net/"
    })
    libraries.push({
        name: response[0].intermediary.maven,
        url: "https://maven.fabricmc.net/"
    })
    response[0].launcherMeta.libraries.common.forEach((library: Library)  => {
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
