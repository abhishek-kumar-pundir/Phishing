import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { RiskTone, TONE_HEX, TONE_HEX_SOFT } from "../../../lib/tone";

interface Props {
  position: [number, number, number];
  label: string;
  scoreLabel: string;
  tone: RiskTone;
  known: boolean; // this modality's score has arrived
  flowing: boolean; // pipeline still running -> animate particles toward the core
  reducedMotion: boolean;
}

const PARTICLE_COUNT = 5;

export function ModalityNode({ position, label, scoreLabel, tone, known, flowing, reducedMotion }: Props) {
  const nodeRef = useRef<THREE.Mesh>(null);
  const particleRefs = useRef<THREE.Mesh[]>([]);

  const curve = useMemo(() => {
    const start = new THREE.Vector3(...position);
    const end = new THREE.Vector3(0, 0, 0);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.y += 0.9;
    mid.multiplyScalar(0.92);
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [position]);

  const linePoints = useMemo(() => curve.getPoints(32), [curve]);
  const color = TONE_HEX[tone];
  const soft = TONE_HEX_SOFT[tone];

  useFrame((state, delta) => {
    if (nodeRef.current && !reducedMotion) {
      nodeRef.current.rotation.y += delta * 0.6;
      nodeRef.current.rotation.x += delta * 0.3;
    }

    if (!reducedMotion && flowing) {
      const t = state.clock.getElapsedTime();
      particleRefs.current.forEach((p, i) => {
        if (!p) return;
        const phase = i / PARTICLE_COUNT;
        const progress = (t * 0.45 + phase) % 1;
        const pt = curve.getPoint(progress);
        p.position.copy(pt);
        const s = Math.sin(progress * Math.PI); // fade in/out along the path
        p.scale.setScalar(0.05 + s * 0.05);
      });
    }
  });

  return (
    <group>
      <Line points={linePoints} color={known ? color : "#3B4456"} transparent opacity={known ? 0.55 : 0.25} lineWidth={1.2} />

      {flowing &&
        !reducedMotion &&
        Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <mesh key={i} ref={(el) => el && (particleRefs.current[i] = el)}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color={soft} transparent opacity={0.85} />
          </mesh>
        ))}

      <mesh ref={nodeRef} position={position}>
        <icosahedronGeometry args={[0.42, 4]} />
        <MeshDistortMaterial
          color={color}
          emissive={soft}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.3}
          distort={reducedMotion ? 0.05 : 0.25}
          speed={reducedMotion ? 0 : 1.6}
        />
      </mesh>

      <Html position={[position[0], position[1] - 0.72, position[2]]} center distanceFactor={7} zIndexRange={[10, 0]}>
        <div className="pointer-events-none flex select-none flex-col items-center whitespace-nowrap">
          <span className="text-[11px] font-medium uppercase tracking-wide text-mist-300">{label}</span>
          <span className="font-display text-sm font-semibold" style={{ color: known ? color : "#718096" }}>
            {scoreLabel}
          </span>
        </div>
      </Html>
    </group>
  );
}
