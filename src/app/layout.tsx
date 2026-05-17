import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ebookforge-ai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "EbookForge AI - Crie Ebooks Profissionais em Segundos",
    template: "%s | EbookForge AI"
  },
  description: "A plataforma definitiva baseada em IA para criar Ebooks premium e infoprodutos luxuosos prontos para venda no Kiwify ou Stripe em menos de 5 minutos.",
  keywords: ["ebook", "inteligência artificial", "SaaS", "criar ebook", "infoproduto", "Kiwify", "Stripe", "ebook profissional"],
  authors: [{ name: "EbookForge AI team" }],
  creator: "EbookForge AI",
  publisher: "EbookForge AI",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "EbookForge AI - Crie Ebooks Profissionais em Segundos",
    description: "Crie infoprodutos luxuosos altamente persuasivos com o poder da Inteligência Artificial. Diagramação automatizada e templates de alta conversão.",
    url: baseUrl,
    siteName: "EbookForge AI",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EbookForge AI - Plataforma SaaS de Criação de Ebooks com IA",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "EbookForge AI - Crie Ebooks Profissionais em Segundos",
    description: "Crie infoprodutos luxuosos altamente persuasivos com o poder da Inteligência Artificial. Diagramação automatizada e templates de alta conversão.",
    images: ["/og-image.png"],
    creator: "@ebookforge_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
