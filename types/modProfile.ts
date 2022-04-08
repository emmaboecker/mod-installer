export type ModProfile = {
    _id: string
    creator: string
    id: string
    name: string
    icon: string
    minecraftVersion: string
    profileName: string
    mods: Mod[]
    servers: Server[]
    // Used for changing key in the database
    oldkey?: string
}

export type Mod = {
    name: string
    downloadLink: string
    requires?: string[]
    incompatible?: string[]
    path: string
    required: boolean
    defaultActivated: boolean
    type: string
}

export type Server = {
    name: string
    ip: string
}
