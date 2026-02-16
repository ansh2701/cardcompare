import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ComparisonBar } from "@/components/comparison-bar";
import { ChatWidget } from "@/components/chat-widget";

export const metadata: Metadata = {
  title: "CardCompare — Find Your Perfect Card",
  description: "Compare credit cards, debit cards, forex cards, and prepaid cards. Get AI-powered recommendations to find the best card for your lifestyle.",
  keywords: "credit card comparison, best credit cards, debit cards, forex cards, prepaid cards, card comparison tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ComparisonBar />
        <ChatWidget />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: '!bg-card !text-card-foreground !border !border-border',
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}
