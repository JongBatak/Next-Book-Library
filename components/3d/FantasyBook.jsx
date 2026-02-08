'use client';

import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, Center } from '@react-three/drei';

export default function FantasyBook(props) {
  const group = useRef();
  const { scene, animations } = useGLTF('/medieval_fantasy_book-v1.glb');
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    console.log('🎬 Animations:', names);
    console.log('📦 Model loaded');
    
    if (names.length > 0 && actions[names[0]]) {
      actions[names[0]].play();
    }
  }, [actions, names]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <group ref={group} {...props} position={[0, 0, 0]}>
      <primitive 
        object={scene} 
        scale={10}
      />
    </group>
  );
}

useGLTF.preload('/medieval_fantasy_book-v1.glb');
