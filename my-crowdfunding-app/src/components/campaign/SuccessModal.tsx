"use client";

import React, { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function SuccessModal({
  isOpen,
  onClose,
  pledgeTitle,
  pledgeAmount,
}: {
  isOpen: boolean;
  onClose: () => void;
  pledgeTitle: string;
  pledgeAmount: number;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-6 opacity-100 transition-opacity duration-200 motion-safe:animate-[fadeIn_180ms_ease-out]"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-lg motion-safe:animate-[modalScaleIn_180ms_ease-out]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
      >
        <CheckCircle2
          className="mx-auto h-14 w-14 text-[#2D6A4F]"
          aria-hidden="true"
        />
        <h2
          id="success-modal-title"
          className="mt-4 font-(--font-display) text-3xl"
        >
          You&apos;re a Backer! &#127881;
        </h2>
        <p className="mt-3 text-[#1A1A1A]/70">
          {pledgeTitle} &middot;{" "}
          {pledgeAmount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          })}
        </p>
        <div className="mt-6 flex justify-center">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#1A1A1A] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
