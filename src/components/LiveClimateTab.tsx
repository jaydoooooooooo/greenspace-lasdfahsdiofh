import React, { useState } from 'react';
import {
  CloudSun,
  MapPin,
  RefreshCw,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
  Droplet,
  Thermometer,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  Navigation,
  Compass,
} from 'lucide-react';
import {
  LocationData,
  UserPreferences,
  WeatherData,
} from '../types';
import {
  getTemperatureAdvisory,
  PRESET_CITIES,
} from '../utils/weather';

interface LiveClimateTabProps {
  weather: WeatherData | null;
  location: LocationData | null;
  loadingLocation: boolean;
  onRequestLocation: () => void;
  onSelectCity: (lat: number, lon: number, city: string, country: string) => void;
  preferences: UserPreferences;
  onOpenEcoGuideWithClimate: (query: string) => void;
  onBackToWelcome?: () => void;
}

export const LiveClimateTab: React.FC<LiveClimateTabProps> = ({
  weather,
  location,
  loadingLocation,
  onRequestLocation,
  onSelectCity,
  preferences,
  onOpenEcoGuideWithClimate,
  onBackToWelcome,
}) => {
  const [selectedCityName, setSelectedCityName] = useState<string>('');

  const advisory = weather ? getTemperatureAdvisory(weather.temperature) : null;

  const formatTemp = (celsius: number) => {
    if (preferences.tempUnit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCityName(val);
    const city = PRESET_CITIES.find((c) => c.name === val);
    if (city) {
      onSelectCity(city.lat, city.lon, city.name, city.country);
    }
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="w-12 h-12 text-amber-400" />;
    if (code === 2) return <CloudSun className="w-12 h-12 text-amber-300" />;
    if (code === 3 || code === 45) return <Cloud className="w-12 h-12 text-slate-300" />;
    if (code >= 51 && code <= 82) return <CloudRain className="w-12 h-12 text-blue-400" />;
    if (code >= 71 && code <= 75) return <Snowflake className="w-12 h-12 text-cyan-300" />;
    if (code >= 95) return <CloudLightning className="w-12 h-12 text-purple-400" />;
    return <CloudSun className="w-12 h-12 text-amber-400" />;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Controls Card */}
      <div
        id="climate-controls-card"
        className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-emerald-100 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors"
      >
        <div className="w-full flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Thermometer className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span>Live Location & Climate Accuracy</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Tracking temperature enables exact timing for pest sprays, watering, and frost/heat defense.
            </p>
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

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-detect-gps-location"
            type="button"
            onClick={onRequestLocation}
            disabled={loadingLocation}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            {loadingLocation ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Locating...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span>Detect Live Location</span>
              </>
            )}
          </button>

          <div className="relative">
            <select
              id="select-city-dropdown"
              value={selectedCityName}
              onChange={handleCityChange}
              className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200 cursor-pointer"
            >
              <option value="">Or select a major city...</option>
              {PRESET_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}, {c.country}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Weather Display Card */}
      {weather && location ? (
        <div
          id="weather-display-card"
          className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden"
        >
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header row */}
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 border border-slate-700">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>{location.isLive ? 'Live GPS Coordinates' : 'Selected Station'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {location.city}
                {location.country ? `, ${location.country}` : ''}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Coordinates: {location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E • Updated at {weather.updatedAt}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {getWeatherIcon(weather.weatherCode)}
              <div>
                <span className="text-5xl sm:text-6xl font-light tracking-tight text-white">
                  {formatTemp(weather.temperature)}
                </span>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 mt-1">
                  {weather.weatherDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>Feels Like</span>
              </span>
              <p className="text-xl font-bold text-white">
                {formatTemp(weather.apparentTemperature)}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <Droplet className="w-3.5 h-3.5 text-blue-400" />
                <span>Relative Humidity</span>
              </span>
              <p className="text-xl font-bold text-white">{weather.humidity}%</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>Wind Velocity</span>
              </span>
              <p className="text-xl font-bold text-white">{weather.windSpeed} km/h</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
                <span>Today's High / Low</span>
              </span>
              <p className="text-xl font-bold text-white">
                {formatTemp(weather.tempMax)} / {formatTemp(weather.tempMin)}
              </p>
            </div>
          </div>

          {/* Microclimate Horticultural Advisory Card */}
          {advisory && (
            <div className="relative z-10 p-5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-3">
              <div className="flex items-center gap-2">
                {advisory.status === 'warning' ? (
                  <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                )}
                <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                  {advisory.title}
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {advisory.advice}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-blue-400" />
                    <span>Watering Guideline</span>
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {advisory.wateringGuideline}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Foliar & Spray Advisory</span>
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {advisory.sprayAdvisory}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action CTA */}
          <div className="relative z-10 pt-2 flex justify-end">
            <button
              type="button"
              onClick={() =>
                onOpenEcoGuideWithClimate(
                  `What natural plant remedies and watering schedule should I use today given my local temperature of ${weather.temperature}°${preferences.tempUnit} and ${weather.weatherDescription}?`
                )
              }
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Open EcoGuide with Current Climate Context</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-800 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Connecting to environmental station...
          </p>
        </div>
      )}
    </div>
  );
};
