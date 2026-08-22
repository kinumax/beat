// NEON BEAT STAR direct top page with the integrated three-stage shooter route.
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import RhythmGame from "./components/RhythmGame";
import CometHunter from "./components/CometHunter";
import RacingGame from "./components/RacingGame";

export default function App() {
  const [route, setRoute] = useState(() => window.location.hash);
  useEffect(() => { const onHash = () => setRoute(window.location.hash); window.addEventListener("hashchange", onHash); return () => window.removeEventListener("hashchange", onHash); }, []);
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster />{route === "#comet" ? <CometHunter /> : route === "#rush" ? <RacingGame /> : <RhythmGame />}</TooltipProvider></ThemeProvider></ErrorBoundary>;
}
