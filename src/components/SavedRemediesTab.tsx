import React, { useState } from 'react';
import {
  Bookmark,
  Trash2,
  Volume2,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  ChevronLeft,
  Clock,
  Hammer,
} from 'lucide-react';
import { RemedyItem, UserPreferences } from '../types';
import { speechService } from '../utils/speech';

interface SavedRemediesTabProps {
  savedRemedies: RemedyItem[];
  onRemoveRemedy: (id: string) => void;
  onClearAll: () => void;
  onOpenEcoGuide: (query?: string) => void;
  onOpenLibrary: () => void;
  preferences: UserPreferences;
  onBackToWelcome?: () => void;
}

export const SavedRemediesTab: React.FC<SavedRemediesTabProps> = ({
  savedRemedies,
  onRemoveRemedy,
  onClearAll,
  onOpenEcoGuide,
  onOpenLibrary,
  preferences,
  onBackToWelcome,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (item: RemedyItem) => {
    const text = `${item.title} (${item.remedyName})\n\nDiagnosis:\n${item.diagnosis}\n\nMaterials:\n${item.materials
      .map((m) => `- ${m.amount} ${m.item}`)
      .join('\n')}\n\nSteps:\n${item.steps
      .map((s) => `${s.stepNumber}. ${s.title}: ${s.instruction}`)
      .join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSpeak = (item: RemedyItem) => {
    const text = `${item.title}. Recipe: ${item.remedyName}. ${item.diagnosis}. Materials: ${item.materials
      .map((m) => `${m.amount} of ${m.item}`)
      .join(', ')}. Steps: ${item.steps
      .map((s) => `${s.title}. ${s.instruction}`)
      .join('. ')}`;
    speechService.speak(text);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Card */}
      <div
        id="saved-header-card"
        className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-emerald-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Saved Remedies & Garden Protocols</span>
              {savedRemedies.length > 0 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  {savedRemedies.length}
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Quick offline access to your bookmarked natural sprays, tonic recipes, and care guides.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBackToWelcome && (
            <button
              type="button"
              onClick={onBackToWelcome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Back to Welcome</span>
            </button>
          )}

          {savedRemedies.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Clear all saved remedies from local storage?')) {
                  onClearAll();
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Saved Items Grid or Empty State */}
      {savedRemedies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedRemedies.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-emerald-100 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                      {item.remedyName}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase whitespace-nowrap">
                    {item.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {item.diagnosis}
                </p>

                {/* Materials preview */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Hammer className="w-3 h-3 text-emerald-500" />
                    <span>Key Ingredients</span>
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-200 line-clamp-2">
                    {item.materials.map((m) => `${m.amount} ${m.item}`).join(' • ')}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSpeak(item)}
                    className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                    title="Read recipe aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Copy recipe"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenEcoGuide(`How to apply ${item.remedyName}?`)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open in EcoGuide</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveRemedy(item.id)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-500 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto text-2xl">
            🌿
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No saved remedies yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Bookmark organic recipes from Ask EcoGuide or the Remedy Library to access them here anytime for quick garden reference.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenLibrary}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Remedy Library</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenEcoGuide()}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask EcoGuide</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
