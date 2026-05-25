"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";

type PaymentMethod = "card" | "usdt" | "paypal";

type CardFields = {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
};

type SimulatedPaymentFormProps = {
  pledgeTitle: string;
  pledgeAmount: number;
  totalRaised: number;
  currencyCode: string;
  onPaymentComplete: () => void;
};

const paymentMethods: Array<{
  id: PaymentMethod;
  label: string;
  description: string;
}> = [
  {
    id: "card",
    label: "Credit or Debit Card",
    description: "Enter card details for a simulated checkout.",
  },
  {
    id: "usdt",
    label: "Cryptocurrency (USDT)",
    description: "Use a simulated wallet transfer confirmation.",
  },
  {
    id: "paypal",
    label: "PayPal",
    description: "Confirm with a simulated PayPal email.",
  },
];

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
  if (method === "card") return "card";
  if (method === "usdt") return "USDT";
  return "PayPal";
}

export default function SimulatedPaymentForm({
  pledgeTitle,
  pledgeAmount,
  totalRaised,
  currencyCode,
  onPaymentComplete,
}: SimulatedPaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardFields, setCardFields] = useState<CardFields>({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const [cryptoTxHash, setCryptoTxHash] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        maximumFractionDigits: 0,
      }),
    [currencyCode],
  );

  const isFormComplete = useMemo(() => {
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
    if (!isFormComplete || isSubmitting) return;

    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1200));

    const nextTotalRaised = totalRaised + pledgeAmount;
    onPaymentComplete();
    setCardFields({ cardNumber: "", expirationDate: "", cvv: "" });
    setCryptoTxHash("");
    setPaypalEmail("");
    setIsSubmitting(false);

    toast.success("Pledge complete", {
      description: `${pledgeTitle} confirmed via ${paymentMethodLabel(
        paymentMethod,
      )}. Total raised is now ${currency.format(nextTotalRaised)}.`,
    });
  }

  return (
    <section className="w-full rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-[var(--font-display)] text-2xl">
            Payment Details
          </h2>
          <p className="mt-1 text-sm text-[#1A1A1A]/65">
            Choose how to complete your selected pledge.
          </p>
        </div>
        <div className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-[#2D6A4F]">
          {currency.format(pledgeAmount)}
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <fieldset>
          <legend className="text-sm font-medium">Payment method</legend>
          <div className="mt-2 grid grid-cols-1 gap-3">
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
                    name="campaignPaymentMethod"
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
          <div className="space-y-4 rounded-2xl border border-black/10 p-4">
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
                worth of USDT to this simulated wallet.
              </p>
              <p className="mt-2 break-all font-mono text-xs text-[#1A1A1A]">
                0xCF0rge0000000000000000000000000000USDT
              </p>
            </div>
            <label
              htmlFor="payment-crypto-tx"
              className="mt-4 block text-sm font-medium"
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
        ) : null}

        {paymentMethod === "paypal" ? (
          <div className="rounded-2xl border border-black/10 p-4">
            <h3 className="text-sm font-semibold">PayPal confirmation</h3>
            <p className="mt-2 text-sm text-[#1A1A1A]/65">
              Enter the PayPal email you want to use for this simulated pledge.
            </p>
            <label
              htmlFor="payment-paypal-email"
              className="mt-4 block text-sm font-medium"
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
        ) : null}

        <div className="rounded-xl bg-[#F7F5F0] px-4 py-3 text-sm text-[#1A1A1A]/75">
          Total after pledge:{" "}
          <span className="font-semibold text-[#1A1A1A]">
            {currency.format(totalRaised + pledgeAmount)}
          </span>
        </div>

        <button
          type="submit"
          disabled={!isFormComplete || isSubmitting}
          className="w-full rounded-full bg-[#1A1A1A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-black/20 disabled:text-black/45"
        >
          {isSubmitting ? "Processing..." : "Complete Pledge"}
        </button>
      </form>
    </section>
  );
}
