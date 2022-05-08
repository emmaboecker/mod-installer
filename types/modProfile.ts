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
    loader?: Loader,
    // Used for changing key in the database
    oldkey?: string
}

export enum Loader {
    FABRIC,
    QUILT
}

export type Mod = {
    id?: string
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
    id?: string
    name: string
    ip: string
}
