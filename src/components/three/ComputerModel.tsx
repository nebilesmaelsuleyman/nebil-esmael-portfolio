import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Realistic code lines with syntax highlighting
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
    { text: ' deploy', color: '#dcdcaa' },
    { text: '() {', color: '#d4d4d4' },
  ],
  [
    { text: '  const', color: '#c586c0' },
    { text: ' res', color: '#9cdcfe' },
    { text: ' = ', color: '#d4d4d4' },
    { text: 'await', color: '#c586c0' },
    { text: ' api', color: '#dcdcaa' },
    { text: '.', color: '#d4d4d4' },
    { text: 'call', color: '#dcdcaa' },
    { text: '();', color: '#d4d4d4' },
  ],
  [
    { text: '  if', color: '#c586c0' },
    { text: ' (res.', color: '#d4d4d4' },
    { text: 'ok', color: '#9cdcfe' },
    { text: ') {', color: '#d4d4d4' },
  ],
  [
    { text: '    console.', color: '#d4d4d4' },
    { text: 'log', color: '#dcdcaa' },
    { text: '("Success!");', color: '#ce9178' },
  ],
  [
    { text: '  }', color: '#d4d4d4' },
  ],
  [
    { text: '}', color: '#d4d4d4' },
  ],
  [
    { text: '// Professional Development', color: '#6a9955' },
  ],
  [
    { text: 'export', color: '#c586c0' },
    { text: ' default', color: '#569cd6' },
    { text: ' Portfolio', color: '#4ec9b0' },
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
    <group ref={groupRef} position={[-0.78, y, 0.052]}>
      {tokens.map((token, i) => {
        if (!token.text) return null;
        const prevLen = tokens
          .slice(0, i)
          .reduce((s, t) => s + t.text.length, 0);
        return (
          <Text
            key={i}
            position={[prevLen * 0.038, 0, 0]}
            fontSize={0.055}
            color={token.color}
            anchorX="left"
            anchorY="middle"
          // Using default font to ensure fast loading and no network errors
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
    if (matRef.current) matRef.current.opacity = Math.sin(t * 6) > 0 ? 0.9 : 0;
    if (meshRef.current) {
      const cycle = t % 12;
      const li = Math.min(Math.floor(cycle / 0.8), codeLines.length - 1);
      const lineText = codeLines[li].map((tok) => tok.text).join('');
      meshRef.current.position.x = -0.78 + lineText.length * 0.038;
      meshRef.current.position.y = 0.32 - li * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} position={[-0.78, 0.32, 0.053]}>
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

/* ── Realistic Monitor (iMac-style) ─────────────────────────────── */
const Monitor = () => {
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.intensity = 0.5 + Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Front bezel – Gray Color as requested */}
      <RoundedBox args={[2.0, 1.25, 0.06]} radius={0.04} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.3} />
      </RoundedBox>

      {/* Screen area – slightly recessed */}
      <mesh position={[0, 0.02, 0.032]}>
        <planeGeometry args={[1.9, 1.15]} />
        <meshBasicMaterial color="#0b0b0f" />
      </mesh>

      {/* Actual screen emitting code */}
      <mesh position={[0, 0.02, 0.035]}>
        <planeGeometry args={[1.85, 1.1]} />
        <meshBasicMaterial color="#1e1e2e" />
      </mesh>

      {/* Code on screen */}
      <group position={[0, 0.02, 0.001]}>
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

      {/* Glass overlay - Simplified to Standard Material for performance */}
      <mesh position={[0, 0.02, 0.038]}>
        <planeGeometry args={[1.85, 1.1]} />
        <meshStandardMaterial
          transparent
          opacity={0.1}
          roughness={0.1}
          metalness={0.5}
          color="#ffffff"
        />
      </mesh>

      {/* Bottom chin – matching gray status */}
      <mesh position={[0, -0.6, 0.031]}>
        <planeGeometry args={[1.98, 0.08]} />
        <meshStandardMaterial color="#5a5a5a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Stand neck */}
      <mesh position={[0, -0.75, -0.05]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 0.35, 16]} />
        <meshStandardMaterial color="#8a8a8a" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Stand base */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.03, 32]} />
        <meshStandardMaterial color="#8a8a8a" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Subtle screen glow */}
      <pointLight
        ref={glowRef}
        position={[0, 0, 0.2]}
        color="#3b82f6"
        intensity={0.5}
        distance={2}
      />
    </group>
  );
};

/* ── Root export ────────────────────────────────────────────────── */
export const ComputerModel = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle floating and looking at cursor effect
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.04;
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
      <group ref={groupRef} position={[0, 0, 0]} scale={1.4}>
        <Monitor />
      </group>
    </Float>
  );
};
