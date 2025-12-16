import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BarberFlow | Sistema de Gestão para Barbearias",
  description: "O melhor sistema para barbearias. Agenda online, controle financeiro e comissões automáticas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased bg-zinc-950 text-zinc-50`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
