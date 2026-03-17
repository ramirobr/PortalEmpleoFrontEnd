import { Children } from "@/types/generic";
import ProfileLayout from "./ProfileLayout";

export default async function layout({ children }: Children) {
  return <ProfileLayout>{children}</ProfileLayout>;
}
