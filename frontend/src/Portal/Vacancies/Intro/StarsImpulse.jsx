import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing';
import { BallCollider, Physics, RigidBody } from '@react-three/rapier';

THREE.ColorManagement.legacyMode = false;

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

function generateBaubles(scaleRange) {
  return [...Array(16)].map(() => ({
    scale: scaleRange[Math.floor(Math.random() * scaleRange.length)],
  }));
}

function LoopController({ active }) {
  const { invalidate } = useThree();

  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);

  useFrame(() => {
    if (active) invalidate();
  });

  return null;
}

function Bauble({ vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread, active }) {
  const { nodes } = useGLTF('/assets/stars.glb');
  const api = useRef();

  useFrame((_, delta) => {
    if (!active) return;
    delta = Math.min(0.1, delta);
    if (api.current && delta > 0) {
      const impulseStrength = -1000 * delta * scale;
      api.current.applyImpulse(vec.copy(api.current.translation()).normalize().multiplyScalar(impulseStrength));
    }
  });

  return (
    <RigidBody
      linearDamping={1.5}
      angularDamping={0.5}
      friction={1}
      position={[r(10), r(10), r(10)]}
      colliders={false}
      ref={api}
      dispose={null}>
      <BallCollider args={[1.4]} />
      <group>
        <mesh castShadow scale={0.7 * scale} geometry={nodes.stars_01.geometry}>
          <meshStandardMaterial color="#ffffff" emissive="#888888" metalness={0} roughness={0.2} />
        </mesh>
      </group>
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3(), active }) {
  const ref = useRef();
  useFrame(({ mouse, viewport }) => {
    if (!active) return;
    vec.lerp({ x: (mouse.x * viewport.width) / 2, y: (mouse.y * viewport.height) / 2, z: 0 }, 0.2);
    ref.current?.setNextKinematicTranslation(vec);
  });

  return (
    <RigidBody position={[100, 100, 100]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1.5]} />
    </RigidBody>
  );
}

function StarsImpulse() {
  const [baubles, setBaubles] = useState(generateBaubles([0.55, 0.75, 1, 1, 1.15]));
  const [isVisible, setIsVisible] = useState(true);
  const [webglSupported, setWebglSupported] = useState(true);
  const [pageVisible, setPageVisible] = useState(typeof document === 'undefined' ? true : !document.hidden);
  const [isActive, setIsActive] = useState(true);
  const idleTimeout = useRef(null);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);

  useEffect(() => {
    const handleVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    const wakeUp = () => {
      setIsActive((current) => (current ? current : true));
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => setIsActive(false), 3500);
    };

    wakeUp();
    window.addEventListener('pointermove', wakeUp);
    window.addEventListener('touchstart', wakeUp);
    window.addEventListener('scroll', wakeUp);

    return () => {
      window.removeEventListener('pointermove', wakeUp);
      window.removeEventListener('touchstart', wakeUp);
      window.removeEventListener('scroll', wakeUp);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 1024 && width >= 768) {
        setBaubles(generateBaubles([0.4, 0.5, 0.6, 0.7]));
      } else {
        setBaubles(generateBaubles([0.55, 0.75, 1, 1, 1.15]));
      }
    };

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });

    const container = document.getElementById('stars-canvas');
    if (container) observer.observe(container);

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) observer.unobserve(container);
    };
  }, []);

  const shouldRender = isVisible && webglSupported && pageVisible;
  const shouldSimulate = shouldRender && isActive;

  return (
    <div id="stars-canvas" style={{ position: 'relative', top: 0, left: 0, height: '100vh', width: '100vw' }}>
      {shouldRender && (
        <Canvas
          style={{ width: '100vw', height: '100vh' }}
          frameloop="demand"
          dpr={[1, 1.5]}
          shadows
          gl={{ alpha: true, stencil: false, depth: false, antialias: true }}
          camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
          onCreated={({ gl }) => {
            if (gl) gl.toneMappingExposure = 3;
          }}>
          <LoopController active={shouldSimulate} />
          <ambientLight intensity={2} color="#91c8fc" />
          <directionalLight castShadow position={[-10, -20, 50]} intensity={2.4} shadow-mapSize={1024} />
          <pointLight intensity={14000} color="#389FFF" decay={2} distance={800} position={[-10, 4, 45]} />
          <pointLight intensity={14000} color="#e02209" distance={2600} position={[20, -15, 36]} />
          <pointLight intensity={800} color="white" decay={2} distance={800} position={[12, 3, 38]} />

          <Physics gravity={[40, 2, 0]} paused={!shouldSimulate}>
            <Pointer active={shouldSimulate} />
            {baubles.map((props, i) => (
              <Bauble key={i} active={shouldSimulate} {...props} />
            ))}
          </Physics>

          <EffectComposer disableNormalPass>
            {typeof N8AO === 'function' && shouldSimulate && (
              <N8AO aoRadius={0.9} intensity={2.5} color="lightgrey" quality="medium" />
            )}
            <ToneMapping />
          </EffectComposer>
        </Canvas>
      )}
    </div>
  );
}

export default StarsImpulse;
