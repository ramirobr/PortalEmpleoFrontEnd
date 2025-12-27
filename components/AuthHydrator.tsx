"use client";
import { useAuthStore } from "@/context/authStore";
import { UserAuthData } from "@/types/user";
import { useEffect } from "react";

export function AuthHydrator({
  userId,
  fullName,
  role,
}: Partial<UserAuthData>) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate({ userId, fullName, role });
  }, [hydrate, userId, fullName, role]);

  return null;
}
