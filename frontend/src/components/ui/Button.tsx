import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "nasa" | "disabled";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-bold rounded-xl transition-all btn-motion select-none focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] min-w-[44px]";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5 shadow-md",
  };

  const variantClasses = {
    primary:
      "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-card hover:shadow-hover focus:ring-emerald-500",
    secondary:
      "bg-white hover:bg-slate-50 text-emerald-800 border-2 border-emerald-600/30 hover:border-emerald-600 focus:ring-emerald-500 shadow-sm",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 focus:ring-slate-400",
    danger:
      "bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-card focus:ring-rose-500",
    nasa:
      "bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white shadow-card hover:shadow-hover focus:ring-blue-600",
    disabled:
      "bg-slate-200 text-slate-400 cursor-not-allowed border-0 shadow-none pointer-events-none",
  };

  const isDisabled = disabled || isLoading || variant === "disabled";

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${
        isDisabled ? variantClasses.disabled : variantClasses[variant]
      } ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
