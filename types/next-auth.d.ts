import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    id: string;
    fullName: string;
    role: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    expired?: boolean;
  }

  interface Session {
    expired?: boolean;
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    fullName: string;
    role: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    expired?: boolean;
  }
}