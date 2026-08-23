import Nav from "@/components/Nav";
import DisputeForm from "@/components/DisputeForm";
import { getLang } from "@/lib/lang-cookie";
import { COPY } from "@/lib/i18n";

export default function NewDisputePage() {
  const lang = getLang();
  const t = COPY[lang];
  return (
    <>
      <Nav t={t} lang={lang} />
      <DisputeForm t={t} lang={lang} />
    </>
  );
}
