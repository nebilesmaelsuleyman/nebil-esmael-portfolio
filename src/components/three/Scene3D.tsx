import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { AbstractShape } from './AbstractShape';

export const Scene3D = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
          
          {/* Ambient lighting */}
          <ambientLight intensity={0.3} />
          
          {/* Key light */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            color="#3b82f6"
          />
          
          {/* Fill light */}
          <directionalLight
            position={[-10, -10, -5]}
            intensity={0.5}
            color="#10b981"
          />
          
          {/* Rim light */}
          <pointLight position={[0, 5, -10]} intensity={0.8} color="#ffffff" />
          
          <AbstractShape />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
