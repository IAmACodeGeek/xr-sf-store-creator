import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useSearchStore } from "../stores/ZustandStores";

export const ProductGSAPUtil = ({ setAnimating, playerRef }) => {
  const { camera } = useThree();
  const { searchResult, initiateSearchGSAP, resetSearchGSAP } = useSearchStore();

  useEffect(() => {
    if (!initiateSearchGSAP || !searchResult || !playerRef.current) return;

    setAnimating(true);
    const getPositionOffset = (face) => {
      switch(face) {
        case 'N': return { x: 0, y: 1, z: 3 }; // North - default forward
        case 'S': return { x: 0, y: 1, z: -3 }; // South - opposite z
        case 'E': return { x: -3, y: 1, z: 0 }; // East - negative x offset
        case 'W': return { x: 3, y: 1, z: 0 }; // West - positive x offset
        default: return { x: 0, y: 1, z: 3 }; // Default to North
      }
    };

    const offset = getPositionOffset(searchResult.face);
    const targetPosition = {
      x: searchResult.x + offset.x,
      y: searchResult.y + offset.y,
      z: searchResult.z + offset.z,
    };

    const timeline = gsap.timeline({
      onComplete: () => {
        if (playerRef.current) {
          playerRef.current.setTranslation(targetPosition);
          playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
          playerRef.current.setAngvel({ x: 0, y: 0, z: 0 });
          setAnimating(false);
        }
        resetSearchGSAP();
      },
    });

    // Calculate rotation based on face
    const getRotationFromFace = (face) => {
      switch(face) {
        case 'N': return { x: 0, y: 0, z: 0 }; // North - default forward
        case 'S': return { x: 0, y: Math.PI, z: 0 }; // South - 180 degrees
        case 'E': return { x: 0, y: -Math.PI/2, z: 0 }; // East - -90 degrees
        case 'W': return { x: 0, y: Math.PI/2, z: 0 }; // West - 90 degrees
        default: return { x: 0, y: 0, z: 0 }; // Default to North
      }
    };

    timeline.to(camera.rotation, {
      ...getRotationFromFace(searchResult.face),
      duration: 1,
      ease: "power2.inOut",
    });

    timeline.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y ,
      z: targetPosition.z ,
      duration: 2,
      ease: "power2.inOut",
    });

    return () => {
      timeline.kill();
      setAnimating(false);
    };
  }, [initiateSearchGSAP, searchResult, playerRef, camera, resetSearchGSAP, setAnimating]);

  return null;
};