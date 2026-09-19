import React from 'react';
import {
  Home,
  Sparkles,
  Camera,
  CloudSun,
  BookOpen,
  Bookmark,
  Sun,
  Moon,
  Type,
  Smile,
  Thermometer,
} from 'lucide-react';
import { LocationData, TabType, UserPreferences, WeatherData } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  weather: WeatherData | null;
  location: LocationData | null;
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  weather,
  location,
  preferences,
  setPreferences,
  savedCount,
}) => {
  const toggleSimpleMode = () => {
    setPreferences((prev) => ({ ...prev, simpleMode: !prev.simpleMode }));
  };

  const toggleDarkMode = () => {
    setPreferences((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const cycleTextSize = () => {
    setPreferences((prev) => {
      const next =
        prev.textSize === 'normal'
          ? 'large'
          : prev.textSize === 'large'
          ? 'xlarge'
          : 'normal';
      return { ...prev, textSize: next };
    });
  };

  const toggleTempUnit = () => {
    setPreferences((prev) => ({
      ...prev,
      tempUnit: prev.tempUnit === 'C' ? 'F' : 'C',
    }));
  };

  const tempDisplay = weather
    ? preferences.tempUnit === 'C'
      ? `${weather.temperature}°C`
      : `${Math.round((weather.temperature * 9) / 5 + 32)}°F`
    : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          id="brand-logo"
          onClick={() => setActiveTab('welcome')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-emerald-950/15 border border-emerald-200/80 dark:border-emerald-700/80 group-hover:scale-105 transition-transform bg-slate-900 flex-shrink-0">
            <img
              src="/assets/greenspace_logo.jpg"
              alt="GreenSpace Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback icon if image path is altered
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-emerald-900 dark:text-emerald-300">
                GreenSpace
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                EcoGuide
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Organic remedies & climate-smart gardening
            </p>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
          <button
            id="nav-welcome-btn"
            type="button"
            onClick={() => setActiveTab('welcome')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'welcome'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/50 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50/80 dark:hover:bg-slate-800/80'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Welcome</span>
          </button>

          <button
            id="nav-ecoguide-btn"
            type="button"
            onClick={() => setActiveTab('ecoguide')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'ecoguide'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/50 font-bold ring-2 ring-emerald-300/60 dark:ring-emerald-700/60'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50/80 dark:hover:bg-slate-800/80'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Ask EcoGuide</span>
          </button>

          <button
            id="nav-advisor-btn"
            type="button"
            onClick={() => setActiveTab('advisor')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'advisor'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/50 font-bold ring-2 ring-emerald-300/60 dark:ring-emerald-700/60'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50/80 dark:hover:bg-slate-800/80'
            }`}
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Plant Advisor</span>
            <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-emerald-700 dark:bg-emerald-600 text-white">
              VISION
            </span>
          </button>

          <button
            id="nav-climate-btn"
            type="button"
            onClick={() => setActiveTab('climate')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'climate'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/50 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50/80 dark:hover:bg-slate-800/80'
            }`}
          >
            <CloudSun className="w-4 h-4" />
            <span>Live Climate</span>
            {tempDisplay && (
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                {tempDisplay}
              </span>
            )}
          </button>

          <button
            id="nav-remedies-btn"
            type="button"
            onClick={() => setActiveTab('remedies')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'remedies'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/50 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50/80 dark:hover:bg-slate-800/80'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Remedy Library</span>
          </button>

          <button
            id="nav-saved-btn"
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/50 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50/80 dark:hover:bg-slate-800/80'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Accessibility & Preferences Controls */}
        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
          {/* Temperature Unit Toggle */}
          <button
            id="btn-toggle-temp-unit"
            type="button"
            onClick={toggleTempUnit}
            title={`Switch to °${preferences.tempUnit === 'C' ? 'F' : 'C'}`}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            °{preferences.tempUnit}
          </button>

          {/* Simple Mode Toggle */}
          <button
            id="btn-toggle-simple-mode"
            type="button"
            onClick={toggleSimpleMode}
            title={preferences.simpleMode ? 'Simple Mode active (Easy to read)' : 'Standard botanical mode'}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
              preferences.simpleMode
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700 ring-2 ring-amber-300/50'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Simple Mode</span>
          </button>

          {/* Font Size Cycle */}
          <button
            id="btn-cycle-text-size"
            type="button"
            onClick={cycleTextSize}
            title={`Font size: ${preferences.textSize}. Click to cycle.`}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center justify-center"
          >
            <Type className="w-4 h-4" />
            <span className="text-[10px] font-bold ml-1">
              {preferences.textSize === 'normal' ? '1x' : preferences.textSize === 'large' ? '1.1x' : '1.2x'}
            </span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            id="btn-toggle-theme"
            type="button"
            onClick={toggleDarkMode}
            title={preferences.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            {preferences.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
