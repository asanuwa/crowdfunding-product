"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import type { Campaign } from "@/types";
import { useCampaigns } from "@/context/CampaignContext";
import { useCampaignDraft } from "@/context/CampaignDraftContext";
import { generateId } from "@/lib/utils";

export default function ReviewCampaignPage() {
  return <ReviewCampaignPageInner />;
}

function ReviewCampaignPageInner() {
  const router = useRouter();
  const stepFrom = "pledges" as string;

  const { dispatch } = useCampaigns();
  const { draft: form, setDraft } = useCampaignDraft();

  if (!form) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-12">
          <section className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="font-[var(--font-display)] text-3xl">
              No draft found
            </h1>
            <p className="mt-3 text-[#1A1A1A]/70">
              Start a campaign again to review and launch.
            </p>
            <Link
              href="/campaigns/new"
              className="mt-6 inline-flex items-center rounded-full bg-[#1A1A1A] px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#333] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
            >
              Back to campaign wizard
            </Link>
          </section>
        </main>
      </>
    );
  }

  const goBack = () => {
    if (stepFrom === "basics") router.push("/campaigns/new?step=basics");
    else if (stepFrom === "media") router.push("/campaigns/new?step=media");
    else if (stepFrom === "story") router.push("/campaigns/new?step=story");
    else router.push("/campaigns/new?step=pledges");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] bg-[#F7F5F0]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={goBack}
              className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-black/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
            >
              Previous
            </button>
            <p className="text-sm font-medium text-[#1A1A1A]/60">Step Review</p>
          </div>

          <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md lg:p-8 motion-safe:animate-[riseIn_520ms_ease-out_both]">
            <h1 className="font-[var(--font-display)] text-4xl">
              Review project
            </h1>
            <p className="mt-2 text-sm text-[#1A1A1A]/65">
              Preview all campaign details before launching.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-6">
                <div className="rounded-2xl bg-[#F7F5F0] p-5 transition hover:-translate-y-0.5 hover:bg-green-50">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2D6A4F]">
                    {form.category}
                  </p>
                  <h2 className="mt-3 font-[var(--font-display)] text-3xl leading-tight">
                    {form.title || "Untitled campaign"}
                  </h2>
                  <p className="mt-2 text-[#1A1A1A]/70">
                    {form.tagline || "No tagline entered."}
                  </p>
                </div>

                <div className="rounded-2xl border border-black/10 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                  <h3 className="font-semibold">Launch checklist</h3>
                  <ul className="mt-3 space-y-3 text-sm text-[#1A1A1A]/70">
                    <li className="flex items-center gap-2">
                      <Check
                        className="h-4 w-4 text-[#02A95C]"
                        aria-hidden="true"
                      />
                      Basics completed
                    </li>
                    <li className="flex items-center gap-2">
                      <Check
                        className="h-4 w-4 text-[#02A95C]"
                        aria-hidden="true"
                      />
                      Story added
                    </li>
                    <li className="flex items-center gap-2">
                      <Check
                        className="h-4 w-4 text-[#02A95C]"
                        aria-hidden="true"
                      />
                      {form.pledges.length} reward tier
                      {form.pledges.length === 1 ? "" : "s"} ready
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-black/10 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                  <h3 className="font-semibold">Reward tiers</h3>
                  <div className="mt-3 space-y-3">
                    {form.pledges.map(
                      (
                        pledge: { title: string; description: string },
                        index: number,
                      ) => (
                        <div
                          key={index}
                          className="rounded-xl bg-[#F7F5F0] p-4 transition hover:-translate-y-0.5 hover:bg-green-50"
                        >
                          <p className="text-sm font-semibold">
                            {pledge.title || `Tier ${index + 1}`}
                          </p>
                          <p className="mt-1 text-xs text-[#1A1A1A]/60">
                            {pledge.description || "No description entered."}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <aside className="space-y-4">
                <div className="rounded-2xl bg-[#F7F5F0] p-5 transition hover:-translate-y-0.5 hover:bg-green-50">
                  <p className="text-sm font-medium text-[#1A1A1A]/55">
                    Funding goal
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#1A1A1A]">
                    ${form.goal || 0}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7F5F0] p-5 transition hover:-translate-y-0.5 hover:bg-green-50">
                  <p className="text-sm font-medium text-[#1A1A1A]/55">
                    Duration
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#1A1A1A]">
                    {form.daysLeft || 0} days
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7F5F0] p-5 transition hover:-translate-y-0.5 hover:bg-green-50">
                  <p className="text-sm font-medium text-[#1A1A1A]/55">
                    Reward tiers
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#1A1A1A]">
                    {form.pledges.length}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!form) return;
                    const campaign = {
                      id: generateId(),
                      title: form.title.trim(),
                      tagline: form.tagline.trim(),
                      story: form.story.trim(),
                      coverImage: form.coverImage.trim(),
                      coverMediaType: form.coverMediaType,
                      category: form.category,
                      goal: form.goal,
                      totalRaised: 0,
                      totalBackers: 0,
                      daysLeft: form.daysLeft,
                      isBookmarked: false,
                      currencyCode: "USD",
                      pledges: form.pledges.map((pledge) => ({
                        id: generateId(),
                        title: pledge.title.trim(),
                        amount: pledge.amount,
                        description: pledge.description.trim(),
                        perks: pledge.perks
                          .map(String)
                          .map((perk) => perk.trim())
                          .filter(Boolean),
                        itemsLeft: pledge.itemsLeft,
                      })),
                      createdAt: new Date().toISOString(),
                    } satisfies Campaign;

                    dispatch({ type: "ADD_CAMPAIGN", payload: campaign });
                    setDraft(null);
                    router.push(`/campaigns/${campaign.id}`);
                  }}
                  className="w-full rounded-full bg-[#02A95C] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#018A4B] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                >
                  Launch Project
                </button>

                <p className="text-xs text-[#1A1A1A]/60">
                  You will be returned to the wizard to launch (draft
                  submission).
                </p>
              </aside>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
