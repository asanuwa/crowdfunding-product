import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

import { CampaignProvider } from "../context/CampaignContext";
import { CampaignDraftProvider } from "../context/CampaignDraftContext";
export const metadata: Metadata = {
  title: "CrowdForge",
  description: "Discover and back crowdfunding campaigns.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#F7F5F0] text-[#1A1A1A]">
      <body>
        <CampaignProvider>
          <CampaignDraftProvider>{children}</CampaignDraftProvider>
        </CampaignProvider>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
