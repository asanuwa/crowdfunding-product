import React from "react";
import { Check } from "lucide-react";
import type { PledgeTier } from "@/types";

function formatAmount(amount: number, currencyCode?: string) {
  const code = currencyCode || "USD";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PledgeCard({
  pledge,
  onSelect,
}: {
  pledge: PledgeTier & { selected?: boolean; currencyCode?: string };
  onSelect: () => void;
}) {
  const isSelected = Boolean(pledge.selected);

  return (
    <article
      className={
        "rounded-2xl border-2 p-5 transition-[background-color,border-color,box-shadow,transform] duration-200 hover:scale-[1.01] hover:shadow-md " +
        (isSelected
          ? "border-[#2D6A4F] bg-green-50"
          : "border-black/10 bg-white")
      }
      role="option"
      aria-selected={isSelected}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-[var(--font-display)] text-xl">{pledge.title}</h3>
          <p className="mt-1 text-sm font-semibold text-[#2D6A4F]">
            Pledge {formatAmount(pledge.amount, pledge.currencyCode)} or more
          </p>
          <p className="mt-3 text-sm text-[#1A1A1A]/70">{pledge.description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-[#1A1A1A]/5 px-3 py-1 text-xs font-semibold text-[#1A1A1A]/70">
          {pledge.itemsLeft === null ? "Unlimited" : `${pledge.itemsLeft} left`}
        </span>
      </div>

      {pledge.perks?.length ? (
        <ul className="mt-4 space-y-2">
          {pledge.perks.map((perk, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-sm text-[#1A1A1A]/75"
            >
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]"
                aria-hidden="true"
              />
              <span>{perk}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        type="button"
        onClick={onSelect}
        className={
          "mt-5 inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 " +
          (isSelected
            ? "bg-[#2D6A4F] text-white"
            : "bg-[#1A1A1A] text-white hover:bg-[#333]")
        }
        aria-pressed={isSelected}
      >
        {isSelected ? <>Selected &#10003;</> : "Select Reward"}
      </button>
    </article>
  );
}
