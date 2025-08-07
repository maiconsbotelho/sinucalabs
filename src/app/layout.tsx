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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${jetbrainsMono.variable} ${orbitron.variable} font-mono antialiased bg-retro-dark`}>
        <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-purple/10 to-retro-cyan/10 relative overflow-hidden">
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
