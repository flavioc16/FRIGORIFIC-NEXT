// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { FocusProvider } from "./context/FocusContext"; // Ajuste o caminho conforme necessário
import { MenuProvider } from "./context/MenuContext"; // Importa o MenuProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Frigorifico Central",
  description: "Preço baixo e carne de qualidade!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.png" />
      <body className={inter.className}>
        
          <MenuProvider>
            <FocusProvider>
            {children}
            </FocusProvider>
          </MenuProvider>
        
      </body>
    </html>
  );
}
