import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { EffectComposer, N8AO, ToneMapping } from '@react-three/postprocessing';
import { BallCollider, Physics, RigidBody } from "@react-three/rapier";

// Отключаем устаревший режим управления цветами
THREE.ColorManagement.legacyMode = false;

// Массив объектов для звезд
const baubles = [...Array(12)].map(() => ({ scale: [0.55, 0.75, 1, 1, 1.15][Math.floor(Math.random() * 2.5)] }));

// Компонент для отдельной звездочки
function Bauble({ vec = new THREE.Vector3(), scale, r = THREE.MathUtils.randFloatSpread }) {
  const { nodes } = useGLTF("/assets/stars.glb");
  const api = useRef();

  useFrame((state, delta) => {
    delta = Math.min(0.1, delta);
    if (api.current) {
    api.current.applyImpulse(
      vec
        .copy(api.current.translation())
        .normalize()
        .multiply({ x: -1500 * delta * scale, y: -1000 * delta * scale, z: -1500 * delta * scale })
    );
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
      dispose={null}
    >
      <BallCollider args={[1.4]} />
      <group>
        <mesh castShadow scale={0.7 * scale} geometry={nodes.stars_01.geometry}>
          <meshPhongMaterial color={[1.4, 1.4, 1.4]} specular={[1.5, 1.5, 1.5]} shininess={12} />
        </mesh>
      </group>
    </RigidBody>
  );
}

// Компонент для управления указателем мыши
function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef();
  useFrame(({ mouse, viewport }) => {
    vec.lerp({ x: (mouse.x * viewport.width) / 2, y: (mouse.y * viewport.height) / 2, z: 0 }, 0.2);
    ref.current?.setNextKinematicTranslation(vec);
  });

  return (
    <RigidBody position={[100, 100, 100]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

// Основной компонент, который возвращает Canvas
function StarsImpulse() {
  return (
    <div style={{ position: 'relative', top: 0, left: 0, height: '100vh', width: '100vw' }}>
    <Canvas
    style={{ width: '100vw', height: '100vh' }} 
      shadows
      gl={{ alpha: true, stencil: false, depth: false, antialias: true }}
      camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
      onCreated={(state) => (state.gl.toneMappingExposure = 3)}>
      <ambientLight intensity={2} color='#91c8fc' />
      <directionalLight
          castShadow
          position={[-10, -20, 50]}
          intensity={2.4}
          shadow-mapSize={1024}
      />
      <pointLight intensity={14000} color='#389FFF' decay={2} distance={800} position={[-10, 4, 45]}/>
      <pointLight intensity={14000} color='#e02209' distance={2600} position={[20, -15, 36]}/>
      <pointLight intensity={800} color='white' decay={2} distance={800} position={[12, 3, 38]}/>
      <Physics gravity={[12, 2, 0]}>
        <Pointer />
        {baubles.map((props, i) => <Bauble key={i} {...props} />)}
      </Physics>
      <EffectComposer disableNormalPass>
        <N8AO aoRadius={1.5} intensity={5} color='lightgrey' quality='ultra' />
        <ToneMapping/>
      </EffectComposer>
  </Canvas>
  </div>
  );
}

export default StarsImpulse;
