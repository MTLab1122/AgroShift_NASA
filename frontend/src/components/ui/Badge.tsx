import React from "react";

export type BadgeVariant =
  | "nasa-power"
  | "smap"
  | "imerg"
  | "ndvi"
  | "demo-data"
  | "documented"
  | "tentative"
  | "high-confidence"
  | "medium-confidence"
  | "low-confidence"
  | "not-enough-info"
  | "elevated-risk"
  | "watch-condition"
  | "healthy-signal"
  | "neutral";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "sm",
  dot = false,
  className = "",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-[11px]",
    md: "px-3 py-1 text-xs",
  };

  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor?: string }> = {
    "nasa-power": {
      bg: "bg-blue-100",
      text: "text-blue-900 font-mono font-bold",
      border: "border-blue-300",
      dotColor: "bg-blue-600",
    },
    smap: {
      bg: "bg-teal-50",
      text: "text-teal-900 font-mono font-bold",
      border: "border-teal-300",
      dotColor: "bg-teal-600",
    },
    imerg: {
      bg: "bg-sky-50",
      text: "text-sky-900 font-mono font-bold",
      border: "border-sky-300",
      dotColor: "bg-sky-600",
    },
    ndvi: {
      bg: "bg-emerald-50",
      text: "text-emerald-900 font-mono font-bold",
      border: "border-emerald-300",
      dotColor: "bg-emerald-600",
    },
    "demo-data": {
      bg: "bg-amber-100",
      text: "text-amber-900 font-bold",
      border: "border-amber-300",
      dotColor: "bg-amber-600",
    },
    documented: {
      bg: "bg-emerald-100",
      text: "text-emerald-800 font-semibold",
      border: "border-emerald-200",
      dotColor: "bg-emerald-500",
    },
    tentative: {
      bg: "bg-amber-50",
      text: "text-amber-800 font-semibold",
      border: "border-amber-200",
      dotColor: "bg-amber-500",
    },
    "high-confidence": {
      bg: "bg-emerald-100",
      text: "text-emerald-900 font-bold",
      border: "border-emerald-300",
      dotColor: "bg-emerald-600",
    },
    "medium-confidence": {
      bg: "bg-blue-100",
      text: "text-blue-900 font-bold",
      border: "border-blue-300",
      dotColor: "bg-blue-600",
    },
    "low-confidence": {
      bg: "bg-amber-100",
      text: "text-amber-900 font-bold",
      border: "border-amber-300",
      dotColor: "bg-amber-600",
    },
    "not-enough-info": {
      bg: "bg-slate-100",
      text: "text-slate-700 font-semibold",
      border: "border-slate-300",
      dotColor: "bg-slate-400",
    },
    "elevated-risk": {
      bg: "bg-rose-100",
      text: "text-rose-900 font-bold",
      border: "border-rose-300",
      dotColor: "bg-rose-600",
    },
    "watch-condition": {
      bg: "bg-amber-100",
      text: "text-amber-900 font-semibold",
      border: "border-amber-300",
      dotColor: "bg-amber-500",
    },
    "healthy-signal": {
      bg: "bg-emerald-50",
      text: "text-emerald-900 font-bold",
      border: "border-emerald-300",
      dotColor: "bg-emerald-500",
    },
    neutral: {
      bg: "bg-slate-100",
      text: "text-slate-800 font-medium",
      border: "border-slate-200",
      dotColor: "bg-slate-400",
    },
  };

  const style = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dotColor || "bg-current"}`} />}
      {children}
    </span>
  );
};
