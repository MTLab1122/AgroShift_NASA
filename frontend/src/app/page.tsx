import React from "react";
import Link from "next/link";
import {
  Sprout,
  Satellite,
  Compass,
  ArrowRight,
  ShieldCheck,
  Droplets,
  Sun,
  Activity,
  FileText,
  Mic,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ThermometerSnowflake,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12 max-w-6xl mx-auto animate-fade-in">
      {/* 1. HERO SECTION WITH ANIMATED SATELLITE & ORBIT */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-emerald-800/40">
        {/* Soft background ambient glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              NASA Space Apps Challenge 2026 — Field Shift: Adapting Farms with NASA Data
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Turn NASA Satellite Insights Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Smarter Farm Decisions
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-xl leading-relaxed">
              AgroShift helps farmers and advisors in Peshawar Valley explore climate-aware crop-rotation options using NASA Earth-observation data.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-900/40 transition-all btn-motion hover:scale-[1.02]"
              >
                <Sprout className="w-5 h-5" />
                Start Farm Checkup
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>

              <Link
                href="/dashboard/farmer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 text-emerald-300 font-semibold hover:bg-slate-700 border border-slate-700 transition-all btn-motion"
              >
                <Activity className="w-5 h-5 text-emerald-400" />
                View Live Demo
              </Link>

              <Link
                href="/recommendations/compare"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-blue-600/30 text-blue-300 font-semibold hover:bg-blue-600/40 border border-blue-500/40 transition-all btn-motion"
              >
                <Compass className="w-5 h-5" />
                3-Strategy Compare
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <strong className="text-slate-200">Team:</strong> Team InCir (5 Members)
              </span>
              <span className="flex items-center gap-1.5">
                <strong className="text-slate-200">Institution:</strong> Abasyn University Peshawar
              </span>
              <span className="flex items-center gap-1.5">
                <strong className="text-slate-200">Lead:</strong> Muhammad Talha
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                Peshawar Valley (34.0151° N, 71.5249° E)
              </span>
            </div>
          </div>

          {/* Interactive Satellite Orbit Visual */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center flex-shrink-0">
            {/* Center Earth Graphic */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-blue-700 via-emerald-600 to-cyan-500 shadow-2xl flex items-center justify-center border-2 border-emerald-400/40 animate-pulse-soft">
              <div className="text-center">
                <Sprout className="w-8 h-8 text-white mx-auto drop-shadow" />
                <span className="text-[10px] font-mono font-bold text-white tracking-widest block">
                  PESHAWAR
                </span>
              </div>
            </div>

            {/* Orbit Ring 1 (SMAP) */}
            <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-spin" style={{ animationDuration: "25s" }}>
              <div className="absolute top-0 left-1/2 -ml-3 -mt-3 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                <Droplets className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Orbit Ring 2 (POWER & GPM) */}
            <div className="absolute inset-4 rounded-full border border-blue-400/30 animate-spin" style={{ animationDuration: "18s", animationDirection: "reverse" }}>
              <div className="absolute bottom-0 right-1/2 -mr-3 -mb-3 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                <Satellite className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE LOCAL PROBLEM IN PESHAWAR VALLEY */}
      <div className="bg-slate-900/40 border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          The Challenge in Pakistan’s Peshawar Valley
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Escalating Climate Stress on Smallholder Farmland
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Droplets className="w-4 h-4 text-cyan-600" />
              Canal Warabandi Gaps
            </h3>
            <p>
              Irregular canal turns and declining water tables force expensive tube-well diesel pumping during peak summer vegetative growth.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Sun className="w-4 h-4 text-amber-500" />
              Summer Heat Waves
            </h3>
            <p>
              Peshawar Valley frequently experiences 35°C+ summer heat episodes that bake bare topsoil between wheat harvests and late maize plantings.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Layers className="w-4 h-4 text-emerald-600" />
              Monoculture Soil Depletion
            </h3>
            <p>
              Repeated cereal-after-cereal double rotations deplete organic nitrogen, degrading long-term soil structure and biological activity.
            </p>
          </div>
        </div>
      </div>

      {/* 3. HOW IT WORKS (SIMPLE 4-STEP JOURNEY) */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Simple 4-Step Decision Journey for Farmers & Advisors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-2.5 hover:border-emerald-500 transition-all card-interactive">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Pin Farm Location</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive Leaflet map centered on Peshawar Valley, Charsadda, and Mardan.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-2.5 hover:border-emerald-500 transition-all card-interactive">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Select Crops & Voice</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pick your current crop or speak naturally in Urdu or English with Web Speech recognition.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-2.5 hover:border-emerald-500 transition-all card-interactive">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">NASA Satellite Checkup</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated multi-satellite fusion: soil moisture, rainfall deficit, and thermal stress.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-2.5 hover:border-emerald-500 transition-all card-interactive">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Compare 3 Strategies</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparent, deterministic side-by-side plans with instant PDF and CSV exports.
            </p>
          </div>
        </div>
      </div>

      {/* 4. THE MULTI-NASA SATELLITE ENGINE */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Satellite className="w-5 h-5 text-emerald-600" />
          The Multi-NASA Earth-Observation Engine
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 transition-all card-interactive">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800 font-mono">
                NASA POWER
              </span>
              <Sun className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Agroclimatology</h3>
            <p className="text-xs text-slate-600 mb-2 leading-relaxed">
              0.5° × 0.625° daily reanalysis tracking 2m temperature, heat stress (&gt;=35°C), solar radiation, and GDD.
            </p>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Operational Core
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 transition-all card-interactive">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-mono">
                NASA SMAP L4
              </span>
              <Droplets className="w-5 h-5 text-cyan-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Root-Zone Moisture</h3>
            <p className="text-xs text-slate-600 mb-2 leading-relaxed">
              9 km resolution 0–100 cm root-zone depth. Flags critical irrigation deficit when below 25 mm/m.
            </p>
            <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
              Crop-CASMA Integrated
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 transition-all card-interactive">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-1 rounded bg-purple-100 text-purple-800 font-mono">
                GPM IMERG
              </span>
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Precipitation & Dry-Spells</h3>
            <p className="text-xs text-slate-600 mb-2 leading-relaxed">
              Gauge-calibrated 10 km satellite rainfall tracking consecutive dry days (&gt;=14 days) and heavy rain runoff.
            </p>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              Runoff & Drought Risk
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 transition-all card-interactive">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-1 rounded bg-amber-100 text-amber-800 font-mono">
                MODIS / VIIRS
              </span>
              <Sprout className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">NDVI Canopy & Fallow</h3>
            <p className="text-xs text-slate-600 mb-2 leading-relaxed">
              250m–500m greenness index detecting bare fallow windows (NDVI &lt; 0.25) to recommend protective cover crops.
            </p>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              Soil Shield Trigger
            </span>
          </div>
        </div>
      </div>

      {/* 5. THREE ROTATION STRATEGIES PREVIEW */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Three-Strategy Comparison Matrix</h2>
            <p className="text-sm text-slate-500">
              Deterministic, explainable alternatives evaluated against Peshawar Valley climate stressors.
            </p>
          </div>
          <Link
            href="/recommendations/compare"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 self-start sm:self-auto btn-motion"
          >
            Open Side-by-Side View
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5 card-interactive">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Benchmark</span>
            <h3 className="font-bold text-slate-800 text-base">1. Conventional Baseline</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rabi: Wheat → Kharif: Hybrid Maize → Summer Fallow. High seasonal water demand and exposed bare soil.
            </p>
            <div className="pt-2 text-xs font-medium text-slate-500">
              Water Fit: <span className="text-amber-600 font-bold">Medium</span> | Soil Diversity: <span className="text-red-600 font-bold">Low</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-300 bg-emerald-50/40 space-y-2.5 card-interactive">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Water Priority</span>
            <h3 className="font-bold text-emerald-900 text-base">2. Water Saver & Pulse Fix</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Rabi: Wheat → Spring: Mung Bean → Kharif: Chickpea/Millet. Biological nitrogen fixation, ~40% fewer irrigations.
            </p>
            <div className="pt-2 text-xs font-medium text-slate-600">
              Water Fit: <span className="text-emerald-600 font-bold">Very High</span> | Soil Diversity: <span className="text-emerald-700 font-bold">High</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-cyan-300 bg-cyan-50/40 space-y-2.5 card-interactive">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">Soil Priority</span>
            <h3 className="font-bold text-cyan-900 text-base">3. Soil Shield & Forage</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Rabi: Wheat → Summer: Berseem Clover → Kharif: Maize. Continuous living cover shields topsoil from solar baking.
            </p>
            <div className="pt-2 text-xs font-medium text-slate-600">
              Water Fit: <span className="text-cyan-700 font-bold">High</span> | Soil Diversity: <span className="text-cyan-700 font-bold">Very High</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. TEAM INCIR — ABASYN UNIVERSITY PESHAWAR */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Team InCir
              </span>
              <span className="text-xs text-slate-500 font-mono">Abasyn University Peshawar</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">NASA Space Apps Challenge 2026 Engineering Team</h3>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            5 Members • 6th Semester
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Muhammad Talha</span>
              <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white">Lead</span>
            </div>
            <p className="text-xs text-emerald-800 font-medium">BS Software Engineering</p>
            <p className="text-[11px] text-slate-500 font-mono">6th Semester</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
            <span className="font-bold text-slate-900 text-sm block">Sana Jalal</span>
            <p className="text-xs text-emerald-700 font-medium">BS Software Engineering</p>
            <p className="text-[11px] text-slate-500 font-mono">6th Semester</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1">
            <span className="font-bold text-slate-900 text-sm block">Hira Dawood</span>
            <p className="text-xs text-emerald-700 font-medium">BS Software Engineering</p>
            <p className="text-[11px] text-slate-500 font-mono">6th Semester</p>
          </div>

          <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/40 space-y-1">
            <span className="font-bold text-slate-900 text-sm block">Sudais Ahmad</span>
            <p className="text-xs text-sky-800 font-medium">BS Artificial Intelligence</p>
            <p className="text-[11px] text-slate-500 font-mono">6th Semester</p>
          </div>

          <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/40 space-y-1">
            <span className="font-bold text-slate-900 text-sm block">Aqsa Faisal</span>
            <p className="text-xs text-sky-800 font-medium">BS Artificial Intelligence</p>
            <p className="text-[11px] text-slate-500 font-mono">6th Semester</p>
          </div>
        </div>
      </div>

      {/* 7. TRUST, PROVENANCE & SCIENTIFIC HONESTY */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/30 border border-slate-200/90 shadow-sm flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-emerald-600 text-white flex-shrink-0 mt-0.5 shadow-sm">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
            Scientific Integrity & Local Ground-Truth Assurance
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            NASA satellite observations represent broad-area gridded conditions (0.5° × 0.625° for POWER, 9 km for SMAP, 10 km for IMERG), not sub-field sensor truth. AgroShift makes <strong>no guaranteed yield, revenue, or water savings claims</strong>. Recommendations are tentative decision-support guidance. Always verify canal water warabandi schedules, soil salinity, and local seed prices with agricultural extension officers before planting.
          </p>
        </div>
      </div>
    </div>
  );
}
