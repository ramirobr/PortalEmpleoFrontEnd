import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginData, RefreshToken } from "@/types/user";
import { JWT } from "next-auth/jwt";

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
        const res = await signInApi(credentials.email as string, credentials.password as string);
        if (!res || !res.isSuccess) return null;
        const { data } = res;
        return {
          id: extractJti(data.token),
          fullName: data.fullName,
          role: data.role,
          email: data.email,
          accessToken: data.token,
          refreshToken: data.refreshToken,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) return { ...token, ...user };

      if (token.accessToken) {
        try {
          const decoded: any = JSON.parse(Buffer.from(token.accessToken.split(".")[1], "base64").toString());
          if (decoded.exp * 1000 > Date.now()) return token;
        } catch {
          console.log("Decoding issue")
        }
      }
      console.log("Token refresh", token.email);
      return await refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      session.user = {
        id: token.id,
        fullName: token.fullName,
        role: token.role,
        email: token.email,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        emailVerified: null,
      };
      return session;
    },
  },
});

function extractJti(jwt: string) {
  const payload = JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString());
  return payload.jti;
}

async function signInApi(email: string, password: string) {
  const res = await fetch(`${process.env.API_ENDPOINT}/Authorization/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) return null;
  return (await res.json()) as { isSuccess: boolean; data: LoginData };
}

async function refreshAccessToken(token: JWT) {
  try {
    const res = await fetch(process.env.API_ENDPOINT + "/Authorization/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
      body: JSON.stringify({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
      })
    });

    const data: RefreshToken = await res.json();
    if (!data.isSuccess) throw new Error("Failed to refresh token");

    return {
      ...token,
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken ?? token.refreshToken,
    };
  } catch {
    console.error("Error refreshing")
    return { ...token, error: "RefreshAccessTokenError" };
  }
}
