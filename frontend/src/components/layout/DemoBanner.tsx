"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface DemoBannerProps {
  show?: boolean;
  message?: string;
}

export default function DemoBanner({
  show = true,
  message = "Demo Data Mode Active: Displaying audited Peshawar Valley historical fixture data. NASA fill values (-999) are preserved as null.",
}: DemoBannerProps) {
  if (!show) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-between shadow-sm border-b border-amber-600">
      <div className="flex items-center space-x-2 mx-auto">
        <AlertTriangle className="w-4 h-4 text-slate-950 flex-shrink-0 animate-pulse" />
        <span>
          <strong className="uppercase tracking-wider font-bold">[Demo Data]</strong> {message}
        </span>
      </div>
    </div>
  );
}
