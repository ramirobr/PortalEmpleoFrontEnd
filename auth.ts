import { LoginResponse } from "@/types/user";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const res = await signInApi(credentials.email as string, credentials.password as string);
        if (!res || !res.isSuccess) return null;
        
        const { data } = res
        const user = {
          id: extractJti(data.token),
          fullName: data.fullName,
          role: data.role,
          email: data.email,
          accessToken: data.token,
          refreshToken: data.refreshToken
        };

        return user;
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.fullName = user.fullName;
        token.role = user.role;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        id: token.id,
        fullName: token.fullName,
        role: token.role,
        email: token.email,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        emailVerified: null
      };
      return session;
    }
  }
});

function extractJti(jwt: string) {
  const payload = JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString());
  return payload.jti;
}

async function signInApi(email: string, password: string) {
  const res = await fetch(process.env.API_ENDPOINT + "/Authorization/login", {
    method: 'POST',
    body: JSON.stringify({
      password,
      email
    }),
    headers: { "Content-Type": "application/json" }
  })

  if (!res.ok) return null;
  return await res.json() as LoginResponse
}
