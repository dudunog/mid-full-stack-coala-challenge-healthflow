import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import theme from "@/theme";

import "./globals.css";

const outfitSans = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HealthFlow - Coala Saúde",
  description:
    "Uma plataforma para gerenciar o processamento e laudo de exames de imagem médica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfitSans.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
