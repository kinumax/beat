// Starlit Pulse style: the stage is a focused vertical instrument, with coral as the hit signature.
import { useEffect, useRef, useState } from "react";
import { createChart, type Difficulty } from "@/game/chart";
import { BeatAudio } from "@/game/audio";
import { RhythmEngine, type Judgment } from "@/game/rhythmEngine";
import { characters, tracks } from "@/game/tracks";

const laneColors = ["#A8F0EE", "#FFB9C8", "#FFE9A8", "#C7B7FF"];
const lanes = ["D", "F", "J", "K"];

function CharacterPortrait({ character, className = "", alt = "" }: { character: (typeof characters)[number]; className?: string; alt?: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hair = ["#8ff7ef", "#a98cff", "#ff7eae", "#ffe69b", "#ff72e8"][character.id - 1] ?? character.accent;
  const styles = ["M18 54L8 18 24 2 38 16 51 2 67 18 56 54Z", "M12 44L17 8 38 1 64 12 62 54Z", "M10 52L16 12 33 4 58 13 69 52 52 40 25 40Z", "M13 49L11 16 35 2 63 15 57 55Z", "M8 50L16 7 38 2 66 16 61 52 46 38 25 42Z"];
  if (!imageFailed && character.imageUrl) return <img className={`character-portrait ${className}`} src={character.imageUrl} alt={alt || character.name} onError={() => setImageFailed(true)} />;
  return <svg className={`character-portrait ${className}`} viewBox="0 0 76 112" role="img" aria-label={alt || character.name} preserveAspectRatio="xMidYMid meet">
    <defs><linearGradient id={`portrait-${character.id}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={hair}/><stop offset="1" stopColor={character.accent}/></linearGradient></defs>
    <path d={styles[character.id - 1] ?? styles[0]} fill={`url(#portrait-${character.id})`} opacity=".95" />
    <path d="M24 32Q38 20 52 32V55Q38 70 24 55Z" fill="#ffd8c5" />
    <path d="M24 36Q38 26 52 36" fill="none" stroke="#29334b" strokeWidth="3" /><circle cx="31" cy="45" r="2.2" fill="#172038" /><circle cx="45" cy="45" r="2.2" fill="#172038" />
    <path d="M29 72L38 59 47 72 61 108H15Z" fill={character.accent} opacity=".9" /><path d="M38 64L44 105H32Z" fill="#f8f5ff" opacity=".82" /><path d="M18 78L5 101M58 78L71 101" stroke={hair} strokeWidth="6" strokeLinecap="round" />
    <circle cx="38" cy="76" r="4" fill="#fff" opacity=".85" /><path d="M34 55Q38 59 42 55" fill="none" stroke="#bc5f78" strokeWidth="1.5" />
  </svg>;
}

function VisualGameGuide() {
  return <div className="visual-game-guide" aria-label="ゲーム内容のビジュアルガイド">
    <div className="visual-guide-card shooter-guide"><svg viewBox="0 0 180 74" role="img" aria-label="飛行機が敵とボスを撃つゲーム"><path d="M18 53L54 38 73 40 88 50 70 56 55 53 37 65Z" fill="#8ff7ef"/><path d="M63 40L78 22 86 42M48 45L30 28 28 48" fill="none" stroke="#fff" strokeWidth="4"/><circle cx="78" cy="46" r="6" fill="#ff7eae"/><path d="M112 12v50M130 12v50" stroke="#ffb9c8" strokeWidth="2" opacity=".5"/><path d="M104 28h34v24h-34z" fill="#ff7eae" opacity=".7"/><circle cx="121" cy="40" r="7" fill="#ffe9a8"/><path d="M96 40H86M143 40h22" stroke="#ffe9a8" strokeWidth="3" strokeDasharray="5 4"/><path d="M157 20l9 9-9 9-9-9z" fill="#c7b7ff"/></svg><span><i>✦</i> SHOOT</span></div>
    <div className="visual-guide-card racer-guide"><svg viewBox="0 0 180 74" role="img" aria-label="車がカーブを走り障害物をミサイルで破壊するゲーム"><path d="M6 16Q74 38 174 16M6 58Q74 36 174 58" fill="none" stroke="#8ff7ef" strokeWidth="3"/><path d="M6 16Q74 38 174 16M6 58Q74 36 174 58" fill="none" stroke="#ff7eae" strokeWidth="2" strokeDasharray="8 7"/><path d="M70 47l7-20h25l8 20z" fill="#8ff7ef"/><path d="M78 28h23l5 12H73z" fill="#182342"/><circle cx="78" cy="48" r="5" fill="#ff7eae"/><circle cx="103" cy="48" r="5" fill="#ff7eae"/><path d="M88 26V8" stroke="#ffd166" strokeWidth="4"/><path d="M88 8l-6 8h12z" fill="#ffd166"/><path d="M142 30l14 0 5 8-19 0z" fill="#ffb9c8"/><path d="M142 49l18-22" stroke="#ffd166" strokeWidth="3" strokeDasharray="4 4"/><path d="M128 15h15v15h-15z" fill="none" stroke="#ffd166" strokeWidth="2"/></svg><span><i>◈</i> RACE / MISSILE</span></div>
    <div className="visual-guide-card controls-guide"><svg viewBox="0 0 180 74" role="img" aria-label="十字キーとアクセル・ブレーキ・ミサイル操作"><path d="M27 20h16v12h12v16H43v12H27V48H15V32h12z" fill="#a8f0ee"/><circle cx="35" cy="40" r="5" fill="#11162e"/><circle cx="126" cy="35" r="16" fill="#ff7eae"/><circle cx="159" cy="53" r="13" fill="#c7b7ff"/><text x="126" y="40" textAnchor="middle" fill="#160f2a" fontSize="12" fontWeight="bold">A</text><text x="159" y="57" textAnchor="middle" fill="#160f2a" fontSize="10" fontWeight="bold">B</text><path d="M69 18h30M69 37h30M69 56h30" stroke="#ffe9a8" strokeWidth="5" strokeLinecap="round"/><circle cx="106" cy="18" r="4" fill="#ffd166"/></svg><span><i>＋</i> DRIVE</span></div>
  </div>;
}

type Screen = "title" | "play" | "result";
export default function RhythmGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef(new BeatAudio());
  const engineRef = useRef<RhythmEngine | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const autoPreviewTimerRef = useRef<number | null>(null);
  const autoPreviewActiveRef = useRef(false);
  const [autoPreviewing, setAutoPreviewing] = useState(false);
  const [muted, setMuted] = useState(false);
  const lastBeatRef = useRef(-1);
  const particlesRef = useRef<{ x: number; y: number; life: number; color: string }[]>([]);
  const [screen, setScreen] = useState<Screen>("title");
  const [difficulty, setDifficulty] = useState<Difficulty>("NORMAL");
  const [hud, setHud] = useState({ score: 0, combo: 0, maxCombo: 0, perfect: 0, great: 0, good: 0, miss: 0 });
  const [judgment, setJudgment] = useState<Judgment | "">("");
  const [flashLane, setFlashLane] = useState<number | null>(null);
  const [holdingLane, setHoldingLane] = useState<number | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState(1);
  const [currentLyric, setCurrentLyric] = useState("");
  const playStartedAtRef = useRef(0);
  const selectedTrack = tracks[selectedTrackId - 1];
  const leadCharacter = characters[(selectedTrack.id - 1) % characters.length];
  const supportCharacter = characters[selectedTrack.id % characters.length];

  const stopAutoPreview = () => {
    autoPreviewActiveRef.current = false;
    if (autoPreviewTimerRef.current !== null) { window.clearTimeout(autoPreviewTimerRef.current); autoPreviewTimerRef.current = null; }
    if (autoPreviewing) setAutoPreviewing(false);
    audioRef.current.stopTrack();
  };

  const selectTrack = (trackId: number) => { stopAutoPreview(); setSelectedTrackId(trackId); };
  const toggleMute = (event?: React.PointerEvent<HTMLButtonElement>) => { event?.stopPropagation(); const next = audioRef.current.toggleMute(); setMuted(next); };

  const beginAutoPreview = () => {
    if (screen !== "title" || autoPreviewActiveRef.current) return;
    autoPreviewActiveRef.current = true;
    setAutoPreviewing(true);
    let index = selectedTrackId - 1;
    const playNext = async () => {
      if (!autoPreviewActiveRef.current) return;
      const track = tracks[index];
      setSelectedTrackId(track.id);
      await audioRef.current.playPreview(track);
      if (!autoPreviewActiveRef.current) return;
      index = (index + 1) % tracks.length;
      void playNext();
    };
    void playNext();
  };

  const start = async () => {
    stopAutoPreview();
    const audioReady = await audioRef.current.playTrack(selectedTrack);
    playStartedAtRef.current = performance.now();
    setCurrentLyric("");
    const engine = new RhythmEngine(createChart(difficulty, selectedTrack));
    engine.start(performance.now());
    engineRef.current = engine;
    setHud({ ...engine.stats });
    void audioReady;
    setJudgment("");
    setScreen("play");
  };

  const handleLane = (lane: number) => {
    if (screen !== "play" || !engineRef.current) return;
    void audioRef.current.start();
    const result = engineRef.current.hit(lane, performance.now());
    audioRef.current.hit(lane, result.judgment);
    setJudgment(result.judgment);
    if (result.holding) setHoldingLane(lane);
    setHud({ ...engineRef.current.stats });
    setFlashLane(lane);
    window.setTimeout(() => setFlashLane(current => current === lane ? null : current), 120);
    if (result.note) {
      const canvas = canvasRef.current;
      if (canvas) particlesRef.current.push({ x: (lane + 0.5) * canvas.clientWidth / 4, y: canvas.clientHeight * 0.71, life: 1, color: laneColors[lane] });
    }
  };

  const moveLane = (lane: number) => {
    if (screen !== "play" || !engineRef.current) return;
    if (engineRef.current.moveHold(lane, performance.now())) setHoldingLane(lane);
  };

  const releaseLane = (lane: number) => {
    if (!engineRef.current || !engineRef.current.isHolding(lane)) return;
    const result = engineRef.current.release(lane, performance.now());
    setHoldingLane(null); setJudgment(result.judgment); setHud({ ...engineRef.current.stats });
  };

  useEffect(() => () => { stopAutoPreview(); }, []);
  useEffect(() => {
    if (screen !== "title") return;
    const idleTimer = window.setTimeout(beginAutoPreview, 7000);
    return () => window.clearTimeout(idleTimer);
  }, [screen]);
  useEffect(() => { if (screen === "result") { audioRef.current.stopTrack(); setCurrentLyric(""); } }, [screen]);
  useEffect(() => {
    if (screen !== "play") return;
    const timer = window.setInterval(() => {
      const elapsed = (performance.now() - playStartedAtRef.current) / 1000;
      const cue = [...selectedTrack.lyrics].reverse().find(item => elapsed >= item.at);
      setCurrentLyric(cue?.text ?? "");
    }, 100);
    return () => window.clearInterval(timer);
  }, [screen, selectedTrack]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { const lane = lanes.indexOf(event.key.toUpperCase()); if (lane >= 0 && !event.repeat) handleLane(lane); };
    const onKeyUp = (event: KeyboardEvent) => { const lane = lanes.indexOf(event.key.toUpperCase()); if (lane >= 0) releaseLane(lane); };
    window.addEventListener("keydown", onKeyDown); window.addEventListener("keyup", onKeyUp);
    return () => { window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 2); canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); window.addEventListener("resize", resize);
    const draw = (now: number) => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const gradient = ctx.createLinearGradient(0, 0, 0, h); gradient.addColorStop(0, "#10152C"); gradient.addColorStop(.42, "#080D21"); gradient.addColorStop(1, "#03050E"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h);
      const horizonY = h * 0.225, hitY = h * 0.695, vanishX = w * 0.5, laneW = w / 4;
      const horizonGlow = ctx.createRadialGradient(vanishX, horizonY, 0, vanishX, horizonY, w * .46); horizonGlow.addColorStop(0, "rgba(206,245,255,.28)"); horizonGlow.addColorStop(.42, "rgba(159,175,255,.08)"); horizonGlow.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = horizonGlow; ctx.fillRect(0, 0, w, h * .72);
      ctx.globalAlpha = 0.22;
      for (let i = 0; i < 11; i++) { ctx.strokeStyle = i % 2 ? "#A8F0EE" : "#FFB9C8"; ctx.beginPath(); ctx.moveTo(w * (i / 10), 0); ctx.lineTo(w * 0.5 + (i - 5) * 20, h * 0.73); ctx.stroke(); }
      ctx.globalAlpha = 0.7;
      for (let i = 0; i < 32; i++) { const x = (i * 97) % w; const y = (i * 53 + now * 0.01 * (i % 3 + 1)) % (h * 0.73); ctx.fillStyle = i % 4 === 0 ? "#FFD23F" : "#BBD9FF"; ctx.fillRect(x, y, i % 3 + 1, i % 3 + 1); }
      ctx.globalAlpha = 1;
      const perspective = (y: number) => Math.max(0.06, Math.min(1, (y - horizonY) / (hitY - horizonY)));
      const floorTop = vanishX - 20, floorBottomLeft = 0, floorBottomRight = w; ctx.fillStyle = "rgba(23,36,74,.42)"; ctx.beginPath(); ctx.moveTo(floorTop, horizonY); ctx.lineTo(floorBottomRight, hitY + 38); ctx.lineTo(floorBottomLeft, hitY + 38); ctx.closePath(); ctx.fill();
      for (let lane = 0; lane <= 4; lane++) { const bottomX = lane * laneW; const topX = vanishX + (lane - 2) * 13; ctx.strokeStyle = lane === 0 || lane === 4 ? "rgba(190,149,255,.72)" : lane === 2 ? "rgba(255,255,255,.42)" : "rgba(132,220,255,.34)"; ctx.lineWidth = lane === 0 || lane === 4 ? 2 : 1.2; ctx.beginPath(); ctx.moveTo(topX, horizonY); ctx.lineTo(bottomX, hitY + 38); ctx.stroke(); }
      for (let row = 0; row < 8; row++) { const y = horizonY + Math.pow((row + 1) / 8, 1.65) * (hitY - horizonY); const p = perspective(y); const left = vanishX - (w * .5) * p; const right = vanishX + (w * .5) * p; ctx.strokeStyle = `rgba(255,255,255,${.06 + p * .12})`; ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke(); }
      ctx.strokeStyle = "rgba(255,255,255,.94)"; ctx.lineWidth = 5; ctx.shadowBlur = 26; ctx.shadowColor = "#B8F8FF"; ctx.beginPath(); ctx.moveTo(0, hitY); ctx.lineTo(w, hitY); ctx.stroke(); ctx.strokeStyle = "#FFB9D7"; ctx.lineWidth = 2; ctx.shadowColor = "#FFB9D7"; ctx.beginPath(); ctx.moveTo(0, hitY + 6); ctx.lineTo(w, hitY + 6); ctx.stroke(); ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255,255,255,.78)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(vanishX, hitY, 18 + Math.sin(now * 0.004) * 3, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = "#A8F0EE"; ctx.globalAlpha = .65; ctx.beginPath(); ctx.arc(vanishX, hitY, 29 + Math.sin(now * 0.004 + 1) * 3, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      const engine = engineRef.current;
      if (screen === "play" && engine) {
        engine.update(now);
        const t = engine.time(now);
        const beat = Math.floor(t * selectedTrack.bpm / 60); if (beat !== lastBeatRef.current) { lastBeatRef.current = beat; }
        for (const note of engine.visible(now)) { const progress = Math.max(0, Math.min(1, 1 - (note.time - t) / 2.0)); const y = horizonY + Math.pow(progress, 1.7) * (hitY - horizonY); const p = perspective(y); const x = vanishX + (note.lane - 1.5) * laneW * p; const barW = Math.max(12, laneW * .66 * p); const barH = Math.max(5, 22 * p); const color = laneColors[note.lane]; ctx.fillStyle = color; ctx.shadowBlur = 24 * p; ctx.shadowColor = color; if (note.kind === "hold") { const endProgress = Math.max(0, Math.min(1, 1 - (note.time + (note.duration ?? .8) - t) / 2.0)); const endY = horizonY + Math.pow(endProgress, 1.7) * (hitY - horizonY); const endP = perspective(endY); const endLane = note.path?.at(-1) ?? note.lane; const endX = vanishX + (endLane - 1.5) * laneW * endP; const endW = Math.max(8, laneW * .66 * endP); const midY = (y + endY) / 2; const wave = note.pattern === "zigzag" || note.pattern === "sweep" ? Math.sin(now * 0.008 + note.id) * 26 * p : note.pattern === "slide" ? Math.sin(now * 0.006 + note.id) * 10 * p : 0; ctx.globalAlpha = .42; ctx.strokeStyle = color; ctx.lineWidth = Math.max(7, endW * .42); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo((x + endX) / 2 + wave, midY, endX, endY); ctx.stroke(); ctx.globalAlpha = 1; ctx.beginPath(); ctx.roundRect(x - barW / 2, y - barH / 2, barW, barH, barH / 2); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.86)"; ctx.shadowBlur = 8 * p; ctx.shadowColor = "#FFFFFF"; ctx.beginPath(); ctx.roundRect(x - barW * .32, y - barH * .22, barW * .64, Math.max(2, barH * .32), barH * .16); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = color; ctx.lineWidth = note.pattern === "sweep" ? 3 : 2; ctx.beginPath(); ctx.arc(endX, endY, Math.max(6, endW * .25), 0, Math.PI * 2); ctx.stroke(); } else { ctx.beginPath(); ctx.roundRect(x - barW / 2, y - barH / 2, barW, barH, barH / 2); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.shadowBlur = 9 * p; ctx.shadowColor = "#FFFFFF"; ctx.beginPath(); ctx.roundRect(x - barW * .3, y - barH * .18, barW * .6, Math.max(2, barH * .3), barH * .15); ctx.fill(); } ctx.shadowBlur = 0; }
        particlesRef.current = particlesRef.current.filter(p => p.life > 0); for (const p of particlesRef.current) { p.life -= 0.035; ctx.globalAlpha = p.life; ctx.strokeStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, (1 - p.life) * 52, 0, Math.PI * 2); ctx.stroke(); } ctx.globalAlpha = 1;
        if (engine.ended(now)) { setHud({ ...engine.stats }); audioRef.current.stopTrack(); setScreen("title"); }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => { window.removeEventListener("resize", resize); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [screen]);

  return <div className="game-shell">
    <canvas ref={canvasRef} className="stage-canvas" aria-label="NEON BEAT STAR game canvas" />
    <header className="game-header"><div className="brand-lockup"><img src="/assets/neon-beat-star-logo.png" alt="" /><span>NEON BEAT <b>STAR</b></span></div><div className="game-header-actions"><button className={muted ? "audio-toggle muted" : "audio-toggle"} onPointerDown={toggleMute} aria-label={muted ? "Unmute audio" : "Mute audio"}>{muted ? "MUTE" : "SOUND"}</button><span className="live-pill"><i /> LIVE / {difficulty}</span></div></header>
    {screen === "title" && <main className="title-panel" onPointerDown={() => { if (autoPreviewActiveRef.current) stopAutoPreview(); }}><img className="title-art" src="/assets/neon-beat-star-title-card.jpg" alt="星の光線が集まるステージ" /><div className="title-copy"><div className="character-strip" aria-label="NEON BEAT STAR performers">{characters.map(character => <button key={character.id} className={character.id === leadCharacter.id ? "character-chip active" : "character-chip"} style={{ "--character-accent": character.accent } as React.CSSProperties} onClick={() => selectTrack(character.id)}><CharacterPortrait character={character} alt={character.name} /><span>{character.name}</span></button>)}</div><p className="eyebrow">ORIGINAL RHYTHM STAGE · ANDROID READY</p><h1>NEON<br /><em>BEAT STAR</em></h1><p className="lead">指先で、夜を鳴らす。</p><div className="portal-game-links"><a className="shooter-link" href="#comet"><span>NEON COMET HUNTER</span><small>8 STAGES · POWER-UPS · PLAY NOW ↗</small></a><a className="racer-link" href="#rush"><img src="/manus-storage/neon-rush-card_f9d721c2.png" alt="ネオン都市を走るNEON RUSH CIRCUIT" /><span><b>NEON RUSH CIRCUIT</b><small>DRIFT · NITRO · RIVAL AI · PLAY NOW ↗</small></span></a></div><VisualGameGuide /><button className="start-button start-button-top" onPointerDown={(event) => { event.stopPropagation(); audioRef.current.unlock(); }} onClick={start}><span>ENTER THE STAGE</span><small>Tap to begin</small></button><div className="difficulty-row">{(["EASY", "NORMAL", "HARD"] as Difficulty[]).map(d => <button key={d} className={difficulty === d ? "difficulty active" : "difficulty"} onClick={() => { stopAutoPreview(); setDifficulty(d); }}>{d}</button>)}</div><div className={autoPreviewing ? "auto-slider active" : "auto-slider"}><span>{autoPreviewing ? "AUTO PREVIEW · 30 TRACK LOOP" : "NO INPUT · AUTO PREVIEW IN 7 SEC"}</span><b>{String(selectedTrack.id).padStart(2, "0")} / {selectedTrack.title}</b><i><em style={{ width: `${(selectedTrack.id / tracks.length) * 100}%` }} /></i></div><div className="track-picker"><div className="track-picker-head"><span>SELECT TRACK · {tracks.length} ORIGINAL SONGS</span><strong>{String(selectedTrack.id).padStart(2, "0")} / {selectedTrack.title}</strong></div><div className="track-grid">{tracks.map(track => <button key={track.id} className={selectedTrackId === track.id ? "track-button selected" : "track-button"} style={{ "--track": track.color } as React.CSSProperties} onClick={() => selectTrack(track.id)}><span>{String(track.id).padStart(2, "0")}</span><b>{track.title}</b><small>{track.genre} · {track.bpm} BPM · {track.mood}</small></button>)}</div></div><p className="hint">Four lanes. One pulse. D / F / J / K supported.</p><p className="audio-hint">{muted ? "AUDIO MUTED · TAP SOUND TO RESTORE" : "AUDIO READY · TAP SOUND TO MUTE"}</p></div><div className="title-lane-preview" aria-hidden="true"><div className="preview-gate"><i /><i /></div>{lanes.map((key, lane) => <div key={key} className="preview-lane" style={{ "--lane": laneColors[lane] } as React.CSSProperties}><span>{lane + 1}</span><b>{key}</b></div>)}</div></main>}
    {screen === "play" && <><div className="play-screen-frame"><img src="/assets/neon-beat-star-title-card.jpg" alt="" /></div><div className="play-characters"><div className="play-character-card lead" style={{ "--character-accent": leadCharacter.accent } as React.CSSProperties}><CharacterPortrait character={leadCharacter} alt={`${leadCharacter.name} ${leadCharacter.role}`} /><span>{leadCharacter.name}<small>{leadCharacter.role}</small></span></div><div className="play-character-card support" style={{ "--character-accent": supportCharacter.accent } as React.CSSProperties}><CharacterPortrait character={supportCharacter} alt={`${supportCharacter.name} ${supportCharacter.role}`} /><span>{supportCharacter.name}<small>{supportCharacter.role}</small></span></div></div><div className="play-hud"><div><span>{selectedTrack.genre} · {selectedTrack.instrument}</span><strong>{String(hud.score).padStart(7, "0")}</strong></div><div className="combo"><strong>{hud.combo}</strong><span>COMBO</span></div></div><div className={currentLyric ? "lyric-line visible" : "lyric-line"} aria-live="polite">{currentLyric}</div><div className={judgment ? `judgment ${judgment.toLowerCase()}` : "judgment"}>{judgment}</div><div className="lane-pad-row" onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); const lane = Math.max(0, Math.min(3, Math.floor(((event.clientX - rect.left) / rect.width) * 4))); moveLane(lane); }}>{lanes.map((key, lane) => <button key={key} className={holdingLane === lane ? "lane-pad holding" : flashLane === lane ? "lane-pad pressed" : "lane-pad"} style={{ "--lane": laneColors[lane] } as React.CSSProperties} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); handleLane(lane); }} onPointerUp={() => releaseLane(lane)} onPointerCancel={() => releaseLane(lane)} aria-label={`Lane ${lane + 1}`}><span>{lane + 1}</span><b>{key}</b></button>)}</div></>}
    {screen === "result" && <main className="result-panel"><p className="eyebrow">LIVE COMPLETE · {difficulty}</p><h2>STAGE<br /><em>CLEARED</em></h2><div className="result-score"><span>FINAL SCORE</span><strong>{String(hud.score).padStart(7, "0")}</strong></div><div className="result-grid"><div><b>{hud.maxCombo}</b><span>MAX COMBO</span></div><div><b>{hud.perfect}</b><span>PERFECT</span></div><div><b>{hud.great + hud.good}</b><span>GOOD HITS</span></div></div><button className="start-button" onClick={() => { stopAutoPreview(); setScreen("title"); }}><span>PLAY AGAIN</span><small>Choose another stage</small></button></main>}
  </div>;
}
