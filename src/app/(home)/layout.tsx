import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.css";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BRK | Auto Cadastro ",
  description: "Aplicação desenvolvida com o objetivo facilitar nos cadastros de produtos variados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`flex h-screen w-screen justify-center items-center ${inter.className}`}>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
