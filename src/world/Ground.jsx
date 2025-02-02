import React, { useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useGLTFWithKTX2 } from './useGTLFwithKTX';

export function Ground() {
  const { nodes, materials } = useGLTFWithKTX2('/BigRoomH.glb');

  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedMaterials = useMemo(() => materials, [materials]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <group rotation={[Math.PI / 2, 0, 0]} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={memoizedNodes.Mesh.geometry}
          material={memoizedNodes.Mesh.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={memoizedNodes.Mesh_1.geometry}
          material={memoizedMaterials.room_m1_light}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={memoizedNodes.Mesh_2.geometry}
          material={memoizedMaterials.model_1}
        />
      </group>
    </RigidBody>
  );
}


