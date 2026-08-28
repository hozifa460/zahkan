/**
 * "العكس" — عادة سيئة → بديل إيجابي بسيط
 *
 * فلسفة: التغيير يبدأ بخطوة صغيرة (2-5 دقايق).
 * الاستمرار أهم من الكمال.
 *
 * البنية: كل عادة سيئة عندها 3 بدائل يختار منهم المستخدم.
 * البدائل مرتبة من الأسهل للأصعب.
 */

export type BadHabitId =
  | "scrolling"
  | "late-sleep"
  | "sugar"
  | "procrastination"
  | "smoking";

export interface ReverseHabit {
  id: BadHabitId;
  badHabit: string;        // العادة السيئة
  icon: string;
  /** بدائل إيجابية مرتبة من الأسهل */
  alternatives: Array<{
    title: string;
    description: string;
    duration: 2 | 5;       // دقائق — خفيف جداً
    category: "habit-mind" | "habit-body" | "habit-sleep" | "habit-productivity";
  }>;
}

export const REVERSE_HABITS: ReverseHabit[] = [
  {
    id: "scrolling",
    badHabit: "تصفح تيك توك أو إنستجرام 30 دقيقة",
    icon: "📱",
    alternatives: [
      {
        title: "اكتب 3 أفكار في دفترك",
        description: "افتح Notes واكتب 3 أفكار تخطر ببالك الآن",
        duration: 2,
        category: "habit-mind",
      },
      {
        title: "اقرأ صفحة من كتاب",
        description: "افتح كتابك المفضل واقرأ صفحة واحدة فقط",
        duration: 2,
        category: "habit-mind",
      },
      {
        title: "امشِ 5 دقائق بدون موبايل",
        description: "اخرج أو امشِ في المكان بدون هاتف",
        duration: 5,
        category: "habit-body",
      },
    ],
  },
  {
    id: "late-sleep",
    badHabit: "تنام متأخراً عن موعدك",
    icon: "🌙",
    alternatives: [
      {
        title: "أطفئ الشاشات الآن",
        description: "أغلق الموبايل والتلفزيون فوراً",
        duration: 2,
        category: "habit-sleep",
      },
      {
        title: "5 تمارين تنفس عميق",
        description: "تنفّس 4-7-8: شهيق 4 ث، حبس 7 ث، زفير 8 ث",
        duration: 2,
        category: "habit-sleep",
      },
      {
        title: "جهّز ملابس الغد + أطفئ الأنوار",
        description: "خطوة عملية تجعلك تنام أسرع",
        duration: 5,
        category: "habit-productivity",
      },
    ],
  },
  {
    id: "sugar",
    badHabit: "أكل حلويات أو سكريات",
    icon: "🍬",
    alternatives: [
      {
        title: "اشرب كوب ماء",
        description: "كوب ماء كامل — العطش أحياناً يُفهم كجوع",
        duration: 2,
        category: "habit-body",
      },
      {
        title: "كوب ماء + ليمونة",
        description: "ماء دافئ + شريحة ليمون — يكسر الرغبة",
        duration: 2,
        category: "habit-body",
      },
      {
        title: "كُل قطعة فاكهة",
        description: "تفاحة أو موزة — حلاوة طبيعية بدون سكر مضاف",
        duration: 2,
        category: "habit-body",
      },
    ],
  },
  {
    id: "procrastination",
    badHabit: "تأجيل مهمة مهمة لليوم التالي",
    icon: "⏰",
    alternatives: [
      {
        title: "ابدأ 5 دقائق فقط",
        description: "فقط 5 دقائق — بعدها تقدر توقف بدون ذنب",
        duration: 5,
        category: "habit-productivity",
      },
      {
        title: "اكتب أول خطوة صغيرة",
        description: "اكتب في دفتر: ما أول شيء يمكنني فعله الآن؟",
        duration: 2,
        category: "habit-mind",
      },
      {
        title: "رتّب مكتبك 2 دقيقة",
        description: "ترتيب سريع يفتح عقلك للمهم",
        duration: 2,
        category: "habit-productivity",
      },
    ],
  },
  {
    id: "smoking",
    badHabit: "تدخين سيجارة",
    icon: "🚭",
    alternatives: [
      {
        title: "5 تمارين تنفس عميق",
        description: "تنفّس عميق يكسر الرغبة خلال دقيقة",
        duration: 2,
        category: "habit-body",
      },
      {
        title: "اشرب ماء ببطء",
        description: "كوب ماء كامل بجرعات صغيرة",
        duration: 2,
        category: "habit-body",
      },
      {
        title: "امشِ 5 دقائق خارج البيت",
        description: "غيّر المكان — الرغبة ستمر بسرعة",
        duration: 5,
        category: "habit-body",
      },
    ],
  },
];

/** يحول بديل مختار لمهمة عادية يمكن إرسالها للـ Timer */
export function alternativeToTask(badHabitId: BadHabitId, altIndex: number) {
  const habit = REVERSE_HABITS.find((h) => h.id === badHabitId);
  if (!habit) return null;
  const alt = habit.alternatives[altIndex];
  if (!alt) return null;
  return {
    id: `reverse-${badHabitId}-${altIndex}`,
    title: alt.title,
    description: alt.description,
    duration: alt.duration,
    category: alt.category,
  };
}
