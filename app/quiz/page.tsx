"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, RefreshCw } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useStats } from "@/hooks/useStats";
import { QUIZ_QUESTIONS, calculateBoredType, getBoredTypeById, type BoredType } from "@/lib/stats/quiz";
import type { Locale } from "@/lib/i18n/types";
import clsx from "clsx";

export default function QuizPage() {
  const router = useRouter();
  const { dir, locale: loc } = useLocale();
  const locale = loc as Locale;
  const stats = useStats();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, BoredType>>({});
  const [result, setResult] = useState<BoredType | null>(null);

  const currentQ = QUIZ_QUESTIONS[step];
  const progress = ((step + 1) / QUIZ_QUESTIONS.length) * 100;

  const handleAnswer = (type: BoredType) => {
    const newAnswers = { ...answers, [currentQ.id]: type };
    setAnswers(newAnswers);

    if (step + 1 < QUIZ_QUESTIONS.length) {
      setStep(step + 1);
    } else {
      // حساب النتيجة
      const boredType = calculateBoredType(newAnswers);
      setResult(boredType);
      stats.setQuizResult(boredType);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  if (result) {
    const type = getBoredTypeById(result);
    return (
      <div className="flex flex-col flex-1 min-h-screen">
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background via-card/10 to-background" />

        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>رجوع</span>
            </button>
            <LanguageSelector />
          </div>
        </header>

        <main className="flex-1 px-4 py-8 max-w-md mx-auto w-full space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl shadow-2xl"
              style={{ background: `${type.color}30`, boxShadow: `0 0 60px ${type.color}40` }}
            >
              {type.emoji}
            </div>
          </motion.div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-light">{type.name[locale]}</h1>
            <p className="text-sm text-muted-foreground">{type.description[locale]}</p>
          </div>

          <div
            className="p-4 rounded-2xl border-2"
            style={{ borderColor: `${type.color}40`, background: `${type.color}10` }}
          >
            <div className="text-xs text-muted-foreground mb-1">نصيحة اليوم</div>
            <p className="text-sm font-medium">{type.tip[locale]}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleReset}
              className="p-3 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">أعد الاختبار</span>
            </button>
            <button
              onClick={() => router.push("/time")}
              className="p-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">ابدأ مهمة</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <div className="fixed inset-0 -z-10 bg-background/30" />

      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            {dir === "rtl" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>رجوع</span>
          </button>
          <LanguageSelector />
        </div>
      </header>

      <main className="flex-1 px-4 py-8 max-w-md mx-auto w-full space-y-8">
        <div>
          <h1 className="text-2xl font-light">أي نوع زهقان أنت؟</h1>
          <p className="text-sm text-muted-foreground">٣ أسئلة سريعة</p>
        </div>

        {/* شريط التقدم */}
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-light text-center">
              {currentQ.text[locale]}
            </h2>

            <div className="space-y-2">
              {currentQ.options.map((option, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option.type)}
                  className={clsx(
                    "w-full p-4 rounded-2xl bg-card border-2 border-border",
                    "hover:border-primary/40 transition-all text-start",
                    "flex items-center gap-3"
                  )}
                >
                  <div className="text-3xl">{option.emoji}</div>
                  <span className="text-sm font-medium flex-1">{option.text[locale]}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-xs text-center text-muted-foreground">
          السؤال {step + 1} من {QUIZ_QUESTIONS.length}
        </p>
      </main>
    </div>
  );
}
