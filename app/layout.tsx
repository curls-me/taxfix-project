import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { DEMO_NOTE, PRODUCT_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: PRODUCT_NAME,
  description: DEMO_NOTE,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Nav />
        <div className="bg-lime-soft px-4 py-2 text-center text-sm text-forest">
          {DEMO_NOTE}
        </div>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
          {children}
        </main>
      </body>
    </html>
  );
}
