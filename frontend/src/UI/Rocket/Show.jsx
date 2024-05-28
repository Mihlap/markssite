import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function Show() {
  const { scene } = useGLTF('/assets/rocket_01.gltf');
  const rotationGroupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const rotationSpeed = useRef(0.01);
  const { camera, raycaster, pointer, size } = useThree();

  const onMouseMove = useCallback((event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    if (rotationGroupRef.current) {
      const intersects = raycaster.intersectObjects(rotationGroupRef.current.children, true);
      setHovered(intersects.length > 0);
    }
  }, [camera, raycaster, pointer]);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [onMouseMove]);


  useFrame(() => {
    if (rotationGroupRef.current) {
      if (hovered) {
        rotationSpeed.current = Math.min(rotationSpeed.current + 0.005, 0.15);
      } else {
        rotationSpeed.current = Math.max(rotationSpeed.current - 0.001, 0.01);
      }
      rotationGroupRef.current.rotation.y += rotationSpeed.current;
    }
  });

  const modelPosition = useMemo(() => {
    if (size.width <= 1600) {
      return [size.width / 24, -7, 20];
    }
    return [size.width / 45, -5, 20];
  }, [size.width]);


  return (
    <group position={modelPosition} scale={15} rotation={[0, 6.4, Math.PI / 3]}>
      <group ref={rotationGroupRef}>
        <primitive object={scene} dispose={null} />
      </group>
    </group>
  );
}

export default React.memo(Show);
