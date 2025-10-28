import type { Metadata } from "next";
import "./globals.css";
import { ToastRegion } from "../components/ToastRegion";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    default: "Portfolio Projects",
    template: "%s | Portfolio Projects"
  },
  description: "Showcase projects with admin management."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <main>{children}</main>
        <ToastRegion />
        <SpeedInsights />
      </body>
    </html>
  );
}
