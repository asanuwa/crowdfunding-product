import React, { useMemo } from "react";
import type { PledgeTier } from "@/types";

import PledgeCard from "@/components/campaign/PledgeCard";

export default function PledgeSection({
  pledges,
  campaignId,
  currencyCode,
  onSelect,
  onConfirm,
}: {
  pledges: PledgeTier[];
  campaignId: string;
  currencyCode: string;
  onSelect: (campaignId: string, pledgeId: string) => void;
  onConfirm: (campaignId: string, pledgeId: string) => void;
}) {
  const selected = useMemo(
    () => pledges.find((p) => p.selected) ?? null,
    [pledges],
  );

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="font-[var(--font-display)] text-2xl">
        Choose Your Pledge
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4" role="listbox">
        {pledges.map((p) => (
          <PledgeCard
            key={p.id}
            pledge={p}
            onSelect={() => onSelect(campaignId, p.id)}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#1A1A1A]/60">Selected</p>
          <p className="mt-1 text-sm font-semibold">
            {selected
              ? `${selected.title} - ${new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: currencyCode,
                  maximumFractionDigits: 0,
                }).format(selected.amount)}`
              : "None"}
          </p>
        </div>
        <button
          type="button"
          disabled={!selected}
          onClick={() => {
            if (selected) onConfirm(campaignId, selected.id);
          }}
          className="rounded-full bg-[#2D6A4F] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#24563f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-black/20 disabled:text-black/45"
        >
          Continue to Payment
        </button>
      </div>
    </section>
  );
}
