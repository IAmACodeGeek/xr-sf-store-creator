import { useGLTFWithKTX2 } from "@/world/useGTLFwithKTX";
import React from "react";

export function LuxeCradleModel() {
  const { scene: Room } = useGLTFWithKTX2("/models/Luxecradle.glb");
  return <primitive object={Room} scale={1.5} />;
}
