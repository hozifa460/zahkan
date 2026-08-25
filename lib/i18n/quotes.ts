/**
 * جمل تحفيزية قصيرة تظهر فوق زر "حوّلها"
 * تتغيّر في كل دخول للصفحة الرئيسية
 * مرتّبة حسب الحالة: طاقة / هدوء / تحفيز / حكمة
 */

import type { Locale } from "./types";

export interface MotivationalQuote {
  text: Record<Locale, string>;
  emoji: string;
}

export const QUOTES: MotivationalQuote[] = [
  // تحفيز عام
  {
    text: {
      en: "Every minute is a new beginning.",
      ar: "كل دقيقة بداية جديدة.",
      "ar-eg": "كل دقيقة بداية جديدة.",
      "ar-sa": "كل دقيقة بداية جديدة.",
      "ar-levant": "كل دقيقة بداية جديدة.",
      "ar-maghreb": "كل دقيقة بداية جديدة.",
    },
    emoji: "✨",
  },
  {
    text: {
      en: "Small steps, big changes.",
      ar: "خطوات صغيرة، تغييرات كبيرة.",
      "ar-eg": "خطوة صغيرة، تغيير كبير.",
      "ar-sa": "خطوات صغيرة، تغييرات كبيرة.",
      "ar-levant": "خطوات صغيرة، تغييرات كبيرة.",
      "ar-maghreb": "خطوات صغار، تغييرات كبار.",
    },
    emoji: "🌱",
  },
  {
    text: {
      en: "Build something, not scroll something.",
      ar: "ابنه شيء، لا تستعرض شيء.",
      "ar-eg": "ابني حاجة، ماتسكرولش حاجة.",
      "ar-sa": "ابنه شي، لا تستعرض شي.",
      "ar-levant": "ابنه شي، لا تتصفّح شي.",
      "ar-maghreb": "بني شي، ما تصفّحش شي.",
    },
    emoji: "🛠️",
  },
  {
    text: {
      en: "Your future is built in moments like these.",
      ar: "مستقبلك يُبنى في لحظات كهذه.",
      "ar-eg": "مستقبلك بيتعمل في لحظات زي دي.",
      "ar-sa": "مستقبلك يُبنى في لحظات كيذا.",
      "ar-levant": "مستقبلك بينبني بلحظات هيك.",
      "ar-maghreb": "المستقبل ديالك كيتبنى فحظات كيهدو.",
    },
    emoji: "🚀",
  },
  {
    text: {
      en: "What will you create today?",
      ar: "ماذا ستصنع اليوم؟",
      "ar-eg": "إيه اللي هتعمله النهاردة؟",
      "ar-sa": "وش رح تسوي اليوم؟",
      "ar-levant": "شو رح تعمل اليوم؟",
      "ar-maghreb": "أشنو غادي تصنع اليوم؟",
    },
    emoji: "🎨",
  },
  {
    text: {
      en: "Boredom is the gateway to creation.",
      ar: "الملل بوابة الإبداع.",
      "ar-eg": "الملل بداية الإبداع.",
      "ar-sa": "الملل بداية الإبداع.",
      "ar-levant": "الملل بداية الإبداع.",
      "ar-maghreb": "الملل بداية الإبداع.",
    },
    emoji: "🚪",
  },
  {
    text: {
      en: "Two minutes is enough to start.",
      ar: "دقيقتان تكفيان للبداية.",
      "ar-eg": "دقيقتين يكفوا تبدأ.",
      "ar-sa": "دقيقتين تكفي تبدأ.",
      "ar-levant": "دقيقتين بتكفي تبلّش.",
      "ar-maghreb": "دقيقتين كافيين تبدا.",
    },
    emoji: "⚡",
  },
  {
    text: {
      en: "Done is better than perfect.",
      ar: "المنجز أفضل من المثالي.",
      "ar-eg": "اللي خلصته أحسن من المثالي.",
      "ar-sa": "المنجز أحسن من المثالي.",
      "ar-levant": "المنتهي أحسن من المثالي.",
      "ar-maghreb": "اللي ساليتيه أحسن من الكامل.",
    },
    emoji: "✓",
  },
  {
    text: {
      en: "You are what you do, not what you plan.",
      ar: "أنت ما تفعله، لا ما تخطط له.",
      "ar-eg": "أنت اللي بتعمله، مش اللي بتخططله.",
      "ar-sa": "أنت اللي تسويه، مو اللي تخطط له.",
      "ar-levant": "إنت اللي بتعمله، مش اللي بتخططله.",
      "ar-maghreb": "نتا اللي كتديرو، ماشي اللي كتخطط ليه.",
    },
    emoji: "💪",
  },
  {
    text: {
      en: "Start before you're ready.",
      ar: "ابدأ قبل أن تكون جاهزاً.",
      "ar-eg": "ابدأ قبل ما تبقى جاهز.",
      "ar-sa": "ابدأ قبل ما تكون جاهز.",
      "ar-levant": "ابدأ قبل ما تكون جاهز.",
      "ar-maghreb": "ابدا قبل ما تكون مستعد.",
    },
    emoji: "🎯",
  },
  {
    text: {
      en: "Bored? That's your signal to begin.",
      ar: "زهقان؟ تلك إشارتك للبداية.",
      "ar-eg": "زهقان؟ دي إشارة إنك تبدأ.",
      "ar-sa": "زهقان؟ ذي إشارتك تبلّش.",
      "ar-levant": "زهقان؟ هاي إشارتك تبلّش.",
      "ar-maghreb": "زهقان؟ هادي الإشارة ديالك باش تبدا.",
    },
    emoji: "💡",
  },
  {
    text: {
      en: "Make today count.",
      ar: "اجعل اليوم ذا معنى.",
      "ar-eg": "خلي النهاردة يفرق.",
      "ar-sa": "خلّ اليوم ذا قيمة.",
      "ar-levant": "خلّي اليوم هاد يحسب.",
      "ar-maghreb": "خلي النهار هاد يحسب.",
    },
    emoji: "⭐",
  },
  {
    text: {
      en: "Energy in motion is better than perfect plans.",
      ar: "الطاقة في حركة أفضل من خطط مثالية.",
      "ar-eg": "طاقة متحركة أحسن من خطط كاملة.",
      "ar-sa": "طاقة متحرّكة أحسن من خطط كاملة.",
      "ar-levant": "طاقة عم تتحرك أحسن من خطط كاملة.",
      "ar-maghreb": "الطاقة في الحركة أحسن من الخطط الكاملة.",
    },
    emoji: "🔋",
  },
  {
    text: {
      en: "One task, fully done, beats ten half-done.",
      ar: "مهمة واحدة منجزة تغلب عشر ناقصة.",
      "ar-eg": "مهمة واحدة خلصتها أحسن من عشرة ناقصين.",
      "ar-sa": "مهمة وحدة خلّصتها تغلب عشرة ناقصين.",
      "ar-levant": "مهمة وحدة منتهية بتغلب عشرة ناقصين.",
      "ar-maghreb": "مهمة وحدة سالينها كتفوق عشرة ناقصين.",
    },
    emoji: "🏁",
  },
  {
    text: {
      en: "Boredom is calling. Answer with action.",
      ar: "الملل ينادي. أجبه بالفعل.",
      "ar-eg": "الملل بينده. رد عليه بفعل.",
      "ar-sa": "الملل ينده. رد عليه بفعل.",
      "ar-levant": "الملل عم ينده. ردّ عليه بفعل.",
      "ar-maghreb": "الملل كينده. جاوبو بفعل.",
    },
    emoji: "📞",
  },
  // طاقة
  {
    text: {
      en: "Your energy is a resource. Spend it wisely.",
      ar: "طاقتك مورد. أنفقها بحكمة.",
      "ar-eg": "طاقتك ديال resource. صرّفها بحكمة.",
      "ar-sa": "طاقتك مورد. أنفقها بحكمة.",
      "ar-levant": "طاقتك مورد. صرفها بحكمة.",
      "ar-maghreb": "طاقتك مورد. استعملها بحكمة.",
    },
    emoji: "⚡",
  },
  {
    text: {
      en: "Move your body. Wake your mind.",
      ar: "حرّك جسدك. أيقظ عقلك.",
      "ar-eg": "حرّك جسمك. صحّي عقلك.",
      "ar-sa": "حرّك جسمك. أيقظ عقلك.",
      "ar-levant": "حرّك جسمك. صحّي عقلك.",
      "ar-maghreb": "حرّك جسمك. صحّي عقلك.",
    },
    emoji: "🏃",
  },
  // هدوء
  {
    text: {
      en: "Stillness is also progress.",
      ar: "السكينة تقدّم أيضاً.",
      "ar-eg": "السكون كمان تقدّم.",
      "ar-sa": "السكينة كمان تقدّم.",
      "ar-levant": "السكينة كمان تقدّم.",
      "ar-maghreb": "السكينة حتى هي تقدّم.",
    },
    emoji: "🧘",
  },
  {
    text: {
      en: "Pause. Breathe. Begin.",
      ar: "توقف. تنفّس. ابدأ.",
      "ar-eg": "وقّف. خد نفس. ابدأ.",
      "ar-sa": "وقّف. تنفّس. ابدأ.",
      "ar-levant": "وقّف. تنفّس. ابلّش.",
      "ar-maghreb": "وقف. تنفس. ابدا.",
    },
    emoji: "🌿",
  },
  {
    text: {
      en: "Slow is smooth. Smooth is fast.",
      ar: "البطيء أملس. الأملس سريع.",
      "ar-eg": "البطيء سلس. السلس سريع.",
      "ar-sa": "البطيء أملس. الأملس سريع.",
      "ar-levant": "البطيء أملس. الأملس سريع.",
      "ar-maghreb": "البطيء ناعم. الناعم سريع.",
    },
    emoji: "🌊",
  },
  // تعلّم
  {
    text: {
      en: "Curiosity is your compass.",
      ar: "الفضول بوصلتك.",
      "ar-eg": "الفضول بوصلك.",
      "ar-sa": "الفضول بوصلتك.",
      "ar-levant": "الفضول بوصلتك.",
      "ar-maghreb": "الفضول البوصلة ديالك.",
    },
    emoji: "🧭",
  },
  {
    text: {
      en: "Learn one thing. That's enough.",
      ar: "تعلّم شيئاً واحداً. هذا يكفي.",
      "ar-eg": "تعلم حاجة واحدة. ده يكفي.",
      "ar-sa": "تعلّم شي واحد. هذا يكفي.",
      "ar-levant": "تعلّم شي واحد. هاد بكفي.",
      "ar-maghreb": "تعلّم شي واحد. هاد كافي.",
    },
    emoji: "📚",
  },
  // بناء
  {
    text: {
      en: "Make, don't consume.",
      ar: "اصنع، لا تستهلك.",
      "ar-eg": "اعمل، ماتستهلكش.",
      "ar-sa": "اسوِ، لا تستهلك.",
      "ar-levant": "اعمل، ما تستهلك.",
      "ar-maghreb": "دير، ما تستهلكش.",
    },
    emoji: "🔨",
  },
  {
    text: {
      en: "Your hands are made for building.",
      ar: "يداك للبناء.",
      "ar-eg": "إيدك معمولة عشان تبتني.",
      "ar-sa": "يديك للبناء.",
      "ar-levant": "إيديك للبناء.",
      "ar-maghreb": "يديك مصنوعين باش تبني.",
    },
    emoji: "👐",
  },
  // اكتشاف
  {
    text: {
      en: "Notice what you never noticed.",
      ar: "لاحظ ما لم تلاحظه من قبل.",
      "ar-eg": "لاحظ اللي ما لاحظتهوش قبل كده.",
      "ar-sa": "لاحظ اللي ما لاحظته قبل.",
      "ar-levant": "لاحظ اللي ما لاحظته قبل.",
      "ar-maghreb": "لاحظ اللي ما لاحظتيهش من قبل.",
    },
    emoji: "🔍",
  },
  {
    text: {
      en: "Look up. Look around. Look closer.",
      ar: "انظر للأعلى. للأعلى. للأقرب.",
      "ar-eg": "بص لفوق. حواليك. قرّب.",
      "ar-sa": "طالع لفوق. حواليك. قرّب.",
      "ar-levant": "طالع لفوق. حواليك. قرّب.",
      "ar-maghreb": "بصّ لفوق. حواليك. قرّب.",
    },
    emoji: "👀",
  },
  // إبداع
  {
    text: {
      en: "Create imperfectly. Perfect later.",
      ar: "اصنع بلا كمال. الكمال لاحقاً.",
      "ar-eg": "اعمل من غير ما تبقى كامل. الكمال بعدين.",
      "ar-sa": "اسوِ مو كامل. الكمال بعدين.",
      "ar-levant": "اعمل مش كامل. الكمال بعدين.",
      "ar-maghreb": "دير بلا ما تكون كامل. الكمال من بعد.",
    },
    emoji: "🎨",
  },
  {
    text: {
      en: "The blank page is a friend, not a wall.",
      ar: "الصفحة الفارغة صديق، لا جدار.",
      "ar-eg": "الصفحة الفاضية صاحب، مش حيطة.",
      "ar-sa": "الصفحة الفاضية صاحب، مو جدار.",
      "ar-levant": "الصفحة الفاضية صاحب، مش جدار.",
      "ar-maghreb": "الصفحة الفارغة صاحب، ماشي حيطة.",
    },
    emoji: "📄",
  },
  // ختام
  {
    text: {
      en: "Now is the only time you own.",
      ar: "الآن هو الوقت الوحيد الذي تملكه.",
      "ar-eg": "دلوقتي هو الوقت الوحيد اللي بتاعك.",
      "ar-sa": "الحين هو الوقت الوحيد اللي تملكه.",
      "ar-levant": "هلق هو الوقت الوحيد اللي إلك.",
      "ar-maghreb": "دابا هو الوقت الوحيد اللي عندك.",
    },
    emoji: "⏰",
  },
  {
    text: {
      en: "Future you is watching.",
      ar: "أنت في المستقبل يراقبك.",
      "ar-eg": "إنت في المستقبل بيراقبك.",
      "ar-sa": "أنت بالمستقبل يراقبك.",
      "ar-levant": "إنت بالمستقبل عم يراقبك.",
      "ar-maghreb": "نتا فالمستقبل كيراقبك.",
    },
    emoji: "👁️",
  },
];

/** اختر جملة عشوائية بناءً على seed (مثلاً تاريخ اليوم) */
export function getRandomQuote(seed?: number): MotivationalQuote {
  const actualSeed = seed ?? Date.now();
  const index = actualSeed % QUOTES.length;
  return QUOTES[index];
}

/** جملة اليوم — نفس الجملة طوال اليوم */
export function getTodayQuote(): MotivationalQuote {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return getRandomQuote(dayOfYear);
}
