/**
 * مهام الطقس — مبنية على الطقس الفعلي للمستخدم
 *
 * المصدر: Open-Meteo API (مجاني 100%، بدون مفتاح، بدون حدود)
 * https://api.open-meteo.com/
 */

export interface WeatherData {
  temperature: number;    // °C
  weatherCode: number;    // WMO code
  isDay: boolean;
}

export type WeatherCondition =
  | "hot"        // > 30°C
  | "warm"       // 20-30°C
  | "mild"       // 10-20°C
  | "cold"       // 0-10°C
  | "freezing"   // < 0°C
  | "rainy"
  | "snowy"
  | "cloudy"
  | "clear";

/** خريطة رموز الطقس WMO */
const WMO_MAP: Record<number, WeatherCondition> = {
  0: "clear",
  1: "clear",
  2: "cloudy",
  3: "cloudy",
  45: "cloudy",
  48: "cloudy",
  51: "rainy",
  53: "rainy",
  55: "rainy",
  61: "rainy",
  63: "rainy",
  65: "rainy",
  71: "snowy",
  73: "snowy",
  75: "snowy",
  77: "snowy",
  80: "rainy",
  81: "rainy",
  82: "rainy",
  85: "snowy",
  86: "snowy",
  95: "rainy",
  96: "rainy",
  99: "rainy",
};

/** تحويل الحرارة إلى فئة */
function tempToCategory(temp: number, condition: WeatherCondition): WeatherCondition {
  // الأولوية للحالة (مطر/ثلج) على الحرارة
  if (condition === "rainy" || condition === "snowy") return condition;
  if (temp > 30) return "hot";
  if (temp > 20) return "warm";
  if (temp > 10) return "mild";
  if (temp > 0) return "cold";
  return "freezing";
}

/**
 * جلب الطقس الحالي من Open-Meteo (مجاني)
 */
export async function fetchWeather(lat: number = 30.0444, lon: number = 31.2357): Promise<WeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    const current = data.current || {};
    return {
      temperature: current.temperature_2m ?? 20,
      weatherCode: current.weather_code ?? 0,
      isDay: current.is_day === 1,
    };
  } catch {
    return null;
  }
}

/** فئة الطقس من البيانات */
export function getWeatherCondition(weather: WeatherData): WeatherCondition {
  const condition = WMO_MAP[weather.weatherCode] || "clear";
  return tempToCategory(weather.temperature, condition);
}

/** اسم الفئة بالعربية */
export function getWeatherLabel(condition: WeatherCondition, locale: "ar" | "en" = "ar"): string {
  const labels: Record<WeatherCondition, Record<string, string>> = {
    hot: { ar: "حار", en: "Hot" },
    warm: { ar: "دافئ", en: "Warm" },
    mild: { ar: "معتدل", en: "Mild" },
    cold: { ar: "بارد", en: "Cold" },
    freezing: { ar: "مثلّج", en: "Freezing" },
    rainy: { ar: "ممطر", en: "Rainy" },
    snowy: { ar: "ثلجي", en: "Snowy" },
    cloudy: { ar: "غائم", en: "Cloudy" },
    clear: { ar: "صحو", en: "Clear" },
  };
  return labels[condition][locale];
}

/** الأيقونة */
export function getWeatherEmoji(condition: WeatherCondition): string {
  const emojis: Record<WeatherCondition, string> = {
    hot: "🥵",
    warm: "☀️",
    mild: "🌤️",
    cold: "🧥",
    freezing: "🥶",
    rainy: "🌧️",
    snowy: "❄️",
    cloudy: "☁️",
    clear: "☀️",
  };
  return emojis[condition];
}

/** نصيحة حسب الطقس */
export function getWeatherTip(condition: WeatherCondition, locale: "ar" | "en" = "ar"): string {
  const tips: Record<WeatherCondition, Record<string, string>> = {
    hot: { ar: "الجو حار. اشرب ماء وابقَ في الظل.", en: "It's hot. Drink water and stay in shade." },
    warm: { ar: "الجو دافئ. وقت مثالي للمشي في الخارج.", en: "It's warm. Great time for a walk outside." },
    mild: { ar: "الجو معتدل. مناسب لأي نشاط.", en: "It's mild. Perfect for any activity." },
    cold: { ar: "الجو بارد. ارتدِ طبقات.", en: "It's cold. Wear layers." },
    freezing: { ar: "الجو مثلّج. ابقَ دافئاً.", en: "It's freezing. Stay warm." },
    rainy: { ar: "الجو ممطر. تمرّن في الداخل.", en: "It's rainy. Exercise indoors." },
    snowy: { ar: "الجو ثلجي. استمتع من النافذة.", en: "It's snowy. Enjoy from the window." },
    cloudy: { ar: "الجو غائم. ضوء خافت للنشاط الهادئ.", en: "It's cloudy. Soft light for calm activity." },
    clear: { ar: "الجو صحو. استمتع بالسماء.", en: "It's clear. Enjoy the sky." },
  };
  return tips[condition][locale];
}
