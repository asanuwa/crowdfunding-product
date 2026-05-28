export type BadgeColor = "green" | "amber" | "blue" | "gray";
export type BadgeSize = "sm" | "md";

export type BadgeProps = {
  label: string;
  color?: BadgeColor;
  size?: BadgeSize;
};

export default function Badge({
  label,
  color = "gray",
  size = "md",
}: BadgeProps) {
  const colorClass =
    color === "green"
      ? "bg-green-100 text-green-800"
      : color === "amber"
        ? "bg-amber-100 text-amber-800"
        : color === "blue"
          ? "bg-blue-100 text-blue-800"
          : "bg-gray-100 text-gray-700";

  const sizeClass = size === "sm" ? "h-7 px-3 text-xs" : "h-8 px-4 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}
    >
      {label}
    </span>
  );
}
