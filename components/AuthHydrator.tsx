"use client";
import { AuthHydratorProps, useAuthStore } from "@/context/authStore";
import { useEffect } from "react";

export default function AuthHydrator(props: AuthHydratorProps) {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate(props);
  }, [
    hydrate,
    props.id,
    props.fullName,
    props.role,
    props.idCurriculum,
    props.pic,
  ]);

  return null;
}
