import React, { useRef, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing';
import Show, { preloadShoeModel } from './Show';
import Planet from './Planet';

preloadShoeModel();

const getContainerWidthPercentage = (screenWidth) => {
  const minScreen = 1024;
  const maxScreen = 4500;
  const minPercentage = 65; // для маленьких экранов
  const maxPercentage = 30; // для больших экранов

  if (screenWidth <= minScreen) return minPercentage;
  if (screenWidth >= maxScreen) return maxPercentage;

  const factor = (screenWidth - minScreen) / (maxScreen - minScreen);
  const widthPercentage = minPercentage - factor * (minPercentage - maxPercentage);
  return widthPercentage;
};

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

  // const handleResize = useCallback(() => {
  //   const screenWidth = window.innerWidth;
  //   let width = '25%';
  //   const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  //   if (screenWidth >= 3500) width = '30%';
  //   else if (screenWidth >= 3000) width = '36%';
  //   else if (screenWidth >= 2500) width = '46%';
  //   else if (screenWidth >= 2000) width = '44%';
  //   else if (screenWidth >= 1601) width = '66%';
  //   else if (screenWidth >= 1301) width = '40%';
  //   else if (screenWidth >= 1024) width = '50%';
  //   else width = '65%';

  //   if (isSafari) {
  //     width = '35%';
  //   }

  //   setContainerStyle((prevStyle) => ({
  //     ...prevStyle,
  //     width,
  //   }));
  // }, []);

    const handleResize = useCallback(() => {
      const screenWidth = window.innerWidth;
      const widthPercentage = getContainerWidthPercentage(screenWidth);

      // Если необходимо, можно задать отдельное значение для Safari
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const finalWidth = isSafari ? 35 : widthPercentage;

      setContainerStyle((prevStyle) => ({
        ...prevStyle,
        width: finalWidth + '%',
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
        <ambientLight intensity={2} color="#91c8fc" />
        <directionalLight castShadow position={[-10, -20, 50]} intensity={2.4} shadow-mapSize={1024} />
        <pointLight ref={light} intensity={1400} color="#389FFF" decay={2} distance={600} position={[-10, 4, 45]} />
        <pointLight ref={light} intensity={14000} color="#8d3e10" distance={600} position={[20, -15, 36]} />
        <pointLight ref={light} intensity={800} color="white" decay={2} distance={600} position={[12, 3, 38]} />
        <Suspense fallback={null}>
          <Planet />
          <Show />
        </Suspense>
        <EffectComposer>
          <N8AO aoRadius={1.5} intensity={5} color="grey" quality="ultra" />
          <ToneMapping />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default React.memo(Rocket);
