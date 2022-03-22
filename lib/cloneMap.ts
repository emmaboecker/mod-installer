export function cloneMap<T, Q>(map: Map<T, Q>): Map<T, Q> {
    const newMap = new Map<T, Q>()
    map.forEach((value, key) => {
        newMap.set(key, value)
    })
    return newMap
}