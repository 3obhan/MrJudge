import { Lang, buildPrompt } from "./i18n";

export interface VerdictResult {
  personA_score: number;
  personB_score: number;
  verdict: string;
  explanation: string;
}

const SYSTEM_PROMPT =
  "You are Mr Judge, an impartial, rigorous AI arbiter. Think carefully and weigh both sides before responding. Always respond with ONLY a valid JSON object matching the schema the user asks for — no markdown, no code fences, no commentary before or after.";

async function callGroq(model: string, prompt: string, extra: Record<string, any> = {}) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set. Get a free key at https://console.groq.com/keys");
  }
  return fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      ...extra,
    }),
  });
}

// Primary model: openai/gpt-oss-120b — Groq's flagship open-weight reasoning
// model. reasoning_effort lets it think through the dispute thoroughly.
// NOTE: GPT-OSS models on Groq do NOT support the `reasoning_format` param
// (that's only for models like qwen3.6) — using it there is silently
// nonstandard and can let raw reasoning tokens bleed into `content`. The
// documented way to keep GPT-OSS's chain-of-thought out of the answer is
// `include_reasoning: false`.
// Falls back to openai/gpt-oss-20b if gpt-oss-120b is ever unavailable.
// (Previously fell back to llama-3.3-70b-versatile, which Groq deprecated
// and fully shut down on 2026-08-16 — that fallback was dead on arrival.)
export async function getVerdict(lang: Lang, personA: string, personB: string): Promise<VerdictResult> {
  const prompt = buildPrompt(lang, personA, personB);

  let resp = await callGroq("openai/gpt-oss-120b", prompt, {
    reasoning_effort: "high",
    include_reasoning: false,
  });

  if (!resp.ok) {
    console.error("gpt-oss-120b failed, falling back:", resp.status, await resp.text());
    resp = await callGroq("openai/gpt-oss-20b", prompt, {
      reasoning_effort: "high",
      include_reasoning: false,
    });
  }

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Groq API error: ${resp.status} ${text}`);
  }

  const data = await resp.json();
  const text: string = data.choices?.[0]?.message?.content || "";
  const clean = text.replace(/```json|```/g, "").trim();
  const startIdx = clean.indexOf("{");
  const endIdx = clean.lastIndexOf("}");
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error(`Groq response contained no JSON object. Raw content: ${text.slice(0, 500)}`);
  }
  const jsonStr = clean.slice(startIdx, endIdx + 1);

  let parsed: any;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(`Failed to parse Groq JSON response: ${(e as Error).message}. Raw: ${jsonStr.slice(0, 500)}`);
  }

  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

  const scoreA = Number(parsed.personA_score);
  const scoreB = Number(parsed.personB_score);
  if (
    !Number.isFinite(scoreA) ||
    !Number.isFinite(scoreB) ||
    typeof parsed.verdict !== "string" ||
    !parsed.verdict.trim() ||
    typeof parsed.explanation !== "string" ||
    !parsed.explanation.trim()
  ) {
    throw new Error(`Groq response was missing/invalid verdict fields: ${jsonStr.slice(0, 500)}`);
  }

  return {
    personA_score: clamp(scoreA),
    personB_score: clamp(scoreB),
    verdict: parsed.verdict,
    explanation: parsed.explanation,
  };
}
