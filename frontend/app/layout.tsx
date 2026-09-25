import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/src/components/SideBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HealPet System",
  description: "Sistema de Gestão Integrada de Clínicas Veterinárias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
     <body 
        className="min-h-full flex text-slate-800 font-sans relative"
        style={{
          backgroundImage: "url('https://static.vecteezy.com/ti/fotos-gratis/p1/10511907-abstrato-design-moderno-fundo-branco-gratis-foto.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-[2px] pointer-events-none" />

        <div className="relative z-10 flex w-full min-h-screen">
          <Sidebar />

          <main className="flex-1 p-8 overflow-y-auto min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}