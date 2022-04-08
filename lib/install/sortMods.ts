import {Mod} from "../../types/modProfile";

export function sortMods(mods: Mod[]) {
    const modsSorted = new Map<string, Mod[]>()
    mods.map(value => {
        if (modsSorted.has(value.type)) {
            modsSorted.get(value.type)!!.push(value)
        } else {
            modsSorted.set(value.type, [value])
        }
    })
    return modsSorted
}
