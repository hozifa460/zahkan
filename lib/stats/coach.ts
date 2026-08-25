/**
 * مدرب الزهق — شخصية "زيد" الصديق
 *
 * رسائل ذكية حسب:
 * - الوقت من آخر إنجاز
 * - السلسلة الحالية
 * - عدد المهام المنجزة اليوم
 * - المزاج المسجَّل
 *
 * كل الرسائل مكتوبة يدوياً × 6 لغات
 */

import type { Locale } from "@/lib/i18n/types";

export type CoachMood = "happy" | "neutral" | "worried" | "proud" | "excited";

export interface CoachMessage {
  text: Record<Locale, string>;
  emoji: string;
  mood: CoachMood;
  /** نوع الموقف */
  context:
    | "welcome"           // عند فتح التطبيق
    | "morning"           // صباحاً
    | "evening"           // مساءً
    | "afterTask"         // بعد مهمة منجزة
    | "streakBroken"      // السلسلة انقطعت
    | "streakStrong"      // السلسلة طويلة
    | "noTasksToday"      // لم ينجز شيئاً اليوم
    | "firstTask"         // أول مهمة
    | "tenthTask"         // المهمة العاشرة
    | "comeback"          // عاد بعد غياب
    | "lowMood"           // مزاج متعب
    | "celebrate"         // إنجاز كبير
    | "gentle";            // تذكير لطيف
}

/** الرسائل حسب السياق */
export const COACH_MESSAGES: CoachMessage[] = [
  // ترحيب
  {
    text: {
      en: "Hey! Zaid here. Ready to build something?",
      ar: "مرحباً! أنا زيد. مستعد تبني شيئاً؟",
      "ar-eg": "أهلاً! أنا زيد. جاهز تبني حاجة؟",
      "ar-sa": "هلا! أنا زيد. مستعد تبني شي؟",
      "ar-levant": "هلا! أنا زيد. جاهز تبني شي؟",
      "ar-maghreb": "أهلا! أنا زيد. مستعد تبني شي؟",
    },
    emoji: "👋",
    mood: "happy",
    context: "welcome",
  },

  // صباحاً
  {
    text: {
      en: "Morning! A small task now = peaceful day.",
      ar: "صباح الخير! مهمة صغيرة الآن = يوم هادئ.",
      "ar-eg": "صباح الفل! حاجة صغيرة دلوقتي = يوم هادي.",
      "ar-sa": "صباح الخير! شي صغير الحين = يوم هادي.",
      "ar-levant": "صباح الخير! شي صغير هلأ = يوم هادي.",
      "ar-maghreb": "صباح الخير! شي صغير دابا = يوم هادي.",
    },
    emoji: "🌅",
    mood: "happy",
    context: "morning",
  },

  // مساءً
  {
    text: {
      en: "Evening. Wrap up the day with one small win.",
      ar: "مساء الخير. اختم اليوم بفوز صغير.",
      "ar-eg": "مساء النور. اختم اليوم بفوز صغير.",
      "ar-sa": "مساء الخير. اختم يومك بفوز صغير.",
      "ar-levant": "مساء الخير. ختم يومك بفوز صغير.",
      "ar-maghreb": "مساء الخير. ختم نهارك بفوز صغير.",
    },
    emoji: "🌙",
    mood: "neutral",
    context: "evening",
  },

  // بعد مهمة
  {
    text: {
      en: "Nice! You built something. How does it feel?",
      ar: "رائع! بنيت شيئاً. كيف تشعر؟",
      "ar-eg": "تمام! بنيت حاجة. حاسس بإيه؟",
      "ar-sa": "تمام! بنيت شي. كيف حاسس؟",
      "ar-levant": "تمام! بنيت شي. كيف حاسس؟",
      "ar-maghreb": "مزيان! بنيت شي. كيفاش حاسس؟",
    },
    emoji: "✨",
    mood: "proud",
    context: "afterTask",
  },

  // سلسلة انقطعت
  {
    text: {
      en: "Hey, no worries. Streaks restart. Try one small thing today?",
      ar: "لا تقلق. السلاسل تبدأ من جديد. جرّب شيئاً صغيراً اليوم؟",
      "ar-eg": "متقلقش. السلاسل بتبدأ من جديد. جرّب حاجة صغيرة النهاردة؟",
      "ar-sa": "لا تشيل همّ. السلاسل تبلّش من جديد. جرّب شي صغير اليوم؟",
      "ar-levant": "ما تشيل همّ. السلاسل بترجع. جرّب شي صغير اليوم؟",
      "ar-maghreb": "ما تقلقش. السلاسل كتبدا من جديد. جرّب شي صغير اليوم؟",
    },
    emoji: "🤗",
    mood: "worried",
    context: "streakBroken",
  },

  // سلسلة قوية
  {
    text: {
      en: "🔥 {streak} days! You're building a real habit.",
      ar: "🔥 {streak} يوم متتالية! أنت تبني عادة حقيقية.",
      "ar-eg": "🔥 {streak} يوم ورا بعض! انت بتبني عادة حقيقية.",
      "ar-sa": "🔥 {streak} يوم ورا بعض! أنت تبني عادة حقيقية.",
      "ar-levant": "🔥 {streak} يوم ورا بعض! إنت عم تبني عادة حقيقية.",
      "ar-maghreb": "🔥 {streak} يوم ورا بعض! نتا كتبني عادة حقيقية.",
    },
    emoji: "🔥",
    mood: "excited",
    context: "streakStrong",
  },

  // لم ينجز اليوم
  {
    text: {
      en: "No tasks today yet. Just 2 minutes?",
      ar: "لا مهام اليوم. دقيقتان فقط؟",
      "ar-eg": "مفيش مهام النهاردة لسه. دقيقتين بس؟",
      "ar-sa": "ما سوّيت شي اليوم. دقيقتين بس؟",
      "ar-levant": "ما سوّيت شي اليوم. دقيقتين بس؟",
      "ar-maghreb": "ما سوّيت والو اليوم. دقيقتين غير؟",
    },
    emoji: "💭",
    mood: "neutral",
    context: "noTasksToday",
  },

  // أول مهمة
  {
    text: {
      en: "First task! This is where it begins.",
      ar: "أول مهمة! هنا تبدأ الرحلة.",
      "ar-eg": "أول مهمة! هنا الرحلة بتبدأ.",
      "ar-sa": "أوّل مهمة! هنا الرحلة تبلّش.",
      "ar-levant": "أوّل مهمة! هون الرحلة بتبلّش.",
      "ar-maghreb": "أوّل مهمة! هنا الرحلة كتبدا.",
    },
    emoji: "🌱",
    mood: "excited",
    context: "firstTask",
  },

  // المهمة العاشرة
  {
    text: {
      en: "10 tasks! You're getting the hang of this.",
      ar: "١٠ مهام! أنت بدأت تتقن هذا.",
      "ar-eg": "١٠ مهام! انت بقيت فاهم الموضوع.",
      "ar-sa": "١٠ مهام! أنت صرت فاهم الموضوع.",
      "ar-levant": "١٠ مهام! إنت صرت فاهم الموضوع.",
      "ar-maghreb": "١٠ مهام! نتا بقيتي فاهم الموضوع.",
    },
    emoji: "💪",
    mood: "proud",
    context: "tenthTask",
  },

  // عودة بعد غياب
  {
    text: {
      en: "Welcome back! The door was always open.",
      ar: "أهلاً بعودتك! الباب كان مفتوحاً دائماً.",
      "ar-eg": "أهلاً بعودتك! الباب كان مفتوح طول الوقت.",
      "ar-sa": "هلا بعودتك! الباب كان مفتوح دايم.",
      "ar-levant": "هلا بعودتك! الباب كان مفتوح دايماً.",
      "ar-maghreb": "أهلا بعودتك! الباب كان مفتوح ديما.",
    },
    emoji: "🌟",
    mood: "happy",
    context: "comeback",
  },

  // مزاج متعب
  {
    text: {
      en: "Feeling tired? Try something gentle — even 2 minutes counts.",
      ar: "تشعر بالتعب؟ جرّب شيئاً لطيفاً — حتى دقيقتان تُحسب.",
      "ar-eg": "تعبان؟ جرّب حاجة هادية — حتى دقيقتين بتفرق.",
      "ar-sa": "تعبان؟ جرّب شي هادي — حتى دقيقتين تحسب.",
      "ar-levant": "تعبان؟ جرّب شي هادي — حتى دقيقتين منحسب.",
      "ar-maghreb": "عيان؟ جرّب شي هادي — حتى دقيقتين كتحسب.",
    },
    emoji: "🤲",
    mood: "worried",
    context: "lowMood",
  },

  // احتفال
  {
    text: {
      en: "🎉 Big win! You did it. Take a moment to feel that.",
      ar: "🎉 فوز كبير! فعلتها. خذ لحظة لتشعر بهذا.",
      "ar-eg": "🎉 فوز كبير! عملتها. خد لحظة تحس بكده.",
      "ar-sa": "🎉 فوز كبير! سويتها. خذ لحظة تحس بذا.",
      "ar-levant": "🎉 فوز كبير! عملتها. خد لحظة تحس فيه.",
      "ar-maghreb": "🎉 فوز كبير! ديرها. خود لحظة باش تحس بيه.",
    },
    emoji: "🎉",
    mood: "excited",
    context: "celebrate",
  },

  // تذكير لطيف
  {
    text: {
      en: "Just a thought: small steps still move you forward.",
      ar: "فكرة بسيطة: خطوات صغيرة لا تزال تُحرّكك للأمام.",
      "ar-eg": "بس فكرة: خطوات صغيرة برضو بتقدّمك لقدام.",
      "ar-sa": "بس فكرة: خطوات صغيرة لا تزاودك للأمام.",
      "ar-levant": "بس فكرة: خطوات صغيرة بتضل عم تحرّكك للأمام.",
      "ar-maghreb": "غير فكرة: خطوات صغار لا تال كتحرّكك للقدام.",
    },
    emoji: "🌿",
    mood: "neutral",
    context: "gentle",
  },
];

/**
 * يختار رسالة مناسبة حسب السياق
 */
export function getCoachMessage(context: CoachMessage["context"], locale: Locale = "ar-eg", vars: Record<string, string | number> = {}): CoachMessage {
  const candidates = COACH_MESSAGES.filter((m) => m.context === context);
  if (candidates.length === 0) {
    return COACH_MESSAGES[0];
  }
  const message = candidates[Math.floor(Math.random() * candidates.length)];
  // استبدال المتغيرات
  let text = message.text[locale];
  for (const [key, value] of Object.entries(vars)) {
    text = text.replace(`{${key}}`, String(value));
  }
  return { ...message, text: { ...message.text, [locale]: text } };
}
