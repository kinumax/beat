// Starlit Pulse style: note silhouettes communicate the action before the timing moment.
import type { Track } from "./tracks";
export type Difficulty = "EASY" | "NORMAL" | "HARD";
export type NotePattern = "standard" | "long" | "zigzag" | "slide" | "stair" | "burst" | "double" | "sweep" | "pulse" | "ghost";
export type Note = { id: number; lane: number; time: number; kind: "tap" | "hold"; duration?: number; pattern: NotePattern; path?: number[]; accent?: boolean; ghost?: boolean };

const lanePatterns = [[0, 1, 2, 3, 1, 2, 0, 3], [0, 2, 1, 3, 0, 3, 1, 2], [3, 2, 1, 0, 2, 1, 3, 0], [1, 3, 0, 2, 3, 1, 2, 0]];
const patternCycle: NotePattern[] = ["standard", "long", "zigzag", "slide", "stair", "burst", "double", "sweep", "pulse", "ghost"];

export function createChart(difficulty: Difficulty, track?: Track): Note[] {
  const bpm = track?.bpm ?? 130;
  const beat = 60 / bpm;
  const step = (difficulty === "EASY" ? 1.35 : difficulty === "NORMAL" ? 1 : 0.75) * beat;
  const bars = difficulty === "EASY" ? 9 : difficulty === "NORMAL" ? 12 : 15;
  const notes: Note[] = [];
  let id = 0;
  const offset = track ? track.id % lanePatterns.length : 0;
  for (let bar = 0; bar < bars; bar++) {
    const pattern = lanePatterns[(bar + offset) % lanePatterns.length];
    const count = difficulty === "EASY" ? 4 : 8;
    for (let i = 0; i < count; i++) {
      const time = 1.6 + (bar * 8 + i) * step;
      const lane = (pattern[i % pattern.length] + (track?.key ?? 0)) % 4;
      const kind = patternCycle[(bar * 3 + i + (track?.id ?? 0)) % patternCycle.length];
      const isHold = kind === "long" || kind === "zigzag" || kind === "slide" || kind === "sweep";
      const duration = kind === "sweep" ? beat * 3.4 : kind === "zigzag" ? beat * 3 : kind === "slide" ? beat * 2.4 : beat * (difficulty === "HARD" ? 2.6 : 1.8);
      const path = kind === "zigzag" ? [lane, (lane + 1) % 4, (lane + 3) % 4, (lane + 2) % 4] : kind === "slide" ? [lane, (lane + 1) % 4] : kind === "sweep" ? [lane, (lane + 1) % 4, (lane + 2) % 4, (lane + 3) % 4] : undefined;
      notes.push({ id: id++, lane, time, kind: isHold ? "hold" : "tap", pattern: kind, ...(isHold ? { duration, path } : {}), ...(kind === "pulse" ? { accent: true } : {}), ...(kind === "ghost" ? { ghost: true } : {}) });
      if ((kind === "double" || (difficulty === "HARD" && i % 4 === 1)) && !isHold) notes.push({ id: id++, lane: (lane + 2) % 4, time: time + step * 0.08, kind: "tap", pattern: "double", accent: true });
      if (kind === "stair") notes.push({ id: id++, lane: (lane + 1) % 4, time: time + step * 0.42, kind: "tap", pattern: "stair" });
      if (kind === "burst") notes.push({ id: id++, lane: (lane + 3) % 4, time: time + step * 0.32, kind: "tap", pattern: "burst" });
    }
  }
  return notes.sort((a, b) => a.time - b.time);
}
