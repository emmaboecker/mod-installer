function writeString(view: DataView, offset: number, value: Uint8Array) {
    view.setUint16(offset, value.byteLength);
    for (let i = 0; i < value.byteLength; i++)
        view.setUint8(offset + 2 + i, value[i]);
    return 2 + value.byteLength;
}
export function getDat(servers: Record<string, string>[]) {
    const encoder = new TextEncoder();
    const encServers: [key: Uint8Array, value: Uint8Array][][] = [];
    for (const server of servers) {
        const i = encServers.length;
        encServers.push([]);
        for (const key in server)
            encServers[i].push([encoder.encode(key), encoder.encode(server[key])]);
    }
    let length = 19;
    for (const server of encServers) {
        for (const [key, value] of server)
            length += key.byteLength + value.byteLength + 5;
        length++;
    }
    const view = new DataView(new ArrayBuffer(length));
    view.setUint8(0, 10);
    view.setUint16(1, 0);
    view.setUint8(3, 9);
    writeString(view, 4, encoder.encode("servers"));
    view.setUint8(13, 10);
    view.setInt32(14, servers.length);
    let n = 18;
    for (const server of encServers) {
        for (const [key, value] of server) {
            view.setUint8(n, 8);
            n += 1;
            n += writeString(view, n, key);
            n += writeString(view, n, value);
        }
        n++; // splitter byte
    }
    return view;
}
