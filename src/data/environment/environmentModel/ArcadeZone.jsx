import { useGLTF } from "@react-three/drei";

export function ArcadeZoneModel() {
  const { scene : Room } = useGLTF("/models/Arcade Zone.glb");
  return (
    <primitive
    object={Room}
    position={[0, -1.5, 0]}
    rotation={[0, Math.PI / 2, 0]}
    scale={[0.45 ,0.45 ,0.27 ]}
  />
 );
}

useGLTF.preload("/models/Arcade Zone.glb");