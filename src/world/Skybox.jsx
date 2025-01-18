import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const Skybox = () => {
  const { scene } = useThree();

  const texture = useMemo(() => {
    const loader = new THREE.CubeTextureLoader();
    loader.setPath("/textures/skybox/");

    return loader.load(
      [
        "px.webp", 
        "nx.webp", 
        "py.webp", 
        "ny.webp", 
        "pz.webp", 
        "nz.webp", 
      ],
      undefined, 
      undefined,
      (error) => {
        console.error("Error loading skybox:", error);
      }
    );
  }, []);

  useEffect(() => {
    const originalBackground = scene.background;
    scene.background = texture;

    return () => {
      scene.background = originalBackground;
      texture.dispose();
    };
  }, [scene, texture]);

  return null;
};

export default Skybox;