# Zawhan Graft Architecture Map

> Auto-generated AST & Architectural Blueprint for Zawhan.

## Subsystems Overview

### `/app`

- [app/globals.css](/app/globals.css) -> [Graft Spec](graft/app/globals.md)
- [app/layout.tsx](/app/layout.tsx) -> [Graft Spec](graft/app/layout.md)
- [app/page.tsx](/app/page.tsx) -> [Graft Spec](graft/app/page.md)
- [app/challenges/page.tsx](/app/challenges/page.tsx) -> [Graft Spec](graft/app/page.md)
- [app/daily/page.tsx](/app/daily/page.tsx) -> [Graft Spec](graft/app/page.md)
- [app/dev/page.tsx](/app/dev/page.tsx) -> [Graft Spec](graft/app/page.md)
- [app/discover/page.tsx](/app/discover/page.tsx) -> [Graft Spec](graft/app/page.md)
- [app/done/page.tsx](/app/done/page.tsx) -> [Graft Spec](graft/app/page.md)
- [app/energy/page.tsx](/app/energy/page.tsx) -> [Graft Spec](graft/app/page.md)
- [app/favorites/page.tsx](/app/favorites/page.tsx) -> [Graft Spec](graft/app/page.md)
- [app/history/page.tsx](/app/history/page.tsx) -> [Graft Spec](graft/app/page.md)
- [app/quiz/page.tsx](/app/quiz/page.tsx) -> [Graft Spec](graft/app/page.md)
- [app/reverse/page.tsx](/app/reverse/page.tsx) -> [Graft Spec](graft/app/page.md)
- [app/stats/page.tsx](/app/stats/page.tsx) -> [Graft Spec](graft/app/page.md)
- [app/time/page.tsx](/app/time/page.tsx) -> [Graft Spec](graft/app/page.md)
- [app/task/[id]/layout.tsx](/app/task/[id]/layout.tsx) -> [Graft Spec](graft/app/layout.md)
- [app/task/[id]/page.tsx](/app/task/[id]/page.tsx) -> [Graft Spec](graft/app/page.md)

### `/components`

- [components/AuthButton.tsx](/components/AuthButton.tsx) -> [Graft Spec](graft/components/AuthButton.md)
- [components/CoachBubble.tsx](/components/CoachBubble.tsx) -> [Graft Spec](graft/components/CoachBubble.md)
- [components/Confetti.ts](/components/Confetti.ts) -> [Graft Spec](graft/components/Confetti.md)
- [components/DailyHabitsButton.tsx](/components/DailyHabitsButton.tsx) -> [Graft Spec](graft/components/DailyHabitsButton.md)
- [components/Heatmap.tsx](/components/Heatmap.tsx) -> [Graft Spec](graft/components/Heatmap.md)
- [components/LanguageSelector.tsx](/components/LanguageSelector.tsx) -> [Graft Spec](graft/components/LanguageSelector.md)
- [components/LevelBadge.tsx](/components/LevelBadge.tsx) -> [Graft Spec](graft/components/LevelBadge.md)
- [components/LocaleBootstrap.tsx](/components/LocaleBootstrap.tsx) -> [Graft Spec](graft/components/LocaleBootstrap.md)
- [components/MoodSelector.tsx](/components/MoodSelector.tsx) -> [Graft Spec](graft/components/MoodSelector.md)
- [components/MotivationalQuote.tsx](/components/MotivationalQuote.tsx) -> [Graft Spec](graft/components/MotivationalQuote.md)
- [components/Rating.tsx](/components/Rating.tsx) -> [Graft Spec](graft/components/Rating.md)
- [components/ReverseHabitButton.tsx](/components/ReverseHabitButton.tsx) -> [Graft Spec](graft/components/ReverseHabitButton.md)
- [components/StreakBadge.tsx](/components/StreakBadge.tsx) -> [Graft Spec](graft/components/StreakBadge.md)
- [components/Timer.tsx](/components/Timer.tsx) -> [Graft Spec](graft/components/Timer.md)
- [components/ToolSelector.tsx](/components/ToolSelector.tsx) -> [Graft Spec](graft/components/ToolSelector.md)
- [components/WeeklyComparison.tsx](/components/WeeklyComparison.tsx) -> [Graft Spec](graft/components/WeeklyComparison.md)

### `/hooks`

- [hooks/useLocale.ts](/hooks/useLocale.ts) -> [Graft Spec](graft/hooks/useLocale.md)
- [hooks/useStats.ts](/hooks/useStats.ts) -> [Graft Spec](graft/hooks/useStats.md)
- [hooks/useTasks.ts](/hooks/useTasks.ts) -> [Graft Spec](graft/hooks/useTasks.md)

### `/lib`

- [lib/auth.ts](/lib/auth.ts) -> [Graft Spec](graft/lib/auth.md)
- [lib/supabase.ts](/lib/supabase.ts) -> [Graft Spec](graft/lib/supabase.md)
- [lib/sync.ts](/lib/sync.ts) -> [Graft Spec](graft/lib/sync.md)
- [lib/i18n/ar-eg.ts](/lib/i18n/ar-eg.ts) -> [Graft Spec](graft/lib/ar-eg.md)
- [lib/i18n/ar-levant.ts](/lib/i18n/ar-levant.ts) -> [Graft Spec](graft/lib/ar-levant.md)
- [lib/i18n/ar-maghreb.ts](/lib/i18n/ar-maghreb.ts) -> [Graft Spec](graft/lib/ar-maghreb.md)
- [lib/i18n/ar-sa.ts](/lib/i18n/ar-sa.ts) -> [Graft Spec](graft/lib/ar-sa.md)
- [lib/i18n/ar.ts](/lib/i18n/ar.ts) -> [Graft Spec](graft/lib/ar.md)
- [lib/i18n/en.ts](/lib/i18n/en.ts) -> [Graft Spec](graft/lib/en.md)
- [lib/i18n/index.ts](/lib/i18n/index.ts) -> [Graft Spec](graft/lib/index.md)
- [lib/i18n/quotes.ts](/lib/i18n/quotes.ts) -> [Graft Spec](graft/lib/quotes.md)
- [lib/i18n/store.ts](/lib/i18n/store.ts) -> [Graft Spec](graft/lib/store.md)
- [lib/i18n/types.ts](/lib/i18n/types.ts) -> [Graft Spec](graft/lib/types.md)
- [lib/stats/achievements.ts](/lib/stats/achievements.ts) -> [Graft Spec](graft/lib/achievements.md)
- [lib/stats/analytics.ts](/lib/stats/analytics.ts) -> [Graft Spec](graft/lib/analytics.md)
- [lib/stats/challenges.ts](/lib/stats/challenges.ts) -> [Graft Spec](graft/lib/challenges.md)
- [lib/stats/coach.ts](/lib/stats/coach.ts) -> [Graft Spec](graft/lib/coach.md)
- [lib/stats/context.ts](/lib/stats/context.ts) -> [Graft Spec](graft/lib/context.md)
- [lib/stats/dailyCompletion.ts](/lib/stats/dailyCompletion.ts) -> [Graft Spec](graft/lib/dailyCompletion.md)
- [lib/stats/doubleTasks.ts](/lib/stats/doubleTasks.ts) -> [Graft Spec](graft/lib/doubleTasks.md)
- [lib/stats/energyLevels.ts](/lib/stats/energyLevels.ts) -> [Graft Spec](graft/lib/energyLevels.md)
- [lib/stats/levels.ts](/lib/stats/levels.ts) -> [Graft Spec](graft/lib/levels.md)
- [lib/stats/quiz.ts](/lib/stats/quiz.ts) -> [Graft Spec](graft/lib/quiz.md)
- [lib/stats/recommender.ts](/lib/stats/recommender.ts) -> [Graft Spec](graft/lib/recommender.md)
- [lib/stats/store.ts](/lib/stats/store.ts) -> [Graft Spec](graft/lib/store.md)
- [lib/stats/types.ts](/lib/stats/types.ts) -> [Graft Spec](graft/lib/types.md)
- [lib/tasks/building.ts](/lib/tasks/building.ts) -> [Graft Spec](graft/lib/building.md)
- [lib/tasks/categories.ts](/lib/tasks/categories.ts) -> [Graft Spec](graft/lib/categories.md)
- [lib/tasks/couple.ts](/lib/tasks/couple.ts) -> [Graft Spec](graft/lib/couple.md)
- [lib/tasks/creative.ts](/lib/tasks/creative.ts) -> [Graft Spec](graft/lib/creative.md)
- [lib/tasks/dailyRoutines.ts](/lib/tasks/dailyRoutines.ts) -> [Graft Spec](graft/lib/dailyRoutines.md)
- [lib/tasks/discovery.ts](/lib/tasks/discovery.ts) -> [Graft Spec](graft/lib/discovery.md)
- [lib/tasks/habitCategories.ts](/lib/tasks/habitCategories.ts) -> [Graft Spec](graft/lib/habitCategories.md)
- [lib/tasks/habits.ts](/lib/tasks/habits.ts) -> [Graft Spec](graft/lib/habits.md)
- [lib/tasks/historical.ts](/lib/tasks/historical.ts) -> [Graft Spec](graft/lib/historical.md)
- [lib/tasks/index.ts](/lib/tasks/index.ts) -> [Graft Spec](graft/lib/index.md)
- [lib/tasks/kids.ts](/lib/tasks/kids.ts) -> [Graft Spec](graft/lib/kids.md)
- [lib/tasks/learning.ts](/lib/tasks/learning.ts) -> [Graft Spec](graft/lib/learning.md)
- [lib/tasks/mental.ts](/lib/tasks/mental.ts) -> [Graft Spec](graft/lib/mental.md)
- [lib/tasks/mindfulness.ts](/lib/tasks/mindfulness.ts) -> [Graft Spec](graft/lib/mindfulness.md)
- [lib/tasks/physical.ts](/lib/tasks/physical.ts) -> [Graft Spec](graft/lib/physical.md)
- [lib/tasks/reverseHabits.ts](/lib/tasks/reverseHabits.ts) -> [Graft Spec](graft/lib/reverseHabits.md)
- [lib/tasks/seasonal.ts](/lib/tasks/seasonal.ts) -> [Graft Spec](graft/lib/seasonal.md)
- [lib/tasks/tools.ts](/lib/tasks/tools.ts) -> [Graft Spec](graft/lib/tools.md)
- [lib/tasks/types.ts](/lib/tasks/types.ts) -> [Graft Spec](graft/lib/types.md)
- [lib/tasks/weather.ts](/lib/tasks/weather.ts) -> [Graft Spec](graft/lib/weather.md)

### `/supabase`

- [supabase/setup.sql](/supabase/setup.sql) -> [Graft Spec](graft/supabase/setup.md)
