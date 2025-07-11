import { useGLTF } from "@react-three/drei";

export function GlowBarModel() {
  const { scene: Room } = useGLTF("/models/Glowbar.glb");
  return <primitive object={Room} rotation={[0, Math.PI / 2, 0]} scale={0.3} />;
}
