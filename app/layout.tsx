import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ooja-swart.vercel.app/"),
  title: "ooja | Stacks Prediction Markets",
  description:
    "A mock trading-market frontend for Stacks price and ecosystem outcomes.",
  other: {
    "talentapp:project_verification": "87ed2bf50760a49230f51a4dfd214cb09aafdae55b12bc15c83862bb1464e6639b6dd89ba7efe2b039bd45f981a2b35ba0710689ab8e8b0652d2935f6bc18f79",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
