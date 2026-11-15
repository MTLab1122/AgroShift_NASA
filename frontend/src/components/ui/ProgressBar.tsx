import React from "react";

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: "emerald" | "blue" | "amber" | "rose";
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = false,
  color = "emerald",
  className = "",
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const colorClasses = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-600",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>{label}</span>
          {showPercent && <span className="font-mono">{percentage}%</span>}
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-200/90 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
