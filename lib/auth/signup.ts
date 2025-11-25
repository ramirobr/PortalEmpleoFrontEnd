import { PostulantRegisterResponse, SignupData } from "@/types/user";

export async function SignUp(data: SignupData) {
    const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const postulant = await res.json() as PostulantRegisterResponse;
    return postulant
}
