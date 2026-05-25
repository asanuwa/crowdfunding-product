"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Navbar from "@/components/shared/Navbar";
import CampaignHero from "@/components/campaign/CampaignHero";
import StatsBar from "@/components/campaign/StatsBar";
import ProgressBar from "@/components/campaign/ProgressBar";
import PledgeSection from "@/components/campaign/PledgeSection";
import SuccessModal from "@/components/campaign/SuccessModal";
import SimulatedPaymentForm from "@/components/campaign/SimulatedPaymentForm";

import { useCampaigns } from "@/context/CampaignContext";
import type { PledgeTier } from "@/types";

export default function CampaignPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const { dispatch, getCampaign } = useCampaigns();

  const campaign = useMemo(
    () => (id ? getCampaign(id) : undefined),
    [id, getCampaign],
  );

  const [showModal, setShowModal] = useState(false);
  const [confirmedPledge, setConfirmedPledge] = useState<PledgeTier | null>(
    null,
  );

  function onSelect(campaignId: string, pledgeId: string) {
    dispatch({
      type: "SELECT_PLEDGE",
      payload: { campaignId, pledgeId },
    });
  }

  function onConfirm(campaignId: string, pledgeId: string) {
    const pledge = campaign?.pledges.find((p) => p.id === pledgeId) ?? null;
    setConfirmedPledge(pledge);
  }

  function onPaymentComplete(campaignId: string, pledgeId: string) {
    const pledge = campaign?.pledges.find((p) => p.id === pledgeId) ?? null;
    setConfirmedPledge(pledge);
    dispatch({
      type: "CONFIRM_PLEDGE",
      payload: { campaignId, pledgeId },
    });
    setShowModal(false);
    router.push("/");
  }

  function onToggleBookmark() {
    if (!id) return;
    dispatch({
      type: "TOGGLE_BOOKMARK",
      payload: { campaignId: id },
    });
  }

  function onClose() {
    setShowModal(false);
  }

  if (!id || !campaign) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl px-6 py-12">
          <section className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="font-(--font-display) text-3xl">Not Found</h1>
            <p className="mt-3 text-[#1A1A1A]/70">
              The campaign you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center rounded-full bg-[#1A1A1A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
            >
              Back to home
            </Link>
          </section>
        </main>
      </>
    );
  }

  const { totalRaised, goal, totalBackers, daysLeft } = campaign;
  const selectedPledge = campaign.pledges.find((pledge) => pledge.selected);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8 sm:py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] shadow-sm transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <section className="min-w-0">
            <CampaignHero
              campaign={campaign}
              onToggleBookmark={onToggleBookmark}
            />
          </section>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <StatsBar
              totalRaised={totalRaised}
              goal={goal}
              totalBackers={totalBackers}
              daysLeft={daysLeft}
              currencyCode={campaign.currencyCode}
            />

            <ProgressBar totalRaised={totalRaised} goal={goal} />

            <PledgeSection
              pledges={campaign.pledges}
              campaignId={campaign.id}
              currencyCode={campaign.currencyCode}
              onSelect={onSelect}
              onConfirm={onConfirm}
            />

            {selectedPledge ? (
              <SimulatedPaymentForm
                pledgeTitle={selectedPledge.title}
                pledgeAmount={selectedPledge.amount}
                totalRaised={campaign.totalRaised}
                currencyCode={campaign.currencyCode}
                onPaymentComplete={() =>
                  onPaymentComplete(campaign.id, selectedPledge.id)
                }
              />
            ) : null}
          </aside>

          <SuccessModal
            isOpen={showModal}
            onClose={onClose}
            pledgeTitle={confirmedPledge?.title ?? "Selected pledge"}
            pledgeAmount={confirmedPledge?.amount ?? 0}
          />
        </div>
      </main>
    </>
  );
}
