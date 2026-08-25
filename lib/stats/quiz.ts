/**
 * الاختبار اليومي — "أي نوع زهقان أنت؟"
 *
 * 3 أسئلة سريعة، نتيجة شخصية + اقتراح مهام
 *
 * مكتوب يدوياً، مجاني 100%
 */

import type { Locale } from "@/lib/i18n/types";

export type BoredType = "tired" | "energetic" | "scattered" | "creative" | "seeking";

export interface BoredTypeInfo {
  id: BoredType;
  name: Record<Locale, string>;
  emoji: string;
  description: Record<Locale, string>;
  color: string;
  recommendedCategories: string[];
  tip: Record<Locale, string>;
}

export const BORED_TYPES: BoredTypeInfo[] = [
  {
    id: "tired",
    name: {
      en: "Tired Explorer",
      ar: "المستكشف المتعب",
      "ar-eg": "المستكشف التعبان",
      "ar-sa": "المستكشف التعبان",
      "ar-levant": "المستكشف المتعب",
      "ar-maghreb": "المستكشف العيان",
    },
    emoji: "😴",
    color: "#94a3b8",
    recommendedCategories: ["mindfulness", "learning"],
    description: {
      en: "Your body is asking for rest, not action.",
      ar: "جسدك يطلب الراحة، لا الحركة.",
      "ar-eg": "جسمك طالب راحة، مش حركة.",
      "ar-sa": "جسمك يطلب راحة، مو حركة.",
      "ar-levant": "جسمك عم يطلب راحة، مش حركة.",
      "ar-maghreb": "جسمك كيطلب الراحة، ماشي الحركة.",
    },
    tip: {
      en: "Try a 2-minute breathing exercise or a single page of a book.",
      ar: "جرّب تمرين تنفّس ٢ دقيقة أو صفحة واحدة من كتاب.",
      "ar-eg": "جرّب تمرين نَفَس دقيقتين أو صفحة من كتاب.",
      "ar-sa": "جرّب تمرين تنفّس دقيقتين أو صفحة من كتاب.",
      "ar-levant": "جرّب تمرين تنفّس دقيقتين ولا صفحة من كتاب.",
      "ar-maghreb": "جرّب تمرين نَفَس دقيقتين ولا صفحة من كتاب.",
    },
  },
  {
    id: "energetic",
    name: {
      en: "Energy Ball",
      ar: "كرة الطاقة",
      "ar-eg": "كورة الطاقة",
      "ar-sa": "كرة الطاقة",
      "ar-levant": "كرة الطاقة",
      "ar-maghreb": "كرة الطاقة",
    },
    emoji: "⚡",
    color: "#f59e0b",
    recommendedCategories: ["physical", "building"],
    description: {
      en: "You have energy to burn. Use it!",
      ar: "لديك طاقة لتُنفق. استخدمها!",
      "ar-eg": "عندك طاقة تتصرّف فيها. استخدمها!",
      "ar-sa": "عندك طاقة تنفقها. استخدمها!",
      "ar-levant": "عندك طاقة لتصرفها. استخدمها!",
      "ar-maghreb": "عندك طاقة تنفقها. استعملها!",
    },
    tip: {
      en: "Try a 10-minute HIIT or build something small.",
      ar: "جرّب HIIT ١٠ دقائق أو ابنِ شيئاً صغيراً.",
      "ar-eg": "جرّب HIIT ١٠ دقايق أو ابني حاجة صغيرة.",
      "ar-sa": "جرّب HIIT ١٠ دقايق أو ابني شي صغير.",
      "ar-levant": "جرّب HIIT ١٠ دقايق ولا ابني شي صغير.",
      "ar-maghreb": "جرّب HIIT ١٠ دقايق ولا ابني شي صغير.",
    },
  },
  {
    id: "scattered",
    name: {
      en: "Scattered Mind",
      ar: "الذهن المشتت",
      "ar-eg": "المخ المشتت",
      "ar-sa": "العقل المشتت",
      "ar-levant": "الذهن المشتت",
      "ar-maghreb": "المخ المشتت",
    },
    emoji: "🌀",
    color: "#8b5cf6",
    recommendedCategories: ["mental", "creative"],
    description: {
      en: "Your mind is jumping everywhere. It needs focus.",
      ar: "ذهنك يقفز في كل مكان. يحتاج تركيزاً.",
      "ar-eg": "مخك بيا في كل حتة. محتاج تركيز.",
      "ar-sa": "عقلك يروح في كل مكان. يحتاج تركيز.",
      "ar-levant": "عقلك عم يقفز بكل بلصة. محتاج تركيز.",
      "ar-maghreb": "مخك كيقفز في كل بلاصة. محتاج التركيز.",
    },
    tip: {
      en: "Try a math puzzle or a 5-minute free writing.",
      ar: "جرّب لغز رياضيات أو كتابة حرة ٥ دقائق.",
      "ar-eg": "جرّب لغز رياضيات أو كتابة حرة ٥ دقايق.",
      "ar-sa": "جرّب لغز رياضيات أو كتابة حرة ٥ دقايق.",
      "ar-levant": "جرّب لغز رياضيات أو كتابة حرة ٥ دقايق.",
      "ar-maghreb": "جرّب لغز ديال الرياضيات ولا كتابة حرة ٥ دقايق.",
    },
  },
  {
    id: "creative",
    name: {
      en: "Creative Soul",
      ar: "الروح المبدعة",
      "ar-eg": "الروح المبدعة",
      "ar-sa": "الروح المبدعة",
      "ar-levant": "الروح المبدعة",
      "ar-maghreb": "الروح المبدعة",
    },
    emoji: "🎨",
    color: "#ec4899",
    recommendedCategories: ["creative", "discovery"],
    description: {
      en: "You crave creation, not consumption.",
      ar: "تشتاق للإبداع، لا الاستهلاك.",
      "ar-eg": "بتشتاق للإبداع، مش الاستهلاك.",
      "ar-sa": "تتشوّف للإبداع، مو للاستهلاك.",
      "ar-levant": "عم تتشوّف للإبداع، مش للاستهلاك.",
      "ar-maghreb": "كتشتاق للإبداع، ماشي للاستهلاك.",
    },
    tip: {
      en: "Draw something, write a poem, or photograph the world.",
      ar: "ارسم شيئاً، اكتب قصيدة، أو صوّر العالم.",
      "ar-eg": "ارسم حاجة، اكتب قصيدة، أو صوّر الدنيا.",
      "ar-sa": "ارسم شي، اكتب قصيدة، أو صوّر الدنيا.",
      "ar-levant": "ارسم شي، اكتب قصيدة، أو صوّر الدنيا.",
      "ar-maghreb": "رسّم شي، اكتب قصيدة، ولا صور الدنيا.",
    },
  },
  {
    id: "seeking",
    name: {
      en: "Meaning Seeker",
      ar: "الباحث عن المعنى",
      "ar-eg": "اللي بيدوّر على معنى",
      "ar-sa": "اللي يبي يدوّر على معنى",
      "ar-levant": "اللي عم يدوّر على معنى",
      "ar-maghreb": "اللي كيدوّر على معنى",
    },
    emoji: "🔍",
    color: "#eab308",
    recommendedCategories: ["discovery", "learning", "building"],
    description: {
      en: "You want meaning, not just activity.",
      ar: "تريد معنى، لا مجرد نشاط.",
      "ar-eg": "عايز معنى، مش مجرد نشاط.",
      "ar-sa": "تبي معنى، مو بس نشاط.",
      "ar-levant": "بدك معنى، مش مجرّد نشاط.",
      "ar-maghreb": "بغيتي معنى، ماشي غير نشاط.",
    },
    tip: {
      en: "Try a deep question, a new place, or a 10-minute coding session.",
      ar: "جرّب سؤالاً عميقاً، مكاناً جديداً، أو جلسة برمجة ١٠ دقائق.",
      "ar-eg": "جرّب سؤال عميق، مكان جديد، أو جلسة برمجة ١٠ دقايق.",
      "ar-sa": "جرّب سؤال عميق، مكان جديد، أو جلسة برمجة ١٠ دقايق.",
      "ar-levant": "جرّب سؤال عميق، مكان جديد، ولا جلسة برمجة ١٠ دقايق.",
      "ar-maghreb": "جرّب سؤال عميق، بلاصة جديدة، ولا جلسة برمجة ١٠ دقايق.",
    },
  },
];

export interface QuizQuestion {
  id: string;
  text: Record<Locale, string>;
  /** 5 خيارات، كل واحد يوافق على نوع معيّن */
  options: QuizOption[];
}

export interface QuizOption {
  text: Record<Locale, string>;
  type: BoredType;
  emoji: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "energy",
    text: {
      en: "How does your body feel right now?",
      ar: "كيف يشعر جسدك الآن؟",
      "ar-eg": "جسمك حاسس بإيه دلوقتي؟",
      "ar-sa": "جسمك كيف حاسس الحين؟",
      "ar-levant": "جسمك كيف حاسس هلأ؟",
      "ar-maghreb": "جسمك كيفاش حاسس دابا؟",
    },
    options: [
      {
        text: {
          en: "Exhausted, want to lie down",
          ar: "مُنهك، أريد أن أستلقي",
          "ar-eg": "مفروش، عايز اتنط",
          "ar-sa": "تعبان، أبي استلقي",
          "ar-levant": "مفروش، بدي اتنط",
          "ar-maghreb": "مفروش، بغي نتّكأ",
        },
        type: "tired",
        emoji: "😴",
      },
      {
        text: {
          en: "Energized, want to move",
          ar: "نشيط، أريد أن أتحرك",
          "ar-eg": "طاقتي عالية، عايز اتحرك",
          "ar-sa": "طاقتي عالية، أبي اتحرّك",
          "ar-levant": "طاقتي عالية، بدي اتحرّك",
          "ar-maghreb": "طاقتي عالية، بغي نتحرّك",
        },
        type: "energetic",
        emoji: "⚡",
      },
      {
        text: {
          en: "Restless but tired",
          ar: "قلق لكن متعب",
          "ar-eg": "مش مرتاح بس تعبان",
          "ar-sa": "مو مرتاح بس تعبان",
          "ar-levant": "مش مرتاح بس تعبان",
          "ar-maghreb": "ما مرتاحش بس عيان",
        },
        type: "scattered",
        emoji: "🌀",
      },
    ],
  },
  {
    id: "mood",
    text: {
      en: "What do you crave right now?",
      ar: "ماذا تشتهي الآن؟",
      "ar-eg": "إيه اللي بتشتهيه دلوقتي؟",
      "ar-sa": "وش اللي تتشوّفه الحين؟",
      "ar-levant": "شو اللي عم تتشوّفه هلأ؟",
      "ar-maghreb": "أشنو اللي كتشتهيه دابا؟",
    },
    options: [
      {
        text: {
          en: "Calm, quiet, slow",
          ar: "هدوء، سكينة، بطء",
          "ar-eg": "هدوء، سكينة، ببطء",
          "ar-sa": "هدوء وسكينة وراحة",
          "ar-levant": "هدوء وسكينة وبطء",
          "ar-maghreb": "هدوء وسكينة وبطء",
        },
        type: "tired",
        emoji: "🧘",
      },
      {
        text: {
          en: "Make something new",
          ar: "اصنع شيئاً جديداً",
          "ar-eg": "اعمل حاجة جديدة",
          "ar-sa": "اسوِ شي جديد",
          "ar-levant": "اعمل شي جديد",
          "ar-maghreb": "دير شي جديد",
        },
        type: "creative",
        emoji: "✨",
      },
      {
        text: {
          en: "Discover or learn something",
          ar: "اكتشف أو تعلّم شيئاً",
          "ar-eg": "اكتشف أو اتعلم حاجة",
          "ar-sa": "اكتشف أو تعلّم شي",
          "ar-levant": "اكتشف أو تعلّم شي",
          "ar-maghreb": "اكتشف ولا تعلّم شي",
        },
        type: "seeking",
        emoji: "🔍",
      },
    ],
  },
  {
    id: "time",
    text: {
      en: "What do you have time for?",
      ar: "ماذا لديك وقت لفعله؟",
      "ar-eg": "عندك وقت لإيه؟",
      "ar-sa": "عندك وقت لأي شي؟",
      "ar-levant": "شو عندك وقت إله؟",
      "ar-maghreb": "شنو عندك وقت باش ديرو؟",
    },
    options: [
      {
        text: {
          en: "2 minutes, no more",
          ar: "دقيقتان، لا أكثر",
          "ar-eg": "دقيقتين، مفيش أكتر",
          "ar-sa": "دقيقتين، مو أكثر",
          "ar-levant": "دقيقتين، مش أكتر",
          "ar-maghreb": "دقيقتين، ماشي أكثر",
        },
        type: "tired",
        emoji: "⏱️",
      },
      {
        text: {
          en: "10 minutes, focused",
          ar: "١٠ دقائق، بتركيز",
          "ar-eg": "١٠ دقايق، بتركيز",
          "ar-sa": "١٠ دقايق، بتركيز",
          "ar-levant": "١٠ دقايق، بتركيز",
          "ar-maghreb": "١٠ دقايق، بتركيز",
        },
        type: "energetic",
        emoji: "⏰",
      },
      {
        text: {
          en: "30+ minutes, dive deep",
          ar: "٣٠+ دقيقة، اغمر بعمق",
          "ar-eg": "٣٠+ دقيقة، ادخل بعمق",
          "ar-sa": "٣٠+ دقيقة، ادخل بعمق",
          "ar-levant": "٣٠+ دقيقة، ادخل بعمق",
          "ar-maghreb": "٣٠+ دقيقة، ادخل بعمق",
        },
        type: "seeking",
        emoji: "🌊",
      },
    ],
  },
];

export function getBoredTypeById(id: BoredType): BoredTypeInfo {
  return BORED_TYPES.find((t) => t.id === id) || BORED_TYPES[0];
}

/** يحسب النوع من إجابات الاختبار */
export function calculateBoredType(answers: Record<string, BoredType>): BoredType {
  const counts: Record<string, number> = {};
  Object.values(answers).forEach((type) => {
    counts[type] = (counts[type] || 0) + 1;
  });
  let maxType: BoredType = "seeking";
  let maxCount = 0;
  for (const [type, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxType = type as BoredType;
    }
  }
  return maxType;
}
