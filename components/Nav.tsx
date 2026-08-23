import Link from "next/link";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import SignOutButton from "./SignOutButton";
import type { Lang } from "@/lib/i18n";
import { getSessionUser } from "@/lib/supabase-server";

export default async function Nav({ t, lang }: { t: any; lang: Lang }) {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-40 bg-parchment/85 backdrop-blur-md border-b border-navy/10">
      <div className="flex items-center justify-between px-[6vw] py-3.5 flex-wrap gap-3">
        <Link href="/">
          <Logo text={t.brand} size={30} />
        </Link>
        <div className="flex items-center gap-5">
          <nav className="flex items-center gap-5">
            <Link href="/" className="text-[13px] font-semibold tracking-wide text-navy/80 hover:text-navy transition-colors">
              {t.home}
            </Link>
            <Link href="/new-dispute" className="text-[13px] font-semibold tracking-wide text-navy/80 hover:text-navy transition-colors">
              {t.newDispute}
            </Link>
            <Link href="/history" className="text-[13px] font-semibold tracking-wide text-navy/80 hover:text-navy transition-colors">
              {t.history}
            </Link>
          </nav>
          <div className="w-px h-4 bg-navy/15" />
          <LanguageSwitcher lang={lang} />
          {user && (
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-muted hidden sm:inline font-mono">{user.email}</span>
              <SignOutButton label={t.signOut} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
