import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BarberFlow | Sistema de Gestão para Barbearias",
  description: "O melhor sistema para barbearias. Agenda online, controle financeiro e comissões automáticas.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} antialiased bg-zinc-950 text-zinc-50`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>{children}</AppProviders>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#18181b',
                color: '#fafafa',
                border: '1px solid #27272a'
              }
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
