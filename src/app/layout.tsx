import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0A050F",
};

export const metadata: Metadata = {
  title: "SinucaLabs - Ranking de Sinuca",
  description: "Aplicação para gerenciar partidas e rankings de sinuca do laboratório",
  authors: [{ name: "Maicon Botelho" }],
  creator: "Maicon Botelho",
  publisher: "Maicon Botelho",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
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
      <head>
        <meta name="theme-color" content="#0A050F" />
        <meta name="msapplication-navbutton-color" content="#0A050F" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {process.env.NODE_ENV === 'development' && (
          <script src="/unregister-sw.js" async />
        )}
      </head>
      <body className={`${jetbrainsMono.variable} ${orbitron.variable} font-mono antialiased bg-retro-dark`} suppressHydrationWarning={true}>
        <div>
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
