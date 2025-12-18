import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Implica",
  description: "Conecta, Certifica, Crece",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-primary">
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
