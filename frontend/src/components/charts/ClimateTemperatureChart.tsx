"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { DailyClimateRecord } from "@/types/climate";

interface ClimateTemperatureChartProps {
  records: DailyClimateRecord[];
  unit?: string;
  sourceBadge?: string;
}

export default function ClimateTemperatureChart({
  records,
  unit = "°C",
  sourceBadge = "NASA POWER Daily Point (AG Community)",
}: ClimateTemperatureChartProps) {
  if (!records || records.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm">
        No temperature observations available for this date window.
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div>
          <h3 className="font-semibold text-slate-800 text-base">
            Daily Air Temperature Regime (T2M)
          </h3>
          <p className="text-xs text-slate-500">
            Thermal accumulation, heat-stress monitoring, and night chilling ({records[0]?.date} to {records[records.length - 1]?.date})
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
            {sourceBadge}
          </span>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Unit: {unit}
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={records} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickFormatter={(val: string) => val.substring(5)}
              dy={10}
            />
            <YAxis
              unit={unit}
              domain={["auto", "auto"]}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-xl space-y-1 border border-slate-800">
                      <p className="font-mono text-slate-300 font-semibold">{label}</p>
                      {payload.map((p: any) => (
                        <p key={p.name} style={{ color: p.color }}>
                          {p.name}: {p.value !== null && p.value !== undefined ? `${p.value} ${unit}` : "Missing (Gap)"}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
            {/* connectNulls={false} is mandatory by scientific integrity rule */}
            <Line
              type="monotone"
              dataKey="t2m_max"
              name="T2M Max (Heat Threshold)"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="t2m"
              name="T2M Mean"
              stroke="#0b3d91"
              strokeWidth={2.5}
              dot={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="t2m_min"
              name="T2M Min"
              stroke="#38bdf8"
              strokeWidth={1.8}
              dot={false}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-slate-400 italic">
        * Note: Unconnected gaps reflect NASA POWER fill-value (-999) satellite retrieval gaps. Data are never zero-interpolated.
      </p>
    </div>
  );
}
