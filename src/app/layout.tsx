import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlowFunds",
  description: "Track your income and expenses efficiently.",
};

import { SettingsProvider } from "@/contexts/SettingsContext";
import { SettingsSidebar } from "@/components/SettingsSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className={outfit.className} suppressHydrationWarning>
        <AuthProvider>
          <SettingsProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Navbar />
              <SettingsSidebar />
              {children}
            </div>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

