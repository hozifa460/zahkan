"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, Cloud, CloudOff, Loader2 } from "lucide-react";
import { useAuth, signInWithGoogle, signOut, signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { loadUserDataFromCloud } from "@/lib/sync";
import { useLocale } from "@/hooks/useLocale";
import { isSupabaseConfigured } from "@/lib/supabase";
import clsx from "clsx";

export function AuthButton() {
  const { t } = useLocale();
  const { user, loading, configured } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // عند تغيّر المستخدم: نُحمّل بياناته من السحابة
  useEffect(() => {
    if (user) {
      setSyncing(true);
      loadUserDataFromCloud()
        .catch(console.error)
        .finally(() => setSyncing(false));
    }
  }, [user]);

  if (!configured) return null;

  if (loading) {
    return (
      <div className="p-2 rounded-full bg-card/60 border border-border">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {syncing && (
          <span title="يُزامن...">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
          </span>
        )}
        {!syncing && (
          <Cloud className="w-3.5 h-3.5 text-green-500" />
        )}        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 border border-border">
          {user.user_metadata?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.user_metadata.avatar_url} alt="" className="w-5 h-5 rounded-full" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">
              {(user.email?.[0] || "U").toUpperCase()}
            </div>
          )}
          <span className="text-xs text-foreground/80 max-w-[120px] truncate">
            {user.user_metadata?.full_name || user.email}
          </span>
        </div>
        <button
          onClick={async () => {
            await signOut();
          }}
          className="p-2 rounded-full bg-card/60 hover:bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
          aria-label="تسجيل الخروج"
          title="تسجيل الخروج"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/60 hover:bg-card border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
        aria-label="تسجيل الدخول"
      >
        <CloudOff className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">سجّل دخول</span>
        <LogIn className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-3xl bg-card border border-border space-y-4"
            >
              <div className="text-center space-y-1">
                <h2 className="text-xl font-semibold">
                  {mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  احفظ إنجازاتك وتابع من أي جهاز
                </p>
              </div>

              {/* Google */}
              <button
                onClick={async () => {
                  setError("");
                  const { error } = await signInWithGoogle();
                  if (error) setError(error.message);
                }}
                className="w-full p-3 rounded-2xl bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium border border-gray-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                المتابعة بـ Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">أو</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Email */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError("");
                  const fn = mode === "signin" ? signInWithEmail : signUpWithEmail;
                  const { error } = await fn(email, password);
                  if (error) setError(error.message);
                  else if (mode === "signup") {
                    setError("");
                    alert("تم! تحقق من بريدك لتأكيد الحساب.");
                  } else {
                    setShowModal(false);
                  }
                }}
                className="space-y-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  className="w-full p-3 rounded-2xl bg-background border border-border text-sm focus:border-primary outline-none"
                  dir="ltr"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور (6 أحرف على الأقل)"
                  className="w-full p-3 rounded-2xl bg-background border border-border text-sm focus:border-primary outline-none"
                  dir="ltr"
                />
                {error && (
                  <p className="text-xs text-red-400 text-center">{error}</p>
                )}
                <button
                  type="submit"
                  className="w-full p-3 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                >
                  {mode === "signin" ? "دخول" : "إنشاء حساب"}
                </button>
              </form>

              <div className="text-center text-xs text-muted-foreground">
                {mode === "signin" ? "ما عندك حساب؟ " : "عندك حساب؟ "}
                <button
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="text-primary hover:underline"
                >
                  {mode === "signin" ? "إنشاء حساب" : "تسجيل دخول"}
                </button>
              </div>

              <p className="text-[10px] text-muted-foreground/60 text-center leading-relaxed">
                بتسجيل الدخول، بياناتك (المهام، الإحصائيات، الإنجازات) تُحفظ سحابياً وتتزامن بين أجهزتك.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
