'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Environment, ContactShadows, OrbitControls, Loader } from '@react-three/drei';
import FantasyBook from './FantasyBook';

export default function BookScene() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ 
          position: [0, 45, 15], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={50}
            shadow-camera-left={-15}
            shadow-camera-right={15}
            shadow-camera-top={15}
            shadow-camera-bottom={-15}
          />
          <pointLight position={[-10, 10, -10]} intensity={0.4} />
          <spotLight
            position={[0, 15, 0]}
            angle={0.5}
            penumbra={1}
            intensity={0.5}
            castShadow
          />
          
          {/* The Model */}
          <FantasyBook />
          
          {/* Ground Shadow */}
          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.5}
            scale={15}
            blur={3}
            far={5}
          />
          
          {/* Environment */}
          <Environment preset="sunset" />
          
          {/* Camera Controls - Bird's Eye View */}
          <OrbitControls
            target={[0, 0, 0]}
            enablePan={false}
            enableZoom={true}
            minDistance={20}
            maxDistance={80}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2.8}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
      
      <Loader
        containerStyles={{
          background: 'rgba(0,0,0,0.5)'
        }}
        innerStyles={{
          background: '#7c3aed',
          width: '250px',
          height: '3px'
        }}
        barStyles={{
          background: '#c084fc',
          height: '3px'
        }}
        dataStyles={{
          color: '#fff',
          fontSize: '12px',
          fontFamily: 'sans-serif',
          marginTop: '10px'
        }}
      />
    </div>
  );
}
