"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Campaign } from "@/types";

type PaymentMethod = "card" | "usdt" | "paypal";

type CardFields = {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
};

type PaymentSectionProps = {
  campaigns: Campaign[];
  pledgeAmount?: number;
  onPledgeComplete?: (campaignId: string, paymentMethod: PaymentMethod) => void;
};

const paymentMethods: Array<{
  id: PaymentMethod;
  label: string;
  description: string;
}> = [
  {
    id: "card",
    label: "Credit or Debit Card",
    description: "Pay with a simulated secure card checkout.",
  },
  {
    id: "usdt",
    label: "Cryptocurrency (USDT)",
    description: "Follow the simulated USDT transfer instructions.",
  },
  {
    id: "paypal",
    label: "PayPal",
    description: "Continue with a simulated PayPal confirmation.",
  },
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCardNumber(value: string) {
  return onlyDigits(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpirationDate(value: string) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function paymentMethodLabel(method: PaymentMethod) {
  if (method === "card") return "Credit or Debit Card";
  if (method === "usdt") return "USDT";
  return "PayPal";
}

export default function PaymentSection({
  campaigns,
  pledgeAmount = 25,
  onPledgeComplete,
}: PaymentSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardFields, setCardFields] = useState<CardFields>({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const [cryptoTxHash, setCryptoTxHash] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCampaigns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return campaigns;

    return campaigns.filter((campaign) =>
      campaign.title.toLowerCase().includes(query),
    );
  }, [campaigns, searchQuery]);

  const selectedCampaign = campaigns.find(
    (campaign) => campaign.id === selectedCampaignId,
  );

  const isPaymentReady = useMemo(() => {
    if (paymentMethod === "card") {
      return (
        onlyDigits(cardFields.cardNumber).length === 16 &&
        onlyDigits(cardFields.expirationDate).length === 4 &&
        onlyDigits(cardFields.cvv).length >= 3
      );
    }

    if (paymentMethod === "usdt") {
      return cryptoTxHash.trim().length >= 8;
    }

    return /^\S+@\S+\.\S+$/.test(paypalEmail.trim());
  }, [cardFields, cryptoTxHash, paymentMethod, paypalEmail]);

  function updateCardField(name: keyof CardFields, value: string) {
    setCardFields((current) => ({
      ...current,
      [name]:
        name === "cardNumber"
          ? formatCardNumber(value)
          : name === "expirationDate"
            ? formatExpirationDate(value)
            : onlyDigits(value).slice(0, 4),
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCampaign || !isPaymentReady || isSubmitting) return;

    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    setIsSubmitting(false);

    onPledgeComplete?.(selectedCampaign.id, paymentMethod);

    toast.success("Pledge complete", {
      description: `${currency.format(pledgeAmount)} pledged to ${
        selectedCampaign.title
      } via ${paymentMethodLabel(paymentMethod)}.`,
    });
  }

  return (
    <section className="w-full rounded-2xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="font-[var(--font-display)] text-2xl">
          Complete Your Pledge
        </h2>
        <p className="mt-1 text-sm text-[#1A1A1A]/65">
          Search for a project, choose a payment method, and submit a simulated
          pledge.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="project-search" className="block text-sm font-medium">
            Search projects
          </label>
          <input
            id="project-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
            placeholder="Search by project name"
          />
        </div>

        <div className="rounded-2xl border border-black/10">
          {filteredCampaigns.length > 0 ? (
            <div className="divide-y divide-black/10">
              {filteredCampaigns.map((campaign) => {
                const isSelected = selectedCampaignId === campaign.id;

                return (
                  <label
                    key={campaign.id}
                    className={
                      "flex cursor-pointer items-start gap-3 p-4 transition " +
                      (isSelected ? "bg-green-50" : "hover:bg-black/[0.03]")
                    }
                  >
                    <input
                      type="radio"
                      name="campaign"
                      value={campaign.id}
                      checked={isSelected}
                      onChange={() => setSelectedCampaignId(campaign.id)}
                      className="mt-1 h-4 w-4 accent-[#2D6A4F] focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                    />
                    <span className="min-w-0">
                      <span className="block font-semibold">
                        {campaign.title}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-sm text-[#1A1A1A]/65">
                        {campaign.tagline}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <p className="p-4 text-sm text-[#1A1A1A]/65">
              No projects match your search.
            </p>
          )}
        </div>

        <fieldset>
          <legend className="text-sm font-medium">Payment method</legend>
          <div className="mt-2 grid grid-cols-1 gap-3 lg:grid-cols-3">
            {paymentMethods.map((method) => {
              const isSelected = paymentMethod === method.id;

              return (
                <label
                  key={method.id}
                  className={
                    "cursor-pointer rounded-2xl border-2 p-4 transition " +
                    (isSelected
                      ? "border-[#2D6A4F] bg-green-50"
                      : "border-black/10 bg-white hover:bg-black/[0.03]")
                  }
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={isSelected}
                    onChange={() => setPaymentMethod(method.id)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-semibold">
                    {method.label}
                  </span>
                  <span className="mt-1 block text-sm text-[#1A1A1A]/65">
                    {method.description}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {paymentMethod === "card" ? (
          <div className="rounded-2xl border border-black/10 p-4">
            <h3 className="text-sm font-semibold">Card details</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="payment-card-number"
                  className="block text-sm font-medium"
                >
                  Card number
                </label>
                <input
                  id="payment-card-number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={cardFields.cardNumber}
                  onChange={(event) =>
                    updateCardField("cardNumber", event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                  placeholder="4242 4242 4242 4242"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="payment-expiration-date"
                    className="block text-sm font-medium"
                  >
                    Expiration date
                  </label>
                  <input
                    id="payment-expiration-date"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    value={cardFields.expirationDate}
                    onChange={(event) =>
                      updateCardField("expirationDate", event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                    placeholder="MM/YY"
                  />
                </div>

                <div>
                  <label
                    htmlFor="payment-cvv"
                    className="block text-sm font-medium"
                  >
                    CVV
                  </label>
                  <input
                    id="payment-cvv"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={cardFields.cvv}
                    onChange={(event) =>
                      updateCardField("cvv", event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {paymentMethod === "usdt" ? (
          <div className="rounded-2xl border border-black/10 p-4">
            <h3 className="text-sm font-semibold">USDT instructions</h3>
            <div className="mt-3 rounded-xl bg-[#F7F5F0] p-4 text-sm text-[#1A1A1A]/75">
              <p>
                Send exactly{" "}
                <span className="font-semibold text-[#1A1A1A]">
                  {currency.format(pledgeAmount)}
                </span>{" "}
                worth of USDT to the simulated wallet below.
              </p>
              <p className="mt-2 font-mono text-xs text-[#1A1A1A]">
                0xCF0rge0000000000000000000000000000USDT
              </p>
              <p className="mt-2 text-xs">Network: TRC20 or ERC20 test flow</p>
            </div>
            <div className="mt-4">
              <label
                htmlFor="payment-crypto-tx"
                className="block text-sm font-medium"
              >
                Transaction hash
              </label>
              <input
                id="payment-crypto-tx"
                value={cryptoTxHash}
                onChange={(event) => setCryptoTxHash(event.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                placeholder="Paste simulated transaction hash"
              />
            </div>
          </div>
        ) : null}

        {paymentMethod === "paypal" ? (
          <div className="rounded-2xl border border-black/10 p-4">
            <h3 className="text-sm font-semibold">PayPal confirmation</h3>
            <p className="mt-2 text-sm text-[#1A1A1A]/65">
              Enter the PayPal email you want to use for this simulated pledge.
            </p>
            <div className="mt-4">
              <label
                htmlFor="payment-paypal-email"
                className="block text-sm font-medium"
              >
                PayPal email
              </label>
              <input
                id="payment-paypal-email"
                type="email"
                autoComplete="email"
                value={paypalEmail}
                onChange={(event) => setPaypalEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                placeholder="you@example.com"
              />
            </div>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!selectedCampaign || !isPaymentReady || isSubmitting}
          className="w-full rounded-full bg-[#1A1A1A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-black/20 disabled:text-black/45"
        >
          {isSubmitting
            ? "Processing..."
            : `Submit ${currency.format(pledgeAmount)} Pledge`}
        </button>
      </form>
    </section>
  );
}
