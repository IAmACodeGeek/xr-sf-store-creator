import { useGLTFWithKTX2 } from "@/world/useGTLFwithKTX";
import React from "react";

export function ShelfscapeModel() {
  const { scene } = useGLTFWithKTX2("/models/Shelfscape.glb");
  return <primitive object={scene} rotation={[0, Math.PI, 0]} />;
}
