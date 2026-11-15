"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Droplets,
  Sprout,
  Sun,
  Shield,
  FileText,
  ArrowRight,
  RefreshCw,
  Globe,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Layers,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { VoiceInputButton } from "@/components/voice/VoiceInputButton";
import { ConfidenceBadge } from "@/components/trust/ConfidenceBadge";
import { LocalCheckBadge } from "@/components/trust/LocalCheckBadge";
import { RotationStrategy } from "@/components/scenario-comparison/StrategyComparisonTable";

export default function FarmerDashboardPage() {
  const [lang, setLang] = useState<"en" | "ur">("en");
  const [farmId, setFarmId] = useState<string>("");
  const [farmName, setFarmName] = useState<string>("Peshawar Valley Demo Farm");
  const [primaryGoal, setPrimaryGoal] = useState<string>("water_efficiency");
  const [strategies, setStrategies] = useState<RotationStrategy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  useEffect(() => {
    async function loadFarmerView() {
      setIsLoading(true);
      try {
        const farmsRes = await apiClient.get<any[]>("/api/v1/farms");
        const farm = farmsRes.data[0];
        if (farm) {
          setFarmId(farm.farm_id);
          setFarmName(farm.name);
        }

        const stratRes = await apiClient.get<RotationStrategy[]>(
          `/api/v1/recommendations/strategies?farm_id=${farm ? farm.farm_id : "demo-peshawar-001"}&primary_goal=${primaryGoal}`
        );
        setStrategies(stratRes.data);
      } catch (err) {
        console.error("Failed to load farmer dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFarmerView();
  }, [primaryGoal]);

  const topStrategy =
    strategies.find((s) => s.strategy_id === (primaryGoal === "soil_health" ? "soil_shield_forage" : "water_saver_pulse_fix")) ||
    strategies[1] ||
    strategies[0];

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const genRes = await apiClient.post<any>("/api/v1/recommendations/generate", {
        farm_id: farmId || "demo-peshawar-001",
        priority: primaryGoal,
        use_demo_fallback: true,
      });
      const recId = genRes.data.recommendation_id;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/v1/reports/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendation_id: recId }),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AgroShift_FarmerBrief_${primaryGoal}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF generation failed. Please verify the backend is active.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 space-y-4">
        <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-base font-bold text-slate-800">
          {lang === "ur" ? "سیٹلائٹ کا جائزہ لیا جا رہا ہے..." : "Scanning NASA Satellite Observations..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header Card with Language Toggle */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {lang === "ur" ? "کسان رہنمائی ڈیش بورڈ" : "Farmer Decision View"}
              </span>
              <ConfidenceBadge level="high" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {lang === "ur" ? "پشاور ویلی فارم — سیٹلائٹ جائزہ" : farmName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {lang === "ur"
                ? "ناسا کے سیٹلائٹس سے حاصل کردہ زمین اور موسم کی معلومات"
                : "NASA Satellite Checkup & Climate-Resilient Rotation Guidance"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Language switch button */}
            <button
              type="button"
              onClick={() => setLang((prev) => (prev === "en" ? "ur" : "en"))}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 shadow-sm transition-all"
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>{lang === "en" ? "اردو (Urdu)" : "English"}</span>
            </button>

            {/* Voice input assistant */}
            <VoiceInputButton
              language={lang}
              label={lang === "ur" ? "بولیں" : "Voice Input"}
              onValueConfirmed={(field, val) => {
                console.log("Voice updated:", field, val);
                if (field === "primary_goal") setPrimaryGoal(val);
              }}
            />
          </div>
        </div>

        {/* Mandatory Local-Check Alert */}
        <LocalCheckBadge />

        {/* Traffic-Light Satellite Checkup Grid */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {lang === "ur" ? "سیٹلائٹ ہیلتھ چیک اپ (ٹریفک لائٹ)" : "NASA Satellite Checkup (Traffic-Light Status)"}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === "ur"
                  ? "ناسا کے چار بڑے مشاہداتی ذرائع کا موجودہ زمینی جائزہ"
                  : "Four independent satellite streams monitoring Peshawar Valley"}
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">Updated Today</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. SMAP Soil Moisture (Yellow - Dry) */}
            <div className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-800">
                  {lang === "ur" ? "زمین کی نمی (SMAP)" : "Root-Zone Moisture"}
                </span>
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm animate-pulse" />
              </div>
              <p className="text-2xl font-black text-amber-950">19.8 <span className="text-xs font-semibold">mm/m</span></p>
              <p className="text-xs text-amber-800 leading-tight">
                {lang === "ur"
                  ? "نمی معمول سے کم ہے۔ پانی بچانے والی فصلوں کی ضرورت ہے۔"
                  : "Depleted root moisture (< 25 mm/m). High irrigation need."}
              </p>
              <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-md">
                NASA SMAP L4 (9 km)
              </span>
            </div>

            {/* 2. GPM IMERG Rainfall (Yellow - Dry Spell) */}
            <div className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-800">
                  {lang === "ur" ? "بارش کا جائزہ (IMERG)" : "Precipitation & Dry Spell"}
                </span>
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm animate-pulse" />
              </div>
              <p className="text-2xl font-black text-amber-950">16 <span className="text-xs font-semibold">Dry Days</span></p>
              <p className="text-xs text-amber-800 leading-tight">
                {lang === "ur"
                  ? "خشک سالی کا خطرہ۔ دالوں کی کاشت مفید رہے گی۔"
                  : "Prolonged dry spell detected (>= 14 days). Drought risk."}
              </p>
              <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-md">
                NASA GPM IMERG (10 km)
              </span>
            </div>

            {/* 3. MODIS NDVI Greenness (Yellow - Bare Window) */}
            <div className="p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-800">
                  {lang === "ur" ? "کھیت کا احاطہ (NDVI)" : "Canopy Greenness"}
                </span>
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm animate-pulse" />
              </div>
              <p className="text-2xl font-black text-amber-950">0.21 <span className="text-xs font-semibold">NDVI</span></p>
              <p className="text-xs text-amber-800 leading-tight">
                {lang === "ur"
                  ? "فصل کے بعد زمین خالی ہے۔ مٹی کو ڈھانپنے کی ضرورت ہے۔"
                  : "Low greenness (< 0.25). Post-harvest bare field window."}
              </p>
              <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded-md">
                NASA MODIS / VIIRS (250m)
              </span>
            </div>

            {/* 4. NASA POWER Heat Stress (Red - High Heat) */}
            <div className="p-5 rounded-2xl border-2 border-rose-300 bg-rose-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-rose-800">
                  {lang === "ur" ? "شدید گرمی (POWER)" : "Summer Heat Stress"}
                </span>
                <span className="w-3.5 h-3.5 rounded-full bg-rose-600 shadow-sm animate-pulse" />
              </div>
              <p className="text-2xl font-black text-rose-950">38 <span className="text-xs font-semibold">Days &gt;= 35°C</span></p>
              <p className="text-xs text-rose-800 leading-tight">
                {lang === "ur"
                  ? "گرمی کی شدت زیادہ ہے۔ مکئی کے تنے اور پھول جل سکتے ہیں۔"
                  : "Elevated heat stress. High evapotranspiration losses."}
              </p>
              <span className="inline-block text-[10px] font-bold text-rose-700 bg-rose-200/60 px-2 py-0.5 rounded-md">
                NASA POWER API
              </span>
            </div>
          </div>
        </div>

        {/* Top Recommendation Highlight Card */}
        {topStrategy && (
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/60 pb-5">
              <div className="space-y-1">
                <span className="text-xs font-black tracking-wider uppercase text-emerald-300 bg-emerald-800/60 px-3 py-1 rounded-full border border-emerald-600/40">
                  {lang === "ur" ? "سب سے موزوں فصل کا منصوبہ" : "Recommended Crop-Rotation Strategy"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                  {topStrategy.name}
                </h3>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-800/80 px-4 py-2.5 rounded-2xl border border-emerald-600/50">
                <span className="text-xs text-emerald-200 font-bold uppercase tracking-wider">Score:</span>
                <span className="text-2xl font-black text-white">{topStrategy.scoring.overall_score}</span>
                <span className="text-xs text-emerald-300">/100</span>
              </div>
            </div>

            {/* 3-Season Sequence Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topStrategy.rotation_sequence.map((season, i) => (
                <div
                  key={i}
                  className="bg-emerald-950/70 border border-emerald-700/50 rounded-2xl p-4 space-y-2 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
                    <span>Season {i + 1}: {season.season_name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 border border-emerald-700">
                      {season.duration_days} days
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white">{season.crop_name}</h4>
                  <p className="text-xs text-emerald-200 leading-relaxed">{season.soil_benefit}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="text-xs text-emerald-200 flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-emerald-400" />
                <span>{topStrategy.relative_water_saving_note}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  href="/recommendations/compare"
                  className="px-5 py-3 rounded-xl bg-white text-emerald-950 font-black text-sm hover:bg-emerald-50 transition-all flex items-center space-x-2 shadow-lg"
                >
                  <span>{lang === "ur" ? "تینوں منصوبوں کا موازنہ کریں" : "Compare All 3 Strategies"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center space-x-2 border border-emerald-600/50 disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isExportingPdf ? "Generating..." : lang === "ur" ? "پی ڈی ایف رپورٹ ڈاؤن لوڈ کریں" : "Download PDF Plan"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links for Farmer Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/onboarding"
            className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-emerald-500 transition-all group flex items-center justify-between"
          >
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 group-hover:text-emerald-700">
                {lang === "ur" ? "نئے کھیت کا اندراج یا ترمیم" : "Update Farm or Add Field"}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === "ur" ? "آواز یا نقشے سے اپنے کھیت کی تفصیلات تبدیل کریں" : "Pin location, update crop, and adjust water settings"}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/recommendations/compare"
            className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-emerald-500 transition-all group flex items-center justify-between"
          >
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 group-hover:text-emerald-700">
                {lang === "ur" ? "مکمل سائنسی موازنہ چارٹ" : "Full Scientific Tradeoff Matrix"}
              </h4>
              <p className="text-xs text-slate-500">
                {lang === "ur" ? "پانی کی بچت، آمدنی اور زمین کی زرخیزی کا موازنہ" : "Deep dive into 5-dimensional scores, NASA evidence, and radar charts"}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
