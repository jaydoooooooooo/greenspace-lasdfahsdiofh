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
  Calendar,
  Sparkles,
  Info,
  Umbrella,
} from 'lucide-react';
import {
  DailyForecastDay,
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
  const [selectedForecastIndex, setSelectedForecastIndex] = useState<number | null>(0);

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

  const getWeatherIcon = (code: number, sizeClass = 'w-12 h-12') => {
    if (code === 0 || code === 1) return <Sun className={`${sizeClass} text-amber-400 flex-shrink-0`} />;
    if (code === 2) return <CloudSun className={`${sizeClass} text-amber-300 flex-shrink-0`} />;
    if (code === 3 || code === 45) return <Cloud className={`${sizeClass} text-slate-300 flex-shrink-0`} />;
    if (code >= 51 && code <= 82) return <CloudRain className={`${sizeClass} text-blue-400 flex-shrink-0`} />;
    if (code >= 71 && code <= 75) return <Snowflake className={`${sizeClass} text-cyan-300 flex-shrink-0`} />;
    if (code >= 95) return <CloudLightning className={`${sizeClass} text-purple-400 flex-shrink-0`} />;
    return <CloudSun className={`${sizeClass} text-amber-400 flex-shrink-0`} />;
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

          {/* 7-Day Extended Weather Forecast */}
          {weather.forecast && weather.forecast.length > 0 && (() => {
            // Determine overall min & max for bar calculations
            const allMins = weather.forecast.map((d) => d.tempMin);
            const allMaxs = weather.forecast.map((d) => d.tempMax);
            const globalMin = Math.min(...allMins);
            const globalMax = Math.max(...allMaxs);
            const range = Math.max(1, globalMax - globalMin);

            const selectedDay =
              selectedForecastIndex !== null && weather.forecast[selectedForecastIndex]
                ? weather.forecast[selectedForecastIndex]
                : weather.forecast[0];

            const getBotanicalForecastTip = (day: DailyForecastDay) => {
              if (day.precipitationProbability >= 45) {
                return {
                  tag: 'Rain Expected',
                  tip: 'Pause scheduled container watering today to prevent root saturation.',
                  color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                };
              }
              if (day.tempMax >= 30) {
                return {
                  tag: 'High Heat Watch',
                  tip: 'Hydrate early in the morning before midday evaporation spikes.',
                  color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                };
              }
              if (day.tempMin <= 4) {
                return {
                  tag: 'Frost Caution',
                  tip: 'Chilly night: move delicate tropicals against warm domestic walls.',
                  color: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
                };
              }
              if (day.windSpeedMax >= 30) {
                return {
                  tag: 'Wind Alert',
                  tip: 'Gusty winds: anchor tall planter pots and check railing stability.',
                  color: 'text-teal-300 bg-teal-500/10 border-teal-500/20',
                };
              }
              return {
                tag: 'Optimal Growing',
                tip: 'Favorable temperature & light conditions for standard care regimens.',
                color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
              };
            };

            if (preferences.simpleMode) {
              const maxWeekTemp = Math.max(...weather.forecast.map((d) => d.tempMax));
              const minWeekTemp = Math.min(...weather.forecast.map((d) => d.tempMin));
              const rainyDays = weather.forecast.filter((d) => d.precipitationProbability >= 40);

              return (
                <div
                  id="simple-forecast-card"
                  className="relative z-10 p-5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-4 animate-fadeIn"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-700/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-400" />
                      <h4 className="text-base font-bold text-white">
                        7-Day Weather Forecast
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/10 text-amber-300 border border-amber-500/20">
                        Simple Mode
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-emerald-400" />
                      <span>{location.city}</span>
                    </span>
                  </div>

                  {/* Shortened compact 7-day strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {weather.forecast.map((day) => {
                      let dateFormatted = day.date;
                      try {
                        const dObj = new Date(day.date + 'T00:00:00');
                        dateFormatted = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      } catch {
                        // fallback
                      }

                      return (
                        <div
                          key={day.date}
                          className="p-3 rounded-xl bg-slate-900/70 border border-slate-700/70 flex flex-col items-center justify-between text-center gap-2"
                        >
                          <div>
                            <span className="font-bold text-xs text-white block">
                              {day.dayName.slice(0, 3)}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {dateFormatted}
                            </span>
                          </div>

                          <div className="my-1">
                            {getWeatherIcon(day.weatherCode, 'w-6 h-6')}
                          </div>

                          <div className="space-y-0.5">
                            <div className="text-xs">
                              <strong className="text-white font-bold">{formatTemp(day.tempMax)}</strong>
                              <span className="text-slate-400 text-[11px] ml-1">/ {formatTemp(day.tempMin)}</span>
                            </div>

                            {day.precipitationProbability >= 20 ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded-md">
                                <Droplet className="w-2.5 h-2.5 text-blue-400" />
                                {day.precipitationProbability}%
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 block truncate max-w-[80px]">
                                {day.weatherDescription.split(' ')[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Concise 1-line outlook */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs text-slate-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <p className="leading-snug">
                      <strong>7-Day Outlook:</strong> Highs near {formatTemp(maxWeekTemp)}, lows around {formatTemp(minWeekTemp)}.{' '}
                      {rainyDays.length > 0
                        ? `Rain expected on ${rainyDays.map((d) => d.dayName).join(', ')} — pause manual watering then.`
                        : 'Dry conditions anticipated — proceed with regular hydration.'}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div className="relative z-10 p-5 sm:p-6 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-700/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-base sm:text-lg font-bold text-white">
                      7-Day Weather & Microclimate Forecast
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Navigation className="w-3 h-3 text-emerald-400" />
                    <span>{location.city} Extended Outlook</span>
                  </span>
                </div>

                {/* 7-Day List/Grid */}
                <div className="space-y-2">
                  {weather.forecast.map((day, idx) => {
                    const isSelected = selectedForecastIndex === idx;
                    const botTip = getBotanicalForecastTip(day);
                    const leftPercent = Math.max(0, Math.min(90, Math.round(((day.tempMin - globalMin) / range) * 100)));
                    const barWidth = Math.max(8, Math.min(100 - leftPercent, Math.round(((day.tempMax - day.tempMin) / range) * 100)));

                    let dateFormatted = day.date;
                    try {
                      const dObj = new Date(day.date + 'T00:00:00');
                      dateFormatted = dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    } catch {
                      // fallback
                    }

                    return (
                      <div
                        key={day.date}
                        onClick={() => setSelectedForecastIndex(idx)}
                        className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-slate-700/90 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/40'
                            : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600'
                        }`}
                      >
                        {/* Day and Date */}
                        <div className="w-full sm:w-32 flex items-center justify-between sm:justify-start gap-2">
                          <span className="font-bold text-sm text-white">
                            {day.dayName}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {dateFormatted}
                          </span>
                        </div>

                        {/* Weather condition & Icon */}
                        <div className="flex items-center gap-2.5 sm:w-44">
                          {getWeatherIcon(day.weatherCode, 'w-6 h-6')}
                          <span className="text-xs font-semibold text-slate-200 truncate">
                            {day.weatherDescription}
                          </span>
                        </div>

                        {/* Rain probability */}
                        <div className="flex items-center gap-1.5 sm:w-20">
                          <Droplet className={`w-3.5 h-3.5 ${day.precipitationProbability > 20 ? 'text-blue-400' : 'text-slate-500'}`} />
                          <span className={`text-xs font-semibold ${day.precipitationProbability > 20 ? 'text-blue-300' : 'text-slate-400'}`}>
                            {day.precipitationProbability}%
                          </span>
                        </div>

                        {/* Temp Range Visual Bar */}
                        <div className="flex items-center gap-3 sm:w-48 flex-1">
                          <span className="text-xs font-semibold text-slate-400 w-9 text-right">
                            {formatTemp(day.tempMin)}
                          </span>
                          <div className="flex-1 h-2 bg-slate-800 rounded-full relative overflow-hidden">
                            <div
                              className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400"
                              style={{
                                left: `${leftPercent}%`,
                                width: `${barWidth}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-bold text-white w-9">
                            {formatTemp(day.tempMax)}
                          </span>
                        </div>

                        {/* Plant Tip Badge */}
                        <div className="hidden lg:flex items-center sm:w-44 justify-end">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${botTip.color} truncate`}>
                            {botTip.tag}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Day Horticultural Breakdown Card */}
                {selectedDay && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-2 animate-fadeIn">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                          {selectedDay.dayName} Plant Care & Climate Insight ({selectedDay.date})
                        </h5>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-300">
                        <span className="flex items-center gap-1">
                          <Wind className="w-3.5 h-3.5 text-teal-400" />
                          <span>Max Wind: {selectedDay.windSpeedMax} km/h</span>
                        </span>
                        {selectedDay.uvIndexMax != null && (
                          <span className="flex items-center gap-1">
                            <Sun className="w-3.5 h-3.5 text-amber-400" />
                            <span>Max UV: {selectedDay.uvIndexMax}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {getBotanicalForecastTip(selectedDay).tip}{' '}
                      Forecasted temperatures range from a low of <strong>{formatTemp(selectedDay.tempMin)}</strong> to a high of <strong>{formatTemp(selectedDay.tempMax)}</strong> with a <strong>{selectedDay.precipitationProbability}%</strong> chance of precipitation.
                    </p>
                  </div>
                )}
              </div>
            );
          })()}

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
