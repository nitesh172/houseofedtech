import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthContext";

const nunitoSansHeading = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "House of EdTech Notes | AI-Assisted Smart Notes",
  description: "AI-powered notes management with Groq summaries, tags, pinning, and archiving",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full dark",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        nunitoSansHeading.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-primary/30">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
