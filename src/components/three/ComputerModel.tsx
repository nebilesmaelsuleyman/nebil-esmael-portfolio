import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const Monitor = () => {
  return (
    <group position={[0, 1.35, 0]}>
      {/* Monitor bezel */}
      <RoundedBox args={[2.4, 1.5, 0.08]} radius={0.04} smoothness={4}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {/* Screen */}
      <mesh position={[0, 0.02, 0.045]}>
        <planeGeometry args={[2.15, 1.25]} />
        <meshStandardMaterial
          color="#0a0a1a"
          emissive="#3b82f6"
          emissiveIntensity={0.15}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
      {/* Code lines on screen */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[-0.3 + (i % 3) * 0.1, 0.4 - i * 0.12, 0.05]}>
          <planeGeometry args={[0.6 + Math.random() * 0.8, 0.04]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#3b82f6' : '#a78bfa'}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
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
      <group ref={groupRef} position={[0, -0.5, 0]} scale={1.3}>
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
