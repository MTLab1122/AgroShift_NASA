"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Sprout,
  Droplets,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Globe,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { VoiceInputButton } from "@/components/voice/VoiceInputButton";
import { LocalCheckBadge } from "@/components/trust/LocalCheckBadge";

// Leaflet dynamic import to prevent SSR window error
const FarmLocationPicker = dynamic(
  () => import("@/components/maps/FarmLocationPicker"),
  { ssr: false, loading: () => <div className="h-64 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-sm">Loading Peshawar Valley Map...</div> }
);

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [lang, setLang] = useState<"en" | "ur">("en");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Location & Specs
    fullName: "",
    district: "peshawar",
    latitude: 34.0151,
    longitude: 71.5249,
    areaValue: 5.0,
    areaUnit: "acres",
    soilType: "loamy",
    // Step 2: Current Crop
    currentCrop: "wheat",
    // Step 3: Water & Irrigation
    irrigationType: "canal",
    waterAvailability: "medium",
    // Step 4: Primary Goal
    primaryGoal: "water_efficiency",
    literacySupportMode: "text",
  });

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVoiceConfirm = (field: string, value: string) => {
    if (field === "current_crop") handleFieldChange("currentCrop", value);
    if (field === "irrigation_type") handleFieldChange("irrigationType", value);
    if (field === "water_availability") handleFieldChange("waterAvailability", value);
    if (field === "primary_goal") handleFieldChange("primaryGoal", value);
    if (field === "district") handleFieldChange("district", value);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      // 1. Create Farm
      const farmPayload = {
        name: formData.fullName ? `${formData.fullName}'s Farm` : "Peshawar Valley Farm",
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        area_value: Number(formData.areaValue),
        area_unit: formData.areaUnit,
        soil_type: formData.soilType,
        irrigation_type: formData.irrigationType,
        water_availability: formData.waterAvailability,
        current_crop: formData.currentCrop,
        is_demo_data: false,
      };

      const farmRes = await apiClient.post<any>("/api/v1/farms", farmPayload);
      const farmId = farmRes.data.farm_id;

      // 2. Create Farmer Profile
      const farmerPayload = {
        full_name: formData.fullName || null,
        phone_number: null,
        preferred_language: lang,
        literacy_support_mode: formData.literacySupportMode,
        district: formData.district,
        village_or_settlement: "Peshawar Valley",
        farm_id: farmId,
      };

      const farmerRes = await apiClient.post<any>("/api/v1/farmers", farmerPayload);
      const farmerId = farmerRes.data.farmer_id;

      // 3. Link Farm to Farmer
      await apiClient.post(`/api/v1/farmers/${farmerId}/farms`, {
        farm_id: farmId,
        relationship: "owner",
      });

      // Redirect to farmer dashboard
      router.push("/dashboard/farmer");
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMsg(err.response?.data?.message || "Failed to create farm profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Header & Language Toggle */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {lang === "ur" ? "کسان آن بورڈنگ — فارم پروفائل" : "Farmer Onboarding & Farm Setup"}
            </h1>
            <p className="text-xs text-slate-500">
              {lang === "ur" ? "چار آسان مراحل میں اپنے کھیت کی تفصیلات شامل کریں" : "Set up your farm in 4 simple steps to receive NASA satellite guidance"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLang((prev) => (prev === "en" ? "ur" : "en"))}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === "en" ? "اردو" : "English"}</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 1, title: lang === "ur" ? "مقام" : "1. Location", icon: MapPin },
            { id: 2, title: lang === "ur" ? "فصل" : "2. Crop", icon: Sprout },
            { id: 3, title: lang === "ur" ? "پانی" : "3. Water", icon: Droplets },
            { id: 4, title: lang === "ur" ? "ہدف" : "4. Goal", icon: Target },
          ].map((s) => {
            const Icon = s.icon;
            const isCurrent = step === s.id;
            const isDone = step > s.id;
            return (
              <div
                key={s.id}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isCurrent
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-md"
                    : isDone
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-white text-slate-400 border-slate-200"
                }`}
              >
                <Icon className="w-4 h-4 mx-auto mb-1" />
                <span className="text-xs font-bold block truncate">{s.title}</span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          {/* STEP 1: LOCATION & FARM SIZE */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {lang === "ur" ? "مرحلہ 1: کھیت کا مقام اور رقبہ" : "Step 1: Farm Location & Size"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {lang === "ur" ? "نقشے پر نشان لگائیں یا پشاور ویلی کا مقام رکھیں" : "Pin your exact field on the map or select district"}
                  </p>
                </div>
                <VoiceInputButton
                  language={lang}
                  label="Speak District"
                  onValueConfirmed={handleVoiceConfirm}
                />
              </div>

              {/* Leaflet Map Picker */}
              <div className="h-64 rounded-2xl overflow-hidden border border-slate-200 relative">
                <FarmLocationPicker
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onChange={(lat, lon) => {
                    handleFieldChange("latitude", lat);
                    handleFieldChange("longitude", lon);
                  }}
                  height="100%"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === "ur" ? "ضلع (District)" : "District"}
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleFieldChange("district", e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  >
                    <option value="peshawar">Peshawar (پشاور)</option>
                    <option value="charsadda">Charsadda (چارسدہ)</option>
                    <option value="mardan">Mardan (مردان)</option>
                    <option value="other">Other Valley Area</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === "ur" ? "رقبہ (Area)" : "Farm Area"}
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={formData.areaValue}
                    onChange={(e) => handleFieldChange("areaValue", e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === "ur" ? "پیمائش (Unit)" : "Area Unit"}
                  </label>
                  <select
                    value={formData.areaUnit}
                    onChange={(e) => handleFieldChange("areaUnit", e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  >
                    <option value="acres">Acres (ایکڑ)</option>
                    <option value="hectares">Hectares (ہیکٹر)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === "ur" ? "مٹی کی ساخت (Soil Type)" : "Soil Type (If known)"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["loamy", "clay", "sandy", "unknown"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleFieldChange("soilType", st)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        formData.soilType === st
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CURRENT / PREVIOUS CROP */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {lang === "ur" ? "مرحلہ 2: موجودہ یا سابقہ فصل منتخب کریں" : "Step 2: Select Current or Previous Crop"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {lang === "ur" ? "آپ نے ابھی کیا بویا ہے یا پچھلی فصل کیا تھی؟" : "What is currently planted or what did you harvest last?"}
                  </p>
                </div>
                <VoiceInputButton
                  language={lang}
                  label="Speak Crop"
                  onValueConfirmed={handleVoiceConfirm}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: "wheat", nameEn: "Wheat", nameUr: "گندم (Gandum)", season: "Rabi" },
                  { id: "maize", nameEn: "Maize", nameUr: "مکئی (Makai)", season: "Kharif" },
                  { id: "rice", nameEn: "Rice", nameUr: "چاول (Rice)", season: "Kharif" },
                  { id: "sugarcane", nameEn: "Sugarcane", nameUr: "کماد (Ganna)", season: "Annual" },
                  { id: "berseem_clover", nameEn: "Berseem Clover", nameUr: "برسیم / شفتل", season: "Rabi" },
                  { id: "mung_bean", nameEn: "Mung Bean", nameUr: "مونگ دال (Pulse)", season: "Zaid" },
                ].map((c) => {
                  const isSelected = formData.currentCrop === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleFieldChange("currentCrop", c.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300"
                          : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Sprout className={`w-6 h-6 mb-2 ${isSelected ? "text-emerald-200" : "text-emerald-600"}`} />
                      <p className="font-bold text-sm">{lang === "ur" ? c.nameUr : c.nameEn}</p>
                      <p className={`text-xs ${isSelected ? "text-emerald-100" : "text-slate-400"}`}>
                        {c.season}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: IRRIGATION & WATER AVAILABILITY */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {lang === "ur" ? "مرحلہ 3: آبپاشی کا ذریعہ اور پانی کی دستیابی" : "Step 3: Irrigation & Water Availability"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {lang === "ur" ? "نہری پانی آتا ہے یا ٹیوب ویل؟ پانی کی فراہمی کیسی ہے؟" : "Canal, tube-well, or rainfed? How reliable is water delivery?"}
                  </p>
                </div>
                <VoiceInputButton
                  language={lang}
                  label="Speak Water"
                  onValueConfirmed={handleVoiceConfirm}
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  {lang === "ur" ? "آبپاشی کا نظام (Irrigation Type)" : "Irrigation System"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "canal", nameEn: "Canal (Nehr)", nameUr: "نہری نظام (Canal)" },
                    { id: "tube_well", nameEn: "Tube-Well", nameUr: "ٹیوب ویل (Tube-well)" },
                    { id: "rainfed", nameEn: "Rainfed (Barani)", nameUr: "بارانی (Rainfed)" },
                  ].map((irr) => (
                    <button
                      key={irr.id}
                      type="button"
                      onClick={() => handleFieldChange("irrigationType", irr.id)}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        formData.irrigationType === irr.id
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-md"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Droplets className="w-5 h-5 mx-auto mb-1.5" />
                      <span className="font-bold text-sm block">{lang === "ur" ? irr.nameUr : irr.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  {lang === "ur" ? "موسمی پانی کی دستیابی (Water Availability)" : "Seasonal Water Availability"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "high", labelEn: "High (Plentiful)", labelUr: "کافی پانی (High)" },
                    { id: "medium", labelEn: "Medium (Scheduled)", labelUr: "درمیانہ (Medium)" },
                    { id: "low", labelEn: "Low (Scarce)", labelUr: "کم پانی / قلت (Low)" },
                  ].map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handleFieldChange("waterAvailability", w.id)}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        formData.waterAvailability === w.id
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-md"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span className="font-bold text-sm block">{lang === "ur" ? w.labelUr : w.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PRIMARY GOAL & SUMMARY */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {lang === "ur" ? "مرحلہ 4: بنیادی ہدف اور حتمی جائزہ" : "Step 4: Primary Goal & Final Review"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {lang === "ur" ? "آپ کے لیے سب سے اہم کیا ہے؟" : "What is your main agricultural priority for the next 3 seasons?"}
                  </p>
                </div>
                <VoiceInputButton
                  language={lang}
                  label="Speak Goal"
                  onValueConfirmed={handleVoiceConfirm}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "water_efficiency",
                    titleEn: "Save Water (Water Efficiency)",
                    titleUr: "پانی بچاؤ (Water Efficiency)",
                    desc: "Reduces tube-well pumping and conserves scarce canal water.",
                  },
                  {
                    id: "soil_health",
                    titleEn: "Fix Soil (Soil Health)",
                    titleUr: "مٹی بہتر کرو (Soil Health)",
                    desc: "Adds nitrogen through legumes and prevents bare soil baking.",
                  },
                  {
                    id: "cash_yield",
                    titleEn: "More Income (Cash Yield)",
                    titleUr: "زیادہ آمدنی (Cash Yield)",
                    desc: "Focuses on high-value cash crops and dependable markets.",
                  },
                  {
                    id: "balanced",
                    titleEn: "Balanced Rotation",
                    titleUr: "متوازن منصوبہ (Balanced)",
                    desc: "Equal weighting across water, soil health, and income.",
                  },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleFieldChange("primaryGoal", g.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      formData.primaryGoal === g.id
                        ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300"
                        : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Target className={`w-5 h-5 mb-2 ${formData.primaryGoal === g.id ? "text-emerald-200" : "text-emerald-600"}`} />
                    <p className="font-bold text-sm">{lang === "ur" ? g.titleUr : g.titleEn}</p>
                    <p className={`text-xs mt-1 ${formData.primaryGoal === g.id ? "text-emerald-100" : "text-slate-500"}`}>
                      {g.desc}
                    </p>
                  </button>
                ))}
              </div>

              {/* Summary Review Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-600">
                  {lang === "ur" ? "منتخب کردہ تفصیلات کا جائزہ" : "Summary of Farm Profile"}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">District:</span>
                    <span className="font-bold text-slate-800 capitalize">{formData.district}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Current Crop:</span>
                    <span className="font-bold text-slate-800 capitalize">{formData.currentCrop}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Irrigation:</span>
                    <span className="font-bold text-slate-800 capitalize">{formData.irrigationType.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Primary Goal:</span>
                    <span className="font-bold text-emerald-700 capitalize">{formData.primaryGoal.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <LocalCheckBadge compact />

              {errorMsg && (
                <p className="text-xs font-semibold text-rose-600 p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  {errorMsg}
                </p>
              )}
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{lang === "ur" ? "پیچھے" : "Back"}</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev + 1)}
                className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
              >
                <span>{lang === "ur" ? "اگلا مرحلہ" : "Continue"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black shadow-lg disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isSubmitting ? "Generating Plan..." : lang === "ur" ? "منصوبہ تیار کریں" : "Submit & Generate NASA Plan"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
