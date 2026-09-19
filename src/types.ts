export type TabType = 'welcome' | 'advisor' | 'ecoguide' | 'climate' | 'remedies' | 'saved';

export type TextSizeType = 'normal' | 'large' | 'xlarge';
export type TempUnit = 'C' | 'F';

export interface UserPreferences {
  textSize: TextSizeType;
  simpleMode: boolean;
  tempUnit: TempUnit;
  darkMode: boolean;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  isLive: boolean;
}

export interface DailyForecastDay {
  date: string;
  dayName: string;
  weatherCode: number;
  weatherDescription: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  windSpeedMax: number;
  uvIndexMax?: number;
}

export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
  tempMax: number;
  tempMin: number;
  updatedAt: string;
  forecast?: DailyForecastDay[];
}

export interface UserAccount {
  username: string;
  password: string;
  createdAt: string;
  savedRemedies?: RemedyItem[];
  preferences?: UserPreferences;
}

export interface RemedyMaterial {
  item: string;
  amount: string;
}

export interface RemedyStep {
  stepNumber: number;
  title: string;
  instruction: string;
  proTip?: string;
}

export interface RemedyItem {
  id: string;
  title: string;
  remedyName: string;
  diagnosis: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  timeRequired: string;
  materials: RemedyMaterial[];
  steps: RemedyStep[];
  liveTemperatureAdvice?: string;
  preventionTips?: string[];
  safetyNotes?: string;
  speechSummary?: string;
  savedAt?: string;
  plantType?: string;
  source?: string;
}

export interface SpacePin {
  id: string;
  plantName: string;
  spot: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface PlantRecommendation {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  matchReason: string;
  idealSpot: string;
  sunlight: string;
  watering: string;
  biodiversityScore: number;
  petSafe: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  maintenance: 'Low Maintenance' | 'Moderate Maintenance' | 'High Maintenance';
  harvestOrBlooms: string;
  fullCareAdvice: string;
}

export interface SpaceDiagnosis {
  spaceTitle: string;
  greeningPotentialScore: number;
  sunlightVector: {
    badge: string;
    description: string;
  };
  windAndExposure: {
    level: string;
    details: string;
  };
  usableFootprint: {
    area: string;
    details: string;
  };
  urbanCoolingAndCO2: {
    cooling: string;
    offset: string;
  };
  identifiedInPhoto: string[];
  architecturalAdvice: string[];
  pins: SpacePin[];
  plants: PlantRecommendation[];
}

export interface PresetSpace {
  id: string;
  name: string;
  tagline: string;
  imageUrl: string;
  thumbnailUrl: string;
  diagnosis: SpaceDiagnosis;
}

export interface PresetCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
}
