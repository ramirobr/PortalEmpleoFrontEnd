import { auth } from "@/auth";
import { AuthHydrator } from "@/components/AuthHydrator";
import { Children } from "@/types/generic";
import { redirect } from "next/navigation";
import ProfileLayout from "./ProfileLayout";

export default async function layout({ children }: Children) {
  const session = await auth();
  if (!session) redirect("/auth/login");

  return (
    <ProfileLayout>
      <AuthHydrator {...session.user} />
      {children}
    </ProfileLayout>
  );
}
