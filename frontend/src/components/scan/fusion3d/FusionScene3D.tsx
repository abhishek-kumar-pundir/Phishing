import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, Sparkles } from "@react-three/drei";
import { Modality } from "../../../api/phish360";
import { UnifiedScanResult } from "../../../lib/scanResult";
import { pct, riskTone } from "../../../lib/format";
import { RiskTone, TONE_HEX, prefersReducedMotion } from "../../../lib/tone";
import { FusionCore } from "./FusionCore";
import { ModalityNode } from "./ModalityNode";
import { FusionDiagram } from "../FusionDiagram";
import { Canvas3DErrorBoundary } from "./Canvas3DErrorBoundary";

const NODE_LAYOUT: Record<Modality, [number, number, number]> = {
  url: [2.9, 0.55, 0.3],
  html: [-0.9, -0.55, 2.7],
  text: [-2.6, 0.55, -1.5],
  vision: [1.0, -0.45, -2.7],
};

const NODE_LABEL: Record<Modality, string> = { url: "URL", html: "DOM", text: "TEXT", vision: "VISION" };

interface Props {
  result: UnifiedScanResult;
  running: boolean;
}

function Scene({ result, running, reducedMotion }: Props & { reducedMotion: boolean }) {
  const fusionTone: RiskTone = riskTone(result.fusion.probability);
  const revealed = result.fusion.probability != null;

  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 5, 5]} intensity={40} color="#5B8DEF" />
      <pointLight position={[-5, -3, -4]} intensity={20} color={TONE_HEX[fusionTone]} />

      {!reducedMotion && <Sparkles count={60} scale={9} size={1.4} speed={0.25} color="#5B8DEF" opacity={0.35} />}

      <FusionCore tone={fusionTone} active={running} revealed={revealed} reducedMotion={reducedMotion} />

      {(Object.keys(NODE_LAYOUT) as Modality[]).map((m) => {
        const score = result.scores[m];
        return (
          <ModalityNode
            key={m}
            position={NODE_LAYOUT[m]}
            label={NODE_LABEL[m]}
            scoreLabel={score != null ? pct(score, 0) : running ? "…" : "—"}
            tone={riskTone(score)}
            known={score != null}
            flowing={running}
            reducedMotion={reducedMotion}
          />
        );
      })}

      {revealed && (
        <Html center position={[0, -2.55, 0]} zIndexRange={[10, 0]}>
          <div className="pointer-events-none flex select-none flex-col items-center whitespace-nowrap">
            <span
              className="font-display text-2xl font-bold"
              style={{ color: TONE_HEX[fusionTone] }}
            >
              {pct(result.fusion.probability, 0)}
            </span>
            <span className="text-[11px] uppercase tracking-wide text-mist-400">phishing probability</span>
          </div>
        </Html>
      )}

      <OrbitControls
        autoRotate={!reducedMotion}
        autoRotateSpeed={running ? 1.1 : 0.5}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2 - 0.55}
        maxPolarAngle={Math.PI / 2 + 0.45}
      />
    </>
  );
}

export function FusionScene3D({ result, running }: Props) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  return (
    <Canvas3DErrorBoundary fallback={<FusionDiagram result={result} animate={running} />}>
      <div className="h-[320px] w-full min-w-0 sm:h-[380px] lg:h-[440px]">
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 1.1, 7.2], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <Suspense fallback={null}>
            <Scene result={result} running={running} reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      </div>
    </Canvas3DErrorBoundary>
  );
}
