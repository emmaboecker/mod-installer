export type ModProfile = {
    key: string
    id: string
    name: string
    icon: string
    minecraftVersion: string
    profileName: string
    mods: Mod[]
    servers: Server[]
}

export type Mod = {
    name: string
    downloadLink: string
    path: string
    required: boolean
    defaultActivated: boolean
    type: string
}

export type Server = {
    name: string
    ip: string
}