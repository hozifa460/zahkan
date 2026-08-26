"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Check, Clock } from "lucide-react";
import clsx from "clsx";

interface TimerProps {
  durationMinutes: number;
  onComplete?: () => void;
  onStop?: () => void;
  color?: string;
  size?: number;
  autoStart?: boolean; // يبدأ تلقائياً
  canComplete?: boolean; // هل يُسمح بالإنهاء المبكر؟ (false = فقط بعد انتهاء الوقت)
}

export function Timer({ durationMinutes, onComplete, onStop, color = "#10b981", size = 240, autoStart = false, canComplete = false }: TimerProps) {
  const totalSeconds = durationMinutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(autoStart);
  const intervalRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            if (!completedRef.current) {
              completedRef.current = true;
              setTimeout(() => onComplete?.(), 100);
            }
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, onComplete]);

  const handleStart = () => {
    if (remaining === 0) {
      setRemaining(totalSeconds);
      completedRef.current = false;
    }
    setRunning(true);
  };

  const handlePause = () => setRunning(false);

  const handleReset = () => {
    setRunning(false);
    setRemaining(totalSeconds);
    completedRef.current = false;
  };

  const handleDone = () => {
    setRunning(false);
    onComplete?.();
  };

  // التنسيق: mm:ss
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // النسبة المئوية
  const progress = remaining / totalSeconds;

  // نصف القطر
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  // رسالة حسب الوقت المتبقي
  const getHint = () => {
    if (remaining === 0) return "خلصنا! 🎉";
    if (remaining <= 10) return "باقي شوية!";
    if (remaining <= 30) return "نص الطريق!";
    if (remaining === totalSeconds) return "يلا نبدأ!";
    return "ركّز...";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* دائرة المؤقت */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* الخلفية */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-border opacity-30"
          />
          {/* التقدم */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
            style={{
              filter: `drop-shadow(0 0 8px ${color}50)`,
            }}
          />
        </svg>

        {/* المحتوى في المنتصف */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={display}
            initial={{ scale: 0.95, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-5xl sm:text-6xl font-light tabular-nums tracking-tight"
            style={{ color: remaining === 0 ? color : "currentColor" }}
          >
            {display}
          </motion.div>
          <div className="text-xs text-muted-foreground mt-1">
            {getHint()}
          </div>
        </div>
      </div>

      {/* أزرار التحكم */}
      <div className="flex items-center gap-2 mt-2">
        {!running ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            disabled={remaining === 0}
            className={clsx(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium",
              "bg-primary text-primary-foreground",
              "hover:bg-primary/90 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Play className="w-4 h-4" />
            {remaining === 0 ? "خلصنا" : remaining === totalSeconds ? "ابدأ" : "استئناف"}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePause}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-card border border-border hover:bg-card/80"
          >
            <Pause className="w-4 h-4" />
            إيقاف مؤقت
          </motion.button>
        )}

        {remaining < totalSeconds && remaining > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="p-2.5 rounded-full bg-card border border-border hover:bg-card/80"
            aria-label="إعادة"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        )}

        {remaining > 0 && canComplete && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDone}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
          >
            <Check className="w-4 h-4" />
            خلصت
          </motion.button>
        )}

        {remaining > 0 && !canComplete && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs text-muted-foreground bg-muted/50">
            <Clock className="w-3.5 h-3.5" />
            <span>الإنجاز متاح بعد انتهاء الوقت</span>
          </div>
        )}
      </div>
    </div>
  );
}
