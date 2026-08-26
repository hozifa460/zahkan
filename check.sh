#!/bin/bash
# 🔍 فحص الأخطاء قبل الرفع لـ Cloudflare
# يكتشف: TypeScript errors + Build errors
# ⚠️ ما يكتشفش: runtime errors (hydration, script tags, console errors)
#    → لازم تشغّل `npm run dev` وتفتح المتصفح بنفسك

set -e

echo "══════════════════════════════════════════"
echo "  🔍 فحص المشروع قبل الرفع لـ Cloudflare"
echo "══════════════════════════════════════════"
echo ""
echo "  ⚠️  هذا الفحص ما بيكشفش:"
echo "     - Hydration mismatch (runtime)"
echo "     - Console errors في المتصفح"
echo "     - Script tag warnings"
echo "     لازم تشغّل npm run dev وتفتح المتصفح"
echo ""

# 1) TypeScript check
echo "⏳ [1/3] فحص TypeScript..."
if npx tsc --noEmit; then
  echo "  ✅ TypeScript: مفيش أخطاء"
else
  echo "  ❌ TypeScript: فيه أخطاء — صلّحها قبل الرفع"
  exit 1
fi
echo ""

# 2) Next.js build
echo "⏳ [2/3] بناء المشروع (Next.js build)..."
if npm run build; then
  echo "  ✅ Build: نجح"
else
  echo "  ❌ Build: فشل — صلّح الأخطاء قبل الرفع"
  exit 1
fi
echo ""

# 3) Bundle size
echo "⏳ [3/3] فحص حجم الـ JS bundle..."
MAX_BUNDLE=$(find out/_next/static/chunks -name "*.js" -exec ls -l {} \; 2>/dev/null | awk '{print $5}' | sort -n | tail -1)
if [ -n "$MAX_BUNDLE" ]; then
  MAX_KB=$((MAX_BUNDLE / 1024))
  echo "  📦 أكبر ملف JS: ${MAX_KB}KB"
  if [ "$MAX_KB" -gt 400 ]; then
    echo "  ⚠️  تحذير: ضخم (>400KB)"
  else
    echo "  ✅ حجم معقول"
  fi
fi
echo ""

echo "══════════════════════════════════════════"
echo "  ✅ البناء نجح — لكن اختبر بـ dev قبل الرفع!"
echo "══════════════════════════════════════════"
echo ""
echo "  الخطوات المطلوبة قبل الرفع:"
echo "    1. npm run dev"
echo "    2. افتح http://localhost:3000"
echo "    3. امسح localStorage: localStorage.clear()"
echo "    4. افتح Console (F12)"
echo "    5. لو مفيش errors → ارفع"
echo ""
echo "  أمر الرفع:"
echo "    git add -A && git commit -m \"...\" && git push origin main"
echo ""
