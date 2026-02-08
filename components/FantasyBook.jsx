'use client';

import { useRef, useEffect } from 'react';
import { useGLTF, Float, Environment, ContactShadows } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function BookModel() {
  const groupRef = useRef();
  const { scene } = useGLTF('/medieval_fantasy_book-v1.glb');
  
  useEffect(() => {
    if (scene) {
      // Center the model and adjust scale if needed
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // Center the model
      scene.position.x = -center.x;
      scene.position.y = -center.y;
      scene.position.z = -center.z;
      
      // Scale to fit (adjust multiplier as needed)
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      scene.scale.setScalar(scale);
      
      // Traverse and set materials
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Enhance materials
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [scene]);
  
  // Slow rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });
  
  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

export default function FantasyBook() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        <BookModel />
        
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
        />
        
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload('/medieval_fantasy_book-v1.glb');
