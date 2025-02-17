import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

const Show = React.memo(() => {
  const { nodes } = useGLTF('/assets/rocket_01.gltf');
  const { size, camera } = useThree();
  const RotationRef = useRef();
  const [hovered, hover] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [scale, setScale] = useState(0.2);
  const [posX, setPosX] = useState(21);

  useEffect(() => {
    // Расчёт позиции модели по оси X относительно правого края экрана
    const objectZ = 30; // фиксированная z-координата группы
    const distance = camera.position.z - objectZ;
    const verticalFov = THREE.MathUtils.degToRad(30);
    const halfVertical = Math.tan(verticalFov / 2) * distance;
    const aspect = size.width / size.height;
    const horizontalSize = halfVertical * 2 * aspect;
    const xRight = horizontalSize / 2;
    const offset = 2; // расстояние от правого края до центра модели
    setPosX(xRight - offset);

    // Линейная интерполяция для scale
    const minScreen = 1024;
    const maxScreen = 4500;
    const minScale = 0.18;
    const maxScale = 0.6;
    let newScale = minScale;

    if (size.width <= minScreen) {
      newScale = minScale;
    } else if (size.width >= maxScreen) {
      newScale = maxScale;
    } else {
      const factor = (size.width - minScreen) / (maxScreen - minScreen);
      newScale = minScale + factor * (maxScale - minScale);
    }

    setScale(newScale);
  }, [size.width, size.height, camera.position.z]);


  useFrame((state, delta) => {
    const targetSpeed = hovered ? 0.12 : 0.01;
    setRotationSpeed((prev) => lerp(prev, targetSpeed, 0.01));
    if (RotationRef.current) {
      RotationRef.current.rotation.z += rotationSpeed * delta * 60;
    }
  });

  return (
    <group rotation={[-0.5, -0.95, 0]} position={[posX, -6, 16]}>
      <Center>
        <mesh
          ref={RotationRef}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}
          castShadow
          receiveShadow
          geometry={nodes.rocket_01.geometry}
          scale={scale}>
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
