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
  }

  interface Session {
    user: {
      id: string;
      fullName: string;
      role: string;
      email: string;
      accessToken: string;
      refreshToken: string;
    };
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
  }
}