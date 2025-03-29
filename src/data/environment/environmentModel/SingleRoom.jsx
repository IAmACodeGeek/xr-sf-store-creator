import React, { useMemo } from 'react';
import { useGLTFWithKTX2 } from '../../../world/useGTLFwithKTX';

const SingleRoomModel = () => {
  const { nodes, materials } = useGLTFWithKTX2('/models/SingleRoom.glb');
    
  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedMaterials = useMemo(() => materials, [materials]);
  
  return (
    <group position={[1, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.05}>
      <mesh
        geometry={memoizedNodes.polySurface104.geometry}
        material={memoizedMaterials.phong14}
        position={[0, 0, -54.545]}
      />
      <mesh
        geometry={memoizedNodes.polySurface104001.geometry}
        material={memoizedMaterials['Material.002']}
      />
      <mesh
        geometry={memoizedNodes.polySurface107.geometry}
        material={memoizedMaterials.phong14}
        position={[-16.968, 51.203, 8.892]}
        scale={634.876}
      />
    </group>
  );
};

export default SingleRoomModel;