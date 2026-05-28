"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { useCampaigns } from "@/context/CampaignContext";
import CampaignGrid from "@/components/dashboard/CampaignGrid";

export default function Home() {
  const { state } = useCampaigns();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return state.campaigns;

    return state.campaigns.filter((campaign) =>
      campaign.title.toLowerCase().includes(query),
    );
  }, [searchQuery, state.campaigns]);

  const totalRaised = state.campaigns.reduce(
    (sum, campaign) => sum + campaign.totalRaised,
    0,
  );

  return (
    <div className="min-h-screen bg-[#F8F6F1] text-[#1A1A1A]">
      <Navbar />

      <main>
        <section className="border-b border-black/10 bg-[linear-gradient(135deg,#E7F8EC_0%,#D8F3DC_52%,#FFF8E8_100%)]">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-center lg:py-16">
            <div className="motion-safe:animate-[riseIn_560ms_ease-out_both]">
              <p className="inline-flex rounded-full border border-[#2D6A4F]/20 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#2D6A4F] shadow-sm">
                CrowdForge fundraising
              </p>
              <h1 className="mt-5 max-w-3xl font-(--font-display) text-4xl leading-tight text-[#14382F] sm:text-6xl">
                Fund the people and ideas moving communities forward.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-[#1A1A1A]/70">
                Discover meaningful projects, follow their progress, and help
                creators reach their next milestone.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-[#14382F]">
                <span className="rounded-full bg-white/70 px-4 py-2 shadow-sm">
                  No platform clutter
                </span>
                <span className="rounded-full bg-[#FFB703]/20 px-4 py-2 text-[#7A4D00] shadow-sm">
                  Creator-first launch
                </span>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-3 rounded-3xl border border-white/70 bg-white/90 p-3 shadow-[0_18px_50px_rgba(20,56,47,0.12)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(20,56,47,0.16)] sm:grid-cols-[minmax(0,1fr)_auto] motion-safe:animate-[popIn_520ms_ease-out_120ms_both]">
                <label className="sr-only" htmlFor="campaign-search">
                  Search campaigns
                </label>
                <input
                  id="campaign-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-full border border-black/10 bg-[#FFFDF8] px-5 py-3 text-sm outline-none transition focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                  placeholder="Search campaigns by name"
                />
                <Link
                  href="/campaigns/new"
                  className="inline-flex items-center justify-center rounded-full bg-[#02A95C] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(2,169,92,0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#018A4B] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                >
                  Start a campaign
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_24px_70px_rgba(20,56,47,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(20,56,47,0.2)] motion-safe:animate-[riseIn_560ms_ease-out_180ms_both]">
              <div className="bg-[#14382F] px-6 py-5 text-white">
                <p className="text-sm font-semibold text-white/70">
                  Community snapshot
                </p>
                <p className="mt-2 font-(--font-display) text-3xl">
                  Ready when your first story is.
                </p>
              </div>
              <div className="space-y-5 p-6">
                <div className="rounded-2xl border border-black/5 bg-[#FFFDF8] p-4 transition hover:-translate-y-0.5 hover:bg-[#F7F5F0]">
                  <p className="text-3xl font-bold text-[#1A1A1A]">
                    {state.campaigns.length.toLocaleString()}
                  </p>
                  <p className="text-sm text-[#1A1A1A]/60">active campaigns</p>
                </div>
                <div className="rounded-2xl border border-black/5 bg-[#FFFDF8] p-4 transition hover:-translate-y-0.5 hover:bg-[#F7F5F0]">
                  <p className="text-3xl font-bold text-[#1A1A1A]">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(totalRaised)}
                  </p>
                  <p className="text-sm text-[#1A1A1A]/60">raised so far</p>
                </div>
                <div className="rounded-2xl bg-[#F7F5F0] p-4 text-sm text-[#1A1A1A]/70 transition hover:-translate-y-0.5">
                  Your homepage stays clean until campaigns are created, then
                  becomes a focused discovery board for backers.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12 motion-safe:animate-[riseIn_560ms_ease-out_260ms_both]">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-(--font-display) text-3xl text-[#14382F]">
                Campaigns
              </h2>
              <p className="mt-1 text-sm text-[#1A1A1A]/65">
                Browse projects currently open for support.
              </p>
            </div>
            {searchQuery ? (
              <p className="text-sm text-[#1A1A1A]/60">
                Showing {filteredCampaigns.length} result
                {filteredCampaigns.length === 1 ? "" : "s"}
              </p>
            ) : null}
          </div>
          <CampaignGrid campaigns={filteredCampaigns} />
        </section>
      </main>
    </div>
  );
}
