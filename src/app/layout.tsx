import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Albedo | Cool Cities",
    description: "AI-driven urban heat mitigation and albedo planning.",
    icons: {
        icon: "/Logo.png", // <--- THIS SETS THE TAB ICON
        shortcut: "/Logo.png",
        apple: "/Logo.png", // For iPhone/iPad home screen
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}