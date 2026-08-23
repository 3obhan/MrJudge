// A MediaRecorder-free audio recorder built on the Web Audio API.
// Safari (iOS & macOS) has a long-standing bug where MediaRecorder silently
// produces zero-byte output for audio; ScriptProcessorNode-based PCM capture
// works reliably everywhere, including Safari, so we use it for the Persian
// voice pipeline instead.
export class WavRecorder {
  private audioContext: AudioContext;
  private source: MediaStreamAudioSourceNode;
  private processor: ScriptProcessorNode;
  private buffers: Float32Array[] = [];
  private sampleRate: number;

  constructor(stream: MediaStream) {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new Ctx();
    this.sampleRate = this.audioContext.sampleRate;
    this.source = this.audioContext.createMediaStreamSource(stream);
    // 4096-sample buffer, mono in, mono out. ScriptProcessorNode is
    // deprecated but has universal support, unlike AudioWorklet on older
    // Safari — reliability matters more than modernity here.
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
    this.processor.onaudioprocess = (e) => {
      const channel = e.inputBuffer.getChannelData(0);
      this.buffers.push(new Float32Array(channel));
    };
    this.source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }

  stop(): { blob: Blob; durationMs: number } {
    this.processor.disconnect();
    this.source.disconnect();
    const totalLength = this.buffers.reduce((sum, b) => sum + b.length, 0);
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const b of this.buffers) {
      merged.set(b, offset);
      offset += b.length;
    }
    const durationMs = (totalLength / this.sampleRate) * 1000;
    const blob = encodeWav(merged, this.sampleRate);
    this.audioContext.close();
    return { blob, durationMs };
  }
}

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}
