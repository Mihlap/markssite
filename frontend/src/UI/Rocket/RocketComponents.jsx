import React, { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing';
import Show, { preloadShoeModel } from './Show';
import Planet from './Planet';

preloadShoeModel();

function isWebGLAvailable() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!(window.WebGLRenderingContext && gl);
  } catch {
    return false;
  }
}

const Rocket = () => {
  const light = useRef();

  const [containerStyle, setContainerStyle] = useState({
    position: 'fixed',
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
  });

  const [webglSupported, setWebglSupported] = useState(true);

  const handleResize = useCallback(() => {
    const screenWidth = window.innerWidth;
    let width = '25%';   

    if (screenWidth >= 3500) width = '40%';
    else if (screenWidth >= 3000) width = '45%';
    else if (screenWidth >= 2500) width = '55%';
    else if (screenWidth >= 2000) width = '65%';
    else if (screenWidth >= 1601) width = '80%';
    else if (screenWidth >= 1301) width = '65%';
    else if (screenWidth >= 1024) width = '75%';
    else width = '95%';

    setContainerStyle((prevStyle) => ({
      ...prevStyle,
      width,
    }));
  }, []);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  if (!webglSupported) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            flex: 1,
            borderRadius: 32,
            background: 'radial-gradient(circle at top, rgba(56,159,255,0.35), transparent 60%)',
          }}
        />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Canvas
        flat
        shadows
        gl={{ preserveDrawingBuffer: true, alpha: true }}
        camera={{ position: [0, 0, 80], fov: 30, near: 1, far: 3000 }}>
        <ambientLight intensity={2} color="#91c8fc" />
        <directionalLight castShadow position={[-10, -20, 50]} intensity={2.4} shadow-mapSize={1024} />
        <pointLight ref={light} intensity={1400} color="#389FFF" decay={2} distance={600} position={[-10, 4, 45]} />
        <pointLight ref={light} intensity={14000} color="#8d3e10" distance={600} position={[20, -15, 36]} />
        <pointLight ref={light} intensity={0} color="white" decay={2} distance={600} position={[12, 3, 38]} />

        <Suspense fallback={null}>
          <Planet />
          <Show />
        </Suspense>

        <EffectComposer>
          {typeof N8AO === 'function' && <N8AO aoRadius={1.5} intensity={5} color="grey" quality="ultra" />}
          <ToneMapping />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default React.memo(Rocket);
