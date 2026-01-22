import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt"
import { Roles } from "./auth";

declare module "next-auth" {
  interface User {
    id: string;
    fullName: string;
    role: Roles;
    email: string;
    accessToken: string;
    refreshToken: string;
    tokenExpireIn: Date;
    idEmpresa?: string;
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    fullName: string;
    role: Roles;
    email: string;
    accessToken: string;
    refreshToken: string;
    tokenExpireIn: Date;
    idEmpresa?: string;
  }
}