"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

// TODO: Needs proper implementation, related to session expire issues
export default function SessionWatcher() {
  const { data: session } = useSession();

  useEffect(() => {
    console.log("expired", session?.expired);
    if (session?.expired) {
      signOut();
    }
  }, [session]);

  return null;
}
