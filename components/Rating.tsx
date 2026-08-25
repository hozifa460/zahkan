"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import clsx from "clsx";

interface RatingProps {
  value?: 1 | 2 | 3 | 4 | 5;
  onChange?: (rating: 1 | 2 | 3 | 4 | 5) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showLabels?: boolean;
}

const LABELS_AR: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "لم تعجبني",
  2: "عادية",
  3: "جيدة",
  4: "ممتعة",
  5: "رائعة!",
};

const LABELS_EN: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Not for me",
  2: "Okay",
  3: "Good",
  4: "Great",
  5: "Loved it!",
};

export function Rating({
  value,
  onChange,
  size = "md",
  readonly = false,
  showLabels = false,
}: RatingProps) {
  const [hover, setHover] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [locale] = useState<"ar" | "en">("ar");

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  }[size];

  const display = hover ?? value ?? 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= display;
          return (
            <motion.button
              key={star}
              type="button"
              disabled={readonly}
              onClick={() => onChange?.(star as 1 | 2 | 3 | 4 | 5)}
              onMouseEnter={() => !readonly && setHover(star as 1 | 2 | 3 | 4 | 5)}
              onMouseLeave={() => !readonly && setHover(null)}
              whileHover={!readonly ? { scale: 1.2 } : {}}
              whileTap={!readonly ? { scale: 0.9 } : {}}
              className={clsx(
                "transition-colors",
                !readonly && "cursor-pointer",
                readonly && "cursor-default"
              )}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={clsx(
                  sizeClasses,
                  "transition-colors",
                  isActive
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/40"
                )}
              />
            </motion.button>
          );
        })}
      </div>

      {showLabels && display > 0 && (
        <motion.p
          key={display}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-muted-foreground"
        >
          {locale === "ar" ? LABELS_AR[display as 1 | 2 | 3 | 4 | 5] : LABELS_EN[display as 1 | 2 | 3 | 4 | 5]}
        </motion.p>
      )}
    </div>
  );
}
