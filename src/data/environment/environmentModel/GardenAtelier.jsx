import { useGLTF } from "@react-three/drei";

export function GardenAtelierModel() {
  const { scene: Room } = useGLTF("/models/GardenAtelier.glb");
  return <primitive object={Room} scale={0.7} />;
}