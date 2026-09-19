import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeTab } from './components/WelcomeTab';
import { EcoGuideTab } from './components/EcoGuideTab';
import { PlantAdvisorTab } from './components/PlantAdvisorTab';
import { LiveClimateTab } from './components/LiveClimateTab';
import { RemedyLibraryTab } from './components/RemedyLibraryTab';
import { SavedRemediesTab } from './components/SavedRemediesTab';
import {
  LocationData,
  RemedyItem,
  TabType,
  UserPreferences,
  WeatherData,
} from './types';
import { fetchWeather, reverseGeocode } from './utils/weather';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('welcome');
  const [ecoGuideQuery, setEcoGuideQuery] = useState<string>('');

  // User preferences with localStorage persistence
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('greenspace_user_prefs');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load user preferences from localStorage:', e);
    }
    return {
      textSize: 'normal',
      simpleMode: false,
      tempUnit: 'C',
      darkMode: false,
    };
  });

  // Saved remedies with localStorage persistence
  const [savedRemedies, setSavedRemedies] = useState<RemedyItem[]>(() => {
    try {
      const saved = localStorage.getItem('greenspace_saved_remedies');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load saved remedies from localStorage:', e);
    }
    return [];
  });

  // Weather and Location state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Sync preferences to localStorage and HTML root classes
  useEffect(() => {
    try {
      localStorage.setItem('greenspace_user_prefs', JSON.stringify(preferences));
    } catch (e) {
      console.warn('Failed to save user preferences:', e);
    }

    const root = document.documentElement;
    if (preferences.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.classList.remove('text-size-large', 'text-size-xlarge');
    if (preferences.textSize === 'large') {
      root.classList.add('text-size-large');
    } else if (preferences.textSize === 'xlarge') {
      root.classList.add('text-size-xlarge');
    }
  }, [preferences]);

  // Sync saved remedies to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('greenspace_saved_remedies', JSON.stringify(savedRemedies));
    } catch (e) {
      console.warn('Failed to save remedies to localStorage:', e);
    }
  }, [savedRemedies]);

  // Initial weather load (Tokyo default)
  useEffect(() => {
    const initDefaultWeather = async () => {
      try {
        const defaultLat = 35.6762;
        const defaultLon = 139.6503;
        const data = await fetchWeather(defaultLat, defaultLon);
        setWeather(data);
        setLocation({
          latitude: defaultLat,
          longitude: defaultLon,
          city: 'Tokyo',
          country: 'Japan',
          isLive: false,
        });
      } catch (err) {
        console.error('Failed to load initial weather:', err);
      }
    };

    initDefaultWeather();

    // Attempt passive browser geolocation on startup
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const w = await fetchWeather(latitude, longitude);
            const geo = await reverseGeocode(latitude, longitude);
            setWeather(w);
            setLocation({
              latitude,
              longitude,
              city: geo.city,
              country: geo.country,
              isLive: true,
            });
          } catch (e) {
            console.warn('Passive geolocation fetch error:', e);
          }
        },
        () => {
          // Geolocation prompt declined; Tokyo fallback remains active
        },
        { timeout: 8000 }
      );
    }
  }, []);

  // Request GPS location explicitly
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const w = await fetchWeather(latitude, longitude);
          const geo = await reverseGeocode(latitude, longitude);
          setWeather(w);
          setLocation({
            latitude,
            longitude,
            city: geo.city,
            country: geo.country,
            isLive: true,
          });
        } catch (err) {
          console.error('Error fetching live location weather:', err);
        } finally {
          setLoadingLocation(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Select preset city
  const handleSelectCity = async (lat: number, lon: number, city: string, country: string) => {
    try {
      setLoadingLocation(true);
      const w = await fetchWeather(lat, lon);
      setWeather(w);
      setLocation({
        latitude: lat,
        longitude: lon,
        city,
        country,
        isLive: false,
      });
    } catch (err) {
      console.error('Error selecting city weather:', err);
    } finally {
      setLoadingLocation(false);
    }
  };

  // Remedy save/remove/check
  const handleSaveRemedy = (item: RemedyItem) => {
    setSavedRemedies((prev) => {
      const exists = prev.some((r) => r.id === item.id);
      if (exists) {
        return prev.filter((r) => r.id !== item.id);
      }
      return [item, ...prev];
    });
  };

  const handleRemoveRemedy = (id: string) => {
    setSavedRemedies((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearAllSaved = () => {
    setSavedRemedies([]);
  };

  const isRemedySaved = (id: string) => {
    return savedRemedies.some((r) => r.id === id);
  };

  // Navigations
  const handleStartEcoGuide = (query?: string) => {
    if (query) {
      setEcoGuideQuery(query);
    }
    setActiveTab('ecoguide');
  };

  const handleBackToWelcome = () => {
    setActiveTab('welcome');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        weather={weather}
        location={location}
        preferences={preferences}
        setPreferences={setPreferences}
        savedCount={savedRemedies.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'welcome' && (
          <WelcomeTab
            onStartEcoGuide={handleStartEcoGuide}
            onOpenClimate={() => setActiveTab('climate')}
            onOpenLibrary={() => setActiveTab('remedies')}
            onOpenAdvisor={() => setActiveTab('advisor')}
            weather={weather}
            location={location}
            onRequestLocation={handleRequestLocation}
            preferences={preferences}
          />
        )}

        {activeTab === 'ecoguide' && (
          <EcoGuideTab
            initialQuery={ecoGuideQuery}
            weather={weather}
            location={location}
            onRequestLocation={handleRequestLocation}
            preferences={preferences}
            onSaveRemedy={handleSaveRemedy}
            isRemedySaved={isRemedySaved}
            onBackToWelcome={handleBackToWelcome}
          />
        )}

        {activeTab === 'advisor' && (
          <PlantAdvisorTab
            weather={weather}
            location={location}
            preferences={preferences}
            onAskEcoGuide={handleStartEcoGuide}
            onSaveRemedy={handleSaveRemedy}
            onBackToWelcome={handleBackToWelcome}
          />
        )}

        {activeTab === 'climate' && (
          <LiveClimateTab
            weather={weather}
            location={location}
            loadingLocation={loadingLocation}
            onRequestLocation={handleRequestLocation}
            onSelectCity={handleSelectCity}
            preferences={preferences}
            onOpenEcoGuideWithClimate={handleStartEcoGuide}
            onBackToWelcome={handleBackToWelcome}
          />
        )}

        {activeTab === 'remedies' && (
          <RemedyLibraryTab
            onAskEcoGuide={handleStartEcoGuide}
            onSaveRemedy={handleSaveRemedy}
            isRemedySaved={isRemedySaved}
            weather={weather}
            preferences={preferences}
            onBackToWelcome={handleBackToWelcome}
          />
        )}

        {activeTab === 'saved' && (
          <SavedRemediesTab
            savedRemedies={savedRemedies}
            onRemoveRemedy={handleRemoveRemedy}
            onClearAll={handleClearAllSaved}
            onOpenEcoGuide={handleStartEcoGuide}
            onOpenLibrary={() => setActiveTab('remedies')}
            preferences={preferences}
            onBackToWelcome={handleBackToWelcome}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-emerald-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-slate-600 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
              GreenSpace EcoGuide
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs">
              Natural recipes & climate-aware urban horticulture
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('welcome')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
            >
              Welcome
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ecoguide')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
            >
              Ask EcoGuide
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('advisor')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
            >
              Plant Advisor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('climate')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
            >
              Live Climate
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('remedies')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
            >
              Remedy Library
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
            >
              Saved ({savedRemedies.length})
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
