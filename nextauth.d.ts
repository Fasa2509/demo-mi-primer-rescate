import { DefaultSession } from "next-auth";
import { Role } from "./interfaces";

declare module "next-auth" {
    interface User {
        _id: string;
        id?: undefined;
        role?: Role;
    }

    interface Session extends DefaultSession {
        user?: DefaultSession["user"] & User;
        accessToken: string;
    }
}