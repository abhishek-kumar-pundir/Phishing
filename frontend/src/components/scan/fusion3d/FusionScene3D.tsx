import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Modality } from "../../../api/phish360";
import { UnifiedScanResult } from "../../../lib/scanResult";
import { riskTone } from "../../../lib/format";
import { prefersReducedMotion } from "../../../lib/tone";
import { FusionCore } from "./FusionCore";
import { ModalityNode } from "./ModalityNode";
import { FusionDiagram } from "../FusionDiagram";
import { Canvas3DErrorBoundary } from "./Canvas3DErrorBoundary";

const NODE_LAYOUT: Record<Modality, [number, number, number]> = {
  url: [-2.6, 1.2, -0.4],
  html: [-1.8, -1.3, 0.4],
  text: [1.8, -1.3, 0.4],
  vision: [2.6, 1.2, -0.4],
};

const NODE_LABELS: Record<Modality, string> = {
  url: "URL",
  html: "DOM",
  text: "TEXT",
  vision: "VISION",
};

const FUSION_WEIGHTS: Record<Modality, number> = {
  url: 3.5985,
  html: 2.6307,
  text: 4.9169,
  vision: 1.2024,
};

const TOTAL_FUSION_WEIGHT = 3.5985 + 2.6307 + 4.9169 + 1.2024; // 12.3485

interface Props {
  result: UnifiedScanResult;
  running: boolean;
  selectedModality?: Modality;
  onSelectModality?: (m: Modality) => void;
  /** Active stage for replay or running state */
  activeStage?: string;
}

function CameraRig({
  selectedModality,
  reducedMotion,
}: {
  selectedModality?: Modality;
  reducedMotion: boolean;
}) {
  const targetCamPos = useRef(new THREE.Vector3(0, 0.8, 6.8));

  useEffect(() => {
    if (selectedModality && NODE_LAYOUT[selectedModality]) {
      const nodePos = NODE_LAYOUT[selectedModality];
      // Target camera position eased slightly toward the clicked node
      targetCamPos.current.set(nodePos[0] * 0.4, 0.8 + nodePos[1] * 0.25, 6.2);
    } else {
      targetCamPos.current.set(0, 0.8, 6.8);
    }
  }, [selectedModality]);

  useFrame(({ camera }) => {
    if (reducedMotion) return;
    camera.position.lerp(targetCamPos.current, 0.05);
  });

  return null;
}

function Scene({
  result,
  running,
  selectedModality,
  onSelectModality,
  reducedMotion,
}: Props & {
  reducedMotion: boolean;
}) {
  const fusionTone = riskTone(result.fusion.probability);
  const revealed = result.fusion.probability != null && result.fusion.label != null;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 6, 5]} intensity={1.2} />
      <directionalLight position={[-5, -4, -4]} intensity={0.4} />

      <CameraRig selectedModality={selectedModality} reducedMotion={reducedMotion} />

      {/* Central Fusion Core (functional settlement) */}
      <FusionCore
        tone={fusionTone}
        active={running}
        revealed={revealed}
        reducedMotion={reducedMotion}
      />

      {/* 4 Modality Nodes */}
      {(Object.keys(NODE_LAYOUT) as Modality[]).map((m) => {
        const score = result.scores[m];
        const skipReason = result.skipReasons[m];

        let state: "idle" | "running" | "done" = "idle";
        if (score != null || skipReason) {
          state = "done";
        } else if (running) {
          state = "running";
        }

        return (
          <ModalityNode
            key={m}
            modality={m}
            position={NODE_LAYOUT[m]}
            label={NODE_LABELS[m]}
            score={score}
            skipReason={skipReason}
            state={state}
            weight={FUSION_WEIGHTS[m]}
            totalWeight={TOTAL_FUSION_WEIGHT}
            isSelected={selectedModality === m}
            onClick={() => onSelectModality?.(m)}
            reducedMotion={reducedMotion}
          />
        );
      })}

      {/* Damped Orbit Controls: no endless spinning, spring damping */}
      <OrbitControls
        enableDamping={true}
        dampingFactor={0.06}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2 - 0.4}
        maxPolarAngle={Math.PI / 2 + 0.4}
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
      />
    </>
  );
}

export function FusionScene3D({
  result,
  running,
  selectedModality = "url",
  onSelectModality,
}: Props) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handler = () => setReducedMotion(mq.matches);
      mq.addEventListener?.("change", handler);
      return () => mq.removeEventListener?.("change", handler);
    }
  }, []);

  // Performance: pause rendering when tab is hidden
  useEffect(() => {
    const handleVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <Canvas3DErrorBoundary
      fallback={
        <FusionDiagram
          result={result}
          animate={running}
          selectedModality={selectedModality}
          onSelectModality={onSelectModality}
        />
      }
    >
      <div className="relative h-[380px] sm:h-[420px] lg:h-[460px] w-full min-w-0 border border-surface-border bg-surface-canvas rounded-lg overflow-hidden select-none">
        {/* Functional Scene Overlay Labels */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none font-mono text-[11px] text-mist-500">
          <span className="w-1.5 h-1.5 rounded-full bg-brand" />
          <span>FUSION PIPELINE TOPOLOGY</span>
        </div>

        <div className="absolute top-3 right-3 z-10 pointer-events-none font-mono text-[10px] text-mist-600">
          EDGE THICKNESS = LOGREG WEIGHT
        </div>

        {tabVisible && (
          <Canvas
            dpr={[1, 2]} // Performance: cap DPR at 2
            camera={{ position: [0, 0.8, 6.8], fov: 42 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x090a0c, 1);
            }}
          >
            <Suspense fallback={null}>
              <Scene
                result={result}
                running={running}
                selectedModality={selectedModality}
                onSelectModality={onSelectModality}
                reducedMotion={reducedMotion}
              />
            </Suspense>
          </Canvas>
        )}
      </div>
    </Canvas3DErrorBoundary>
  );
}
