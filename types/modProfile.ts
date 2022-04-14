export type ModProfile = {
    _id: string
    verified: boolean
    creator: string
    id: string
    name: string
    description?: string
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
