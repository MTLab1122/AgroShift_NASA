import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  variant?: "default" | "muted" | "bordered" | "highlight";
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseClasses = "rounded-2xl transition-all duration-200 overflow-hidden";

  const variantClasses = {
    default: "bg-white border border-slate-200/90 shadow-card",
    muted: "bg-slate-50 border border-slate-200 shadow-sm",
    bordered: "bg-white border-2 border-slate-300/80 shadow-none",
    highlight: "bg-emerald-50/50 border border-emerald-300 shadow-sm",
  };

  const interactiveClasses = interactive
    ? "card-interactive cursor-pointer hover:border-emerald-500/80"
    : "";

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-3 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`p-5 sm:p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3 ${className}`}
    {...props}
  >
    {children}
  </div>
);
