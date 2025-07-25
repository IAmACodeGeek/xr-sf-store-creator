import { useGLTF } from "@react-three/drei";

export function CocktailDenModel() {
  const { scene: Room } = useGLTF("/models/Cocktail Den.glb");
  return <primitive object={Room} scale={[0.4,0.47,0.4]} />;
}