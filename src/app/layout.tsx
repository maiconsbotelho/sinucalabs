import type { Metadata } from "next";
import { JetBrains_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "SinucaLabs - Ranking de Sinuca",
  description: "Aplicação para gerenciar partidas e rankings de sinuca do laboratório",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  authors: [{ name: "Maicon Botelho" }],
  creator: "Maicon Botelho",
  publisher: "Maicon Botelho",
  manifest: "/manifest.json",
  themeColor: "#00FFFF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SinucaLabs",
  },
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  keywords: ["sinuca", "ranking", "partidas", "laboratório", "jogos", "bilhar"],
  category: "games",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${jetbrainsMono.variable} ${orbitron.variable} font-mono antialiased bg-retro-dark`}>
        <div className="p-[10px]">
          {/* Retro Grid Background */}
          <div className="absolute inset-0 bg-retro-grid opacity-5 pointer-events-none"></div>

          {/* Scanlines Effect */}
          <div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none"></div>

          {children}
        </div>
      </body>
    </html>
  );
}
