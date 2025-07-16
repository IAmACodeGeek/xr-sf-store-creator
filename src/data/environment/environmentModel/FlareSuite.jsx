import { useGLTFWithKTX2 } from "@/world/useGTLFwithKTX";
import React from "react";

export function FlareSuiteModel() {
  const { scene: Room } = useGLTFWithKTX2("/models/Flaresuite.glb");
  return <primitive object={Room} scale={30} />;
}
