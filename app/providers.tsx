"use client";

import { SessionProvider } from "next-auth/react";

import { Session } from "next-auth";
import NotificationRealtimeClient from "@/components/NotificationRealtimeClient";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session ?? null}>
      <NotificationRealtimeClient />
      {children}
    </SessionProvider>
  );
}
