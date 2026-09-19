import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CloudSun,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Bookmark,
  Copy,
  Check,
  ChevronLeft,
  AlertTriangle,
  ShieldCheck,
  Thermometer,
  Clock,
  Hammer,
  HelpCircle,
} from 'lucide-react';
import {
  LocationData,
  RemedyItem,
  UserPreferences,
  WeatherData,
} from '../types';
import { speechService } from '../utils/speech';

interface EcoGuideTabProps {
  initialQuery?: string;
  weather: WeatherData | null;
  location: LocationData | null;
  onRequestLocation: () => void;
  preferences: UserPreferences;
  onSaveRemedy: (remedy: RemedyItem) => void;
  isRemedySaved: (id: string) => boolean;
  onBackToWelcome?: () => void;
}

export const EcoGuideTab: React.FC<EcoGuideTabProps> = ({
  initialQuery = '',
  weather,
  location,
  onRequestLocation,
  preferences,
  onSaveRemedy,
  isRemedySaved,
  onBackToWelcome,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [plantType, setPlantType] = useState('');
  const [loading, setLoading] = useState(false);
  const [remedy, setRemedy] = useState<RemedyItem | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Audio state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const unsub = speechService.subscribe((speaking, paused) => {
      setIsSpeaking(speaking);
      setIsPaused(paused);
    });
    return () => {
      unsub();
      speechService.stop();
    };
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleGenerateRemedy(initialQuery);
    }
  }, [initialQuery]);

  const handleGenerateRemedy = async (userQuery?: string) => {
    const q = userQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    speechService.stop();
    setCheckedSteps({});

    try {
      const payload = {
        query: q,
        plantType: plantType || undefined,
        locationName: location ? `${location.city}, ${location.country}` : undefined,
        temperature: weather?.temperature,
        tempUnit: preferences.tempUnit,
        weatherCondition: weather?.weatherDescription,
        humidity: weather?.humidity,
        ageMode: preferences.simpleMode ? 'simple' : 'standard',
      };

      const res = await fetch('/api/ecoguide/remedy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Unable to retrieve remedy instructions.');
      }

      const json = await res.json();
      if (json.success && json.data) {
        const item: RemedyItem = {
          ...json.data,
          id: `remedy-${Date.now()}`,
          plantType: plantType || 'General Plant',
          savedAt: new Date().toISOString(),
          source: json.source,
        };
        setRemedy(item);
      } else {
        throw new Error('Invalid response received from EcoGuide.');
      }
    } catch (err: any) {
      console.error('EcoGuide query error:', err);
      setError('Could not load custom remedy. Please check your connection or try another plant question.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (stepIdx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [stepIdx]: !prev[stepIdx] }));
  };

  const handleToggleSpeak = () => {
    if (!remedy) return;
    if (isSpeaking) {
      if (isPaused) {
        speechService.resume();
      } else {
        speechService.pause();
      }
    } else {
      const stepsText = remedy.steps
        .map((s) => `Step ${s.stepNumber}: ${s.title}. ${s.instruction}`)
        .join('. ');
      const speech = `${remedy.speechSummary || remedy.title}. Materials needed: ${remedy.materials
        .map((m) => `${m.amount} of ${m.item}`)
        .join(', ')}. Instructions: ${stepsText}. Safety advice: ${remedy.safetyNotes || ''}`;
      speechService.speak(speech);
    }
  };

  const handleStopSpeak = () => {
    speechService.stop();
  };

  const handleCopy = () => {
    if (!remedy) return;
    const text = `${remedy.title} (${remedy.remedyName})\n\nDiagnosis:\n${remedy.diagnosis}\n\nMaterials:\n${remedy.materials
      .map((m) => `- ${m.amount} ${m.item}`)
      .join('\n')}\n\nStep-by-Step Instructions:\n${remedy.steps
      .map((s) => `${s.stepNumber}. ${s.title}: ${s.instruction} (Tip: ${s.proTip || ''})`)
      .join('\n')}\n\nLive Temperature Guidance:\n${remedy.liveTemperatureAdvice || ''}\n\nSafety Notes:\n${
      remedy.safetyNotes || ''
    }`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const plantTypes = [
    'Indoor Houseplants',
    'Vegetables & Tomatoes',
    'Garden Roses & Flowers',
    'Herbs & Balcony Greens',
    'Succulents & Cacti',
    'Outdoor Shrubs & Trees',
  ];

  const quickSymptoms = [
    'How to get rid of aphids naturally with neem oil',
    'Yellow leaves on my monstera or pothos',
    'Baking soda spray for white powdery mildew',
    'Natural fertilizer from banana peels & eggshells',
    'How to stop fungus gnats in potting soil',
    'Tomato blossom end rot remedy & soil fix',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Climate Context Banner */}
      <div
        id="climate-context-banner"
        className="rounded-3xl bg-slate-900 text-white p-5 sm:p-6 border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-4 relative overflow-hidden"
      >
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CloudSun className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Live Environmental Feed
              </span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">
              {weather && location ? (
                <>
                  Active Tracking:{' '}
                  <strong className="text-white">
                    {weather.temperature}°{preferences.tempUnit}
                  </strong>{' '}
                  in <strong className="text-emerald-300">{location.city}</strong> ({weather.weatherDescription})
                </>
              ) : (
                'Location not yet connected. Live temperature optimizes spray dilution and watering timing.'
              )}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          {onBackToWelcome && (
            <button
              type="button"
              onClick={onBackToWelcome}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Welcome</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRequestLocation}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Refresh GPS
          </button>
        </div>
      </div>

      {/* Query Formulation Form */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-emerald-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-3xl space-y-4">
          <div>
            <label
              htmlFor="ecoguide-query-input"
              className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>What symptom or gardening question can EcoGuide solve?</span>
            </label>
            <div className="relative">
              <input
                id="ecoguide-query-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleGenerateRemedy();
                  }
                }}
                placeholder="Describe symptoms, e.g. yellow leaves, white spots, pest infestation, or natural fertilizers..."
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Plant Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Plant Category (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {plantTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPlantType(plantType === type ? '' : type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    plantType === type
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              id="ecoguide-submit-btn"
              type="button"
              disabled={loading || !query.trim()}
              onClick={() => handleGenerateRemedy()}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-200 dark:shadow-emerald-950/60 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Organic Remedy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Organic Remedy</span>
                </>
              )}
            </button>

            {preferences.simpleMode && (
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800">
                Simple Mode Active: Formatted with beginner instructions & kitchen measurements
              </span>
            )}
          </div>
        </div>

        {/* Quick Symptom Chips */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
            Or select a common gardening condition:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickSymptoms.map((sym, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(sym);
                  handleGenerateRemedy(sym);
                }}
                className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Remedy Display */}
      {remedy && (
        <div
          id="remedy-result-card"
          className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-emerald-100 dark:border-slate-800 shadow-md space-y-6 transition-colors"
        >
          {/* Remedy Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="space-y-1 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                  100% Organic Verified
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {remedy.timeRequired}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  {remedy.difficulty} Difficulty
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {remedy.title}
              </h2>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Recipe: {remedy.remedyName}
              </p>
            </div>

            {/* Save & Copy Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSaveRemedy(remedy)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isRemedySaved(remedy.id)
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isRemedySaved(remedy.id) ? 'Saved' : 'Save Remedy'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                title="Copy instructions to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Audio Reader Toolbar */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleSpeak}
                className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                title={isSpeaking ? (isPaused ? 'Resume' : 'Pause') : 'Listen to instructions'}
              >
                {isSpeaking ? (
                  isPaused ? (
                    <Play className="w-4 h-4 ml-0.5" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <div>
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  {isSpeaking
                    ? isPaused
                      ? 'Audio Reading Paused'
                      : 'Reading Step-by-Step Instructions Aloud'
                    : 'Hands-Free Gardening Audio Reader'}
                </p>
                <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
                  Keep your hands free in the soil while hearing measurements & steps
                </p>
              </div>
            </div>

            {isSpeaking && (
              <button
                type="button"
                onClick={handleStopSpeak}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Stop</span>
              </button>
            )}
          </div>

          {/* Diagnosis Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              <span>Diagnostic Analysis</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {remedy.diagnosis}
            </p>
          </div>

          {/* Materials & Kitchen Measurements */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
              <Hammer className="w-4 h-4 text-emerald-500" />
              <span>Required Organic Ingredients & Kitchen Measurements</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {remedy.materials.map((mat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-slate-800 border border-emerald-100 dark:border-slate-700 flex items-center justify-between"
                >
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {mat.item}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {mat.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Step-by-Step Instructions */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white">
              Preparation & Application Steps (Click to check off)
            </h3>
            <div className="space-y-3">
              {remedy.steps.map((step, idx) => {
                const isDone = !!checkedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                      isDone
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 opacity-75'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    <div className="mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          Step {step.stepNumber}
                        </span>
                        <h4
                          className={`font-bold text-sm sm:text-base ${
                            isDone
                              ? 'line-through text-slate-500 dark:text-slate-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {step.title}
                        </h4>
                      </div>
                      <p
                        className={`text-sm leading-relaxed ${
                          isDone
                            ? 'text-slate-500 dark:text-slate-400'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {step.instruction}
                      </p>
                      {step.proTip && (
                        <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 p-2 rounded-xl border border-amber-200/60 dark:border-amber-900/60 mt-2">
                          <strong>💡 Pro-Tip:</strong> {step.proTip}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Temperature Advisory Callout */}
          {remedy.liveTemperatureAdvice && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
              <Thermometer className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-1">
                  Live Microclimate Advisory ({weather?.temperature || 22}°{preferences.tempUnit})
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  {remedy.liveTemperatureAdvice}
                </p>
              </div>
            </div>
          )}

          {/* Safety & Prevention Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {remedy.preventionTips && remedy.preventionTips.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Long-Term Prevention</span>
                </h4>
                <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {remedy.preventionTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {remedy.safetyNotes && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-500" />
                  <span>Safety & Ecology</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {remedy.safetyNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
