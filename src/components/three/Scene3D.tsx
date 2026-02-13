import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { ComputerModel } from './ComputerModel';

const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[0.5, 0.5, 0.5]} />
    <meshBasicMaterial color="#3b82f6" wireframe />
  </mesh>
);

const LoadingOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-center space-y-3">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-primary/80 text-sm font-medium">Loading 3D Model…</p>
    </div>
  </div>
);

export const Scene3D = () => {
  return (
    <div className="w-full h-full relative">
      {/* Loading overlay — shown until Canvas paints */}
      <Suspense fallback={<LoadingOverlay />}>
        <Canvas
          dpr={[1, 1.5]}           /* cap pixel-ratio for performance */
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={<LoadingFallback />}>
            {/* Camera: slightly above eye-level, looking at desk */}
            <PerspectiveCamera
              makeDefault
              position={[0, 1.5, 4.0]}
              fov={40}
            />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 4, 5]} intensity={0.9} color="#ffffff" />
            <pointLight position={[-2, 2, 2]} intensity={0.4} color="#3b82f6" />
            <pointLight position={[2, 2, -1]} intensity={0.3} color="#10b981" />

            <ComputerModel />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  );
};
