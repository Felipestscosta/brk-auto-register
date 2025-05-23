import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.css";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brk | Auto Cadastro - Expedição ",
  description: "Aplicação desenvolvida com o objetivo facilitar nos cadastros de produtos variados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`flex min-h-screen min-w-screen justify-center items-center ${inter.className} bg-gradient-to-r from-zinc-800 to-zinc-950`}>
        <p className="fixed bottom-3 right-3 opacity-15 text-xs font-thin">By Felipe Costa</p>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
