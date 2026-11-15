import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "AgroShift — NASA POWER Climate-Resilient Crop Planning",
  description: "Decision-support platform combining NASA Earth observations with Peshawar Valley cropping realities for climate adaptation and soil health.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
