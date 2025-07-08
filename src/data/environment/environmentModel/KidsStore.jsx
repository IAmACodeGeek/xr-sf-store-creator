import { useGLTF } from "@react-three/drei";

export function KidsStoreModel() {
  const { scene } = useGLTF("/models/kids store.glb");
  return (
    <primitive object={scene} rotation={[0, -Math.PI / 2, 0]} scale={35} />
  );
}

useGLTF.preload("/models/kids store.glb");
