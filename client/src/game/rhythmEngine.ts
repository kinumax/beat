// Starlit Pulse style: holding is a continuous contract between finger, lane, path, and pulse.
import type { Note } from "./chart";
export type Judgment = "Perfect" | "Great" | "Good" | "Miss";
export type EngineStats = { score: number; combo: number; maxCombo: number; perfect: number; great: number; good: number; miss: number };
type ActiveHold = { note: Note; currentLane: number; visited: Set<number> };

export class RhythmEngine {
  readonly notes: Note[];
  readonly stats: EngineStats = { score: 0, combo: 0, maxCombo: 0, perfect: 0, great: 0, good: 0, miss: 0 };
  private startAt = 0;
  private judged = new Set<number>();
  private activeHolds = new Map<number, ActiveHold>();

  constructor(notes: Note[]) { this.notes = notes; }
  start(now: number) { this.startAt = now; }
  time(now: number) { return (now - this.startAt) / 1000; }
  ended(now: number) { return this.time(now) > (this.notes.at(-1)?.time ?? 0) + 2.1; }
  update(now: number) {
    const t = this.time(now);
    for (const note of this.notes) {
      if (this.judged.has(note.id) || this.activeHolds.has(note.id)) continue;
      if (t - note.time > 0.22) this.apply(note, "Miss");
    }
    for (const [id, state] of Array.from(this.activeHolds.entries())) {
      if (t > state.note.time + (state.note.duration ?? 0.8) + 0.28) { this.activeHolds.delete(id); this.apply(state.note, "Miss"); }
    }
  }
  visible(now: number, travel = 2.0) {
    const t = this.time(now);
    return this.notes.filter(n => !this.judged.has(n.id) && (n.time - t < travel && n.time + (n.duration ?? 0) - t > -0.24));
  }
  hit(lane: number, now: number): { judgment: Judgment; note?: Note; holding?: boolean } {
    const t = this.time(now);
    const candidate = this.notes.filter(n => !this.judged.has(n.id) && !this.activeHolds.has(n.id) && n.lane === lane && Math.abs(n.time - t) <= 0.22).sort((a, b) => Math.abs(a.time - t) - Math.abs(b.time - t))[0];
    if (!candidate) return { judgment: "Miss" };
    const delta = Math.abs(candidate.time - t);
    const judgment: Judgment = delta <= 0.075 ? "Perfect" : delta <= 0.14 ? "Great" : "Good";
    if (candidate.kind === "hold") { this.activeHolds.set(candidate.id, { note: candidate, currentLane: lane, visited: new Set([lane]) }); this.stats.score += judgment === "Perfect" ? 300 : judgment === "Great" ? 210 : 120; return { judgment, note: candidate, holding: true }; }
    this.apply(candidate, judgment); return { judgment, note: candidate };
  }
  moveHold(lane: number, now: number) {
    const state = Array.from(this.activeHolds.values())[0];
    if (!state) return false;
    const path = state.note.path ?? [state.note.lane];
    if (!path.includes(lane)) return false;
    state.currentLane = lane; state.visited.add(lane);
    if (state.note.pattern === "slide" || state.note.pattern === "zigzag" || state.note.pattern === "sweep") this.stats.score += 35;
    void now;
    return true;
  }
  release(lane: number, now: number): { judgment: Judgment; note?: Note } {
    const t = this.time(now);
    const entry = Array.from(this.activeHolds.entries()).find(([, state]) => state.currentLane === lane || state.note.lane === lane);
    if (!entry) return { judgment: "Miss" };
    const [id, state] = entry;
    this.activeHolds.delete(id);
    const end = state.note.time + (state.note.duration ?? 0.8);
    const remaining = end - t;
    const pathComplete = (state.note.path ?? [state.note.lane]).every(pathLane => state.visited.has(pathLane));
    const judgment: Judgment = !pathComplete ? "Miss" : remaining <= 0.12 ? "Perfect" : remaining <= 0.28 ? "Great" : "Miss";
    this.apply(state.note, judgment);
    return { judgment, note: state.note };
  }
  isHolding(lane: number) { return Array.from(this.activeHolds.values()).some(state => state.currentLane === lane || state.note.lane === lane); }
  private apply(note: Note, judgment: Judgment) {
    this.judged.add(note.id);
    this.stats[judgment.toLowerCase() as "perfect" | "great" | "good" | "miss"]++;
    if (judgment === "Miss") this.stats.combo = 0;
    else { this.stats.combo += 1; this.stats.maxCombo = Math.max(this.stats.maxCombo, this.stats.combo); this.stats.score += judgment === "Perfect" ? 1000 : judgment === "Great" ? 700 : 400; }
    void note;
  }
}
