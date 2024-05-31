import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing';
import Shoe from './Show';
import Planet from './Planet';


const Rocket = () => {
  const light = useRef();
  const [containerStyle, setContainerStyle] = useState({
    position: 'fixed',
    right: 0,
    top: 10,
    bottom: 0,
    width: '25%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  });

  const handleResize = useCallback(() => {
    const screenWidth = window.innerWidth;
    let width = '25%';
      if (screenWidth >= 3500) width = '30%';
    else if (screenWidth >= 2500) width = '35%';
    else if (screenWidth >= 2000) width = '40%';
      else if (screenWidth >= 1601) width = '55%';
      else if (screenWidth >= 1301) width = '40%';
    else if (screenWidth >= 1024) width = '55%';
    else width = '65%';

    setContainerStyle((prevStyle) => ({
      ...prevStyle,
      width,
    }));
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <div style={containerStyle}>
      <Canvas flat shadows camera={{ position: [0, 0, 80], fov: 30, near: 1, far: 3000 }}>
        <ambientLight intensity={2} color='#91c8fc' />
        <directionalLight
          castShadow
          position={[-10, -20, 50]}
          intensity={2.4}
          shadow-mapSize={1024}
        />
        <pointLight ref={light} intensity={3000} color='#389FFF' decay={2} distance={600} position={[-10, 4, 45]} />
        <pointLight ref={light} intensity={14000} color='#8d3e10' distance={600} position={[20, -15, 36]} />
        <pointLight ref={light} intensity={1800} color='white' decay={2} distance={600} position={[12, 3, 38]} />
        <Planet />
        <Shoe />
        <EffectComposer>
          <N8AO aoRadius={1.5} intensity={5} color='grey' quality='ultra' />
          <ToneMapping />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export default React.memo(Rocket);