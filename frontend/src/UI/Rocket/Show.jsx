import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';


function lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }


const Show = React.memo(() => {
  const { nodes } = useGLTF('/assets/rocket_01.gltf');
  const RotationRef = useRef();
  const [hovered, hover] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 1024) {
        setScale(0.18);
      } else if (screenWidth <= 1600) {
        setScale(0.19);
      } else {
        setScale(0.2);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // useEffect(() => {
  //   if (RotationRef.current) {
  //     gsap.fromTo(
  //       RotationRef.current.position,
  //       { z: -100 },
  //       { z: -1, duration: 1.5, ease: 'power2.out' }
  //     );
  //   }
  // }, []);
    
  useFrame((state, delta) => {
    const targetSpeed = hovered ? 0.12 : 0.01;
    setRotationSpeed((prev) => lerp(prev, targetSpeed, 0.01));
    if (RotationRef.current) {
      RotationRef.current.rotation.z += rotationSpeed * delta * 60;
    }
  });

  return (
    <group rotation={[-0.5, -0.95, 0]} position={[18, -2.9, 14]}>
      <mesh
        ref={RotationRef}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
        castShadow
        receiveShadow
        geometry={nodes.rocket_01.geometry}
        scale={scale}
      >
        <meshPhongMaterial color={[1.8, 1.8, 1.8]} specular={[1, 1, 1]} shininess={12} />
      </mesh>
    </group>
  );
});

export const preloadShoeModel = () => {
  useGLTF.preload('/assets/rocket_01.gltf');
};

export default Show;