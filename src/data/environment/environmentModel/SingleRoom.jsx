import React, { useMemo } from 'react';
import { useGLTFWithKTX2 } from '../../../world/useGTLFwithKTX';

const SingleRoomModel = () => {
  const { nodes, materials } = useGLTFWithKTX2('/models/SingleRoom.glb');
    
  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedMaterials = useMemo(() => materials, [materials]);
  
  return (
    <group position={[1, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.05}>
      <mesh
          castShadow
          receiveShadow
          geometry={memoizedNodes.polySurface104004.geometry}
          material={memoizedMaterials['phong14.001']}
          position={[0, 0, -54.545]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={memoizedNodes.polySurface104005.geometry}
          material={memoizedMaterials['Luxurious White Marble']}
        />
    </group>
  );
};

export default SingleRoomModel;