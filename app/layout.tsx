import "./globals.css";
import { getLang } from "@/lib/lang-cookie";
import { COPY } from "@/lib/i18n";

export const metadata = {
  title: "Mr Judge",
  description: "An impartial AI verdict for any dispute.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = getLang();
  const t = COPY[lang];
  return (
    <html lang={lang} dir={t.dir}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600;700&family=Vazirmatn:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className={lang === "fa" ? "font-vazir" : "font-inter"}>{children}</body>
    </html>
  );
}
