import { NextRequest, NextResponse } from "next/server";

// Persian voice-to-text via Groq's hosted Whisper Large v3 — same free
// GROQ_API_KEY used for the judge analysis, no OpenAI account needed at all.
export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not set. Get a free key at https://console.groq.com/keys" },
      { status: 500 }
    );
  }

  const incoming = await req.formData();
  const audio = incoming.get("audio") as File | null;
  if (!audio) {
    return NextResponse.json({ error: "No audio file provided." }, { status: 400 });
  }
  if (audio.size < 2000) {
    return NextResponse.json(
      { error: "Recording was too short — hold the button longer while speaking." },
      { status: 400 }
    );
  }

  // A short in-language prompt biases the model toward Persian script and
  // everyday dispute vocabulary, improving accuracy noticeably.
  const CONTEXT_PROMPT =
    "این یک ضبط صدا به زبان فارسی است که در آن یک نفر درباره یک اختلاف یا مشکل شخصی صحبت می‌کند.";

  try {
    const form = new FormData();
    form.append("file", audio, audio.name || "recording.webm");
    form.append("model", "whisper-large-v3");
    form.append("language", "fa");
    form.append("prompt", CONTEXT_PROMPT);
    form.append("response_format", "json");
    form.append("temperature", "0");

    const resp = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("Groq transcription error:", resp.status, text);
      return NextResponse.json({ error: `Transcription failed (${resp.status}). ${text.slice(0, 200)}` }, { status: 500 });
    }

    const data = await resp.json();
    const text: string = (data.text || "").trim();

    if (!text) {
      return NextResponse.json({ error: "No speech was detected in the recording." }, { status: 422 });
    }

    return NextResponse.json({ text });
  } catch (err: any) {
    console.error("Transcription exception:", err);
    return NextResponse.json({ error: "Transcription request failed. Please try again." }, { status: 500 });
  }
}
