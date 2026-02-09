import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const ScreenContent = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        
        void main() {
          float line = step(0.98, fract(vUv.y * 20.0 + uTime * 0.5));
          vec3 bg = mix(vec3(0.02, 0.02, 0.05), vec3(0.05, 0.08, 0.12), vUv.y);
          vec3 code = mix(vec3(0.2, 0.8, 0.5), vec3(0.3, 0.6, 1.0), sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5);
          
          float codeLines = step(0.5, fract(vUv.y * 12.0 - uTime * 0.3));
          float codeBlocks = step(0.3 + sin(vUv.y * 30.0) * 0.2, vUv.x) * step(vUv.x, 0.7 + cos(vUv.y * 20.0) * 0.15);
          
          vec3 col = mix(bg, code * 0.6, codeLines * codeBlocks * 0.4);
          col += vec3(0.1, 0.4, 0.3) * line * 0.3;
          
          // Cursor blink
          float cursor = step(0.48, vUv.y) * step(vUv.y, 0.52) * step(0.3, vUv.x) * step(vUv.x, 0.32);
          cursor *= step(0.5, fract(uTime * 2.0));
          col += vec3(0.2, 0.9, 0.5) * cursor;
          
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    }),
    []
  );

  return (
    <mesh ref={meshRef} position={[0, 0.45, 0.02]}>
      <planeGeometry args={[2.6, 1.5]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  );
};

export const ComputerModel = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const bodyColor = useMemo(() => new THREE.Color('#1a1a2e'), []);
  const accentColor = useMemo(() => new THREE.Color('#10b981'), []);
  const metalColor = useMemo(() => new THREE.Color('#2d2d3d'), []);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={[0, -0.5, 0]} scale={1.2}>
        {/* Monitor body */}
        <RoundedBox args={[3, 1.9, 0.12]} radius={0.06} position={[0, 0.45, 0]}>
          <meshStandardMaterial color={bodyColor} metalness={0.7} roughness={0.3} />
        </RoundedBox>

        {/* Screen bezel */}
        <RoundedBox args={[2.75, 1.65, 0.01]} radius={0.03} position={[0, 0.45, 0.065]}>
          <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.5} />
        </RoundedBox>

        {/* Screen with animated code */}
        <ScreenContent />

        {/* Screen glow */}
        <pointLight position={[0, 0.5, 1]} intensity={0.5} color="#10b981" distance={4} />

        {/* Monitor stand - neck */}
        <RoundedBox args={[0.3, 0.6, 0.08]} radius={0.02} position={[0, -0.6, 0]}>
          <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.2} />
        </RoundedBox>

        {/* Monitor stand - base */}
        <RoundedBox args={[1.2, 0.06, 0.6]} radius={0.03} position={[0, -0.9, 0.1]}>
          <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.2} />
        </RoundedBox>

        {/* Keyboard */}
        <RoundedBox args={[2.2, 0.06, 0.7]} radius={0.03} position={[0, -0.95, 1.2]}>
          <meshStandardMaterial color={bodyColor} metalness={0.6} roughness={0.4} />
        </RoundedBox>

        {/* Keyboard keys - rows */}
        {[0, 1, 2, 3].map((row) =>
          Array.from({ length: 10 }).map((_, col) => (
            <RoundedBox
              key={`key-${row}-${col}`}
              args={[0.15, 0.03, 0.12]}
              radius={0.01}
              position={[-0.85 + col * 0.19, -0.92, 0.95 + row * 0.16]}
            >
              <meshStandardMaterial color="#2a2a3e" metalness={0.5} roughness={0.5} />
            </RoundedBox>
          ))
        )}

        {/* LED strip on monitor */}
        <mesh position={[0, -0.2, 0.07]}>
          <boxGeometry args={[2.5, 0.015, 0.01]} />
          <meshBasicMaterial color={accentColor} />
        </mesh>

        {/* Accent light glow */}
        <pointLight position={[0, -0.2, 0.3]} intensity={0.3} color="#10b981" distance={2} />
      </group>
    </Float>
  );
};
