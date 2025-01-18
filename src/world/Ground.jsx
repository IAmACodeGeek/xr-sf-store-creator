import React, { useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useGLTFWithKTX2 } from './useGTLFwithKTX';

export function Ground() {
  const { nodes, materials } = useGLTFWithKTX2('/Castle4.glb');

  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedMaterials = useMemo(() => materials, [materials]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <group position={[0, -4, 0]} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={memoizedNodes.Plane_1.geometry}
          material={memoizedMaterials['Material.004']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={memoizedNodes.Plane_2.geometry}
          material={memoizedMaterials['Material.002']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={memoizedNodes.Plane_3.geometry}
          material={memoizedMaterials['Material.001']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={memoizedNodes.Plane_4.geometry}
          material={memoizedMaterials['Material.003']}
        />
      </group>
    </RigidBody>
  );
}


