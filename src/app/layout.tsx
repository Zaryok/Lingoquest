import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AudioProvider } from "@/contexts/AudioContext";
import AudioControls from "@/components/ui/AudioControls";
import MobileAudioInit from "@/components/ui/MobileAudioInit";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LingoQuest - Medieval Language Learning Adventure",
  description: "Embark on a gamified language learning journey with medieval RPG elements. Master new languages through quests, earn XP, and build your adventure chain!",
  keywords: ["language learning", "medieval", "RPG", "education", "vocabulary", "grammar", "interactive learning", "gamification"],
  authors: [{ name: "LingoQuest Team" }],
  creator: "LingoQuest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "LingoQuest - Medieval Language Learning Adventure",
    description: "Embark on a gamified language learning journey with medieval RPG elements. Master new languages through quests, earn XP, and build your adventure chain!",
    siteName: 'LingoQuest',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "LingoQuest - Medieval Language Learning Adventure",
    description: "Master new languages through epic medieval quests and RPG-style adventures.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Proper viewport configuration for mobile optimization
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#2F1B14' },
    { media: '(prefers-color-scheme: light)', color: '#2F1B14' }
  ],
  colorScheme: 'dark'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <AudioProvider>
              {children}
              <AudioControls />
              <MobileAudioInit />
            </AudioProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
