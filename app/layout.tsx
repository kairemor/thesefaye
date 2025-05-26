import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Analgésie Péridurale - Collecte de Données",
  description:
    "Application de collecte de données pour thèse de doctorat en médecine sur l'analgésie péridurale au cours du travail et de l'accouchement",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <SiteHeader />
          <main className="flex-1 flex justify-center">
            <div className="container py-6">{children}</div>
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
