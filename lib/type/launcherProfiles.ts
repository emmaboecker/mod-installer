export type LauncherProfiles = {
    profiles: Map<string, LauncherProfile>,
    settings: Map<string, any>,
    version: number
}

export type LauncherProfile = {
    created: string,
    icon: string,
    lastUsed: string,
    lastVersionId: string
    name: string,
    type: string
}