import React, { useEffect, useMemo, useState } from "react";

export default function ProgressBar({
  totalRaised,
  goal,
}: {
  totalRaised: number;
  goal: number;
}) {
  const pct = useMemo(() => {
    if (goal <= 0) return 0;
    return Math.min(100, Math.max(0, (totalRaised / goal) * 100));
  }, [totalRaised, goal]);

  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    const next = Math.round(pct);
    const frame = window.requestAnimationFrame(() => setDisplayPct(next));
    return () => window.cancelAnimationFrame(frame);
  }, [pct]);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-[#1A1A1A]/70">
          Funding progress
        </p>
        <p className="text-sm font-medium">{Math.round(displayPct)}% funded</p>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#2D6A4F] to-[#74C69D] transition-all duration-700"
          style={{ width: `${displayPct}%` }}
        />
      </div>
    </section>
  );
}
