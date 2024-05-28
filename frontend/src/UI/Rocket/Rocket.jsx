import { Canvas } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing';
import React, { useRef, useMemo } from 'react';
import Show from './Show';

const Rocket = () => {
  const light1 = useRef();
  const light2 = useRef();
  const light3 = useRef();

  const ambientLight = useMemo(() => <ambientLight intensity={3.5} color='#7ec1ff' />, []);
  const directionalLight = useMemo(() => (
    <directionalLight 
      castShadow 
      position={[-10, -20, 50]} 
      intensity={2.4}
      shadow-mapSize={1024} 
      // target-position={[0, 0, 0]}
    />
  ), []);

  const pointLights = useMemo(() => ([
    <pointLight key="1" ref={light1} intensity={17000} color='#389FFF' distance={3000} position={[-50, 30, 60]} />,
    <pointLight key="2" ref={light2} intensity={17000} color='#e43b1d' distance={2000} position={[15, -25, 35]} />,
    <pointLight key="3" ref={light3} intensity={8000} color='white' distance={600} position={[-35, 0, 45]} />
  ]), []);

  return (
    <Canvas className='canvas' shadows camera={{ position: [0, 0, 100], fov: 20, near: 1, far: 3000 }}>
      {ambientLight}
      {directionalLight}
      {pointLights}
      <Show />
      <CameraControls />
      <EffectComposer>
        <N8AO aoRadius={2} intensity={7} color='lightgrey' quality='ultra' />
        <ToneMapping />
      </EffectComposer>
    </Canvas>
  );
}

export default React.memo(Rocket);
