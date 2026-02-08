'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export default function ProceduralBook({ title = "E-LIBRARY PRESTASI", ...props }) {
  const containerRef = useRef();
  const frontCoverPivotRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Animation state
  const targetRotationY = useRef(0);
  const currentRotationY = useRef(0);
  const targetCoverRotation = useRef(0);
  
  // Dimensions
  const bookWidth = 2;
  const bookHeight = 2.8;
  const bookDepth = 0.3;
  const coverThickness = 0.05;
  const spineWidth = 0.15;
  
  // Colors
  const coverColor = "#0a192f"; // Deep midnight blue
  const spineColor = "#FFD700"; // Gold
  const pageColor = "#fdfbf7"; // Off-white
  
  useFrame((state, delta) => {
    if (!containerRef.current || !frontCoverPivotRef.current) return;
    
    if (hovered) {
      // Stop spinning, face camera, open book
      targetRotationY.current = 0;
      targetCoverRotation.current = -Math.PI * 0.8;
      
      // Tilt back to 0
      containerRef.current.rotation.z = THREE.MathUtils.lerp(
        containerRef.current.rotation.z,
        0,
        delta * 3
      );
    } else {
      // Continuous spin, tilted
      targetRotationY.current += delta * 0.5;
      targetCoverRotation.current = 0;
      
      // Tilt to 20 degrees
      containerRef.current.rotation.z = THREE.MathUtils.lerp(
        containerRef.current.rotation.z,
        0.35,
        delta * 3
      );
    }
    
    // Smooth rotation
    currentRotationY.current = THREE.MathUtils.lerp(
      currentRotationY.current,
      targetRotationY.current,
      delta * 3
    );
    
    containerRef.current.rotation.y = currentRotationY.current;
    
    // Smooth cover opening
    frontCoverPivotRef.current.rotation.y = THREE.MathUtils.lerp(
      frontCoverPivotRef.current.rotation.y,
      targetCoverRotation.current,
      delta * 4
    );
  });
  
  return (
    <group
      ref={containerRef}
      {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* BACK COVER (Static) */}
      <mesh position={[0, 0, -bookDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[bookWidth, bookHeight, coverThickness]} />
        <meshStandardMaterial color={coverColor} roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Back Cover Text: "HIGH IQ" */}
      <Text
        position={[0, 0, -bookDepth / 2 - coverThickness / 2 - 0.01]}
        fontSize={0.6}
        color="white"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI, 0]}
      >
        HIGH IQ
      </Text>
      
      {/* SPINE (Static) */}
      <mesh position={[-bookWidth / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[spineWidth, bookHeight, bookDepth]} />
        <meshStandardMaterial color={spineColor} roughness={0.3} metalness={0.6} />
      </mesh>
      
      {/* PAPER BLOCK (Static) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[bookWidth - spineWidth, bookHeight - 0.1, bookDepth - coverThickness * 2]} />
        <meshStandardMaterial color={pageColor} roughness={0.8} />
      </mesh>
      
      {/* Inner Page Text: "Sampaikan perasaan dengan literasi" */}
      <Text
        position={[0.3, 0, bookDepth / 2 - 0.01]}
        fontSize={0.18}
        color="#333"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.5}
        textAlign="center"
        font="serif"
      >
        Sampaikan perasaan{'\n'}dengan literasi
      </Text>
      
      {/* FRONT COVER PIVOT (The Key to Realistic Opening) */}
      <group
        ref={frontCoverPivotRef}
        position={[-bookWidth / 2 + spineWidth / 2, 0, 0]}
      >
        {/* Front Cover Mesh (offset so edge is at pivot) */}
        <mesh
          position={[(bookWidth - spineWidth) / 2, 0, bookDepth / 2]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[bookWidth - spineWidth, bookHeight, coverThickness]} />
          <meshStandardMaterial color={coverColor} roughness={0.4} metalness={0.1} />
        </mesh>
        
        {/* Front Cover Title Text */}
        <Text
          position={[(bookWidth - spineWidth) / 2, 0.3, bookDepth / 2 + coverThickness / 2 + 0.01]}
          fontSize={0.25}
          color={spineColor}
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.5}
          textAlign="center"
        >
          {title}
        </Text>
      </group>
    </group>
  );
}
