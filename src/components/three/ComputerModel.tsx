import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Code tokens with syntax colors
const codeLines = [
  [
    { text: 0.25, color: '#c586c0' }, // keyword (purple)
    { text: 0.15, color: '#9cdcfe' }, // variable (blue)
    { text: 0.1, color: '#d4d4d4' },  // operator
    { text: 0.35, color: '#4ec9b0' }, // type (teal)
    { text: 0.1, color: '#d4d4d4' },  // punctuation
  ],
  [
    { text: 0.12, color: '#569cd6' }, // keyword
    { text: 0.2, color: '#dcdcaa' },  // function (yellow)
    { text: 0.08, color: '#d4d4d4' }, // paren
    { text: 0.18, color: '#9cdcfe' }, // param
    { text: 0.06, color: '#d4d4d4' }, // paren
    { text: 0.1, color: '#569cd6' },  // arrow
  ],
  [
    { text: 0.08, color: '#d4d4d4' }, // indent
    { text: 0.18, color: '#c586c0' }, // keyword
    { text: 0.3, color: '#9cdcfe' },  // variable
    { text: 0.1, color: '#d4d4d4' },  // operator
    { text: 0.2, color: '#dcdcaa' },  // function call
  ],
  [
    { text: 0.12, color: '#d4d4d4' }, // indent
    { text: 0.15, color: '#569cd6' }, // keyword
    { text: 0.08, color: '#d4d4d4' }, // paren
    { text: 0.25, color: '#9cdcfe' }, // condition
    { text: 0.08, color: '#d4d4d4' }, // paren
    { text: 0.06, color: '#d4d4d4' }, // brace
  ],
  [
    { text: 0.16, color: '#d4d4d4' }, // indent
    { text: 0.2, color: '#dcdcaa' },  // function
    { text: 0.08, color: '#d4d4d4' }, // paren
    { text: 0.35, color: '#ce9178' }, // string (orange)
    { text: 0.08, color: '#d4d4d4' }, // paren
  ],
  [
    { text: 0.12, color: '#d4d4d4' }, // indent
    { text: 0.06, color: '#d4d4d4' }, // brace
  ],
  [
    { text: 0.06, color: '#d4d4d4' }, // brace
  ],
  [
    { text: 0.0, color: '#d4d4d4' },  // empty line
  ],
  [
    { text: 0.2, color: '#6a9955' },  // comment (green)
    { text: 0.45, color: '#6a9955' }, // comment continued
  ],
  [
    { text: 0.18, color: '#c586c0' }, // keyword
    { text: 0.12, color: '#569cd6' }, // keyword
    { text: 0.22, color: '#4ec9b0' }, // class name
    { text: 0.1, color: '#d4d4d4' },  // brace
  ],
];

const CodeLine = ({ tokens, y, animOffset }: { tokens: { text: number; color: string }[]; y: number; animOffset: number }) => {
  const materialRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    // Simple cycling: each line appears one after another, then all fade and restart
    const cycleDuration = 12;
    const t = (time % cycleDuration);
    const lineStart = animOffset * 0.8; // when this line starts appearing

    tokens.forEach((_, i) => {
      const mat = materialRefs.current[i];
      if (mat) {
        const tokenStart = lineStart + i * 0.12;
        // fade in over 0.3s, stay visible, then fade out near cycle end
        const fadeIn = Math.max(0, Math.min(1, (t - tokenStart) * 4));
        const fadeOut = Math.max(0, Math.min(1, (cycleDuration - 1 - t) * 2));
        mat.opacity = Math.min(fadeIn, fadeOut) * 0.95;
      }
    });
  });

  const elements = useMemo(() => {
    let xPos = -0.85;
    return tokens.map((token, i) => {
      if (token.text === 0) return null;
      const x = xPos + token.text / 2;
      xPos += token.text + 0.025;
      return { x, token, i };
    }).filter(Boolean);
  }, [tokens]);

  return (
    <group position={[0, y, 0.046]}>
      {elements.map((el) => {
        if (!el) return null;
        return (
          <mesh key={el.i} position={[el.x, 0, 0]}>
            <planeGeometry args={[el.token.text, 0.04]} />
            <meshBasicMaterial
              ref={(ref) => { materialRefs.current[el.i] = ref; }}
              color={el.token.color}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const Cursor = () => {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (matRef.current) {
      matRef.current.opacity = Math.sin(time * 5) > 0 ? 0.95 : 0;
    }
    if (meshRef.current) {
      const cycleDuration = 12;
      const t = time % cycleDuration;
      const lineIndex = Math.min(Math.floor(t / 0.8), codeLines.length - 1);
      const line = codeLines[lineIndex];
      const lineWidth = line ? line.reduce((sum, tok) => sum + tok.text + 0.025, 0) : 0;
      meshRef.current.position.x = -0.85 + lineWidth;
      meshRef.current.position.y = 0.4 - lineIndex * 0.09;
    }
  });

  return (
    <mesh ref={meshRef} position={[-0.85, 0.4, 0.047]}>
      <planeGeometry args={[0.012, 0.045]} />
      <meshBasicMaterial ref={matRef} color="#d4d4d4" transparent opacity={0.9} depthWrite={false} />
    </mesh>
  );
};

const Monitor = () => {
  return (
    <group position={[0, 1.35, 0]}>
      {/* Monitor bezel */}
      <RoundedBox args={[2.4, 1.5, 0.08]} radius={0.04} smoothness={4}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {/* Screen background - dark like VS Code */}
      <mesh position={[0, 0.02, 0.043]}>
        <planeGeometry args={[2.15, 1.25]} />
        <meshBasicMaterial color="#1e1e2e" />
      </mesh>
      {/* Animated code lines rendered on top of screen */}
      <group position={[0, 0.02, 0.001]}>
        {codeLines.map((tokens, i) => (
          <CodeLine key={i} tokens={tokens} y={0.4 - i * 0.09} animOffset={i} />
        ))}
        <Cursor />
      </group>
      {/* Stand neck */}
      <mesh position={[0, -0.95, -0.05]}>
        <boxGeometry args={[0.15, 0.4, 0.08]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Stand base */}
      <mesh position={[0, -1.18, 0.1]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.8, 0.04, 0.5]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

const Keyboard = () => {
  return (
    <group position={[0, 0.02, 0.8]}>
      <RoundedBox args={[1.6, 0.06, 0.55]} radius={0.02} smoothness={4}>
        <meshStandardMaterial color="#1e1e30" metalness={0.7} roughness={0.3} />
      </RoundedBox>
      {/* Key rows */}
      {[...Array(4)].map((_, row) =>
        [...Array(12)].map((_, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[-0.66 + col * 0.12, 0.04, -0.18 + row * 0.12]}
          >
            <boxGeometry args={[0.09, 0.03, 0.09]} />
            <meshStandardMaterial
              color="#2a2a42"
              metalness={0.5}
              roughness={0.4}
              emissive={row === 1 && col >= 3 && col <= 6 ? '#3b82f6' : '#000000'}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))
      )}
    </group>
  );
};

const Mouse = () => {
  return (
    <group position={[1.1, 0.03, 0.85]}>
      <mesh>
        <capsuleGeometry args={[0.08, 0.12, 8, 16]} />
        <meshStandardMaterial color="#1e1e30" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Scroll wheel */}
      <mesh position={[0, 0.085, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.03, 8]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

const CoffeeMug = () => {
  return (
    <group position={[-1.4, 0.15, 0.6]}>
      {/* Mug body */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.08, 0.25, 16]} />
        <meshStandardMaterial color="#f5f5f0" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.06, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#f5f5f0" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Coffee */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
        <meshStandardMaterial color="#3d1c02" metalness={0.3} roughness={0.2} />
      </mesh>
    </group>
  );
};

const Desk = () => {
  return (
    <group position={[0, -0.12, 0.4]}>
      {/* Desktop surface */}
      <RoundedBox args={[3.5, 0.08, 2]} radius={0.02} smoothness={4}>
        <meshStandardMaterial color="#1a1a28" metalness={0.6} roughness={0.4} />
      </RoundedBox>
    </group>
  );
};

const PlantPot = () => {
  return (
    <group position={[1.4, 0.15, 0.2]}>
      {/* Pot */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.07, 0.18, 8]} />
        <meshStandardMaterial color="#e8d5b7" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* Plant leaves */}
      {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(angle) * 0.06,
            0.18 + i * 0.03,
            Math.cos(angle) * 0.06,
          ]}
          rotation={[0.3 * Math.sin(angle), angle, 0.2 * Math.cos(angle)]}
        >
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color="#10b981" metalness={0.1} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

export const ComputerModel = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.08 + 0.25;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, -0.2, 0]} scale={1.3}>
        <Monitor />
        <Keyboard />
        <Mouse />
        <CoffeeMug />
        <Desk />
        <PlantPot />
      </group>
    </Float>
  );
};
