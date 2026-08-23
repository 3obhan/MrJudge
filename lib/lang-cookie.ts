import { cookies } from "next/headers";
import type { Lang } from "./i18n";

export function getLang(): Lang {
  const c = cookies().get("mrjudge_lang")?.value;
  return c === "fa" ? "fa" : "en";
}
