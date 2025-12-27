import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/auth";
import { Providers } from "./providers";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Implica",
  description: "Conecta, Certifica, Crece",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body className="font-primary">
        <Providers session={session}>{children}</Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
