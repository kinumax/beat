// Starlit Pulse style: authored genre tracks lead the stage, with a safe synth fallback for offline play.
import type { Track } from "./tracks";

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

export class BeatAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private clarity: BiquadFilterNode | null = null;
  private media: HTMLAudioElement | null = null;
  private started = false;
  private timer: number | null = null;
  private step = 0;
  private usingMedia = false;
  private previewResolve: (() => void) | null = null;
  private muted = false;
  private volume = 1;

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.media) this.media.volume = muted ? 0 : this.volume;
    if (this.master) this.master.gain.value = muted ? 0 : 0.92 * this.volume;
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  isMuted() { return this.muted; }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.media) this.media.volume = this.muted ? 0 : this.volume;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.92 * this.volume;
  }

  unlock() {
    if (!this.ctx) {
      const AudioContextCtor = window.AudioContext || (window as AudioWindow).webkitAudioContext;
      if (!AudioContextCtor) return false;
      this.ctx = new AudioContextCtor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.92 * this.volume;
      this.clarity = this.ctx.createBiquadFilter();
      this.clarity.type = "highpass";
      this.clarity.frequency.value = 58;
      this.clarity.Q.value = 0.7;
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -4;
      this.compressor.knee.value = 6;
      this.compressor.ratio.value = 4;
      this.compressor.attack.value = 0.006;
      this.compressor.release.value = 0.16;
      this.master.connect(this.clarity).connect(this.compressor).connect(this.ctx.destination);
    }
    if (this.ctx.state !== "running") void this.ctx.resume();
    return true;
  }

  async start() {
    if (!this.ctx && !this.unlock()) return false;
    const ctx = this.ctx;
    if (!ctx) return false;
    if (ctx.state !== "running") await ctx.resume();
    this.started = ctx.state === "running";
    return this.started;
  }

  async playTrack(track: Track, volume = 0.72, loop = true) {
    this.stopTrack();
    this.unlock();
    // Try the real MP3 first, while the click/tap activation is still alive.
    // Awaiting AudioContext.resume() before media.play() can lose iOS/Safari activation.
    if (track.audioUrl) {
      try {
        const media = new Audio();
        media.src = track.audioUrl;
        media.loop = loop;
        media.preload = "auto";
        media.volume = this.muted ? 0 : Math.min(1, volume * this.volume);
        // MP3も同じ音声経路へ通し、低域の濁りを整理してから出力する。
        if (!this.ctx || !this.clarity) throw new Error("Audio filter is unavailable");
        this.ctx.createMediaElementSource(media).connect(this.clarity);
        await media.play();
        this.media = media;
        this.usingMedia = true;
        const ready = await this.start();
        if (!ready) return false;
        // 実音源が再生できた場合は、音楽だけを流す。生成伴奏は重ねない。
        return true;
      } catch {
        this.media = null;
        this.usingMedia = false;
      }
    }
    // Keep a synthesized fallback so a decode or network failure never makes the game silent.
    const ready = await this.start();
    if (!ready) return false;
    this.step = 0;
    const beatMs = 60000 / track.bpm;
    this.scheduleTrackStep(track);
    this.timer = window.setInterval(() => this.scheduleTrackStep(track), beatMs);
    return true;
  }

  async playPreview(track: Track) {
    const started = await this.playTrack(track, 0.34, false);
    if (!started) return false;
    if (this.media) {
      const media = this.media;
      await new Promise<void>(resolve => {
        const finish = () => { if (this.previewResolve === finish) this.previewResolve = null; resolve(); };
        this.previewResolve = finish;
        media.addEventListener("ended", finish, { once: true });
      });
    } else {
      // Generated fallback has no natural ended event; use a full 32-beat phrase.
      await new Promise(resolve => window.setTimeout(resolve, Math.max(4000, (60000 / track.bpm) * 32)));
    }
    return true;
  }

  stopTrack() {
    if (this.previewResolve) { const resolve = this.previewResolve; this.previewResolve = null; resolve(); }
    if (this.timer !== null) { window.clearInterval(this.timer); this.timer = null; }
    if (this.media) { this.media.pause(); this.media.currentTime = 0; this.media.src = ""; this.media = null; }
    this.usingMedia = false;
  }

  private scheduleTrackStep(track: Track) {
    if (!this.ctx || !this.master || !this.started) return;
    const now = this.ctx.currentTime + 0.02;
    const chord = [261.63, 329.63, 392, 493.88][track.key];
    this.voice(chord / 2, now, 0.16, "sine", 0.32);
    this.voice(chord, now, 0.11, "triangle", 0.22);
    if (this.step % 2 === 0) this.voice(55 + track.key * 8, now, 0.2, "sine", 0.34);
    if (this.step % 4 === 2) this.voice(chord * 1.5, now, 0.07, "square", 0.16);
    if (this.step % 8 === 4) this.voice(chord * 2, now, 0.12, "sawtooth", 0.12);
    this.step = (this.step + 1) % 16;
  }

  private voice(frequency: number, time: number, length: number, type: OscillatorType, volume: number) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(frequency, time);
    gain.gain.setValueAtTime(0.0001, time); gain.gain.exponentialRampToValueAtTime(volume, time + 0.012); gain.gain.exponentialRampToValueAtTime(0.0001, time + length);
    osc.connect(gain).connect(this.master); osc.start(time); osc.stop(time + length + 0.02);
  }

  hit(_lane: number, _quality: "Perfect" | "Great" | "Good" | "Miss") {
    // 音楽のみモード: ノーツ判定音は鳴らさない。
  }
}
