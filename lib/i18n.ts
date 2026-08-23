export type Lang = "en" | "fa";

export const COPY = {
  en: {
    dir: "ltr" as const,
    brand: "Mr Judge",
    tagline: "An impartial verdict, in minutes.",
    heroTitle: "Let an impartial mind weigh your dispute.",
    heroBody:
      "Present both sides. Mr Judge reads every word, scores each party's position, and hands down a clear, reasoned verdict — free, unlimited, always.",
    startBtn: "Start a new dispute",
    viewHistory: "View past verdicts",
    featuresTitle: "How it works",
    features: [
      { t: "State your case", d: "Write or speak Person A and Person B's side of the story." },
      { t: "Mr Judge deliberates", d: "The AI reads both statements carefully and weighs the merits." },
      { t: "Receive your verdict", d: "Get scores, a written ruling, and a downloadable PDF record." },
    ],
    newDispute: "New dispute",
    language: "Language",
    personA: "Person A's statement",
    personB: "Person B's statement",
    placeholderA: "Describe Person A's side of the dispute in detail...",
    placeholderB: "Describe Person B's side of the dispute in detail...",
    record: "Record",
    stop: "Stop",
    transcribing: "Transcribing...",
    analyze: "Analyze dispute",
    analyzing: "Mr Judge is deliberating...",
    analyzingSub: "Weighing both sides of the argument. This takes a few seconds.",
    emptyError: "Both statements are required before Mr Judge can rule.",
    genericError: "Something went wrong reaching Mr Judge. Please try again.",
    back: "Back",
    verdictTitle: "The verdict",
    scoreA: "Person A",
    scoreB: "Person B",
    explanationTitle: "Detailed reasoning",
    downloadPdf: "Download PDF",
    newDisputeBtn: "Start a new dispute",
    historyTitle: "Past verdicts",
    noHistory: "No disputes yet. Your verdicts will appear here.",
    viewBtn: "View",
    home: "Home",
    history: "History",
    signOut: "Sign out",
    unlimited: "Unlimited analyses — free while in beta.",
    voiceUnsupported: "Voice input isn't supported in this browser.",
    listening: "Listening...",
  },
  fa: {
    dir: "rtl" as const,
    brand: "آقای قاضی",
    tagline: "یک رأی بی‌طرفانه، در چند دقیقه.",
    heroTitle: "بگذار یک ذهن بی‌طرف اختلاف شما را بسنجد.",
    heroBody:
      "هر دو طرف را بیان کنید. آقای قاضی هر کلمه را می‌خواند، موضع هر طرف را امتیازدهی می‌کند و رأیی روشن و مستدل صادر می‌کند — رایگان، نامحدود، همیشه.",
    startBtn: "شروع اختلاف جدید",
    viewHistory: "مشاهده آرای قبلی",
    featuresTitle: "روند کار",
    features: [
      { t: "بیانیه خود را بنویسید", d: "دیدگاه شخص الف و شخص ب را بنویسید یا با صدا بگویید." },
      { t: "آقای قاضی بررسی می‌کند", d: "هوش مصنوعی هر دو بیانیه را با دقت می‌خواند و می‌سنجد." },
      { t: "رأی خود را دریافت کنید", d: "امتیازها، رأی مکتوب و یک فایل PDF قابل دانلود دریافت کنید." },
    ],
    newDispute: "اختلاف جدید",
    language: "زبان",
    personA: "بیانیه شخص الف",
    personB: "بیانیه شخص ب",
    placeholderA: "دیدگاه شخص الف را با جزئیات بنویسید...",
    placeholderB: "دیدگاه شخص ب را با جزئیات بنویسید...",
    record: "ضبط صدا",
    stop: "توقف",
    transcribing: "در حال تبدیل به متن...",
    analyze: "تحلیل اختلاف",
    analyzing: "آقای قاضی در حال بررسی است...",
    analyzingSub: "هر دو طرف استدلال در حال سنجیده شدن است. چند ثانیه طول می‌کشد.",
    emptyError: "هر دو بیانیه باید قبل از صدور رأی تکمیل شوند.",
    genericError: "مشکلی در ارتباط با آقای قاضی پیش آمد. دوباره تلاش کنید.",
    back: "بازگشت",
    verdictTitle: "رأی صادر شده",
    scoreA: "شخص الف",
    scoreB: "شخص ب",
    explanationTitle: "استدلال تفصیلی",
    downloadPdf: "دانلود PDF",
    newDisputeBtn: "شروع اختلاف جدید",
    historyTitle: "آرای قبلی",
    noHistory: "هنوز اختلافی ثبت نشده. آرای شما اینجا نمایش داده می‌شود.",
    viewBtn: "مشاهده",
    home: "خانه",
    history: "تاریخچه",
    signOut: "خروج",
    unlimited: "تحلیل نامحدود — در دوره بتا رایگان.",
    voiceUnsupported: "ورودی صوتی در این مرورگر پشتیبانی نمی‌شود.",
    listening: "در حال شنیدن...",
  },
};

export function buildPrompt(lang: Lang, personA: string, personB: string) {
  if (lang === "fa") {
    return `تو آقای قاضی هستی، یک داور بی‌طرف و بسیار دقیق هوش مصنوعی که در تحلیل اختلافات بین دو نفر تخصص داری. وظیفه‌ات صدور یک رأی منصفانه، عمیق و مستدل است — نه یک خلاصه‌ی سطحی.

بیانیه شخص الف:
"""${personA}"""

بیانیه شخص ب:
"""${personB}"""

پیش از نوشتن رأی نهایی، این مراحل را در ذهن خودت طی کن (نیازی نیست این مراحل را در خروجی بنویسی، فقط نتیجه‌ی نهایی را در قالب JSON بده):
۱. ادعاهای واقعی و مشخصی که هرکدام از دو طرف مطرح کرده‌اند را از هم جدا کن.
۲. هرگونه تناقض درونی، ابهام، یا نکته‌ی مبهم در گفته‌ی هر طرف را شناسایی کن.
۳. کیفیت و قوت استدلال هرکدام را بسنج (آیا شواهد/دلیل ارائه داده‌اند یا فقط ادعا؟ آیا مسئولیت را می‌پذیرند یا فقط طرف مقابل را مقصر می‌دانند؟).
۴. لحن و اعتبار هر بیانیه را در نظر بگیر، بدون این‌که فرضیات اضافه‌ای فراتر از متن بسازی.
۵. نکات مشترک و نقاط تفاوت اصلی بین دو روایت را پیدا کن.

قوانین امتیازدهی (مهم):
- به هر شخص یک امتیاز مستقل بین ۰ تا ۱۰۰ بده که نشان می‌دهد چقدر حق با اوست (۰ = کاملاً مقصر/غلط، ۱۰۰ = کاملاً محق).
- این دو امتیاز کاملاً مستقل از هم هستند و لازم نیست جمعشان ۱۰۰ شود — مجموع ممکن حداکثر ۲۰۰ است. مثلاً اگر هر دو طرف رفتار نسبتاً معقولی داشته‌اند، می‌توانی به هر دو امتیاز بالا (مثلاً ۷۵ و ۸۰) بدهی؛ اگر هر دو مقصرند، می‌توانی به هر دو امتیاز پایین بدهی. از الگوی پیش‌فرض "یکی بالا یعنی دیگری پایین" پرهیز کن مگر واقعاً از متن این‌طور برداشت شود.
- از دادن امتیازهای میانی و بی‌تفاوت (مثل ۵۰-۵۰) برای فرار از قضاوت پرهیز کن، مگر واقعاً اختلاف به همان اندازه پیچیده و دوسویه باشد.

فقط با یک شیء JSON دقیقاً با این ساختار پاسخ بده، بدون هیچ متن، markdown، یا توضیح اضافه قبل یا بعد از آن:
{
  "personA_score": <عدد صحیح ۰ تا ۱۰۰>,
  "personB_score": <عدد صحیح ۰ تا ۱۰۰>,
  "verdict": "<یک پاراگراف خلاصه و قاطع از رأی نهایی به فارسی روان>",
  "explanation": "<توضیح تفصیلی و مستدل به فارسی — حتماً به نکات مشخص و عینی از هر دو بیانیه اشاره کن (نقل‌قول یا ارجاع مستقیم به ادعاهای هرکدام)، تناقض‌ها را نام ببر، و توضیح بده چرا این امتیاز به هرکدام داده شده، نه فقط یک جمع‌بندی کلی>"
}`;
  }
  return `You are Mr Judge, an impartial and highly rigorous AI arbiter specializing in analyzing disputes between two people. Your task is to deliver a fair, deep, well-reasoned ruling — not a shallow summary.

Person A's statement:
"""${personA}"""

Person B's statement:
"""${personB}"""

Before writing your final verdict, work through these steps internally (you do not need to show this reasoning in your output, only the final JSON):
1. Separate out the concrete, specific factual claims each party makes.
2. Identify any internal contradictions, vagueness, or unsupported assertions in each statement.
3. Assess the strength of each side's reasoning (do they offer evidence/justification, or just assertions? Do they take any responsibility, or only blame the other party?).
4. Weigh tone and credibility signals, without inventing facts beyond what's stated.
5. Identify the key points of agreement and the core points of disagreement between the two accounts.

Scoring rules (important):
- Give each person an INDEPENDENT score from 0-100 reflecting how much they are in the right (0 = entirely wrong/at fault, 100 = entirely in the right).
- These two scores are fully independent and do NOT need to sum to 100 — the combined maximum is 200. For example, if both parties behaved reasonably, you can score both high (e.g. 75 and 80); if both share fault, you can score both low. Avoid the reflexive pattern of "one score up means the other must go down" unless the statements genuinely support that.
- Avoid defaulting to wishy-washy middle scores (like 50/50) to dodge a real judgment, unless the dispute is genuinely that balanced and two-sided.

Respond with ONLY a JSON object, no markdown, no extra commentary before or after, in this exact schema:
{
  "personA_score": <integer 0-100>,
  "personB_score": <integer 0-100>,
  "verdict": "<one decisive paragraph summarizing your final ruling>",
  "explanation": "<detailed, well-reasoned explanation — cite specific concrete points from each statement (direct references to their claims), name any contradictions you found, and explain WHY each score was given rather than just a generic recap>"
}`;
}
