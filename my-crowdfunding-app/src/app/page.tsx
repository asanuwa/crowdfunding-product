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
    <div className="min-h-screen bg-[#F7F5F0]">
      <Navbar />

      <main>
        <section className="border-b border-black/10 bg-[#D8F3DC]">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center lg:py-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2D6A4F]">
                CrowdForge fundraising
              </p>
              <h1 className="mt-3 max-w-3xl font-[var(--font-display)] text-4xl leading-tight text-[#1A1A1A] sm:text-6xl">
                Fund the people and ideas moving communities forward.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-[#1A1A1A]/70">
                Discover meaningful projects, follow their progress, and help
                creators reach their next milestone.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-3 rounded-2xl bg-white p-3 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto]">
                <label className="sr-only" htmlFor="campaign-search">
                  Search campaigns
                </label>
                <input
                  id="campaign-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-full border border-black/10 bg-white px-5 py-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                  placeholder="Search campaigns by name"
                />
                <Link
                  href="/campaigns/new"
                  className="inline-flex items-center justify-center rounded-full bg-[#02A95C] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#018A4B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                >
                  Start a campaign
                </Link>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-[#1A1A1A]/60">
                Community snapshot
              </p>
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-3xl font-bold text-[#1A1A1A]">
                    {state.campaigns.length.toLocaleString()}
                  </p>
                  <p className="text-sm text-[#1A1A1A]/60">active campaigns</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#1A1A1A]">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(totalRaised)}
                  </p>
                  <p className="text-sm text-[#1A1A1A]/60">raised so far</p>
                </div>
                <div className="rounded-xl bg-[#F7F5F0] p-4 text-sm text-[#1A1A1A]/70">
                  Your homepage stays clean until campaigns are created, then
                  becomes a focused discovery board for backers.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-[var(--font-display)] text-3xl">
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
