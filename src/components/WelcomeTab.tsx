import React from 'react';
import {
  Sparkles,
  Camera,
  ArrowRight,
  Droplet,
  Compass,
  Wind,
  Sun,
  ShieldCheck,
  RefreshCw,
  Bug,
  Leaf,
} from 'lucide-react';
import { LocationData, UserPreferences, WeatherData } from '../types';

interface WelcomeTabProps {
  onStartEcoGuide: (query?: string) => void;
  onOpenClimate: () => void;
  onOpenLibrary: () => void;
  onOpenAdvisor: () => void;
  weather: WeatherData | null;
  location: LocationData | null;
  onRequestLocation: () => void;
  preferences: UserPreferences;
}

export const WelcomeTab: React.FC<WelcomeTabProps> = ({
  onStartEcoGuide,
  onOpenClimate,
  onOpenLibrary,
  onOpenAdvisor,
  weather,
  location,
  onRequestLocation,
  preferences,
}) => {
  const tempValue = weather
    ? preferences.tempUnit === 'C'
      ? `${weather.temperature}°`
      : `${Math.round((weather.temperature * 9) / 5 + 32)}°`
    : '72°';

  const tempUnitText = preferences.tempUnit === 'C' ? 'C' : 'F';

  const quickPrompts = [
    {
      label: 'Yellow Leaves on Plants',
      query: 'My tomato and houseplant leaves are turning yellow. What should I do?',
      icon: '🍂',
    },
    {
      label: 'Natural Pest & Aphid Spray',
      query: 'How do I make a safe organic neem or soap spray for aphids and spider mites?',
      icon: '🐛',
    },
    {
      label: 'DIY Organic Soil Fertilizer',
      query: 'How to make natural fertilizer from banana peels, coffee grounds, and eggshells?',
      icon: '🍌',
    },
    {
      label: 'Powdery Mildew Remedy',
      query: 'Natural baking soda recipe to cure white powdery mildew on vegetable leaves',
      icon: '🌿',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Live Monitoring Status Bar */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2.5 bg-emerald-100 dark:bg-emerald-950/60 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-800">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300">
            Live Monitoring Active • {location?.city || 'Local Climate Connected'}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenClimate}
          className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Environmental Station</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* Welcome Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                Welcome back
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Your urban oasis is thriving today. EcoGuide AI has analyzed your local climate conditions to provide custom care instructions and natural remedies for your unique garden.
              </p>
            </div>

            {/* Ask EcoGuide AI Banner */}
            <div className="bg-emerald-500 p-6 rounded-2xl text-white shadow-xl shadow-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-emerald-100 font-medium text-xs sm:text-sm mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Ask EcoGuide AI</span>
                </p>
                <p className="text-lg sm:text-xl font-bold leading-snug">
                  "My plant leaves have spots. What organic remedy should I make?"
                </p>
              </div>
              <button
                id="hero-ask-now-btn"
                type="button"
                onClick={() => onStartEcoGuide()}
                className="bg-white text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-xl font-bold shadow-lg transition-colors whitespace-nowrap self-start sm:self-center active:scale-95 cursor-pointer"
              >
                Ask Now
              </button>
            </div>
          </div>

          {/* Plant Advisor Banner */}
          <div className="bg-emerald-950 text-white p-6 sm:p-7 rounded-3xl border border-emerald-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
            <div className="space-y-1.5 z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5" />
                <span>Gemini Vision Plant Advisor</span>
              </div>
              <h3 className="text-xl font-black text-white">
                Dynamic Plant Recommendations Based on Space Photography
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                Upload a photo of your balcony, patio, or windowsill to map sunlight angles, wind sheer, and container footprints with interactive placement pins.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenAdvisor}
              className="z-10 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-900/50 transition-all active:scale-95 whitespace-nowrap flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Plant Advisor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2 Guide Cards: Watering & Pest/Disease */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/80 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold">
                    💧
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                    Watering Guide
                  </h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                  {weather && weather.temperature > 28
                    ? `High heat (${weather.temperature}°C). Water soil early in morning or after sunset.`
                    : 'Soil moisture levels are optimal. Water root base without wetting foliage.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onStartEcoGuide(
                    "What is the ideal watering schedule for my plants given today's temperature?"
                  )
                }
                className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 transition-colors text-sm cursor-pointer"
              >
                View Instructions
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-emerald-100 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/80 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 text-xl font-bold">
                    🌿
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                    Pest & Disease
                  </h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                  Organic neem and soap recipes tested for non-toxic protection without harming honeybees.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenLibrary}
                className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 transition-colors text-sm cursor-pointer"
              >
                Browse Remedies
              </button>
            </div>
          </div>
        </section>

        {/* Right 5 Columns: Environmental Station */}
        <section className="lg:col-span-5 flex flex-col">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg flex flex-col justify-between h-full min-h-[340px]">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs">
                  Live Environmental Feed
                </h3>
                <button
                  type="button"
                  onClick={onRequestLocation}
                  className="text-xs text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh GPS</span>
                </button>
              </div>

              <div className="flex items-end gap-2 mb-6">
                <span className="text-6xl sm:text-7xl font-light tracking-tight">
                  {tempValue}
                </span>
                <span className="text-2xl font-medium text-emerald-400 mb-2">
                  {tempUnitText}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-slate-400 text-sm flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Condition</span>
                  </span>
                  <span className="font-semibold text-sm text-slate-200">
                    {weather?.weatherDescription || 'Clear Sky'}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-slate-400 text-sm flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-blue-400" />
                    <span>Humidity</span>
                  </span>
                  <span className="font-semibold text-sm text-slate-200">
                    {weather ? `${weather.humidity}%` : '54%'}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-slate-400 text-sm flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-teal-400" />
                    <span>Wind Speed</span>
                  </span>
                  <span className="font-semibold text-sm text-slate-200">
                    {weather ? `${weather.windSpeed} km/h` : '8 km/h'}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-slate-400 text-sm flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-purple-400" />
                    <span>Location</span>
                  </span>
                  <span className="font-semibold text-sm text-slate-200 truncate max-w-[180px]">
                    {location?.city ? `${location.city}, ${location.country}` : 'Tokyo, Japan'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onOpenClimate}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-950/40 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View 7-Day Forecast & Climate Advisory</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Quick Questions Section - Hidden in Simple Mode */}
      {!preferences.simpleMode && (
        <div className="pt-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Instant EcoGuide Questions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickPrompts.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onStartEcoGuide(item.query)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-sm text-left transition-all group flex items-start gap-3 cursor-pointer"
              >
                <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {item.query}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
