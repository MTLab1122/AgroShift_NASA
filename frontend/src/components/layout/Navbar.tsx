"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, Menu, X, FileText } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: "Farmer View", href: "/dashboard/farmer", highlight: true },
    { name: "3-Strategy Compare", href: "/recommendations/compare" },
    { name: "Onboarding", href: "/onboarding" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "NASA Climate", href: "/dashboard/climate" },
    { name: "Farms", href: "/farms" },
    { name: "Crops", href: "/crops" },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Hackathon Header */}
        <div className="flex items-center space-x-3">
          <Link href="/dashboard" className="flex items-center space-x-2.5 group">
            <div className="bg-emerald-600 p-2 rounded-xl group-hover:bg-emerald-500 transition-transform group-hover:scale-105 shadow-sm">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                AgroShift
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-mono uppercase tracking-wider font-semibold">
                  NASA POWER
                </span>
              </span>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Field Shift: Adapting Farms with NASA Data | Team InCir
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 sm:space-x-2 text-xs md:text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                isActive(link.href)
                  ? "bg-emerald-600 text-white font-bold shadow-sm"
                  : link.highlight
                  ? "text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/80 font-bold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/dashboard/reports"
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-all shadow-sm ${
              isActive("/dashboard/reports")
                ? "bg-blue-500 text-white"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Reports
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1 animate-fade-down">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-emerald-600 text-white font-bold"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/dashboard/reports"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Reports
          </Link>
        </div>
      )}
    </header>
  );
}
