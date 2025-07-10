import { useGLTF } from "@react-three/drei";

export function VarsityVaultModel() {
  const { scene: Room } = useGLTF("/models/varsity vault.glb");
  return <primitive object={Room} scale={15} position={[0,0,7.728]} />;
}

useGLTF.preload("/models/varsity vault.glb");
