import React from "react";
import { Card } from "./Card";
import { Badge, BadgeVariant } from "./Badge";

export interface StatCardProps {
  title: string;
  value: string | number | null;
  unit?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: BadgeVariant;
  trendText?: string;
  trendType?: "positive" | "negative" | "neutral";
  isLoading?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  subtitle,
  badgeText,
  badgeVariant = "neutral",
  trendText,
  trendType = "neutral",
  isLoading = false,
  className = "",
}) => {
  return (
    <Card className={`p-5 sm:p-6 ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        {isLoading ? (
          <div className="h-8 w-24 bg-slate-200 animate-shimmer rounded-lg" />
        ) : (
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {value !== null && value !== undefined ? value : "No data"}
          </span>
        )}
        {unit && value !== null && (
          <span className="text-xs font-bold text-slate-500 font-sans">{unit}</span>
        )}
      </div>

      {(subtitle || badgeText || trendText) && (
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          {subtitle && (
            <span className="text-slate-500 truncate">{subtitle}</span>
          )}
          {badgeText && (
            <Badge variant={badgeVariant} size="sm">
              {badgeText}
            </Badge>
          )}
          {trendText && (
            <span
              className={`font-semibold ${
                trendType === "positive"
                  ? "text-emerald-600"
                  : trendType === "negative"
                  ? "text-rose-600"
                  : "text-slate-500"
              }`}
            >
              {trendText}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
