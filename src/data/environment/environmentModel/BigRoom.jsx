import { useMemo } from 'react';
import { useGLTFWithKTX2 } from "../../../world/useGTLFwithKTX";

const BigRoomModel = () => {
  const { nodes, materials } = useGLTFWithKTX2('/models/BigRoomH.glb');
  
  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedMaterials = useMemo(() => materials, [materials]);

  return (
    <group position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.9, 0.9, 0.9]} dispose={null}>
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
  );
};

export default BigRoomModel;