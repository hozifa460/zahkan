/**
 * المهام المزدوجة — تحديات مكوّنة من مهمتين قصيرتين
 *
 * كل تحدي = مهمتان من فئتين مختلفتين، معاً يكوّنان جلسة متوازنة
 */

import type { Task, TaskDuration, TaskCategory, LocalizedText } from "@/lib/tasks";
import { t, tSteps } from "@/lib/tasks";
import { CATEGORIES } from "@/lib/tasks";

export interface DoubleTaskChallenge {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  emoji: string;
  /** أول مهمة (تُنفّذ أولاً) */
  task1: Task;
  /** ثاني مهمة (تُنفّذ بعدها مباشرة) */
  task2: Task;
  /** مكافأة XP إضافية لإكمال الاثنين معاً */
  bonusXp: number;
  totalDuration: TaskDuration;
  categories: [TaskCategory, TaskCategory];
}

export const DOUBLE_TASKS: DoubleTaskChallenge[] = [
  // 1) تنفس + كتابة = "صفاء وتعبير"
  {
    id: "breathe-write",
    title: t(
      "Calm & Express",
      "صفاء وتعبير",
      "صفاء وتعبير",
      "صفاء وتعبير",
      "صفاء وتعبير",
      "صفاء وتعبير"
    ),
    description: t(
      "Breathe deeply, then write how you feel.",
      "تنفّس بعمق، ثم اكتب ما تشعر به.",
      "خد نفس عميق، واكتب اللي حاسس بيه.",
      "تنفّس بعمق، ثم اكتب وش تحس.",
      "تنفّس بعمق، ثم اكتب شو حاسس.",
      "تنفّس بعمق، ثم اكتب أشنو كتحس.",
    ),
    emoji: "🧘✍️",
    bonusXp: 10,
    totalDuration: 10,
    categories: ["mindfulness", "creative"],
    task1: {
      id: "breathe-478",
      category: "mindfulness",
      duration: 2,
      energy: "low",
      title: t(
        "Breathe 4-7-8",
        "تنفّس 4-7-8",
        "خد نفس 4-7-8",
        "تنفّس 4-7-8",
        "تنفّس 4-7-8",
        "تنفّس 4-7-8"
      ),
      description: t(
        "Calm your nervous system in 2 minutes.",
        "اهدأ جهازك العصبي في دقيقتين.",
        "اهدّي أعصابك في دقيقتين.",
        "اهدأ أعصابك في دقيقتين.",
        "اهدأ أعصابك في دقيقتين.",
        "هدّي أعصابك في دقيقتين."
      ),
      steps: tSteps(
        [
          "Sit comfortably, back straight.",
          "Close your eyes.",
          "Inhale through nose for 4 seconds.",
          "Hold breath for 7 seconds.",
          "Exhale through mouth for 8 seconds.",
          "Repeat 4 times.",
        ],
        [
          "اجلس بشكل مريح، ظهرك مستقيم.",
          "أغمض عينيك.",
          "شهيق من الأنف ٤ ثوانٍ.",
          "احبس النفس ٧ ثوانٍ.",
          "زفير من الفم ٨ ثوانٍ.",
          "كرر ٤ مرات.",
        ],
        [
          "اتكي براحتك، ضهرك معتدل.",
          "قفل عينيك.",
          "خد نفس من بوزك ٤ ثواني.",
          "امسك ٧ ثواني.",
          "طلّع النفس من بقي ٨ ثواني.",
          "اعمل الحركة ٤ مرات.",
        ],
        [
          "اتّكئ براحتك، ظهرك معتدل.",
          "سكّر عيونك.",
          "شهيق من أنفك ٤ ثواني.",
          "احبس النفس ٧ ثواني.",
          "زفير من ثمّك ٨ ثواني.",
          "كرّرها ٤ مرّات.",
        ],
        [
          "اجلس منيح، ضهرك منتصب.",
          "سكّر عيونك.",
          "شهيق من أنفك ٤ ثواني.",
          "احبس ٧ ثواني.",
          "زفير من فمّك ٨ ثواني.",
          "كرّر ٤ مرّات.",
        ],
        [
          "اقعد مزيان، ظهرك معتدل.",
          "سدّ عينيك.",
          "شهيق من الخشم ٤ ثواني.",
          "احبس ٧ ثواني.",
          "زفير من الفم ٨ ثواني.",
          "عاودها ٤ مرّات.",
        ]
      ),
      output: t(
        "A calmer nervous system.",
        "جهاز عصبي أكثر هدوءاً.",
        "أعصابك هتكون أهدى.",
        "أعصابك بتكون أهدأ.",
        "أعصابك رح تكون أهدأ.",
        "الأعصاب غادي تكون أهدأ."
      ),
      difficulty: 1,
      tags: ["breathing", "calm", "quick"],
      xp: 5,
    },
    task2: {
      id: "poem-line",
      category: "creative",
      duration: 2,
      energy: "low",
      title: t(
        "One line of poetry",
        "بيت شعر واحد",
        "سطر شعر واحد",
        "سطر شعر واحد",
        "سطر شعر واحد",
        "سطر شِعر واحد"
      ),
      description: t(
        "Write one line about your day.",
        "اكتب سطراً واحداً عن يومك.",
        "اكتب سطر واحد عن يومك.",
        "اكتب سطر واحد عن يومك.",
        "اكتب سطر واحد عن يومك.",
        "اكتب سطر واحد على نهارك."
      ),
      steps: tSteps(
        [
          "Think of how today felt.",
          "Pick one image or moment.",
          "Write it as a single poetic line.",
          "Don't edit, just write.",
          "Read it aloud.",
        ],
        [
          "فكّر كيف كان يومك.",
          "اختر صورة أو لحظة واحدة.",
          "اكتبها كسطر شعري واحد.",
          "لا تعدّل، فقط اكتب.",
          "اقرأه بصوت عالٍ.",
        ],
        [
          "فكّر يومك كان عامل إزاي.",
          "اختار صورة أو لحظة واحدة.",
          "اكتبها كسطر شعري واحد.",
          "ماتعدلش، اكتب بس.",
          "اقراه بصوت عالي.",
        ],
        [
          "فكّر كيف كان يومك.",
          "اختار صورة أو لحظة وحدة.",
          "اكتبها كسطر شعري واحد.",
          "لا تعدّل، اكتب فقط.",
          "اقرأه بصوت عالي.",
        ],
        [
          "فكّر كيف كان يومك.",
          "اختار صورة ولا لحظة وحدة.",
          "اكتبها كسطر شعري واحد.",
          "ما تعدّل، اكتب فقط.",
          "اقراه بصوت عالي.",
        ],
        [
          "فكّر نهارك كان كيفاش.",
          "اختار صورة ولا لحظة وحدة.",
          "اكتبها كسطر شعري واحد.",
          "ما تعدّلش، اكتب غير.",
          "قراه بصوت عالي.",
        ]
      ),
      output: t(
        "A poetic line that's true to today.",
        "سطر شعري صادق عن اليوم.",
        "سطر شعري صادق عن يومك.",
        "سطر شعري صادق عن اليوم.",
        "سطر شعري صادق عن اليوم.",
        "سطر شعري صادق على نهارك."
      ),
      difficulty: 1,
      tags: ["poetry", "writing", "quick"],
      xp: 5,
    },
  },

  // 2) حركة + تعلّم
  {
    id: "move-learn",
    title: t(
      "Move & Learn",
      "حرّك وتعلّم",
      "اتحرك واتعلم",
      "حرّك وتعلّم",
      "حرّك وتعلّم",
      "تحرّك وتعلّم"
    ),
    description: t(
      "Walk briskly, then read and learn one thing.",
      "امشِ بسرعة، ثم اقرأ وتعلّم شيئاً.",
      "امشي بسرعة، اقرا واتعلم حاجة.",
      "امشِ بسرعة، ثم اقرأ وتعلّم شي.",
      "امشِ بسرعة، اقرا وتعلّم شي.",
      "امشِ بالسّرعة، قرا وتعلّم شي.",
    ),
    emoji: "🚶📚",
    bonusXp: 10,
    totalDuration: 30,
    categories: ["physical", "learning"],
    task1: {
      id: "brisk-walk",
      category: "physical",
      duration: 10,
      energy: "medium",
      title: t(
        "Brisk walk",
        "مشي سريع",
        "مشي بسرعة",
        "مشي بسرعة",
        "مشي بسرعة",
        "مشي بالسّرعة"
      ),
      description: t(
        "Walk fast enough to slightly raise your heart rate.",
        "امشِ بسرعة كافية لرفع معدّل ضربات قلبك قليلاً.",
        "امشي بسرعة تخلّي قلبك يدق أكتر.",
        "امشِ بسرعة ترفع نبضك شوي.",
        "امشِ بسرعة ترفع نبضك شوي.",
        "امشِ بسرعة تزيد النبض شوية."
      ),
      steps: tSteps(
        [
          "Step outside or pace in a large room.",
          "Set a timer for 10 minutes.",
          "Walk at a pace where breathing quickens but you can still talk.",
          "Notice 3 new things on your route.",
          "Cool down for 1 minute.",
        ],
        [
          "اخرج أو امشِ في غرفة كبيرة.",
          "اضبط مؤقّتاً لـ ١٠ دقائق.",
          "امشِ بسرعة تُسرّع تنفّسك لكن تستطيع الكلام.",
          "لاحظ ٣ أشياء جديدة في طريقك.",
          "تهدأ دقيقة واحدة.",
        ],
        [
          "اطلع برّه أو اتمشى في حتت كبيرة.",
          "حط تايمر ١٠ دقايق.",
          "امشي بسرعة تجعلك تتنفس أكتر بس تقدر تتكلم.",
          "لاحظ ٣ حاجات جديدة في طريقك.",
          "ريّح دقيقة.",
        ],
        [
          "طلّع برّا أو اتمشى في غرفة كبيرة.",
          "حط مؤقّت ١٠ دقايق.",
          "امشِ بسرعة تجعلك تتنفّس أكثر بس تقدر تتكلّم.",
          "لاحظ ٣ أشياء جديدة في مسارك.",
          "استرخِ دقيقة.",
        ],
        [
          "طلّع برّا ولا اتمشى بغرفة كبيرة.",
          "حط مؤقّت ١٠ دقايق.",
          "امشي بسرعة تخلّيك تتنفس أكتر بس تقدر تتكلّم.",
          "لاحظ ٣ أشياء جديدة بمسارك.",
          "استرخِ دقيقة.",
        ],
        [
          "خرج برّا ولا اتمشى في بيت كبير.",
          "حط التايمر ١٠ دقايق.",
          "امشِ بسرعة تخلي النفس يتسارع بس تقدر تهدر.",
          "لاحظ ٣ حوايج جداد في مسارك.",
          "ريّح دقيقة.",
        ]
      ),
      output: t(
        "Better circulation and fresh air.",
        "دورة دموية أفضل وهواء نقي.",
        "دورة دموية أحسن وهوا نضيف.",
        "دورة دموية أحسن وهواء نقي.",
        "دورة دموية أحسن وهواء نقي.",
        "دورة دموية أحسن وهواء نقي."
      ),
      difficulty: 1,
      tags: ["walking", "cardio", "outdoor"],
      xp: 15,
    },
    task2: {
      id: "read-page",
      category: "learning",
      duration: 2,
      energy: "low",
      title: t(
        "Read one page",
        "اقرأ صفحة",
        "اقرا صفحة",
        "اقرأ صفحة",
        "اقرأ صفحة",
        "اقرا صفحة"
      ),
      description: t(
        "Just one page of any book, paper, or article.",
        "صفحة واحدة فقط من أي كتاب، ورقة بحثية، أو مقال.",
        "صفحة واحدة بس من أي كتاب أو مقال.",
        "صفحة وحدة فقط من أي كتاب، ورقة، أو مقال.",
        "صفحة وحدة بس من أي كتاب، ورقة، أو مقال.",
        "صفحة وحدة غير من أي كتاب، ورقة، ولا مقال."
      ),
      steps: tSteps(
        [
          "Pick a book, paper, or article (digital or physical).",
          "Open to the next unread page.",
          "Read it slowly, no skimming.",
          "Highlight or note one thing.",
          "Close the book, remember one sentence.",
        ],
        [
          "اختر كتاباً، ورقة بحثية، أو مقالاً (رقمياً أو ورقياً).",
          "افتح على الصفحة التالية غير المقروءة.",
          "اقرأها ببطء، لا تستعرض.",
          "حدّد أو لخّص شيئاً واحداً.",
          "أغلق الكتاب، تذكّر جملة واحدة.",
        ],
        [
          "اختار كتاب أو مقال (إلكتروني أو ورقي).",
          "افتح الصفحة اللي بعدها.",
          "اقراها بالراحة، ماتقراش بسرعة.",
          "حدد أو اكتب ملاحظة واحدة.",
          "اقفل الكتاب وفكر في جملة واحدة.",
        ],
        [
          "افتح كتاب، ورقة، أو مقال (رقمي أو ورقي).",
          "افتح على الصفحة اللي بعدها غير المقروءة.",
          "اقرأها ببطء، بدون تصفّح.",
          "أبرز أو لخّص شي واحد.",
          "أغلق الكتاب، تذكّر جملة وحدة.",
        ],
        [
          "افتح كتاب، ورقة، ولا مقال (رقمي ولا ورقي).",
          "افتح على الصفحة اللي بعدها.",
          "اقراها ببطء، بلا تصفّح.",
          "أبرز ولا لخّص شي واحد.",
          "سكّر الكتاب، تذكّر جملة وحدة.",
        ],
        [
          "حلّ كتاب، ورقة، ولا مقال (رقمي ولا ورقي).",
          "حلّ على الصفحة الجاية.",
          "قراها بالراحة، بلا تصفّح.",
          "حدّد ولا لخّص شي واحد.",
          "سدّ الكتاب، تفكّر في جملة وحدة.",
        ]
      ),
      output: t(
        "A new idea absorbed.",
        "فكرة جديدة مُمتصّة.",
        "فكرة جديدة اتمتصّت.",
        "فكرة جديدة مُمتصّة.",
        "فكرة جديدة مُمتصّة.",
        "فكرة جديدة متشرّبة."
      ),
      difficulty: 1,
      tags: ["reading", "quick"],
      xp: 5,
    },
  },
];

/** اختيار تحدي عشوائي */
export function getRandomChallenge(): DoubleTaskChallenge | null {
  if (DOUBLE_TASKS.length === 0) return null;
  return DOUBLE_TASKS[Math.floor(Math.random() * DOUBLE_TASKS.length)];
}

/** جلب تحدي بمعرّفه */
export function getChallengeById(id: string): DoubleTaskChallenge | null {
  return DOUBLE_TASKS.find((c) => c.id === id) || null;
}

/** الحصول على لون الفئتين معاً (gradient) */
export function getChallengeColor(categories: [TaskCategory, TaskCategory]): [string, string] {
  const c1 = CATEGORIES.find((c) => c.id === categories[0])?.color || "#8b5cf6";
  const c2 = CATEGORIES.find((c) => c.id === categories[1])?.color || "#ec4899";
  return [c1, c2];
}
