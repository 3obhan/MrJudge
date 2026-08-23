"use client";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";

export default function LanguageSwitcher({ lang, onChange }: { lang: Lang; onChange?: (next: Lang) => void }) {
  const router = useRouter();

  const change = (next: Lang) => {
    document.cookie = `mrjudge_lang=${next}; path=/; max-age=31536000`;
    if (onChange) {
      // Client component already holding lang in local state (e.g. the
      // login page) — update it directly instead of a server round-trip.
      onChange(next);
    } else {
      // Server component pages (Home, Nav, etc.) re-read the cookie on refresh.
      router.refresh();
    }
  };

  return (
    <select
      defaultValue={lang}
      onChange={(e) => change(e.target.value as Lang)}
      className="border border-navy/20 rounded-md px-2.5 py-1.5 text-xs font-semibold text-navy outline-none bg-white/70 cursor-pointer"
    >
      <option value="en">English</option>
      <option value="fa">فارسی</option>
    </select>
  );
}
