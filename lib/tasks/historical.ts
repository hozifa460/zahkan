/**
 * "مهمة اليوم من التاريخ"
 *
 * نجلب أحداثاً تاريخية من Wikipedia API المجاني
 * (https://api.wikimedia.org/feed/v1/wikipedia/onthisday/events)
 *
 * مجاني 100% — بدون API key، بدون حدود
 *
 * نُخزّن مؤقتاً في localStorage لتقليل الطلبات
 */

export interface HistoricalEvent {
  year: number;
  text: string;
  source?: string;
}

interface CachedEvent {
  date: string;        // MM-DD
  events: HistoricalEvent[];
  timestamp: number;
}

const CACHE_KEY = "zawhan-history-events";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // يوم واحد

/** دالة مساعدة للترجمة (بسيطة) */
const COMMON_TRANSLATIONS: Record<string, string> = {
  born: "وُلد",
  died: "توفي",
  battle: "معركة",
  war: "حرب",
  founded: "تأسست",
  discovered: "اكتُشف",
  invented: "اختُرع",
  published: "نُشر",
  signed: "وُقع",
  elected: "انتُخب",
  launched: "أُطلق",
  opened: "افتُتح",
  closed: "أُغلق",
};

/**
 * محاولة ترجمة بسيطة للنص الإنجليزي
 * (Wikipedia تُرجِم نفسها لو ضفتنا accept-language header)
 */
function tryTranslate(text: string): string {
  // محاولة سريعة: لو النص قصير وإنجليزي، نُترجمه يدوياً
  let translated = text;
  for (const [en, ar] of Object.entries(COMMON_TRANSLATIONS)) {
    const regex = new RegExp(`\\b${en}\\b`, "gi");
    translated = translated.replace(regex, ar);
  }
  return translated;
}

/**
 * جلب أحداث اليوم من Wikipedia
 * التاريخ بصيغة MM-DD
 */
export async function fetchTodayEvents(date: Date = new Date()): Promise<HistoricalEvent[]> {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateKey = `${month}-${day}`;

  // فحص الكاش أولاً
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data: CachedEvent = JSON.parse(cached);
        if (data.date === dateKey && Date.now() - data.timestamp < CACHE_DURATION) {
          return data.events;
        }
      }
    } catch {
      // ignore
    }
  }

  // جلب من Wikipedia API
  try {
    const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`;
    const response = await fetch(url, {
      headers: {
        // طلب النسخة الإنجليزية؛ نُترجم نحن يدوياً
        "Api-User-Agent": "ZawhanApp/1.0 (https://zawhan.app)",
      },
    });

    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.status}`);
    }

    const data = await response.json();
    const events: HistoricalEvent[] = (data.events || [])
      .slice(0, 10)
      .map((e: { year: number; text: string }) => ({
        year: e.year,
        text: tryTranslate(e.text),
      }));

    // حفظ في الكاش
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            date: dateKey,
            events,
            timestamp: Date.now(),
          } as CachedEvent)
        );
      } catch {
        // ignore
      }
    }

    return events;
  } catch (err) {
    // عند الفشل، نُعيد أحداثاً افتراضية مكتوبة يدوياً
    return getFallbackEvents(date);
  }
}

/**
 * أحداث احتياطية مكتوبة يدوياً (في حال فشل API)
 * نختار 3 أحداث من أشهر ما حدث في هذا اليوم
 */
function getFallbackEvents(date: Date): HistoricalEvent[] {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // قاموس صغير لأحداث مشهورة
  const known: Record<string, HistoricalEvent[]> = {
    "1-1": [
      { year: 1972, text: "ولادة الكاتب المسرحي أنطوان Chekhov" },
      { year: 1959, text: "ثورة كوبا تنجح ضد نظام باتيستا" },
    ],
    "3-8": [
      { year: 1910, text: "اليوم العالمي للمرأة" },
    ],
    "7-20": [
      { year: 1969, text: "هبوط أبولو 11 على سطح القمر" },
    ],
    "9-11": [
      { year: 2001, text: "أحداث 11 سبتمبر في الولايات المتحدة" },
    ],
    "10-29": [
      { year: 1929, text: "انهيار وول ستريت - الكساد الكبير" },
    ],
  };

  const key = `${month}-${day}`;
  return known[key] || [
    { year: 2000, text: "حدث تاريخي مميز" },
  ];
}

/**
 * تحويل الحدث التاريخي إلى مهمة تعلّم
 */
export function eventToTask(event: HistoricalEvent) {
  return {
    title: `ماذا حدث في ${event.year}؟`,
    description: `تعرّف على الحدث: ${event.text}`,
    category: "learning" as const,
    duration: 2 as const,
    energy: "low" as const,
  };
}
