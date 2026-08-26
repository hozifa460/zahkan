/**
 * Supabase Client
 *
 * يدير الاتصال بـ Supabase (Auth + Database)
 * 
 * المتغيرات العامة تأتي من:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * ملاحظة: NEXT_PUBLIC_* مكشوفة للـ client (آمنة في static export)
 */

import { createClient } from "@supabase/supabase-js";

// قيم افتراضية لمنع فشل البناء
// هذه القيم يتم استبدالها وقت التشغيل من env vars في Cloudflare
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,    // يحفظ الجلسة في localStorage
    autoRefreshToken: true,  // يجدد التوكن تلقائياً
    detectSessionInUrl: true, // يلتقط التوكن من URL بعد OAuth
  },
});

/** هل تم إعداد Supabase؟ */
export const isSupabaseConfigured = () => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
  );
};
