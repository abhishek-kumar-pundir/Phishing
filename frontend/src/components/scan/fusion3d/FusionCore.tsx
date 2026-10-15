import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { RiskTone, TONE_HEX, TONE_HEX_SOFT } from "../../../lib/tone";

interface Props {
  tone: RiskTone;
  active: boolean; // still scanning -> faster morph, brighter pulse
  revealed: boolean; // verdict known -> settle into final color with one burst
  reducedMotion: boolean;
}

export function FusionCore({ tone, active, revealed, reducedMotion }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const burstStart = useRef<number | null>(null);
  const prevRevealed = useRef(revealed);
  const color = new THREE.Color(TONE_HEX[tone]);
  const emissive = new THREE.Color(TONE_HEX_SOFT[tone]);

  if (revealed && !prevRevealed.current) {
    burstStart.current = performance.now();
  }
  prevRevealed.current = revealed;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    if (!reducedMotion) {
      meshRef.current.rotation.y += delta * (active ? 0.35 : 0.12);
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.15;
    }

    // Idle breathing scale, plus a one-shot burst when the verdict lands.
    let scale = 1 + Math.sin(t * (active ? 2.2 : 1)) * (reducedMotion ? 0.01 : active ? 0.045 : 0.02);
    if (burstStart.current != null) {
      const elapsed = (performance.now() - burstStart.current) / 1000;
      const duration = 0.7;
      if (elapsed < duration) {
        const p = elapsed / duration;
        const burst = Math.sin(p * Math.PI) * 0.28 * (1 - p * 0.3);
        scale += burst;
      } else {
        burstStart.current = null;
      }
    }
    meshRef.current.scale.setScalar(scale);

    if (materialRef.current) {
      materialRef.current.color.lerp(color, reducedMotion ? 1 : 0.06);
      materialRef.current.emissive?.lerp?.(emissive, reducedMotion ? 1 : 0.06);
      materialRef.current.distort = reducedMotion ? 0.08 : active ? 0.45 : 0.22;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 12]} />
      <MeshDistortMaterial
        ref={materialRef}
        color={TONE_HEX.idle}
        emissive={TONE_HEX_SOFT.idle}
        emissiveIntensity={0.35}
        roughness={0.15}
        metalness={0.35}
        distort={0.3}
        speed={reducedMotion ? 0 : active ? 3.2 : 1.2}
      />
    </mesh>
  );
}
