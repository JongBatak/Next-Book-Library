// 'use client';

// import { useEffect, useRef, useState } from 'react';

// function AnimatedSphere() {
//   const meshRef = useRef();
  
//   return null;
// }

// function Books3D() {
//   return null;
// }

// export default function Scene3D() {
//   const [Canvas, setCanvas] = useState(null);
//   const [components, setComponents] = useState(null);

//   useEffect(() => {
//     // Only import on client side
//     import('@react-three/fiber').then((fiber) => {
//       import('@react-three/drei').then((drei) => {
//         setCanvas(() => fiber.Canvas);
//         setComponents({
//           useFrame: fiber.useFrame,
//           OrbitControls: drei.OrbitControls,
//           Sphere: drei.Sphere,
//           MeshDistortMaterial: drei.MeshDistortMaterial,
//           Float: drei.Float
//         });
//       });
//     });
//   }, []);

//   if (!Canvas || !components) {
//     return (
//       <div className="w-full h-full flex items-center justify-center">
//         <div className="text-white/50">Loading 3D Scene...</div>
//       </div>
//     );
//   }

//   const { useFrame, OrbitControls, Sphere, MeshDistortMaterial, Float } = components;

//   function AnimatedSphereComponent() {
//     const meshRef = useRef();
    
//     useFrame((state) => {
//       if (meshRef.current) {
//         meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
//         meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
//       }
//     });

//     return (
//       <Float speed={2} rotationIntensity={1} floatIntensity={2}>
//         <Sphere ref={meshRef} args={[1, 100, 100]} scale={2.5}>
//           <MeshDistortMaterial
//             color="#8b5cf6"
//             attach="material"
//             distort={0.5}
//             speed={2}
//             roughness={0.2}
//             metalness={0.8}
//           />
//         </Sphere>
//       </Float>
//     );
//   }

//   function Books3DComponent() {
//     const groupRef = useRef();
//     const booksData = useRef(
//       Array.from({ length: 30 }, (_, i) => ({
//         position: [
//           (Math.random() - 0.5) * 20,
//           (Math.random() - 0.5) * 20,
//           (Math.random() - 0.5) * 20
//         ],
//         rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
//         color: `hsl(${Math.random() * 360}, 70%, 60%)`
//       }))
//     ).current;

//     useFrame((state) => {
//       if (groupRef.current) {
//         groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
//       }
//     });

//     return (
//       <group ref={groupRef}>
//         {booksData.map((book, i) => (
//           <mesh key={i} position={book.position} rotation={book.rotation}>
//             <boxGeometry args={[0.3, 0.5, 0.1]} />
//             <meshStandardMaterial color={book.color} />
//           </mesh>
//         ))}
//       </group>
//     );
//   }
//   // 


//   return (
//     <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} intensity={1} />
//       <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
//       <AnimatedSphereComponent />
//       <Books3DComponent />
//       <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
//     </Canvas>
//   );
// }
