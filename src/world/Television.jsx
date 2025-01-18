import React, { useEffect, useMemo } from 'react';
import { useVideoTexture } from '@react-three/drei';
import { useGLTFWithKTX2 } from './useGTLFwithKTX';

export default function Television({
  videoPath,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  const { nodes, materials } = useGLTFWithKTX2('/models/tv_modified.glb');

  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedMaterials = useMemo(() => materials, [materials]);

  const videoTexture = useVideoTexture(videoPath, {
    crossOrigin: 'anonymous',
    loop: true,
    muted: true,
    playsInline: true,
  });

  useEffect(() => {
    if (videoTexture) {
      videoTexture.flipY = false;
    }
  }, [videoTexture]);

  const memoizedRotation = useMemo(
    () => rotation.map((r) => r * (Math.PI / 180)),
    [rotation]
  );

  
  useEffect(() => {
    if (memoizedMaterials.phong15) {
      memoizedMaterials.phong15.polygonOffset = true;
      memoizedMaterials.phong15.polygonOffsetFactor = 1;
      memoizedMaterials.phong15.polygonOffsetUnits = 1;
    }
  }, [memoizedMaterials]);

  return (
    <group
      dispose={null}
      scale={scale}
      position={position}
      rotation={memoizedRotation} 
    >
      <group
        position={[-0.577, 0.192, -0.479]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.004, 16, 9]}
      >
      
        <mesh
          castShadow
          receiveShadow
          geometry={memoizedNodes['monitor-screen'].geometry}
          renderOrder={1} // IMP: Ensure screen renders first
        >
          <meshBasicMaterial 
            map={videoTexture} 
            toneMapped={false}
            depthWrite={true}
            polygonOffset={true}
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>

        
        <mesh
          castShadow
          receiveShadow
          geometry={memoizedNodes.tv_frame.geometry}
          material={memoizedMaterials.phong15}
          renderOrder={2} // IMP: Frame renders after screen
        >
          <meshStandardMaterial
            {...memoizedMaterials.phong15}
            depthWrite={true}
            polygonOffset={true}
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
        </mesh>
      </group>
    </group>
  );
}


