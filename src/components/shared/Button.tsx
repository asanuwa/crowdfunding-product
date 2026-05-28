import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  href?: string;
};

export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  children,
  className,
  type = "button",
  href,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6A4F] focus-visible:ring-offset-2";

  const variantClass =
    variant === "primary"
      ? "bg-[#1A1A1A] text-white hover:bg-[#333]"
      : variant === "secondary"
        ? "border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
        : "text-[#1A1A1A] underline-offset-4 hover:underline";

  const sizeClass =
    size === "sm"
      ? "h-9 px-4 text-sm"
      : size === "lg"
        ? "h-11 px-6 text-base"
        : "h-10 px-5 text-sm";

  const disabledClass = disabled ? "opacity-40 cursor-not-allowed" : "";

  const classes = `${base} ${variantClass} ${sizeClass} ${disabledClass} ${className ?? ""}`;

  if (href) {
    return (
      <Link aria-disabled={disabled} className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
