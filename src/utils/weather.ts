import { DailyForecastDay, LocationData, PresetCity, WeatherData } from '../types';

export const PRESET_CITIES: PresetCity[] = [
  { name: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Berlin', country: 'Germany', lat: 52.52, lon: 13.405 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'New Delhi', country: 'India', lat: 28.6139, lon: 77.209 },
  { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lon: -46.6333 },
];

export function getWeatherCondition(code: number): { text: string; icon: string } {
  switch (code) {
    case 0:
      return { text: 'Clear Sky', icon: 'Sun' };
    case 1:
      return { text: 'Mainly Clear', icon: 'SunMedium' };
    case 2:
      return { text: 'Partly Cloudy', icon: 'CloudSun' };
    case 3:
      return { text: 'Overcast', icon: 'Cloud' };
    case 45:
    case 48:
      return { text: 'Foggy', icon: 'CloudFog' };
    case 51:
    case 53:
    case 55:
      return { text: 'Light Drizzle', icon: 'CloudDrizzle' };
    case 61:
    case 63:
    case 65:
      return { text: 'Rain', icon: 'CloudRain' };
    case 71:
    case 73:
    case 75:
      return { text: 'Snowfall', icon: 'Snowflake' };
    case 80:
    case 81:
    case 82:
      return { text: 'Rain Showers', icon: 'CloudRainWind' };
    case 95:
    case 96:
    case 99:
      return { text: 'Thunderstorm', icon: 'CloudLightning' };
    default:
      return { text: 'Partly Cloudy', icon: 'CloudSun' };
  }
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max&forecast_days=7&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch weather: ${res.statusText}`);
  }
  const data = await res.json();
  const current = data.current;
  const daily = data.daily;
  const cond = getWeatherCondition(current.weather_code);

  const forecastDays: DailyForecastDay[] = [];
  if (daily && daily.time && Array.isArray(daily.time)) {
    for (let i = 0; i < daily.time.length; i++) {
      const dateStr = daily.time[i];
      const wCode = daily.weather_code?.[i] ?? 0;
      const c = getWeatherCondition(wCode);

      let dayName = 'Day';
      try {
        if (i === 0) {
          dayName = 'Today';
        } else if (i === 1) {
          dayName = 'Tomorrow';
        } else {
          const dateObj = new Date(dateStr + 'T00:00:00');
          dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        }
      } catch {
        dayName = `Day ${i + 1}`;
      }

      forecastDays.push({
        date: dateStr,
        dayName,
        weatherCode: wCode,
        weatherDescription: c.text,
        tempMax: daily.temperature_2m_max?.[i] != null ? Math.round(daily.temperature_2m_max[i]) : Math.round(current.temperature_2m),
        tempMin: daily.temperature_2m_min?.[i] != null ? Math.round(daily.temperature_2m_min[i]) : Math.round(current.temperature_2m),
        precipitationProbability: daily.precipitation_probability_max?.[i] != null ? Math.round(daily.precipitation_probability_max[i]) : 0,
        windSpeedMax: daily.wind_speed_10m_max?.[i] != null ? Math.round(daily.wind_speed_10m_max[i]) : Math.round(current.wind_speed_10m),
        uvIndexMax: daily.uv_index_max?.[i] != null ? Math.round(daily.uv_index_max[i] * 10) / 10 : undefined,
      });
    }
  }

  return {
    temperature: Math.round(current.temperature_2m),
    apparentTemperature: Math.round(current.apparent_temperature),
    humidity: Math.round(current.relative_humidity_2m),
    windSpeed: Math.round(current.wind_speed_10m),
    weatherCode: current.weather_code,
    weatherDescription: cond.text,
    isDay: current.is_day === 1,
    tempMax: daily?.temperature_2m_max?.[0] ? Math.round(daily.temperature_2m_max[0]) : Math.round(current.temperature_2m + 3),
    tempMin: daily?.temperature_2m_min?.[0] ? Math.round(daily.temperature_2m_min[0]) : Math.round(current.temperature_2m - 4),
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    forecast: forecastDays,
  };
}

export async function reverseGeocode(lat: number, lon: number): Promise<{ city: string; country: string }> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en' },
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || addr.state || 'Local Region';
      const country = addr.country || '';
      return { city, country };
    }
  } catch {
    // Fallback if network or CORS restricts nominatim
  }
  return {
    city: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`,
    country: '',
  };
}

export interface TemperatureAdvisory {
  status: 'warning' | 'caution' | 'ideal';
  title: string;
  advice: string;
  wateringGuideline: string;
  sprayAdvisory: string;
}

export function getTemperatureAdvisory(celsius: number): TemperatureAdvisory {
  if (celsius >= 32) {
    return {
      status: 'warning',
      title: 'Intense Heat Advisory (Over 32°C)',
      advice: 'Plants face high evaporation stress. Provide afternoon shade for tender vegetables and indoor plants near south-facing windows.',
      wateringGuideline: 'Deep soak early morning before 8 AM or after 7 PM at dusk. Never water hot dry leaves directly in midday.',
      sprayAdvisory: 'DO NOT spray neem oil or organic foliar feeds today! Oil drops act as lenses under hot sun and cause severe leaf burn.',
    };
  }

  if (celsius >= 27) {
    return {
      status: 'caution',
      title: 'Warm Summer Weather (27°C - 31°C)',
      advice: 'Good active plant growth. Mulch container tops with wood chips or straw to keep root systems cool.',
      wateringGuideline: 'Water thoroughly early in the day. Ensure drainage trays are emptied so roots do not stew in heated stagnant water.',
      sprayAdvisory: 'Apply any pest remedies or foliar fertilizer strictly at dusk after the direct sun has receded.',
    };
  }

  if (celsius >= 18) {
    return {
      status: 'ideal',
      title: 'Optimal Growing Conditions (18°C - 26°C)',
      advice: 'Prime photosynthesis temperature! Perfect balance for transplanting, soil feeding, and foliar treatments.',
      wateringGuideline: 'Maintain steady, standard moisture. Let top 1-2 inches of soil dry between waterings.',
      sprayAdvisory: 'Safest window to apply organic remedies, compost tea, or beneficial neem treatments.',
    };
  }

  if (celsius >= 10) {
    return {
      status: 'caution',
      title: 'Cool Autumn/Spring Weather (10°C - 17°C)',
      advice: 'Plant growth slows down. Tropical indoor plants should be kept away from chilly drafts and window panes.',
      wateringGuideline: 'Reduce watering frequency by 30-40%. Roots take much longer to absorb water in cool soil.',
      sprayAdvisory: 'Foliar sprays dry slower; ensure good air circulation to avoid persistent damp leaves.',
    };
  }

  return {
    status: 'warning',
    title: 'Cold / Frost Alert (Below 10°C)',
    advice: 'Cold shock risk. Bring all potted succulents, tropicals, and tender herbs indoors into a warm bright room.',
    wateringGuideline: 'Water sparingly with room-temperature water. Avoid cold tap water which shocks root filaments.',
    sprayAdvisory: 'Do not apply wet leaf treatments outdoors. Keep plants dry to prevent fungal frost damage.',
  };
}
