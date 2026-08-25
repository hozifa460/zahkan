import type { Task } from "./types";
import { t, tSteps } from "./types";

export const buildingTasks: Task[] = [
  // 1. حدّث README
  {
    id: "update-readme",
    category: "building",
    duration: 2,
    energy: "low",
    title: t(
      "Update a README",
      "حدّث ملف README",
      "حدّث ملف README",
      "حدّث ملف README",
      "حدّث ملف README",
      "حدّث ملف README"
    ),
    description: t(
      "Improve one README in your projects.",
      "حسّن ملف README واحد في مشاريعك.",
      "حسّن ملف README واحد في مشاريعك.",
      "حسّن ملف README واحد بمشاريعك.",
      "حسّن ملف README واحد بمشاريعك.",
      "حسّن ملف README واحد فالمشاريع ديالك."
    ),
    steps: tSteps(
      [
        "Open a project you've been neglecting.",
        "Read the existing README.",
        "Add one missing thing: install steps, usage, or screenshot.",
        "Commit the change.",
        "Push it to GitHub.",
      ],
      [
        "افتح مشروعاً أهملته.",
        "اقرأ ملف README الحالي.",
        "أضف شيئاً ناقصاً: خطوات التثبيت، الاستخدام، أو لقطة شاشة.",
        "احفظ التغيير.",
        "ادفعه إلى GitHub.",
      ],
      [
        "افتح مشروع كنت ناسيه.",
        "اقرا ملف README الموجود.",
        "حط حاجة ناقصة: خطوات التسطيب، الاستخدام، أو سكرين شوت.",
        "اعمل كوميت.",
        "ارفعه على GitHub.",
      ],
      [
        "افتح مشروع خلّيته مهمل.",
        "اقرأ ملف README الحالي.",
        "أضف شي ناقص: خطوات التثبيت، الاستخدام، أو لقطة شاشة.",
        "احفظ التغيير.",
        "ادفعه لـ GitHub.",
      ],
      [
        "افتح مشروع خلّيته مهمل.",
        "اقرأ ملف README الحالي.",
        "أضف شي ناقص: خطوات التثبيت، الاستخدام، أو لقطة شاشة.",
        "احفظ التغيير.",
        "ادفعه لـ GitHub.",
      ],
      [
        "حلّ مشروع كنت ناسيه.",
        "اقرا ملف README اللي كاين.",
        "زيد شي ناقص: خطوات التثبيت، الاستعمال، ولا سكرينشوت.",
        "دير كوميت.",
        "حلّو على GitHub.",
      ]
    ),
    output: t(
      "A better project for others.",
      "مشروع أفضل للآخرين.",
      "مشروع أحسن للناس.",
      "مشروع أحسن للآخرين.",
      "مشروع أحسن للآخرين.",
      "مشروع أحسن للآخرين."
    ),
    difficulty: 1,
    tags: ["github", "docs", "quick"],
    xp: 5,
  },

  // 2. 20 سطر كود
  {
    id: "code-20",
    category: "building",
    duration: 10,
    energy: "medium",
    title: t(
      "20 lines of code",
      "٢٠ سطر كود",
      "٢٠ سطر كود",
      "٢٠ سطر كود",
      "٢٠ سطر كود",
      "٢٠ سطر كود"
    ),
    description: t(
      "Solve one small problem with 20 lines of code.",
      "حل مشكلة صغيرة بـ ٢٠ سطر كود.",
      "حل مشكلة صغيرة بـ ٢٠ سطر كود.",
      "حل مشكلة صغيرة بـ ٢٠ سطر كود.",
      "حل مشكلة صغيرة بـ ٢٠ سطر كود.",
      "حل مشكل صغير بـ ٢٠ سطر كود."
    ),
    steps: tSteps(
      [
        "Pick a small problem: parse a CSV, format dates, etc.",
        "Create a new file.",
        "Write the solution in 20 lines or fewer.",
        "Test it on 3 inputs.",
        "Commit it.",
      ],
      [
        "اختر مشكلة صغيرة: تحليل CSV، تنسيق تواريخ، إلخ.",
        "أنشئ ملفاً جديداً.",
        "اكتب الحل في ٢٠ سطر أو أقل.",
        "اختبره على ٣ مدخلات.",
        "احفظ التغيير.",
      ],
      [
        "اختار مشكلة صغيرة: تحليل CSV، تنسيق تواريخ، إلخ.",
        "اعمل فايل جديد.",
        "اكتب الحل في ٢٠ سطر أو أقل.",
        "اتسته على ٣ مدخلات.",
        "اعمل كوميت.",
      ],
      [
        "اختار مشكلة صغيرة: تحليل CSV، تنسيق تواريخ، إلخ.",
        "أنشئ ملف جديد.",
        "اكتب الحل بـ ٢٠ سطر أو أقل.",
        "جرّبه على ٣ مدخلات.",
        "احفظ التغيير.",
      ],
      [
        "اختار مشكلة صغيرة: تحليل CSV، تنسيق تواريخ، إلخ.",
        "أنشئ ملف جديد.",
        "اكتب الحل بـ ٢٠ سطر أو أقل.",
        "جرّبه على ٣ مدخلات.",
        "احفظ التغيير.",
      ],
      [
        "اختار مشكل صغير: تحليل CSV، تنسيق التواريخ، لخ.",
        "أنشئ ملف جديد.",
        "اكتب الحل بـ ٢٠ سطر ولا أقل.",
        "جرّبو على ٣ مدخلات.",
        "دير كوميت.",
      ]
    ),
    output: t(
      "Working code that solves a problem.",
      "كود يعمل يحل مشكلة.",
      "كود شغّال بيحل مشكلة.",
      "كود يشتغل يحل مشكلة.",
      "كود يشتغل يحل مشكلة.",
      "كود خدّام يحل مشكل."
    ),
    difficulty: 2,
    tags: ["code", "script", "quick"],
    xp: 15,
  },

  // 3. صفحة HTML واحدة
  {
    id: "one-html",
    category: "building",
    duration: 30,
    energy: "medium",
    title: t(
      "One HTML page",
      "صفحة HTML واحدة",
      "صفحة HTML واحدة",
      "صفحة HTML واحدة",
      "صفحة HTML واحدة",
      "صفحة HTML وحدة"
    ),
    description: t(
      "Build one complete HTML page for an idea.",
      "ابنِ صفحة HTML كاملة واحدة لفكرة.",
      "اعمل صفحة HTML كاملة لفكرة.",
      "ابنِ صفحة HTML كاملة لفكرة.",
      "ابنِ صفحة HTML كاملة لفكرة.",
      "بني صفحة HTML كاملة لفكرة."
    ),
    steps: tSteps(
      [
        "Pick an idea: landing page, portfolio, list, anything.",
        "Sketch the layout in 2 minutes.",
        "Write the HTML in a single file.",
        "Add basic CSS inline or in a <style> block.",
        "Open it in browser, check it works.",
        "Deploy to GitHub Pages or Netlify Drop.",
      ],
      [
        "اختر فكرة: صفحة هبوط، معرض أعمال، قائمة، أي شيء.",
        "خطّط التخطيط في دقيقتين.",
        "اكتب HTML في ملف واحد.",
        "أضف CSS أساسياً inline أو في <style>.",
        "افتحه في المتصفح، تأكّد أنه يعمل.",
        "انشره على GitHub Pages أو Netlify Drop.",
      ],
      [
        "اختار فكرة: لاندنج بيج، بورتفوليو، ليست، أي حاجة.",
        "ارسم التصميم في دقيقتين.",
        "اكتب HTML في فايل واحد.",
        "حط CSS بسيط inline أو في <style>.",
        "افتحه في المتصفح، اتأكد انه شغّال.",
        "انشره على GitHub Pages أو Netlify.",
      ],
      [
        "اختار فكرة: صفحة هبوط، معرض، قائمة، أي شي.",
        "خطّط التخطيط بدقيقتين.",
        "اكتب HTML بملف واحد.",
        "أضف CSS أساسي inline أو بـ <style>.",
        "افتحه بالمتصفّح، تأكّد يشتغل.",
        "انشره على GitHub Pages أو Netlify Drop.",
      ],
      [
        "اختار فكرة: صفحة هبوط، معرض، قائمة، أي شي.",
        "خطّط التخطيط بدقيقتين.",
        "اكتب HTML بملف واحد.",
        "أضف CSS أساسي inline أو بـ <style>.",
        "افتحه بالمتصفّح، تأكّد يشتغل.",
        "انشره على GitHub Pages أو Netlify Drop.",
      ],
      [
        "اختار فكرة: صفحة هبوط، بورطيفوليو، ليست، أي شي.",
        "خطّط التخطيط في دقيقتين.",
        "اكتب HTML في ملف واحد.",
        "زيد CSS بسيط inline ولا في <style>.",
        "حلّو في المتصفّح، تأكّد خدّام.",
        "نشرو على GitHub Pages ولا Netlify Drop.",
      ]
    ),
    output: t(
      "A live, shareable page.",
      "صفحة حيّة قابلة للمشاركة.",
      "صفحة شغّالة تقدر تشاركها.",
      "صفحة حيّة قابلة للمشاركة.",
      "صفحة حيّة قابلة للمشاركة.",
      "صفحة حيّة تقدر تشاركوها."
    ),
    difficulty: 2,
    tags: ["html", "web", "deploy"],
    xp: 30,
  },

  // 4. سكريبت Python
  {
    id: "python-script",
    category: "building",
    duration: 30,
    energy: "medium",
    title: t(
      "Useful Python script",
      "سكريبت Python مفيد",
      "سكريبت Python مفيد",
      "سكريبت Python مفيد",
      "سكريبت Python مفيد",
      "سكريبت Python مفيد"
    ),
    description: t(
      "Write a small Python script for a real task.",
      "اكتب سكريبت Python صغير لمهمة حقيقية.",
      "اكتب سكريبت Python صغير لمهمة حقيقية.",
      "اكتب سكريبت Python صغير لمهمة حقيقية.",
      "اكتب سكريبت Python صغير لمهمة حقيقية.",
      "اكتب سكريبت Python صغير لمهمة حقيقية."
    ),
    steps: tSteps(
      [
        "Find a real task: rename files, scrape data, send emails.",
        "Set up a Python virtual environment.",
        "Write the script in one file.",
        "Test it on a small dataset.",
        "Document usage in a comment or README.",
        "Add to your scripts folder.",
      ],
      [
        "جد مهمة حقيقية: إعادة تسمية ملفات، كشط بيانات، إرسال إيميلات.",
        "أنشئ بيئة Python افتراضية.",
        "اكتب السكريبت في ملف واحد.",
        "اختبره على بيانات صغيرة.",
        "وثّق الاستخدام في تعليق أو README.",
        "أضفه لمجلد سكريبتاتك.",
      ],
      [
        "دوّر على مهمة حقيقية: تسمية ملفات، استخراج داتا، إرسال إيميلات.",
        "اعمل بيئة Python افتراضية.",
        "اكتب السكريبت في فايل واحد.",
        "اتسته على داتا صغيرة.",
        "وثّق الاستخدام في كومنت أو README.",
        "حطه في فولدر السكربتات بتاعك.",
      ],
      [
        "دوّر على مهمة حقيقية: تسمية ملفات، استخراج بيانات، إرسال إيميلات.",
        "أنشئ بيئة Python افتراضية.",
        "اكتب السكريبت بملف واحد.",
        "جرّبه على بيانات صغيرة.",
        "وثّق الاستخدام بتعليق أو README.",
        "أضفه لمجلد سكريبتاتك.",
      ],
      [
        "قلّب على مهمة حقيقية: تسمية ملفات، استخراج بيانات، إرسال إيميلات.",
        "أنشئ بيئة Python افتراضية.",
        "اكتب السكريبت بملف واحد.",
        "جرّبه على بيانات صغيرة.",
        "وثّق الاستخدام بتعليق أو README.",
        "أضفه لمجلد سكريبتاتك.",
      ],
      [
        "قلّب على مهمة حقيقية: تسمية ملفات، استخراج داتا، إرسال إيميلات.",
        "أنشئ بيئة Python افتراضية.",
        "اكتب السكريبت في ملف واحد.",
        "جرّبو على داتا صغيرة.",
        "وثّق الاستعمال في كومنط ولا README.",
        "زيدو في مجلد السكربتات ديالك.",
      ]
    ),
    output: t(
      "A reusable tool.",
      "أداة قابلة لإعادة الاستخدام.",
      "أداة تقدر تستعملها تاني.",
      "أداة قابلة لإعادة الاستخدام.",
      "أداة قابلة لإعادة الاستخدام.",
      "أداة تقدر تعاود تستعملها."
    ),
    difficulty: 2,
    tags: ["python", "automation", "tool"],
    xp: 30,
  },

  // 5. تطبيق ويب صغير
  {
    id: "small-app",
    category: "building",
    duration: 60,
    energy: "high",
    title: t(
      "Small web app",
      "تطبيق ويب صغير",
      "تطبيق ويب صغير",
      "تطبيق ويب صغير",
      "تطبيق ويب صغير",
      "تطبيق ويب صغير"
    ),
    description: t(
      "Build and deploy a small full-stack or static app.",
      "ابنِ وانشر تطبيق ويب صغير كامل أو ثابت.",
      "اعمل وانشر تطبيق ويب صغير.",
      "ابنِ وانشر تطبيق ويب صغير.",
      "ابنِ وانشر تطبيق ويب صغير.",
      "بني وانشر تطبيق ويب صغير."
    ),
    steps: tSteps(
      [
        "Pick a tiny idea: todo, counter, weather, quote, anything.",
        "Choose stack: HTML/CSS/JS, or Next.js, or SvelteKit.",
        "Set up the project (npm create, etc).",
        "Build the minimum viable version.",
        "Test it works end to end.",
        "Deploy to Vercel, Netlify, or GitHub Pages.",
      ],
      [
        "اختر فكرة صغيرة: قائمة مهام، عدّاد، طقس، اقتباس، أي شيء.",
        "اختر المكدس: HTML/CSS/JS، أو Next.js، أو SvelteKit.",
        "أنشئ المشروع (npm create، إلخ).",
        "ابنِ الحد الأدنى القابل للتشغيل.",
        "اختبره من البداية للنهاية.",
        "انشره على Vercel، Netlify، أو GitHub Pages.",
      ],
      [
        "اختار فكرة صغيرة: تودو، كونتر، طقس، كوت، أي حاجة.",
        "اختار الستاك: HTML/CSS/JS، Next.js، SvelteKit.",
        "اعمل المشروع (npm create، إلخ).",
        "اعمل أقل نسخة شغّالة.",
        "اتسته من الأول للآخر.",
        "انشره على Vercel أو Netlify أو GitHub Pages.",
      ],
      [
        "اختار فكرة صغيرة: قائمة مهام، عدّاد، طقس، اقتباس، أي شي.",
        "اختار المكدس: HTML/CSS/JS، أو Next.js، أو SvelteKit.",
        "أنشئ المشروع (npm create، إلخ).",
        "ابنِ الحد الأدنى القابل للتشغيل.",
        "جرّبه من البداية للنهاية.",
        "انشره على Vercel، Netlify، أو GitHub Pages.",
      ],
      [
        "اختار فكرة صغيرة: قائمة مهام، عدّاد، طقس، اقتباس، أي شي.",
        "اختار المكدس: HTML/CSS/JS، أو Next.js، أو SvelteKit.",
        "أنشئ المشروع (npm create، إلخ).",
        "ابنِ الحد الأدنى القابل للتشغيل.",
        "جرّبه من البداية للنهاية.",
        "انشره على Vercel، Netlify، أو GitHub Pages.",
      ],
      [
        "اختار فكرة صغيرة: تودو، كونتر، طقس، كوت، أي شي.",
        "اختار الستاك: HTML/CSS/JS، Next.js، SvelteKit.",
        "أنشئ المشروع (npm create، لخ).",
        "بني أقل نسخة خدّامة.",
        "جرّبو من الأول للآخر.",
        "نشرو على Vercel، Netlify، ولا GitHub Pages.",
      ]
    ),
    output: t(
      "A live app you can share.",
      "تطبيق حيّ يمكنك مشاركته.",
      "تطبيق شغّال تقدر تشاركه.",
      "تطبيق حيّ تقدر تشاركه.",
      "تطبيق حيّ تقدر تشاركه.",
      "تطبيق حيّ تقدر تشاركو."
    ),
    difficulty: 3,
    tags: ["app", "deploy", "full-stack"],
    xp: 50,
  },

  // 6. مشروع إصلاح
  {
    id: "fix-issue",
    category: "building",
    duration: 30,
    energy: "medium",
    title: t(
      "Fix one issue",
      "أصلح مشكلة واحدة",
      "صلّح مشكلة واحدة",
      "أصلح مشكلة وحدة",
      "أصلح مشكلة وحدة",
      "صلّح مشكل واحد"
    ),
    description: t(
      "Pick one GitHub issue from your project and fix it.",
      "اختر مشكلة واحدة من GitHub في مشروعك وأصلحها.",
      "اختار مشكلة واحدة من GitHub في مشروعك وصلحها.",
      "اختار مشكلة وحدة من GitHub في مشروعك وأصلحها.",
      "اختار مشكلة وحدة من GitHub في مشروعك وأصلحها.",
      "اختار مشكل واحد من GitHub في المشروع ديالك وصلّحو."
    ),
    steps: tSteps(
      [
        "Open a project with open issues.",
        "Pick the smallest one (good first issue, help wanted).",
        "Read the code, understand the problem.",
        "Make a focused fix.",
        "Add a test if possible.",
        "Open a PR with clear description.",
      ],
      [
        "افتح مشروعاً به مشاكل مفتوحة.",
        "اختر الأصغر (good first issue، help wanted).",
        "اقرأ الكود، افهم المشكلة.",
        "اعمل إصلاحاً مركّزاً.",
        "أضف اختباراً إن أمكن.",
        "افتح PR بوصف واضح.",
      ],
      [
        "افتح مشروع فيه مشاكل مفتوحة.",
        "اختار أصغر مشكلة (good first issue).",
        "اقرا الكود، افهم المشكلة.",
        "اعمل إصلاح محدد.",
        "حط تيست لو تقدر.",
        "افتح PR بوصف واضح.",
      ],
      [
        "افتح مشروع فيه مشاكل مفتوحة.",
        "اختار الأصغر (good first issue، help wanted).",
        "اقرأ الكود، افهم المشكلة.",
        "سوِّ إصلاح مركّز.",
        "أضف اختبار إن أمكن.",
        "افتح PR بوصف واضح.",
      ],
      [
        "افتح مشروع فيه مشاكل مفتوحة.",
        "اختار الأصغر (good first issue، help wanted).",
        "اقرأ الكود، افهم المشكلة.",
        "سوِّ إصلاح مركّز.",
        "أضف اختبار إن أمكن.",
        "افتح PR بوصف واضح.",
      ],
      [
        "حلّ مشروع فيه مشاكل محلولين.",
        "اختار أصغر واحد (good first issue، help wanted).",
        "اقرا الكود، فهم المشكل.",
        "دير إصلاح مركّز.",
        "زيد التيست إلا قدرتيش.",
        "حلّ PR بوصف واضح.",
      ]
    ),
    output: t(
      "A real fix shipped.",
      "إصلاح حقيقي تم نشره.",
      "إصلاح حقيقي اتنشر.",
      "إصلاح حقيقي تم نشره.",
      "إصلاح حقيقي تم نشره.",
      "إصلاح حقيقي تنشر."
    ),
    difficulty: 3,
    tags: ["github", "open-source", "fix"],
    xp: 30,
  },

  // 7. وثيقة API
  {
    id: "api-doc",
    category: "building",
    duration: 30,
    energy: "medium",
    title: t(
      "Document an API",
      "وثّق API",
      "وثّق API",
      "وثّق API",
      "وثّق API",
      "وثّق API"
    ),
    description: t(
      "Write documentation for one of your APIs or libraries.",
      "اكتب توثيقاً لـ API أو مكتبة من مشاريعك.",
      "اكتب توثيق لـ API أو مكتبة من مشاريعك.",
      "اكتب توثيق لـ API أو مكتبة من مشاريعك.",
      "اكتب توثيق لـ API أو مكتبة من مشاريعك.",
      "اكتب توثيق لـ API ولا مكتبة من مشاريعك."
    ),
    steps: tSteps(
      [
        "Pick an API or function that has no docs.",
        "Write 1 example: how to call it, what it returns.",
        "Document the parameters and types.",
        "Add a 'common mistakes' section.",
        "Commit and push.",
      ],
      [
        "اختر API أو دالة بدون توثيق.",
        "اكتب مثالاً واحداً: كيف تستدعيها، ماذا ترجع.",
        "وثّق المعاملات والأنواع.",
        "أضف قسم \"أخطاء شائعة\".",
        "احفظ التغيير وادفعه.",
      ],
      [
        "اختار API أو فانكشن مالهاش توثيق.",
        "اكتب مثال واحد: إزاي تستدعيها، بترجع إيه.",
        "وثّق البارامترات والتيبات.",
        "حط قسم 'أخطاء شائعة'.",
        "اعمل كوميت وارفع.",
      ],
      [
        "اختار API أو دالة بدون توثيق.",
        "اكتب مثال واحد: كيف تستدعيها، وش ترجع.",
        "وثّق المعاملات والأنواع.",
        "أضف قسم \"أخطاء شائعة\".",
        "احفظ التغيير وادفعه.",
      ],
      [
        "اختار API أو دالة بدون توثيق.",
        "اكتب مثال واحد: كيف تستدعيها، وش ترجع.",
        "وثّق المعاملات والأنواع.",
        "أضف قسم \"أخطاء شائعة\".",
        "احفظ التغيير وادفعه.",
      ],
      [
        "اختار API ولا فانكشن ما عندهاش توثيق.",
        "اكتب مثال واحد: كيفاش تستدعيها، كترجع أشنو.",
        "وثّق البارامترات والتيبات.",
        "زيد قسم 'أخطاء شائعين'.",
        "دير كوميت وارفع.",
      ]
    ),
    output: t(
      "Documentation others can use.",
      "توثيق يمكن للآخرين استخدامه.",
      "توثيق يقدر الناس تستعمله.",
      "توثيق يقدر الآخرين يستخدمونه.",
      "توثيق يقدر الآخرين يستخدمونه.",
      "توثيق يقدر الآخرين يستعملوه."
    ),
    difficulty: 2,
    tags: ["docs", "api", "writing"],
    xp: 30,
  },
];
