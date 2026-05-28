"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";

type PaymentMethod = "paystack" | "flutterwave" | "card";

type CardFields = {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
};

type GatewayFields = {
  email: string;
  phone: string;
};

type SimulatedPaymentFormProps = {
  pledgeTitle: string;
  pledgeAmount: number;
  pledgeItemsLeft: number | null;
  totalRaised: number;
  totalBackers: number;
  currencyCode: string;
  onPaymentComplete: () => void;
};

const paymentMethods: Array<{
  id: PaymentMethod;
  label: string;
  description: string;
}> = [
  {
    id: "paystack",
    label: "Paystack",
    description: "Simulate a Paystack checkout with email and phone.",
  },
  {
    id: "flutterwave",
    label: "Flutterwave",
    description: "Simulate a Flutterwave checkout with email and phone.",
  },
  {
    id: "card",
    label: "Credit or Debit Card",
    description: "Enter card details for a simulated checkout.",
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
  if (method === "paystack") return "Paystack";
  return "Flutterwave";
}

function isValidEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

export default function SimulatedPaymentForm({
  pledgeTitle,
  pledgeAmount,
  pledgeItemsLeft,
  totalRaised,
  totalBackers,
  currencyCode,
  onPaymentComplete,
}: SimulatedPaymentFormProps) {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("paystack");
  const [cardFields, setCardFields] = useState<CardFields>({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const [gatewayFields, setGatewayFields] = useState<GatewayFields>({
    email: "",
    phone: "",
  });
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

    return (
      isValidEmail(gatewayFields.email) &&
      onlyDigits(gatewayFields.phone).length >= 7
    );
  }, [cardFields, gatewayFields, paymentMethod]);

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

  function updateGatewayField(name: keyof GatewayFields, value: string) {
    setGatewayFields((current) => ({
      ...current,
      [name]: name === "phone" ? onlyDigits(value).slice(0, 15) : value,
    }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFormComplete || isSubmitting) return;

    setIsSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1200));

    const nextTotalRaised = totalRaised + pledgeAmount;
    const nextBackerNumber = totalBackers + 1;
    const nextItemsLeft =
      pledgeItemsLeft === null ? null : Math.max(0, pledgeItemsLeft - 1);

    toast.success("Payment successful", {
      description: `${pledgeTitle} confirmed via ${paymentMethodLabel(
        paymentMethod,
      )}. You are backer #${nextBackerNumber}. ${
        nextItemsLeft === null
          ? "This reward tier has unlimited spots."
          : `${nextItemsLeft} spot${nextItemsLeft === 1 ? "" : "s"} left in this tier.`
      } Total raised is now ${currency.format(nextTotalRaised)}.`,
    });

    onPaymentComplete();
    setCardFields({ cardNumber: "", expirationDate: "", cvv: "" });
    setGatewayFields({ email: "", phone: "" });
    setIsSubmitting(false);
  }

  return (
    <section className="w-full rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-[var(--font-display)] text-2xl">
            Payment Method
          </h2>
          <p className="mt-1 text-sm text-[#1A1A1A]/65">
            Continue with Paystack, Flutterwave, or a simulated card payment.
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

        {paymentMethod === "paystack" || paymentMethod === "flutterwave" ? (
          <div className="space-y-4 rounded-2xl border border-black/10 p-4">
            <div className="rounded-xl bg-[#F7F5F0] p-4 text-sm text-[#1A1A1A]/75">
              <p className="font-semibold text-[#1A1A1A]">
                {paymentMethod === "paystack"
                  ? "Paystack checkout"
                  : "Flutterwave checkout"}
              </p>
              <p className="mt-1">
                This is a safe simulation. No real money is collected, but the
                pledge stats will update after confirmation.
              </p>
              <p className="mt-2 font-mono text-xs text-[#1A1A1A]/70">
                Reference: CF-{paymentMethod.toUpperCase()}-
                {Math.round(pledgeAmount * 100)}
              </p>
            </div>

            <div>
              <label
                htmlFor="gateway-email"
                className="block text-sm font-medium"
              >
                Email address
              </label>
              <input
                id="gateway-email"
                type="email"
                autoComplete="email"
                value={gatewayFields.email}
                onChange={(event) =>
                  updateGatewayField("email", event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="gateway-phone"
                className="block text-sm font-medium"
              >
                Phone number
              </label>
              <input
                id="gateway-phone"
                inputMode="tel"
                autoComplete="tel"
                value={gatewayFields.phone}
                onChange={(event) =>
                  updateGatewayField("phone", event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
                placeholder="08012345678"
              />
            </div>
          </div>
        ) : null}

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

        <div className="rounded-xl bg-[#F7F5F0] px-4 py-3 text-sm text-[#1A1A1A]/75">
          <p>
            Total after pledge:{" "}
            <span className="font-semibold text-[#1A1A1A]">
              {currency.format(totalRaised + pledgeAmount)}
            </span>
          </p>
          <p className="mt-1">
            You will be backer{" "}
            <span className="font-semibold text-[#1A1A1A]">
              #{totalBackers + 1}
            </span>
            {pledgeItemsLeft === null
              ? " for this unlimited reward tier."
              : ` for this tier, with ${Math.max(
                  0,
                  pledgeItemsLeft - 1,
                )} spot${
                  Math.max(0, pledgeItemsLeft - 1) === 1 ? "" : "s"
                } left after payment.`}
          </p>
        </div>

        <button
          type="submit"
          disabled={!isFormComplete || isSubmitting}
          className="w-full rounded-full bg-[#1A1A1A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-black/20 disabled:text-black/45"
        >
          {isSubmitting
            ? "Processing..."
            : `Complete with ${paymentMethodLabel(paymentMethod)}`}
        </button>
      </form>
    </section>
  );
}
