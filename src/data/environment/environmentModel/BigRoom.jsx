import { useMemo } from 'react';
import { useGLTFWithKTX2 } from "../../../world/useGTLFwithKTX";

const BigRoomModel = () => {
  const { nodes, materials } = useGLTFWithKTX2('/models/BigRoom.glb');
  
  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedMaterials = useMemo(() => materials, [materials]);

  return (
    <group>

      <group position={[6, 0, 1]} rotation={[Math.PI / 2, 0, 0]} scale={[0.9, 0.9, 0.9]} dispose={null}>
        <mesh
            castShadow
            receiveShadow
            geometry={memoizedNodes.Mesh.geometry}
            material={materials.model_1}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={memoizedNodes.Mesh_1.geometry}
            material={memoizedMaterials.phong3}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={memoizedNodes.Mesh_2.geometry}
            material={memoizedMaterials.room_m1_light}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={memoizedNodes.Mesh_3.geometry}
            material={memoizedMaterials.phong2}
          />
      </group>
    </group>
  );
};

export default BigRoomModel;