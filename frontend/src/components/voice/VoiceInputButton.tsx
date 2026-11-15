"use client";

import React, { useState } from "react";
import { Mic, MicOff, Check, X, Edit3, Volume2 } from "lucide-react";
import { useSpeechRecognition } from "@/lib/voice/useSpeechRecognition";
import { apiClient } from "@/lib/api/client";

interface VoiceInputButtonProps {
  onValueConfirmed: (field: string, value: string) => void;
  language?: "en" | "ur";
  label?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onValueConfirmed,
  language = "en",
  label = "Speak",
}) => {
  const { isSupported, isListening, transcript, error, startListening, stopListening, resetTranscript } =
    useSpeechRecognition();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editableText, setEditableText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [activeLang, setActiveLang] = useState<"en-US" | "ur-PK">(language === "ur" ? "ur-PK" : "en-US");

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) {
        setEditableText(transcript);
        setShowReviewModal(true);
      }
    } else {
      resetTranscript();
      startListening(activeLang);
    }
  };

  // If recognition finishes with transcript, open review
  React.useEffect(() => {
    if (!isListening && transcript.trim() && !showReviewModal) {
      setEditableText(transcript);
      setShowReviewModal(true);
    }
  }, [isListening, transcript, showReviewModal]);

  const handleConfirm = async () => {
    if (!editableText.trim()) return;
    setIsParsing(true);
    try {
      // Call backend voice parser API
      const response = await apiClient.post<{
        transcript: string;
        detected_language: string;
        parsed_fields: Record<string, string>;
      }>("/api/v1/farmers/parse-voice", { transcript: editableText });

      const fields = response.data.parsed_fields;
      Object.entries(fields).forEach(([fKey, fVal]) => {
        if (fVal && fVal !== "unknown") {
          onValueConfirmed(fKey, fVal);
        }
      });
      setShowReviewModal(false);
      resetTranscript();
    } catch (err) {
      console.error("Voice parse error:", err);
      // Fallback: pass raw confirmed text as custom
      onValueConfirmed("custom_speech", editableText);
      setShowReviewModal(false);
    } finally {
      setIsParsing(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="text-xs text-slate-500 flex items-center space-x-1.5 p-2 bg-slate-100 rounded-lg">
        <MicOff className="w-3.5 h-3.5 text-slate-400" />
        <span>Voice input unavailable in browser. Standard text input active.</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handleToggleListening}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
            isListening
              ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-200"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
          aria-label={isListening ? "Stop listening" : "Start speaking"}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 animate-bounce" />
              <span>{activeLang === "ur-PK" ? "سن رہا ہے... (روکیں)" : "Listening... (Stop)"}</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>{activeLang === "ur-PK" ? "بولیں (Urdu)" : label}</span>
            </>
          )}
        </button>

        {/* Language selector toggle for voice */}
        <button
          type="button"
          onClick={() => setActiveLang((prev) => (prev === "en-US" ? "ur-PK" : "en-US"))}
          className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 font-semibold"
          title="Toggle English / Urdu speech recognition"
        >
          {activeLang === "en-US" ? "Urdu (اردو)" : "English"}
        </button>
      </div>

      {error && (
        <p className="text-xs text-rose-600 mt-1.5">{error}</p>
      )}

      {/* Confirmation & Editing Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {activeLang === "ur-PK" ? "آواز کی تصدیق کریں" : "Confirm Spoken Input"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false);
                  resetTranscript();
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              {activeLang === "ur-PK"
                ? "ہم نے یہ سنا۔ براہ کرم ضرورت کے مطابق ترمیم کریں اور تصدیق کریں۔"
                : "Here is what we recognized. You can edit any word before applying it to the form."}
            </p>

            <div className="relative">
              <textarea
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                className="w-full text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none min-h-[90px] text-slate-800"
                placeholder="Spoken words..."
              />
              <Edit3 className="w-4 h-4 text-slate-400 absolute right-3 bottom-3 pointer-events-none" />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false);
                  resetTranscript();
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isParsing || !editableText.trim()}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isParsing ? "Applying..." : "Confirm & Apply"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
