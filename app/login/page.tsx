"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import Logo from "@/components/Logo";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { COPY, Lang } from "@/lib/i18n";

// Uses whatever language cookie is already set; defaults to English.
function readLangCookie(): Lang {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/mrjudge_lang=(en|fa)/);
  return (match?.[1] as Lang) || "en";
}

export default function LoginPage() {
  const [lang, setLang] = useState<Lang>(readLangCookie());
  const t = COPY[lang];
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  const strings = lang === "fa"
    ? {
        title: "ورود به آقای قاضی",
        signin: "ورود",
        signup: "ثبت‌نام",
        email: "ایمیل",
        password: "رمز عبور",
        submitSignin: "ورود",
        submitSignup: "ساخت حساب",
        toggleToSignup: "حساب ندارید؟ ثبت‌نام کنید",
        toggleToSignin: "حساب دارید؟ وارد شوید",
        checkEmail: "لینک تأیید به ایمیل شما ارسال شد.",
        orContinueWith: "یا",
        google: "ادامه با گوگل",
      }
    : {
        title: "Sign in to Mr Judge",
        signin: "Sign in",
        signup: "Sign up",
        email: "Email",
        password: "Password",
        submitSignin: "Sign in",
        submitSignup: "Create account",
        toggleToSignup: "No account? Sign up",
        toggleToSignin: "Already have an account? Sign in",
        checkEmail: "Check your email for a confirmation link.",
        orContinueWith: "or",
        google: "Continue with Google",
      };

  const submit = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    const supabase = supabaseBrowser();
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(params.get("next") || "/");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setMessage(strings.checkEmail);
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={t.dir} className={`min-h-screen flex items-center justify-center bg-parchment ${lang === "fa" ? "font-vazir" : "font-inter"}`} style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(11,18,32,.045) 1px, transparent 0)", backgroundSize: "22px 22px" }}>
      <div className="max-w-[380px] w-full mx-4 bg-white border border-navy/10 rounded-2xl p-8 shadow-card rise-in">
        <div className="flex items-center justify-between">
          <Logo text={t.brand} size={30} />
          <LanguageSwitcher lang={lang} onChange={setLang} />
        </div>
        <h1 className="text-lg font-display font-semibold text-navy mt-5 mb-6">{strings.title}</h1>

        <div className="flex gap-2 mb-6 bg-parchment-dim rounded-lg p-1">
          <button
            onClick={() => setMode("signin")}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${mode === "signin" ? "bg-navy text-parchment" : "text-navy/60"}`}
          >
            {strings.signin}
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${mode === "signup" ? "bg-navy text-parchment" : "text-navy/60"}`}
          >
            {strings.signup}
          </button>
        </div>

        <label className="block text-xs font-mono tracking-wide text-muted mb-1.5 uppercase">{strings.email}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full box-border px-3 py-2.5 rounded-lg border border-navy/15 text-sm outline-none mb-4 focus:border-gold transition-colors"
          placeholder="you@example.com"
        />
        <label className="block text-xs font-mono tracking-wide text-muted mb-1.5 uppercase">{strings.password}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full box-border px-3 py-2.5 rounded-lg border border-navy/15 text-sm outline-none mb-5 focus:border-gold transition-colors"
          placeholder="••••••••"
        />

        {error && <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg px-3 py-2 text-xs mb-4">{error}</div>}
        {message && <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg px-3 py-2 text-xs mb-4">{message}</div>}

        <button
          disabled={loading || !email || !password}
          onClick={submit}
          className="w-full bg-navy text-parchment font-semibold rounded-xl py-3 text-sm tracking-wide hover:bg-ink transition-colors disabled:opacity-40"
        >
          {mode === "signin" ? strings.submitSignin : strings.submitSignup}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-navy/10" />
          <span className="text-xs font-mono tracking-wide text-muted uppercase">{strings.orContinueWith}</span>
          <div className="flex-1 h-px bg-navy/10" />
        </div>

        <GoogleSignInButton label={strings.google} />
      </div>
    </div>
  );
}
