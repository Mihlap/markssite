import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, CameraControls } from '@react-three/drei';
import { EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing';
import { useRef, useState, useEffect } from 'react';

function Shoe() {
  const { scene } = useGLTF('/assets/rocket_01.gltf');
  const rotationGroupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const rotationSpeed = useRef(0.01);
  const { camera, raycaster, pointer  } = useThree();
  

  useEffect(() => {
    const onMouseMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      if (rotationGroupRef.current) {
        const intersects = raycaster.intersectObjects(rotationGroupRef.current.children, true);
        setHovered(intersects.length > 0);
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [camera, raycaster, pointer]);

  useFrame(() => {
    if (rotationGroupRef.current) {
      if (hovered) {
        rotationSpeed.current = Math.min(rotationSpeed.current + 0.5, 0.15);
      } else {
        rotationSpeed.current = Math.max(rotationSpeed.current - 0.001, 0.01);
      }
      rotationGroupRef.current.rotation.y += rotationSpeed.current;
    }
  });

  return (
    <group position={[60, -5, 15]} scale={15} rotation={[0, 6, Math.PI / 3]}>
      <group ref={rotationGroupRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

export default function Rocket() {
  const light = useRef()
  return (
    <Canvas className='canvas'  shadows camera={{ position: [0, 0, 100], fov: 20, near:1, far: 3000 }}>
      <ambientLight intensity={3.5} color='#7ec1ff' />
      <directionalLight 
      castShadow 
      position={[-10, -20, 50]} 
      intensity={2.4}
      shadow-mapSize={1024} >
      </directionalLight>
      <pointLight ref={light} intensity={17000} color='#389FFF' distance={3000} position={[-50,30,60]}/>
      <pointLight ref={light} intensity={17000} color='#e43b1d' distance={2000} position={[15,-25,35]}/>
      <pointLight ref={light} intensity={8000} color='white' distance={600} position={[-35,0,45]}/>
      <Shoe />
      <CameraControls />
      <EffectComposer>
        <N8AO aoRadius={2} intensity={7} color='lightgrey' quality='ultra' />
        <ToneMapping />
      </EffectComposer>
    </Canvas>
  )
}