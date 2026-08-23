"use client";
import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { WavRecorder } from "@/lib/wavRecorder";

interface Props {
  lang: Lang;
  t: any;
  onText: (text: string) => void;
}

const MIN_RECORDING_MS = 400;

export default function VoiceButton({ lang, t, onText }: Props) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const wavRecorderRef = useRef<WavRecorder | null>(null);
  const startedAtRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      timerRef.current && clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  const flashUnsupported = () => {
    setUnsupported(true);
    setTimeout(() => setUnsupported(false), 3500);
  };

  /* ---------- English: Web Speech API (browser-native, real-time) ---------- */
  const startEnglish = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      flashUnsupported();
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = true;
    rec.onresult = (e: any) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) text += e.results[i][0].transcript + " ";
      if (text.trim()) onText(text.trim());
    };
    rec.onerror = () => setRecording(false);
    rec.onend = () => setRecording(false);
    rec.start();
    recognitionRef.current = rec;
    setRecording(true);
  };
  const stopEnglish = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  /* ---------- Persian: Web Audio API -> WAV -> /api/transcribe ----------
     MediaRecorder is unreliable on Safari (produces 0-byte output), so
     Persian voice input captures raw PCM via ScriptProcessorNode and
     encodes it to a WAV file directly in the browser — no codec/container
     dependent on browser quirks. */
  const startPersian = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
      streamRef.current = stream;
      wavRecorderRef.current = new WavRecorder(stream);

      startedAtRef.current = Date.now();
      setElapsedMs(0);
      timerRef.current = setInterval(() => setElapsedMs(Date.now() - startedAtRef.current), 200);
      setRecording(true);
    } catch (e) {
      flashUnsupported();
    }
  };

  const stopPersian = async () => {
    timerRef.current && clearInterval(timerRef.current);
    setRecording(false);

    const recorder = wavRecorderRef.current;
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    if (!recorder) return;

    const { blob, durationMs } = recorder.stop();

    if (durationMs < MIN_RECORDING_MS || blob.size < 2000) {
      setError(
        (lang === "fa" ? "ضبط خیلی کوتاه بود، دوباره تلاش کنید." : "Recording too short, try again.") +
          ` (${(blob.size / 1024).toFixed(1)}KB, ${Math.round(durationMs)}ms)`
      );
      return;
    }

    setTranscribing(true);
    try {
      const form = new FormData();
      form.append("audio", blob, "recording.wav");
      const resp = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || (lang === "fa" ? "تبدیل گفتار به متن ناموفق بود." : "Transcription failed."));
        return;
      }
      if (data.text?.trim()) {
        onText(data.text.trim());
      } else {
        setError(lang === "fa" ? "چیزی شنیده نشد. دوباره تلاش کنید." : "Nothing was heard. Try again.");
      }
    } catch (e: any) {
      setError(lang === "fa" ? "خطا در ارتباط با سرور." : "Network error reaching the server.");
    } finally {
      setTranscribing(false);
    }
  };

  const toggle = () => {
    setError(null);
    if (lang === "fa") {
      recording ? stopPersian() : startPersian();
    } else {
      recording ? stopEnglish() : startEnglish();
    }
  };

  const seconds = (elapsedMs / 1000).toFixed(1);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        disabled={transcribing}
        className={`inline-flex items-center text-[12px] font-semibold tracking-wide px-3 py-1.5 rounded-full border transition-all ${
          recording
            ? "border-red-400 bg-red-50 text-red-700"
            : "border-navy/25 text-navy hover:border-gold hover:text-gold"
        } ${transcribing ? "opacity-70" : ""}`}
      >
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full me-2 ${recording ? "bg-red-600 animate-pulse" : "bg-gold"}`}
        />
        {transcribing ? t.transcribing : recording ? `${t.listening} ${seconds}s` : t.record}
      </button>

      {unsupported && (
        <div className="absolute top-[115%] start-0 bg-white border border-navy/15 rounded-lg px-2.5 py-1.5 text-xs text-red-700 shadow-card whitespace-nowrap z-10">
          {t.voiceUnsupported}
        </div>
      )}
      {error && (
        <div className="absolute top-[115%] start-0 bg-white border border-navy/15 rounded-lg px-2.5 py-1.5 text-xs text-red-700 shadow-card z-10 max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
}
