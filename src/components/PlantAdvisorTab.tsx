import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  MapPin,
  RefreshCw,
  Sun,
  Wind,
  Layers,
  Thermometer,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  Bookmark,
  Check,
  HelpCircle,
  X,
  Compass,
  Droplet,
  Heart,
  AlertTriangle,
} from 'lucide-react';
import {
  LocationData,
  PlantRecommendation,
  PresetSpace,
  RemedyItem,
  SpaceDiagnosis,
  SpacePin,
  UserPreferences,
  WeatherData,
} from '../types';
import { PRESET_SPACES } from '../data/presetSpaces';

interface PlantAdvisorTabProps {
  weather: WeatherData | null;
  location: LocationData | null;
  preferences: UserPreferences;
  onAskEcoGuide: (query: string) => void;
  onSaveRemedy: (remedy: RemedyItem) => void;
  onBackToWelcome?: () => void;
}

export const PlantAdvisorTab: React.FC<PlantAdvisorTabProps> = ({
  weather,
  location,
  preferences,
  onAskEcoGuide,
  onSaveRemedy,
  onBackToWelcome,
}) => {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('sunny-balcony');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customImageLoading, setCustomImageLoading] = useState(false);

  // Surface zones for pins
  const surfaceZones = [
    { y: 58, spot: 'Front Railing / Balustrade Planter' },
    { y: 78, spot: 'Corner Deck Floor Container' },
    { y: 66, spot: 'Window Ledge / Railing Shelf' },
    { y: 84, spot: 'Patio Paver Planter' },
  ];

  const sanitizePins = (pins: SpacePin[], plants?: PlantRecommendation[]): SpacePin[] => {
    if (!Array.isArray(pins) || pins.length === 0) {
      if (!plants || plants.length === 0) return [];
      return plants.slice(0, 3).map((p, idx) => ({
        id: `pin-auto-${idx + 1}`,
        plantName: p.name,
        spot: p.idealSpot || surfaceZones[idx % surfaceZones.length].spot,
        x: 28 + idx * 24,
        y: surfaceZones[idx % surfaceZones.length].y,
      }));
    }

    return pins.map((pin, idx) => {
      let x = typeof pin.x === 'number' ? Math.max(14, Math.min(86, Math.round(pin.x))) : 30 + idx * 22;
      let y = typeof pin.y === 'number' ? Math.round(pin.y) : surfaceZones[idx % surfaceZones.length].y;
      let spot = pin.spot;

      if (y < 50) {
        y = surfaceZones[idx % surfaceZones.length].y;
        if (!spot || spot.toLowerCase().includes('sky') || spot.toLowerCase().includes('air')) {
          spot = surfaceZones[idx % surfaceZones.length].spot;
        }
      } else {
        y = Math.max(50, Math.min(88, y));
      }

      return {
        ...pin,
        spot: spot || surfaceZones[idx % surfaceZones.length].spot,
        x,
        y,
      };
    });
  };

  const [diagnosis, setDiagnosis] = useState<SpaceDiagnosis>(() => ({
    ...PRESET_SPACES[0].diagnosis,
    pins: sanitizePins(PRESET_SPACES[0].diagnosis.pins, PRESET_SPACES[0].diagnosis.plants),
  }));

  const [showPins, setShowPins] = useState(true);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [draggingPinId, setDraggingPinId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);

  // Filters and adjustments
  const [orientation, setOrientation] = useState('South-facing');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Pollinators & Bees',
    'Edible Herbs & Teas',
  ]);
  const [petSafeOnly, setPetSafeOnly] = useState(false);
  const [irrigation, setIrrigation] = useState('Manual watering');
  const [windExposure, setWindExposure] = useState('High sheer');

  // Plants filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'default' | 'biodiversity' | 'maintenance' | 'difficulty'>('default');

  // Camera modal
  const [showCameraModal, setShowCameraModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Select Preset Space
  const handleSelectPreset = (space: PresetSpace) => {
    setSelectedSpaceId(space.id);
    setCustomImage(null);
    setDiagnosis({
      ...space.diagnosis,
      pins: sanitizePins(space.diagnosis.pins, space.diagnosis.plants),
    });
    setActivePinId(null);
    showToast(`Loaded ${space.name}`);
  };

  // Dragging pin logic
  const handlePinPointerDown = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setDraggingPinId(id);
    setActivePinId(id);
  };

  const handleStagePointerMove = (clientX: number, clientY: number) => {
    if (!draggingPinId || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const xPct = Math.max(14, Math.min(86, Math.round(((clientX - rect.left) / rect.width) * 100)));
    let yPct = Math.round(((clientY - rect.top) / rect.height) * 100);

    if (yPct < 50) {
      yPct = 50;
    } else {
      yPct = Math.min(88, yPct);
    }

    let spotName = 'Balcony / Deck Planter';
    if (yPct < 64) spotName = 'Balustrade / Railing Planter Bar';
    else if (yPct < 76) spotName = 'Window Ledge / Railing Shelf';
    else spotName = 'Floor / Deck Corner Container';

    setDiagnosis((prev) => ({
      ...prev,
      pins: prev.pins.map((p) =>
        p.id === draggingPinId ? { ...p, x: xPct, y: yPct, spot: spotName } : p
      ),
    }));
  };

  const handlePointerUp = () => {
    if (draggingPinId) {
      setDraggingPinId(null);
      showToast('📍 Pin anchored to surface!');
    }
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (draggingPinId) handleStagePointerMove(e.clientX, e.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (draggingPinId && e.touches[0]) {
        handleStagePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onEnd = () => {
      if (draggingPinId) handlePointerUp();
    };

    if (draggingPinId) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [draggingPinId]);

  // Reset pins to surfaces
  const handleResetPins = () => {
    const defaultCoords = [
      { y: 58, spot: 'Front Railing / Balustrade Planter', x: 32 },
      { y: 78, spot: 'Corner Deck Floor Container', x: 72 },
      { y: 66, spot: 'Window Ledge / Railing Stand', x: 52 },
      { y: 84, spot: 'Patio Paver Planter', x: 42 },
    ];

    setDiagnosis((prev) => ({
      ...prev,
      pins: prev.pins.map((p, idx) => ({
        ...p,
        x: defaultCoords[idx % defaultCoords.length].x,
        y: defaultCoords[idx % defaultCoords.length].y,
        spot: defaultCoords[idx % defaultCoords.length].spot,
      })),
    }));
    showToast('📍 Pins reset to standard surface zones');
  };

  // Image scaling helper
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          const maxDim = 1280;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(reader.result as string);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload image handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCustomImageLoading(true);
      const base64 = await processImageFile(file);
      setCustomImage(base64);
      setSelectedSpaceId('custom-space');
      await triggerVisionAnalysis(base64, file.name);
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Could not process photo.');
    } finally {
      setCustomImageLoading(false);
    }
  };

  // Webcam capture modal
  const openCamera = async () => {
    setShowCameraModal(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      showToast('Camera permission denied or camera not found.');
      setShowCameraModal(false);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCameraModal(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64 = canvas.toDataURL('image/jpeg', 0.88);
      closeCamera();
      setCustomImage(base64);
      setSelectedSpaceId('custom-camera');
      await triggerVisionAnalysis(base64, 'Live Balcony Capture');
    }
  };

  // Trigger Vision analysis
  const triggerVisionAnalysis = async (imgBase64: string, spaceTitleName: string) => {
    setCustomImageLoading(true);
    try {
      const payload = {
        imageBase64: imgBase64,
        spaceTitle: spaceTitleName,
        adjustments: {
          orientation,
          goals: selectedGoals,
          petSafeOnly,
          irrigation,
          windExposure,
        },
        liveClimate: {
          temperature: weather?.temperature,
          tempUnit: preferences.tempUnit,
          city: location?.city,
        },
      };

      const res = await fetch('/api/plant-advisor/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to analyze photo.');
      const data = await res.json();

      if (data.success && data.data) {
        setDiagnosis({
          ...data.data,
          pins: sanitizePins(data.data.pins, data.data.plants),
        });
        showToast('✨ Gemini Vision completed spatial greening analysis!');
      }
    } catch (err) {
      console.error('Vision analysis error:', err);
      showToast('Vision analysis error. Displaying curated spatial assessment.');
    } finally {
      setCustomImageLoading(false);
    }
  };

  // Toggle goals
  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  // Filtered and sorted plants
  const filteredPlants = diagnosis.plants.filter((p) => {
    if (petSafeOnly && !p.petSafe) return false;
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.scientificName.toLowerCase().includes(q) ||
        p.matchReason.toLowerCase().includes(q) ||
        p.idealSpot.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const sortedPlants = [...filteredPlants].sort((a, b) => {
    if (sortBy === 'biodiversity') return b.biodiversityScore - a.biodiversityScore;
    if (sortBy === 'maintenance') {
      const order: Record<string, number> = {
        'Low Maintenance': 1,
        'Moderate Maintenance': 2,
        'High Maintenance': 3,
      };
      return (order[a.maintenance] || 2) - (order[b.maintenance] || 2);
    }
    if (sortBy === 'difficulty') {
      const order: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };
      return (order[a.difficulty] || 2) - (order[b.difficulty] || 2);
    }
    return 0;
  });

  const activePreset = PRESET_SPACES.find((s) => s.id === selectedSpaceId);
  const activeImage = customImage || activePreset?.imageUrl || PRESET_SPACES[0].imageUrl;

  const categories = [
    'All',
    'Herb & Edible',
    'Flowering Pollinator',
    'Air Purifier',
    'Drought Tolerant',
    'Foliage Shade',
    'Compact Fruit & Veg',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-500/50 flex items-center gap-2 text-xs sm:text-sm font-semibold animate-fadeIn">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Space Selector */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-emerald-100 dark:border-slate-800 shadow-sm transition-colors space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                Gemini Vision Spatial Engine
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Microclimate & Surface Mapping
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Domestic Space Plant Advisor
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Select a sample domestic microclimate below or upload/photograph your balcony to receive tailored botanical recommendations with interactive placement pins.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onBackToWelcome && (
              <button
                type="button"
                onClick={onBackToWelcome}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Back to Welcome
              </button>
            )}

            <label
              htmlFor="upload-balcony-input"
              className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
              <input
                id="upload-balcony-input"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={openCamera}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-200 dark:shadow-emerald-900/50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Live</span>
            </button>
          </div>
        </div>

        {/* Preset Sample Spaces Switcher */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Select Preset Architectural Space:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {PRESET_SPACES.map((space) => {
              const isSelected = selectedSpaceId === space.id && !customImage;
              return (
                <button
                  key={space.id}
                  type="button"
                  onClick={() => handleSelectPreset(space)}
                  className={`p-2 rounded-2xl border text-left transition-all cursor-pointer group flex flex-col gap-2 select-none ${
                    isSelected
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/40'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                  }`}
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <img
                      src={space.thumbnailUrl}
                      alt={space.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {space.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {space.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Image Stage & Spatial Diagnosis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Photo Stage (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="rounded-3xl bg-slate-900 overflow-hidden border border-slate-800 shadow-xl relative select-none">
            {/* Stage Controls Header */}
            <div className="p-4 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{diagnosis.spaceTitle}</span>
                </span>
                {customImageLoading && (
                  <span className="text-[11px] text-amber-300 animate-pulse">
                    Analyzing photo with Gemini Vision...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPins(!showPins)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                    showPins
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {showPins ? 'Hide Placement Pins' : 'Show Placement Pins'}
                </button>

                <button
                  type="button"
                  onClick={handleResetPins}
                  title="Reset pins to standard container zones"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Photo Canvas */}
            <div
              ref={stageRef}
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950 overflow-hidden cursor-crosshair"
            >
              <img
                src={activeImage}
                alt="Selected Garden Space"
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />

              {/* Pins Overlay */}
              {showPins &&
                diagnosis.pins.map((pin, idx) => {
                  const isActive = activePinId === pin.id;
                  const isDragging = draggingPinId === pin.id;

                  return (
                    <div
                      key={pin.id}
                      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                      onMouseDown={(e) => handlePinPointerDown(pin.id, e)}
                      onTouchStart={(e) => handlePinPointerDown(pin.id, e)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform ${
                        isDragging ? 'scale-125 z-30' : 'hover:scale-110'
                      }`}
                    >
                      {/* Pin Marker */}
                      <div
                        className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-xl border-2 transition-all cursor-grab active:cursor-grabbing ${
                          isActive
                            ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-400/40'
                            : 'bg-emerald-500 text-white border-white'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="whitespace-nowrap max-w-[130px] truncate text-[11px]">
                          {pin.plantName}
                        </span>
                      </div>

                      {/* Tooltip on Hover / Active */}
                      {isActive && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-[11px] shadow-2xl border border-slate-700 whitespace-nowrap z-40 pointer-events-none">
                          <p className="font-bold text-amber-300">{pin.plantName}</p>
                          <p className="text-slate-300">{pin.spot}</p>
                        </div>
                      )}
                    </div>
                  );
                })}

              {/* Drag instruction notice */}
              <div className="absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-sm text-slate-300 text-[11px] border border-slate-800 flex items-center gap-1.5">
                <span>💡 Tip: Click and drag numbered pins to adjust pot placements onto surfaces</span>
              </div>
            </div>
          </div>

          {/* Vision Adjustments Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 border border-emerald-100 dark:border-slate-800 shadow-sm transition-colors space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-500" />
              <span>Microclimate Customizer & Gardening Intent</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Solar Orientation
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <option value="South-facing">South-Facing (Intense Direct Sun)</option>
                  <option value="East-facing">East-Facing (Gentle Morning Sun)</option>
                  <option value="West-facing">West-Facing (Hot Afternoon Sun)</option>
                  <option value="North-facing">North-Facing (Bright Indirect Shade)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Balcony Wind Exposure
                </label>
                <select
                  value={windExposure}
                  onChange={(e) => setWindExposure(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <option value="Low / Sheltered">Low / Sheltered Courtyard</option>
                  <option value="Moderate">Moderate Balustrade Airflow</option>
                  <option value="High sheer">High Altitude Wind Sheer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Irrigation System
                </label>
                <select
                  value={irrigation}
                  onChange={(e) => setIrrigation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <option value="Manual watering">Manual Can Watering</option>
                  <option value="Self-watering reservoir">Sub-Irrigated Self-Watering Pots</option>
                  <option value="Drip system">Automated Micro-Drip Line</option>
                </select>
              </div>
            </div>

            {/* Goals chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Gardening Goals (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Pollinators & Bees',
                  'Edible Herbs & Teas',
                  'Compact Fruit & Veg',
                  'Air Purifying Foliage',
                  'Drought Tolerant',
                  'Foliage Shade',
                ].map((goal) => {
                  const active = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                        active
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {goal}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pet Safe Toggle & Re-analyze button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={petSafeOnly}
                  onChange={(e) => setPetSafeOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  🐾 Filter strictly non-toxic (Pet-Safe for Cats & Dogs)
                </span>
              </label>

              <button
                type="button"
                onClick={() => triggerVisionAnalysis(activeImage, diagnosis.spaceTitle)}
                disabled={customImageLoading}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Update Spatial Analysis</span>
              </button>
            </div>
          </div>
        </div>

        {/* Spatial Microclimate Diagnosis (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-7 border border-emerald-100 dark:border-slate-800 shadow-sm transition-colors space-y-5">
            {/* Greening Potential Score */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Greening Potential Score
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                    {diagnosis.greeningPotentialScore}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">/ 100</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Prime Microclimate
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Urban Cooling Impact
                </span>
                <p className="text-xs font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                  {diagnosis.urbanCoolingAndCO2.cooling}
                </p>
                <p className="text-[10px] text-slate-400">
                  {diagnosis.urbanCoolingAndCO2.offset}
                </p>
              </div>
            </div>

            {/* Sunlight & Thermal Vector */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                  {diagnosis.sunlightVector.badge}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                {diagnosis.sunlightVector.description}
              </p>
            </div>

            {/* Wind & Usable Footprint */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                  {diagnosis.windAndExposure.level}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                {diagnosis.windAndExposure.details}
              </p>
            </div>

            {/* Container Layout Footprint */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                  {diagnosis.usableFootprint.area}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                {diagnosis.usableFootprint.details}
              </p>
            </div>

            {/* Detected Elements in Photo */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Identified Surfaces in Domestic Space
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {diagnosis.identifiedInPhoto.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Architectural Recommendations */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Architectural Placement Strategy
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-900/80 dark:text-emerald-200">
                {diagnosis.architecturalAdvice.map((advice, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                    <span>{advice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Botanical Species Section */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 border border-emerald-100 dark:border-slate-800 shadow-sm transition-colors space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Tailored Botanical Recommendations ({sortedPlants.length})
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Matched strictly against detected light angles, surface wind sheer, and container depths.
            </p>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search species or herbs..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white cursor-pointer"
            >
              <option value="default">Sort: Default Match</option>
              <option value="biodiversity">Sort: Biodiversity Score</option>
              <option value="maintenance">Sort: Low Maintenance First</option>
              <option value="difficulty">Sort: Beginner First</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                categoryFilter === cat
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Species Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPlants.map((plant) => (
            <div
              key={plant.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {plant.name}
                    </h4>
                    <p className="text-xs italic text-slate-500 dark:text-slate-400">
                      {plant.scientificName}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase whitespace-nowrap">
                    Score: {plant.biodiversityScore}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                    {plant.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                      plant.petSafe
                        ? 'bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {plant.petSafe ? '🐾 Pet-Safe' : '⚠️ Keep away from pets'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                    {plant.maintenance}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {plant.matchReason}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <p className="text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Ideal Spot: {plant.idealSpot}</span>
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    ☀️ {plant.sunlight} • 💧 {plant.watering}
                  </p>
                </div>

                {plant.harvestOrBlooms && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                    🌸 <strong>Blooms/Harvest:</strong> {plant.harvestOrBlooms}
                  </p>
                )}
              </div>

              {/* Card Actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={() => onAskEcoGuide(`How to care for ${plant.name} on my domestic balcony?`)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask EcoGuide</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const fakeRemedy: RemedyItem = {
                      id: `plant-care-${plant.id}`,
                      title: `${plant.name} Domestic Container Care`,
                      remedyName: `${plant.name} Growth Protocol`,
                      diagnosis: `Care guide for ${plant.name} (${plant.scientificName}) placed in ${plant.idealSpot}.`,
                      difficulty: plant.difficulty === 'Beginner' ? 'Easy' : plant.difficulty === 'Intermediate' ? 'Moderate' : 'Advanced',
                      timeRequired: '15 mins monthly upkeep',
                      materials: [
                        { item: 'Well-draining potting soil with pumice', amount: '1 container volume' },
                        { item: 'Organic liquid feed', amount: '1 capful monthly' },
                      ],
                      steps: [
                        {
                          stepNumber: 1,
                          title: 'Potting & Placement',
                          instruction: `Place in ${plant.idealSpot} with ${plant.sunlight}. Ensure drainage holes are unblocked.`,
                          proTip: 'Add 1 inch of pebble mulch on top to retain soil moisture.',
                        },
                        {
                          stepNumber: 2,
                          title: 'Watering Regimen',
                          instruction: plant.fullCareAdvice,
                          proTip: 'Never water in the heat of midday.',
                        },
                      ],
                      plantType: plant.name,
                      savedAt: new Date().toISOString(),
                    };
                    onSaveRemedy(fakeRemedy);
                  }}
                  className="w-full sm:w-auto py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
                  title="Save care notes to saved list"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-xl w-full text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <span>Live Balcony Capture</span>
              </h3>
              <button
                type="button"
                onClick={closeCamera}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-400">
                Position your camera towards your balcony railings or container floor.
              </p>
              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg cursor-pointer"
              >
                Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
