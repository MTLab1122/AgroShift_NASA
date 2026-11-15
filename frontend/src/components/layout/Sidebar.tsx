"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CloudSun,
  LineChart,
  Lightbulb,
  GitCompare,
  MapPin,
  Sprout,
  FileSpreadsheet,
  Info,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
  { name: "Farmer View", href: "/dashboard/farmer", icon: Sprout },
  { name: "3-Strategy Compare", href: "/recommendations/compare", icon: GitCompare },
  { name: "Farmer Onboarding", href: "/onboarding", icon: MapPin },
  { name: "NASA Climate Data", href: "/dashboard/climate", icon: CloudSun },
  { name: "Climate History", href: "/dashboard/climate/history", icon: LineChart },
  { name: "Recommendations", href: "/dashboard/recommendations", icon: Lightbulb },
  { name: "Farm Locations", href: "/farms", icon: MapPin },
  { name: "Crop Catalogue", href: "/crops", icon: Sprout },
  { name: "Exports & Reports", href: "/dashboard/reports", icon: FileSpreadsheet },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 hidden md:flex">
      <div className="space-y-6">
        <div className="px-3 py-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
          <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
            Pilot Location
          </p>
          <p className="text-sm font-semibold text-white">Peshawar Valley, PK</p>
          <p className="text-[11px] text-slate-400 font-mono">34.0151° N, 71.5249° E</p>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800 space-y-2">
        <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>NASA Space Apps 2026</span>
          </div>
          <p>Abasyn University Peshawar</p>
          <p className="text-[10px] text-slate-500">Team InCir | Muhammad Talha</p>
        </div>
      </div>
    </aside>
  );
}
