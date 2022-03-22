export type ModProfile = {
    key: string
    id: string
    name: string
    icon: string
    profileName: string
    mods: Mod[]
}

export type Mod = {
    name: string
    downloadLink: string
    path: string
    required: boolean
    defaultActivated: boolean
    type: string
}
