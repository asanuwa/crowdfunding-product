import React, { useMemo } from "react";
import type { PledgeTier } from "@/types";

import PledgeCard from "@/components/campaign/PledgeCard";

export default function PledgeSection({
  pledges,
  campaignId,
  currencyCode,
  paymentPledgeId,
  onSelect,
  onConfirm,
}: {
  pledges: PledgeTier[];
  campaignId: string;
  currencyCode: string;
  paymentPledgeId?: string | null;
  onSelect: (campaignId: string, pledgeId: string) => void;
  onConfirm: (campaignId: string, pledgeId: string) => void;
}) {
  const selected = useMemo(
    () => pledges.find((p) => p.selected) ?? null,
    [pledges],
  );
  const isPaymentOpen = Boolean(selected && selected.id === paymentPledgeId);

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
          aria-expanded={isPaymentOpen}
          className="rounded-full bg-[#2D6A4F] px-6 py-3 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#24563f] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-black/20 disabled:text-black/45"
        >
          {isPaymentOpen ? "Payment Ready" : "Continue to Payment"}
        </button>
      </div>
      {isPaymentOpen ? (
        <p className="mt-3 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-[#2D6A4F]">
          Payment options are open below.
        </p>
      ) : null}
    </section>
  );
}
