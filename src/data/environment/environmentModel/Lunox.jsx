import { useGLTFWithKTX2 } from "@/world/useGTLFwithKTX";
import React from "react";

export function LunoxModel() {
  const { scene } = useGLTFWithKTX2("/models/lunox/shoe store.glb");
  const { scene: curtain } = useGLTFWithKTX2("/models/lunox/curtain.glb");
  curtain.children[0].children[0].material.transparent = true;
  curtain.children[0].children[0].material.opacity = 0.7;
  curtain.children[0].children[0].material.roughness = 0.5;
  curtain.children[0].children[0].material.metalness = 0;
  curtain.children[0].children[0].material.reflectivity = 1;
  curtain.children[0].children[0].material.ior = 2;
  return (
    <>
      <primitive object={curtain} rotation={[0, -Math.PI / 2, 0]} scale={40} />
      <primitive object={scene} rotation={[0, -Math.PI / 2, 0]} scale={40} />
    </>
  );
}

