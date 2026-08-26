"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

/**
 * Hook لإدارة حالة المستخدم
 *
 * يُرجع:
 * - user: معلومات المستخدم (أو null)
 * - loading: هل جاري التحميل
 * - configured: هل Supabase مُعدّ
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    // جلب الجلسة الحالية
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // الاستماع للتغييرات
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  return { user, loading, configured };
}

/** تسجيل الخروج */
export async function signOut() {
  return supabase.auth.signOut();
}

/** تسجيل دخول بـ Google */
export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // رابط التطبيق بعد تسجيل الدخول (يجب أن يكون في Supabase redirect URLs)
      redirectTo: "https://zahkan.pages.dev",
    },
  });
}

/** تسجيل دخول بـ Email + Password */
export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

/** إنشاء حساب جديد */
export async function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}
