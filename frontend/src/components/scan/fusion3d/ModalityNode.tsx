import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Modality } from "../../../api/phish360";
import { pct } from "../../../lib/format";

interface Props {
  modality: Modality;
  position: [number, number, number];
  label: string;
  score: number | null | undefined;
  skipReason?: string;
  state: "idle" | "running" | "done";
  weight: number;
  totalWeight: number;
  isSelected: boolean;
  onClick: () => void;
  reducedMotion: boolean;
}

export function ModalityNode({
  modality,
  position,
  label,
  score,
  skipReason,
  state,
  weight,
  totalWeight,
  isSelected,
  onClick,
  reducedMotion,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Track pulse completion when transitioning to "done"
  const prevStateRef = useRef(state);
  const pulseStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (state === "done" && prevStateRef.current !== "done") {
      pulseStartTimeRef.current = performance.now();
    }
    prevStateRef.current = state;
  }, [state]);

  // Unified calm theme: nodes stay dark graphite/slate, singular accent #38C0E4 for running
  const nodeColor = state === "running" ? "#38C0E4" : isSelected ? "#38C0E4" : "#242A36";
  const emissiveColor = state === "running" ? "#0E3A4B" : "#121419";

  // Quadratic curve connecting node to the central core (0, 0, 0)
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...position);
    const end = new THREE.Vector3(0, 0, 0);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.y += 0.4;
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [position]);

  // Real 3D tube geometry for edge thickness based on fusion logreg weight
  const normalizedWeight = totalWeight > 0 ? weight / totalWeight : 0.25;
  const tubeRadius = Math.max(0.015, normalizedWeight * 0.07);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 32, tubeRadius, 8, false);
  }, [curve, tubeRadius]);

  useFrame((stateCtx) => {
    const t = stateCtx.clock.getElapsedTime();

    // Node subtle pulse during running
    if (meshRef.current) {
      if (state === "running" && !reducedMotion) {
        const s = 1.0 + Math.sin(t * 3.5) * 0.05;
        meshRef.current.scale.setScalar(s);
      } else {
        meshRef.current.scale.setScalar(isSelected ? 1.1 : 1.0);
      }
    }

    // Traveling pulse toward the core upon completion
    if (pulseMeshRef.current && pulseStartTimeRef.current != null) {
      const elapsed = (performance.now() - pulseStartTimeRef.current) / 1000;
      const pulseDuration = 0.75;
      if (elapsed < pulseDuration) {
        const progress = elapsed / pulseDuration;
        const pt = curve.getPoint(progress);
        pulseMeshRef.current.position.copy(pt);
        pulseMeshRef.current.visible = true;
      } else {
        pulseMeshRef.current.visible = false;
        pulseStartTimeRef.current = null;
      }
    } else if (pulseMeshRef.current) {
      pulseMeshRef.current.visible = false;
    }
  });

  const weightPercent = (normalizedWeight * 100).toFixed(1);
  const contribution = score != null ? (weight * score).toFixed(2) : "0.00";

  return (
    <group>
      {/* Real Edge Tube */}
      <mesh
        geometry={tubeGeometry}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered || isSelected ? "#38C0E4" : state === "done" ? "#2E3544" : "#1A1E27"}
          roughness={0.4}
          metalness={0.2}
          transparent
          opacity={state === "done" ? 0.7 : 0.3}
        />
      </mesh>

      {/* Edge Completion Pulse Particle */}
      <mesh ref={pulseMeshRef} visible={false}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#38C0E4" />
      </mesh>

      {/* Modality Node Mesh */}
      <mesh
        ref={meshRef}
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.36, 24, 24]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={emissiveColor}
          emissiveIntensity={state === "running" ? 0.5 : isSelected ? 0.3 : 0.15}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Radial Probability Ring (singular accent #38C0E4 when scored) */}
      {state === "done" && score != null && (
        <group position={position} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.42, 0.46, 32, 1, 0, score * Math.PI * 2]} />
            <meshBasicMaterial color="#38C0E4" side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.42, 0.46, 32, 1]} />
            <meshBasicMaterial color="#1E232E" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Node HTML Label & Score */}
      <Html
        position={[position[0], position[1] - 0.62, position[2]]}
        center
        distanceFactor={8}
        zIndexRange={[10, 0]}
      >
        <button
          type="button"
          onClick={onClick}
          className={`flex flex-col items-center select-none font-mono transition-transform ${
            isSelected ? "scale-105" : ""
          }`}
        >
          <span className="text-[10px] font-semibold tracking-wider text-mist-300 uppercase">
            {label}
          </span>
          <span
            className={`text-[10px] font-bold tabular px-1.5 py-0.5 rounded border mt-0.5 ${
              isSelected
                ? "border-brand text-brand bg-surface-card"
                : "border-surface-border text-mist-200 bg-surface-card/90"
            }`}
          >
            {score != null ? pct(score, 0) : state === "running" ? "RUN" : skipReason ? "SKIP" : "—"}
          </span>
        </button>
      </Html>

      {/* Hover Tooltip: Weight x Probability */}
      {hovered && (
        <Html
          position={[position[0], position[1] + 0.62, position[2]]}
          center
          distanceFactor={7}
          zIndexRange={[50, 10]}
        >
          <div className="pointer-events-none border border-surface-border bg-surface-card/95 px-3 py-2 rounded shadow-lg font-mono text-[10px] space-y-0.5 text-mist-200 whitespace-nowrap">
            <div className="text-brand font-semibold uppercase">{label} Modality</div>
            <div className="text-mist-400">
              Weight: <span className="text-mist-100">{weight.toFixed(2)} ({weightPercent}%)</span>
            </div>
            <div className="text-mist-400">
              Score: <span className="text-mist-100">{score != null ? pct(score, 1) : "unavailable"}</span>
            </div>
            <div className="text-mist-400 border-t border-surface-border pt-1 mt-1">
              Weight × Score: <span className="text-brand font-semibold">+{contribution}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
