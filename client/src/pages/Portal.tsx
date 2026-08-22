// Starlit Pulse portal: a dark live rhythm stage leads; the bright game mosaic remains a secondary discovery layer.
import { useMemo, useState, type CSSProperties } from "react";

type GameStatus = "LIVE" | "COMING SOON" | "IN PROGRESS";
type GameCard = { id: string; title: string; subtitle: string; genre: string; status: GameStatus; accent: string; image: string; description: string; externalUrl?: string; tile: "hero" | "wide" | "standard" | "small" };
const games: GameCard[] = [
  { id: "neon-beat-star", title: "NEON BEAT STAR", subtitle: "ORIGINAL RHYTHM STAGE", genre: "RHYTHM / MUSIC", status: "LIVE", accent: "#FFB9C8", image: "/assets/neon-beat-star-title-card.jpg", description: "30 original tracks, four lanes, and a live stage built for the beat in your hands.", tile: "hero" },
  { id: "neon-comet-hunter", title: "NEON COMET HUNTER", subtitle: "ORIGINAL ARCADE ACTION", genre: "ACTION / SHOOTER", status: "IN PROGRESS", accent: "#A8F0EE", image: "/assets/neon-beat-star-stage.jpg", description: "Break comets, collect crystals, and protect your high score across a neon sky.", tile: "wide" },
  { id: "fashion-runway-worlds", title: "FASHION RUNWAY WORLDS", subtitle: "2.5D ACTION ADVENTURE", genre: "ACTION / FASHION", status: "IN PROGRESS", accent: "#FFB9C8", image: "/assets/neon-beat-star-character.png", description: "Run, jump, attack, fly, and clear runway worlds with a character-led adventure system.", tile: "wide" },
  { id: "signal-drift", title: "SIGNAL DRIFT", subtitle: "AUDIO EXPLORATION", genre: "ADVENTURE / SOUND", status: "COMING SOON", accent: "#C7B7FF", image: "/assets/neon-beat-star-stage.jpg", description: "Follow a lost broadcast through a silent city.", tile: "standard" },
  { id: "luma-atelier", title: "LUMA ATELIER", subtitle: "COLOR-BUILDING PUZZLE", genre: "PUZZLE / CREATIVE", status: "IN PROGRESS", accent: "#FFE9A8", image: "/assets/neon-beat-star-character.png", description: "Build small worlds from light, memory, and color.", tile: "small" },
  { id: "orbit-garden", title: "ORBIT GARDEN", subtitle: "GRAVITY GARDEN SIM", genre: "STRATEGY / SIMULATION", status: "IN PROGRESS", accent: "#A8F0EE", image: "/assets/neon-beat-star-stage.jpg", description: "Shape a tiny solar garden by bending gravity and protecting fragile moons.", tile: "standard" },
  { id: "velvet-vector", title: "VELVET VECTOR", subtitle: "RUNWAY PATTERN PUZZLE", genre: "PUZZLE / FASHION", status: "IN PROGRESS", accent: "#FFB9C8", image: "/assets/neon-beat-star-character.png", description: "Match silhouettes, color signals, and moving patterns before the runway shifts.", tile: "small" },
  { id: "echo-archive", title: "ECHO ARCHIVE", subtitle: "MEMORY SOUND MYSTERY", genre: "MYSTERY / EXPLORATION", status: "IN PROGRESS", accent: "#C7B7FF", image: "/assets/neon-beat-star-title-card.jpg", description: "Restore a vanished broadcast by arranging sound fragments and following unlocked memories.", tile: "wide" },
];

export default function Portal({ onLaunch }: { onLaunch: () => void }) {
  const [filter, setFilter] = useState<GameStatus | "ALL">("ALL");
  const visibleGames = useMemo(() => filter === "ALL" ? games : games.filter(game => game.status === filter), [filter]);
  const openGame = (game: GameCard) => {
    if (game.id === "neon-beat-star") onLaunch();
    else if (game.externalUrl) window.open(game.externalUrl, "_blank", "noopener,noreferrer");
  };
  const cardProps = (game: GameCard) => game.status === "LIVE" ? {
    role: "button" as const,
    tabIndex: 0,
    onClick: () => openGame(game),
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openGame(game); } },
    "aria-label": `${game.title}をプレイする`,
  } : {};
  return <main className="portal-shell portal-mosaic-shell portal-stage-first">
    <header className="portal-header portal-mosaic-header"><div className="portal-brand"><img src="/assets/neon-beat-star-logo.png" alt="" /><span>NEON<br /><b>BEAT STAR</b></span></div><div className="portal-search">⌕ <span>TRACK SELECT</span></div><div className="portal-status"><i /> LIVE / ANDROID STAGE</div></header>
    <section className="portal-stage-hero"><div className="portal-stage-copy"><span className="portal-kicker">ORIGINAL RHYTHM STAGE / 30 TRACKS / 4 LANES</span><h1>NEON<br /><em>BEAT STAR</em></h1><p>指先で、夜を鳴らす。星を落とさない。</p><button className="portal-hero-cta" onClick={onLaunch}><span>ENTER THE STAGE</span><b>↗</b></button><div className="portal-stats"><span><b>30</b> ORIGINAL TRACKS</span><span><b>04</b> LIVE LANES</span><span><b>∞</b> NIGHT RUNS</span></div></div><div className="portal-stage-poster" aria-label="Four lane rhythm stage preview"><div className="portal-screen"><span>NEON BEAT STAR / LIVE</span><strong>COMBO <em>47</em></strong></div><div className="portal-lane-beams"><i /><i /><i /><i /></div><div className="portal-pulse-gate"><i /><b>★</b></div><div className="portal-notes"><i /><i /><i /><i /><i /></div><div className="portal-input-pads"><b>D</b><b>F</b><b>J</b><b>K</b></div></div></section>
    <section className="portal-library portal-secondary-library" aria-label="Other games and future signals"><div className="portal-library-head"><div><span className="portal-label">NEXT SIGNALS / OTHER WORLDS</span><h2>After the stage,<br /><em>choose another signal.</em></h2></div><div className="portal-filters" role="tablist" aria-label="Game status filter">{["ALL", "LIVE", "IN PROGRESS", "COMING SOON"].map(option => <button key={option} className={filter === option ? "active" : ""} onClick={() => setFilter(option as GameStatus | "ALL")}>{option}</button>)}</div></div><div className="portal-mosaic-grid">{visibleGames.filter(game => game.id !== "neon-beat-star").map((game, index) => <article className={`portal-tile tile-${game.tile} ${game.status === "LIVE" ? "is-clickable" : ""}`} key={game.id} style={{ "--tile-accent": game.accent } as CSSProperties} {...cardProps(game)}><div className="portal-tile-image"><img src={game.image} alt="" /><span className="portal-tile-index">{String(index + 2).padStart(2, "0")}</span><span className="portal-tile-status">{game.status}</span></div><div className="portal-tile-copy"><span className="portal-tile-genre">{game.genre}</span><h2>{game.title}</h2><p>{game.description}</p>{game.status === "LIVE" ? (game.externalUrl ? <a className="portal-tile-button" href={game.externalUrl} target="_blank" rel="noreferrer" onClick={event => event.stopPropagation()}>PLAY NOW <b>↗</b></a> : <button className="portal-tile-button" onClick={event => { event.stopPropagation(); onLaunch(); }}>PLAY NOW <b>↗</b></button>) : <span className="portal-tile-muted">{game.status === "IN PROGRESS" ? "BUILDING THIS WORLD" : "COMING SOON"}</span>}</div></article>)}</div></section>
    <footer className="portal-footer portal-mosaic-footer"><span>NEON BEAT STAR / A NIGHT STAGE IN PROGRESS</span><span>NEXT SIGNALS WILL OPEN HERE.</span></footer>
  </main>;
}
