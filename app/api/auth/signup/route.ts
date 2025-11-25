import { PostulantRegisterResponse, SignupData } from "@/types/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { password, ...body } = (await req.json()) as SignupData;

    const res = await fetch(process.env.API_ENDPOINT + "/Postulant/RegisterPostulant", {
        method: 'POST',
        body: JSON.stringify({
            password,
            ...body
        }),
        headers: { "Content-Type": "application/json" }
    })

    const userRes = await res.json()
    return NextResponse.json<PostulantRegisterResponse>(userRes);
}
