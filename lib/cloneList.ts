export function cloneList<T>(list: T[]) {
    const newList = [] as T[]
    list.map(value => newList.push(value))
    return newList
}
