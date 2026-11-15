"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, MapPin, Search, Layers, Droplets, ArrowRight, Filter } from "lucide-react";
import DemoBanner from "@/components/layout/DemoBanner";
import { getFarms } from "@/lib/api/farms";
import { FarmProfile } from "@/types/farm";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function FarmsListPage() {
  const [farms, setFarms] = useState<FarmProfile[]>([]);
  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [irrigationFilter, setIrrigationFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getFarms();
        setFarms(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredFarms = farms.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.farm_id.toLowerCase().includes(search.toLowerCase());
    const matchesDistrict =
      districtFilter === "all" ||
      (districtFilter === "peshawar" && f.name.toLowerCase().includes("peshawar")) ||
      (districtFilter === "charsadda" && f.name.toLowerCase().includes("charsadda")) ||
      (districtFilter === "mardan" && f.name.toLowerCase().includes("mardan"));
    const matchesIrrigation =
      irrigationFilter === "all" || f.irrigation_type === irrigationFilter;

    return matchesSearch && matchesDistrict && matchesIrrigation;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <DemoBanner show={farms.some((f) => f.is_demo_data)} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            Farm Locations & Plots
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registered agricultural holdings across Peshawar Valley and Khyber Pakhtunkhwa
          </p>
        </div>

        <Link
          href="/farms/new"
          className="text-xs font-bold px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all btn-motion flex items-center gap-2 shadow-sm self-start sm:self-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          Register New Farm
        </Link>
      </div>

      {/* Filters & Content Area */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-card space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search farms by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium"
            />
          </div>

          {/* District & Irrigation Select Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="all">All Districts</option>
              <option value="peshawar">Peshawar</option>
              <option value="charsadda">Charsadda</option>
              <option value="mardan">Mardan</option>
            </select>

            <select
              value={irrigationFilter}
              onChange={(e) => setIrrigationFilter(e.target.value)}
              className="text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="all">All Irrigation</option>
              <option value="canal">Canal</option>
              <option value="tube_well">Tube-Well</option>
              <option value="rainfed">Rainfed</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <Skeleton height={20} width="60%" />
                <Skeleton height={14} width="90%" />
                <Skeleton height={14} width="75%" />
                <Skeleton height={32} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredFarms.length === 0 && (
          <EmptyState
            title="No farms found"
            description="No farms matched your search filters. Clear filters or register a new farm."
            actionText="Register New Farm"
            onAction={() => window.location.href = "/farms/new"}
          />
        )}

        {/* Farm Cards Grid */}
        {!loading && filteredFarms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFarms.map((farm) => (
              <Card
                key={farm.farm_id}
                interactive
                className="p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-400 font-bold tracking-wider">
                      {farm.farm_id}
                    </span>
                    {farm.is_demo_data && (
                      <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                        Demo Farm
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {farm.name}
                  </h3>

                  <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                    <p className="font-mono text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {farm.latitude.toFixed(4)}° N, {farm.longitude.toFixed(4)}° E
                    </p>
                    <p>
                      Area: <strong className="text-slate-800">{farm.area_value} {farm.area_unit}</strong>
                    </p>
                    <p>
                      Soil: <strong className="capitalize text-slate-800">{farm.soil_type}</strong> | Irrigation: <strong className="capitalize text-slate-800">{farm.irrigation_type.replace('_', ' ')}</strong>
                    </p>
                    <p>
                      Water Availability: <strong className="capitalize text-slate-800">{farm.water_availability}</strong>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    {farm.crop_history?.length || 0} crop cycles
                  </span>
                  <Link
                    href={`/farms/${farm.farm_id}`}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 btn-motion"
                  >
                    View Farm <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
