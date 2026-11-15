import React from "react";
import { AlertCircle, RefreshCw, Sprout, Loader2 } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  title?: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Data Available",
  description,
  actionText,
  onAction,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`text-center p-8 sm:p-12 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4 max-w-md mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
        {icon || <Sprout className="w-6 h-6 text-slate-400" />}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 text-base">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onUseDemo?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Unable to Load Data",
  message,
  onRetry,
  onUseDemo,
  className = "",
}) => {
  return (
    <div
      className={`p-6 bg-rose-50/70 border border-rose-200 rounded-2xl text-center space-y-3 max-w-lg mx-auto ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-rose-950 text-sm mb-1">{title}</h4>
        <p className="text-xs text-rose-800 leading-relaxed">{message}</p>
      </div>
      <div className="flex items-center justify-center gap-2 pt-2">
        {onRetry && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Retry Connection
          </Button>
        )}
        {onUseDemo && (
          <Button variant="nasa" size="sm" onClick={onUseDemo}>
            Use Demo Data
          </Button>
        )}
      </div>
    </div>
  );
};

export const LoadingSpinner: React.FC<{ message?: string; className?: string }> = ({
  message = "Loading NASA data...",
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-3 ${className}`}>
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      <span className="text-xs font-semibold text-slate-500">{message}</span>
    </div>
  );
};
