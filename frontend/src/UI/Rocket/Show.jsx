import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function Show() {
  const { scene } = useGLTF('/assets/rocket_01.gltf');
  const rotationGroupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const rotationSpeed = useRef(0.01);
  const { camera, raycaster, pointer } = useThree();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
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
    const xPosition = windowWidth <= 1024 ? windowWidth / 45 - 15 : windowWidth <= 1600 ? windowWidth / 45 - 20 : windowWidth / 45 - 10;
    const yPosition = -7;
    const zPosition = 20;
    return [xPosition, yPosition, zPosition];
  }, [windowWidth]);

  const modelScale = useMemo(() => {
    if (windowWidth <= 1024) {
      return 7;
    } else if (windowWidth <= 1600) {
      return 10;
    } else {
      return 15;
    }
  }, [windowWidth]);

  return (
    <group position={modelPosition} scale={modelScale} rotation={[0, 6.4, Math.PI / 3]}>
      <group ref={rotationGroupRef}>
        <primitive object={scene} dispose={null} />
      </group>
    </group>
  );
}

export default React.memo(Show);
