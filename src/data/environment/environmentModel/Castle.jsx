import { useMemo } from 'react';
import { useGLTFWithKTX2 } from '../../../world/useGTLFwithKTX';

const CastleModel = () => {
  const { nodes, materials } = useGLTFWithKTX2('/models/Castle4.glb');
  
  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedMaterials = useMemo(() => materials, [materials]);

  return (
    <group position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]} dispose={null}>
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
  );
};

export default CastleModel;