import { auth } from "@/auth";
import { Logout } from "@/types/user";

export async function POST() {
  const session = await auth();

  if (session?.user?.accessToken) {
    console.log(session.user)
    const res = await fetch(`${process.env.API_ENDPOINT}/Authorization/logout`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    const data = await res.json() as Logout
    return Response.json({ ok: data.isSuccess });
  }

  return Response.json({ ok: true });
}

