"use client";

import React, { useEffect, useState } from "react";
import { Sprout, Search, Droplets, Clock, Layers, ShieldCheck, AlertCircle } from "lucide-react";
import DemoBanner from "@/components/layout/DemoBanner";
import { getCrops } from "@/lib/api/crops";
import { CropCatalogItem } from "@/types/recommendation";

export default function CropsPage() {
  const [crops, setCrops] = useState<CropCatalogItem[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getCrops();
        setCrops(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredCrops = crops.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.crop_id.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || c.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-600" />
            Peshawar Valley Crop Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Nine documented crops adapted to Khyber Pakhtunkhwa agro-ecological zones with biological nitrogen and water metrics
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> 9 Audited Species
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search crop name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {["all", "cereal", "pulse", "oilseed", "cash_crop", "forage_cover"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition capitalize ${
                categoryFilter === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <div
            key={crop.crop_id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-emerald-400 transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {crop.category.replace("_", " ")}
                </span>
                {crop.is_legume && (
                  <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    N-Fixing Legume
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{crop.name}</h3>
                <p className="text-xs text-slate-400 font-mono">ID: {crop.crop_id}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Seasons</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {crop.seasons.join(", ")}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Duration</span>
                  <span className="font-semibold text-slate-800">
                    ~{crop.duration_days} Days
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Water Demand</span>
                  <span className="font-semibold text-blue-700 capitalize">
                    {crop.water_demand}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Suitable Soils</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {crop.suitable_soils.join(", ")}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                &ldquo;{crop.evidence_note}&rdquo;
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                Status: <strong className="text-slate-700 capitalize">{crop.evidence_status}</strong>
              </span>
              <span className="text-slate-400 italic">No guaranteed yield claims</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
