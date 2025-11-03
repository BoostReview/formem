import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FormBuilder - Créez des formulaires professionnels en ligne",
  description: "Plateforme moderne pour concevoir, publier et analyser vos formulaires. Simple, rapide et sans code. Commencez gratuitement aujourd'hui.",
  keywords: ["formulaire en ligne", "créateur de formulaire", "form builder", "formulaire gratuit", "sans code"],
  authors: [{ name: "FormBuilder" }],
  openGraph: {
    title: "FormBuilder - Créez des formulaires professionnels",
    description: "Plateforme moderne pour concevoir, publier et analyser vos formulaires",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

