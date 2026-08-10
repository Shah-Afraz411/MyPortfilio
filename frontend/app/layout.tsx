import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { ShaderBackground } from "@/components/shader-background";
import { AudioProvider } from "@/components/audio-provider";
import { ErrorBoundary } from "@/components/error-boundary";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Syed Afraz Portfolio",
  description: "Modern AI-powered portfolio with minimal design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <ShaderBackground />
          </ErrorBoundary>
          <AudioProvider>
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
