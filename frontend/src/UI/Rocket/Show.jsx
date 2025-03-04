import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowWidth;
}

const getModelScale = (width) => {
  if (width >= 3500) return 0.24;
  else if (width >= 3000) return 0.24;
  else if (width >= 2500) return 0.24;
  else if (width >= 2000) return 0.24;
  else if (width >= 1601) return 0.24;
  else if (width >= 1301) return 0.25;
  else if (width >= 1024) return 0.25;
  else return 0.25;
};

const Show = React.memo(() => {
  const { nodes } = useGLTF('/assets/rocket_01.gltf');
  const { size, camera } = useThree();
   const windowWidth = useWindowWidth();
  const RotationRef = useRef();
  const [hovered, hover] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [scale, setScale] = useState(0.2);
  const [posX, setPosX] = useState(21);

  useEffect(() => {
    const objectZ = 34;
    const distance = camera.position.z - objectZ;
    const verticalFov = THREE.MathUtils.degToRad(30);
    const halfVertical = Math.tan(verticalFov / 2) * distance;
    const aspect = size.width / size.height;
    const horizontalSize = halfVertical * 2 * aspect;
    const xRight = horizontalSize / 2;
    const offset = 2;
    setPosX(xRight - offset);

    const newScale = getModelScale(windowWidth);
    setScale(newScale);
  }, [size.width, size.height, camera.position.z, windowWidth]);

  useFrame((state, delta) => {
    const targetSpeed = hovered ? 0.12 : 0.01;
    setRotationSpeed((prev) => lerp(prev, targetSpeed, 0.01));
    if (RotationRef.current) {
      RotationRef.current.rotation.z += rotationSpeed * delta * 60;
    }
  });


  useFrame((state, delta) => {
    const targetSpeed = hovered ? 0.12 : 0.01;
    setRotationSpeed((prev) => lerp(prev, targetSpeed, 0.01));
    if (RotationRef.current) {
      RotationRef.current.rotation.z += rotationSpeed * delta * 60;
    }
  });  
  

  return (
    <group rotation={[-0.5, -0.95, 0]} position={[posX, -5.5, 16]}>
      <Center>
        <mesh
          ref={RotationRef}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          castShadow
          receiveShadow
          geometry={nodes.rocket_01.geometry}
          scale={scale}
          renderOrder={10}>
          <meshPhongMaterial color={[1.8, 1.8, 1.8]} specular={[1, 1, 1]} shininess={12} />
        </mesh>
      </Center>
    </group>
  );
});

export const preloadShoeModel = () => {
  useGLTF.preload('/assets/rocket_01.gltf');
};

export default Show;
