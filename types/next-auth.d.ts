import {Role} from "./role";

declare module "next-auth" {
    export interface Session {
        user: {
            id: string,
            username: string,
            image: string,
            role: Role,
        }
    }
    export interface User {
        id: string,
        username: string,
        image: string,
        role: Role,
    }
}
