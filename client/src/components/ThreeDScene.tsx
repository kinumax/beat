// 3D arcade layer: an original low-poly-inspired web representation that keeps the game deployable without a Unity runtime.
import type { CSSProperties } from "react";

type Props = { accent: string; stage: number; boss?: boolean };

export function ThreeDScene({ accent, stage, boss = false }: Props) {
  const planet = stage === 4 ? "jungle" : stage === 5 ? "ocean" : stage === 6 ? "city" : stage === 7 ? "demon" : stage === 8 ? "core" : stage === 2 ? "earth" : stage === 3 ? "mars" : "space";
  return <div className={`three-d-scene three-d-${planet}`} aria-hidden="true">
    <div className="three-d-depth-grid" />
    <div className="three-d-haze" />
    <div className={`three-d-craft ${boss ? "three-d-boss" : ""}`} style={{ "--craft-accent": accent } as CSSProperties}>
      <span className="craft-core" /><span className="craft-wing craft-wing-left" /><span className="craft-wing craft-wing-right" /><span className="craft-engine craft-engine-left" /><span className="craft-engine craft-engine-right" />
    </div>
    {!boss && <><div className="three-d-drone drone-a" style={{ "--craft-accent": accent } as CSSProperties} /><div className="three-d-drone drone-b" style={{ "--craft-accent": accent } as CSSProperties} /></>}
    {boss && <div className="three-d-boss-rings" style={{ "--craft-accent": accent } as CSSProperties}><i /><i /><i /></div>}
  </div>;
}
