import React from "react";

const currencyFor = (currencyCode: string) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  });

export default function StatsBar({
  totalRaised,
  totalBackers,
  daysLeft,
  currencyCode,
}: {
  totalRaised: number;
  goal: number;
  totalBackers: number;
  daysLeft: number;
  currencyCode: string;
}) {
  const currency = currencyFor(currencyCode);

  const stats = [
    {
      value: currency.format(totalRaised),
      label: "raised",
    },
    {
      value: totalBackers.toLocaleString(),
      label: "backers",
    },
    {
      value: daysLeft.toLocaleString(),
      label: "days left",
    },
  ];

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <p className="text-2xl font-bold tracking-normal text-[#1A1A1A]">
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-medium text-[#1A1A1A]/60">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
