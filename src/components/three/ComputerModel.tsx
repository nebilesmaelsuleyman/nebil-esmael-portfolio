import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// Code lines with syntax highlighting
const codeLines = [
  [
    { text: 'const', color: '#c586c0' },
    { text: ' app', color: '#9cdcfe' },
    { text: ' = ', color: '#d4d4d4' },
    { text: 'express', color: '#dcdcaa' },
    { text: '();', color: '#d4d4d4' },
  ],
  [
    { text: 'async', color: '#569cd6' },
    { text: ' ', color: '#d4d4d4' },
    { text: 'function', color: '#569cd6' },
    { text: ' build', color: '#dcdcaa' },
    { text: '() {', color: '#d4d4d4' },
  ],
  [
    { text: '  const', color: '#c586c0' },
    { text: ' data', color: '#9cdcfe' },
    { text: ' = ', color: '#d4d4d4' },
    { text: 'await', color: '#c586c0' },
    { text: ' fetch', color: '#dcdcaa' },
    { text: '();', color: '#d4d4d4' },
  ],
  [
    { text: '  if', color: '#c586c0' },
    { text: ' (data.', color: '#d4d4d4' },
    { text: 'ok', color: '#9cdcfe' },
    { text: ') {', color: '#d4d4d4' },
  ],
  [
    { text: '    return', color: '#c586c0' },
    { text: ' data.', color: '#d4d4d4' },
    { text: 'json', color: '#dcdcaa' },
    { text: '();', color: '#d4d4d4' },
  ],
  [
    { text: '  }', color: '#d4d4d4' },
  ],
  [
    { text: '}', color: '#d4d4d4' },
  ],
  [
    { text: '// Built with passion', color: '#6a9955' },
  ],
  [
    { text: 'export default', color: '#c586c0' },
    { text: ' App', color: '#4ec9b0' },
    { text: ';', color: '#d4d4d4' },
  ],
];

/* ── Code line rendered as <Text> tokens ────────────────────────── */
const CodeLine = ({
  tokens,
  y,
  animOffset,
}: {
  tokens: { text: string; color: string }[];
  y: number;
  animOffset: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime % 12;
    const lineStart = animOffset * 0.8;
    const fadeIn = Math.min(1, Math.max(0, (t - lineStart) * 4));
    const fadeOut = Math.min(1, Math.max(0, (11 - t) * 2));
    const opacity = Math.min(fadeIn, fadeOut) * 0.95;

    groupRef.current?.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        (child.material as THREE.MeshBasicMaterial).opacity = opacity;
      }
    });
  });

  return (
    <group ref={groupRef} position={[-0.75, y, 0.052]}>
      {tokens.map((token, i) => {
        if (!token.text) return null;
        const prevLen = tokens
          .slice(0, i)
          .reduce((s, t) => s + t.text.length, 0);
        return (
          <Text
            key={i}
            position={[prevLen * 0.038, 0, 0]}
            fontSize={0.06}
            color={token.color}
            anchorX="left"
            anchorY="middle"
          >
            {token.text}
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </Text>
        );
      })}
    </group>
  );
};

/* ── Blinking cursor ────────────────────────────────────────────── */
const Cursor = () => {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (matRef.current) matRef.current.opacity = Math.sin(t * 5) > 0 ? 0.9 : 0;
    if (meshRef.current) {
      const cycle = t % 12;
      const li = Math.min(Math.floor(cycle / 0.8), codeLines.length - 1);
      const lineText = codeLines[li].map((tok) => tok.text).join('');
      meshRef.current.position.x = -0.75 + lineText.length * 0.038;
      meshRef.current.position.y = 0.32 - li * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} position={[-0.75, 0.32, 0.053]}>
      <planeGeometry args={[0.012, 0.05]} />
      <meshBasicMaterial
        ref={matRef}
        color="#d4d4d4"
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </mesh>
  );
};

/* ── Monitor (iMac-style) ───────────────────────────────────────── */
const Monitor = () => (
  <group position={[0, 0.9, 0]}>
    {/* Back shell – silver aluminum */}
    <mesh>
      <boxGeometry args={[2.0, 1.25, 0.06]} />
      <meshStandardMaterial color="#c0c0c8" metalness={0.7} roughness={0.25} />
    </mesh>

    {/* Thin black bezel all around */}
    <mesh position={[0, 0, 0.031]}>
      <planeGeometry args={[1.95, 1.2]} />
      <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.5} />
    </mesh>

    {/* Screen – dark editor background */}
    <mesh position={[0, 0.02, 0.035]}>
      <planeGeometry args={[1.8, 1.05]} />
      <meshBasicMaterial color="#1e1e2e" />
    </mesh>

    {/* Code on screen */}
    <group position={[0, 0, 0.001]}>
      {codeLines.map((tokens, i) => (
        <CodeLine
          key={i}
          tokens={tokens}
          y={0.32 - i * 0.08}
          animOffset={i}
        />
      ))}
      <Cursor />
    </group>

    {/* Monitor chin / brand strip */}
    <mesh position={[0, -0.6, 0.031]}>
      <planeGeometry args={[1.95, 0.06]} />
      <meshStandardMaterial color="#d0d0d8" metalness={0.6} roughness={0.3} />
    </mesh>

    {/* ── Stand neck (thin silver cylinder) ── */}
    <mesh position={[0, -0.78, -0.04]}>
      <cylinderGeometry args={[0.04, 0.06, 0.35, 12]} />
      <meshStandardMaterial color="#b0b0b8" metalness={0.8} roughness={0.15} />
    </mesh>

    {/* ── Stand base (flat oval) ── */}
    <mesh position={[0, -0.96, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.3, 0.32, 0.025, 24]} />
      <meshStandardMaterial color="#b8b8c0" metalness={0.7} roughness={0.2} />
    </mesh>
  </group>
);

/* ── Keyboard (light silver/white, clearly visible keys) ────────── */
const Keyboard = () => (
  <group position={[0, -0.04, 0.75]}>
    {/* Base plate – light aluminum */}
    <mesh>
      <boxGeometry args={[1.3, 0.04, 0.4]} />
      <meshStandardMaterial color="#d8d8e0" metalness={0.5} roughness={0.35} />
    </mesh>

    {/* Key rows */}
    {[...Array(4)].map((_, row) =>
      [...Array(12)].map((_, col) => (
        <mesh
          key={`${row}-${col}`}
          position={[-0.55 + col * 0.1, 0.03, -0.14 + row * 0.09]}
        >
          <boxGeometry args={[0.08, 0.02, 0.07]} />
          <meshStandardMaterial
            color="#f0f0f4"
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>
      )),
    )}

    {/* Space bar */}
    <mesh position={[0, 0.03, 0.17]}>
      <boxGeometry args={[0.5, 0.02, 0.07]} />
      <meshStandardMaterial color="#e8e8f0" metalness={0.2} roughness={0.6} />
    </mesh>
  </group>
);

/* ── Mouse (white, simple, recognisable) ────────────────────────── */
const Mouse = () => (
  <group position={[0.85, -0.02, 0.8]}>
    {/* Body – white capsule */}
    <mesh rotation={[0.15, 0, 0]}>
      <capsuleGeometry args={[0.06, 0.08, 8, 16]} />
      <meshStandardMaterial color="#e8e8f0" metalness={0.2} roughness={0.5} />
    </mesh>

    {/* Scroll wheel */}
    <mesh position={[0, 0.065, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.012, 0.012, 0.025, 8]} />
      <meshStandardMaterial color="#a0a0a8" metalness={0.5} roughness={0.3} />
    </mesh>
  </group>
);

/* ── Small desk surface ─────────────────────────────────────────── */
const Desk = () => (
  <mesh position={[0, -0.08, 0.5]} rotation={[0, 0, 0]}>
    <boxGeometry args={[2.4, 0.04, 1.2]} />
    <meshStandardMaterial color="#3a3a4a" metalness={0.25} roughness={0.65} />
  </mesh>
);

/* ── Root export ────────────────────────────────────────────────── */
export const ComputerModel = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(clock.elapsedTime * 0.3) * 0.06;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.02} floatIntensity={0.15}>
      <group ref={groupRef} position={[0, -0.15, 0]} scale={1.45}>
        <Monitor />
        <Keyboard />
        <Mouse />
        <Desk />
      </group>
    </Float>
  );
};
