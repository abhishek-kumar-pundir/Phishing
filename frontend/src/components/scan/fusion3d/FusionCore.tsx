import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RiskTone, TONE_HEX, TONE_HEX_SOFT } from "../../../lib/tone";

interface Props {
  tone: RiskTone;
  active: boolean; // pipeline currently executing
  revealed: boolean; // fusion completed -> resolve into verdict with brief settle
  reducedMotion: boolean;
}

const NEUTRAL_COLOR = new THREE.Color("#20242D");
const NEUTRAL_EMISSIVE = new THREE.Color("#121419");

export function FusionCore({ tone, active, revealed, reducedMotion }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const settleStartTime = useRef<number | null>(null);
  const prevRevealed = useRef(revealed);

  if (revealed && !prevRevealed.current) {
    settleStartTime.current = performance.now();
  }
  prevRevealed.current = revealed;

  const targetColor = revealed ? new THREE.Color(TONE_HEX[tone]) : NEUTRAL_COLOR;
  const targetEmissive = revealed ? new THREE.Color(TONE_HEX_SOFT[tone]) : NEUTRAL_EMISSIVE;

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Settle motion: one-shot damped spring when verdict lands
    let currentScale = 1.0;

    if (!reducedMotion && settleStartTime.current != null) {
      const elapsed = (performance.now() - settleStartTime.current) / 1000;
      const duration = 0.65;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        // Damped harmonic settle: overshoot slightly and settle to 1.0
        const envelope = Math.exp(-progress * 5);
        const osc = Math.sin(progress * Math.PI * 4);
        currentScale = 1.0 + envelope * osc * 0.18;
      } else {
        settleStartTime.current = null;
        currentScale = 1.0;
      }
    }

    meshRef.current.scale.setScalar(currentScale);

    if (materialRef.current) {
      if (reducedMotion) {
        materialRef.current.color.copy(targetColor);
        materialRef.current.emissive.copy(targetEmissive);
      } else {
        materialRef.current.color.lerp(targetColor, 0.12);
        materialRef.current.emissive.lerp(targetEmissive, 0.12);
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Fusion Core Polyhedron */}
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          ref={materialRef}
          color={revealed ? TONE_HEX[tone] : "#20242D"}
          emissive={revealed ? TONE_HEX_SOFT[tone] : "#121419"}
          emissiveIntensity={revealed ? 0.6 : 0.15}
          roughness={0.25}
          metalness={0.4}
          wireframe={false}
        />
      </mesh>

      {/* Subtle outer geometric ring / cage around core */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.25, 0.02, 16, 64]} />
        <meshBasicMaterial
          color={revealed ? TONE_HEX[tone] : "#363D4E"}
          transparent
          opacity={revealed ? 0.4 : 0.2}
        />
      </mesh>
    </group>
  );
}
