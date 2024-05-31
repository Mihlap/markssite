import React from 'react';

const Planet = React.memo(() => {
    return (
      <group>
        <mesh castShadow receiveShadow position={[-29, 11, 0]}>
          <sphereGeometry args={[1.6, 12, 12]} />
          <meshPhongMaterial color={[4, 4, 4]} specular={[1, 1, 5]} shininess={10} />
        </mesh>
        <mesh castShadow receiveShadow position={[-12, -10, 0]}>
          <sphereGeometry args={[1.3, 12, 12]} />
          <meshPhongMaterial color={[3, 3, 3]} specular={[5, 5, 1]} shininess={10} />
        </mesh>
      </group>
    );
});
  
export default Planet;