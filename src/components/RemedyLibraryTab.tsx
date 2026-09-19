import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Volume2,
  Bookmark,
  Sparkles,
  Clock,
  Hammer,
  ShieldCheck,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { RemedyItem, UserPreferences, WeatherData } from '../types';
import { CURATED_REMEDIES } from '../data/curatedRemedies';
import { speechService } from '../utils/speech';

interface RemedyLibraryTabProps {
  onAskEcoGuide: (query: string) => void;
  onSaveRemedy: (remedy: RemedyItem) => void;
  isRemedySaved: (id: string) => boolean;
  weather: WeatherData | null;
  preferences: UserPreferences;
  onBackToWelcome?: () => void;
}

export const RemedyLibraryTab: React.FC<RemedyLibraryTabProps> = ({
  onAskEcoGuide,
  onSaveRemedy,
  isRemedySaved,
  weather,
  preferences,
  onBackToWelcome,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRemedyId, setSelectedRemedyId] = useState<string>('curated-1');

  const categories = [
    'All',
    'Pest Control',
    'Fungus & Mold',
    'Soil & Fertilizer',
    'Root Care',
  ];

  const filteredRemedies = CURATED_REMEDIES.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.remedyName.toLowerCase().includes(search.toLowerCase()) ||
      item.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      item.materials.some((m) => m.item.toLowerCase().includes(search.toLowerCase()));

    if (selectedCategory === 'All') return matchesSearch;
    if (selectedCategory === 'Pest Control') {
      return matchesSearch && (item.title.includes('Pest') || item.title.includes('Neem'));
    }
    if (selectedCategory === 'Fungus & Mold') {
      return matchesSearch && (item.title.includes('Baking Soda') || item.title.includes('Antifungal'));
    }
    if (selectedCategory === 'Soil & Fertilizer') {
      return matchesSearch && (item.title.includes('Banana') || item.title.includes('Tonic'));
    }
    if (selectedCategory === 'Root Care') {
      return matchesSearch && (item.title.includes('Cinnamon') || item.title.includes('Root'));
    }
    return matchesSearch;
  });

  const selectedRemedy =
    filteredRemedies.find((r) => r.id === selectedRemedyId) ||
    filteredRemedies[0] ||
    CURATED_REMEDIES[0];

  const handleSpeakRemedy = (item: RemedyItem) => {
    const text = `${item.title}. ${item.diagnosis}. Recipe: ${item.materials
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
        id="library-header-card"
        className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-emerald-100 dark:border-slate-800 shadow-sm transition-colors"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Verified Organic Remedy Library
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Time-tested, non-toxic recipes with exact step-by-step instructions and kitchen measurements.
              </p>
            </div>
          </div>

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
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes, ingredients..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* Main Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredRemedies.map((item) => {
            const isSelected = selectedRemedy.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedRemedyId(item.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 select-none ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-900 border-emerald-100/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase whitespace-nowrap">
                    {item.difficulty}
                  </span>
                </div>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {item.remedyName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {item.diagnosis}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.timeRequired}</span>
                </div>
              </div>
            );
          })}

          {filteredRemedies.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
              No remedies matched "{search}".
            </div>
          )}
        </div>

        {/* Right Detail Card (7 cols) */}
        <div className="lg:col-span-7">
          {selectedRemedy && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-emerald-100 dark:border-slate-800 shadow-md space-y-6 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                      100% Non-Toxic
                    </span>
                    <span className="text-xs text-slate-500">{selectedRemedy.timeRequired}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {selectedRemedy.title}
                  </h3>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Recipe: {selectedRemedy.remedyName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSpeakRemedy(selectedRemedy)}
                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                    title="Read recipe aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSaveRemedy(selectedRemedy)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isRemedySaved(selectedRemedy.id)
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>{isRemedySaved(selectedRemedy.id) ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Root Cause Diagnosis
                </h4>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {selectedRemedy.diagnosis}
                </p>
              </div>

              {/* Materials */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Hammer className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Exact Kitchen Ingredients</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedRemedy.materials.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-emerald-50/50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {m.item}
                      </span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">
                        {m.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Step-by-Step Application
                </h4>
                <div className="space-y-2.5">
                  {selectedRemedy.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          Step {step.stepNumber}:
                        </span>
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                          {step.title}
                        </h5>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {step.instruction}
                      </p>
                      {step.proTip && (
                        <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200/60 dark:border-amber-900/60 mt-2">
                          💡 <strong>Pro-Tip:</strong> {step.proTip}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button: Ask EcoGuide */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    onAskEcoGuide(
                      `I want to use the ${selectedRemedy.remedyName} on my plants. What precautions should I take?`
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ask EcoGuide About This Recipe</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
