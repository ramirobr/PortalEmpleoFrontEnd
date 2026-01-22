import { GenericResponse, LoginData, RefreshToken } from "@/types/user";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { fetchApi } from "./lib/apiClient";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const res = await signInApi(
          credentials.email as string,
          credentials.password as string
        );
        if (!res || !res.isSuccess) return null;
        const { data } = res;
        return {
          id: data.userId,
          fullName: data.fullName,
          role: data.role,
          email: data.email,
          accessToken: data.token,
          tokenExpireIn: data.tokenExpireIn,
          refreshToken: data.refreshToken,
          idEmpresa: data.idEmpresa,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
    updateAge: 5 * 60
  },
  pages: { signIn: "/auth/login" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) return { ...token, ...user };
      if (token.accessToken) {
        try {
          const decoded: any = JSON.parse(
            Buffer.from(token.accessToken.split(".")[1], "base64").toString()
          );
          if (decoded.exp * 1000 > Date.now()) return token;
        } catch {
          console.warn("Decoding issue");
        }
      }
      console.warn("Token refresh", token.email);
      return await refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      session.user = {
        id: token.id,
        fullName: token.fullName,
        role: token.role,
        email: token.email,
        emailVerified: null,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        tokenExpireIn: token.tokenExpireIn,
        idEmpresa: token.idEmpresa,
      };
      return session;
    },
  },
});

async function signInApi(email: string, password: string) {
  return await fetchApi<GenericResponse<LoginData>>("/Authorization/login", {
    method: "POST",
    body: { email, password },
  });
}

async function refreshAccessToken(token: JWT) {
  try {
    const data = await fetchApi<RefreshToken>("/Authorization/refresh-token", {
      method: "POST",
      body: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      },
    });
    if (!data || !data.isSuccess) throw new Error("Failed to refresh token");

    return {
      ...token,
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken ?? token.refreshToken,
    };
  } catch {
    console.warn("Error refreshing or expired token");
    return token;
  }
}
