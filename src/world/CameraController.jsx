import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useTourStore } from "../stores/ZustandStores";
import { useEffect } from "react";

export const CameraController = ({ setAnimating, playerRef }) => {
  const { camera } = useThree();
  const { tourComplete } = useTourStore();

  useEffect(() => {
    if (tourComplete && playerRef.current) {
      setAnimating(true);

      const targetPosition = {
        x: 0.5,
        y: -4 + 1.95,
        z: -64
      };

      
      const timeline = gsap.timeline({
        onComplete: () => {
          if (playerRef.current) {
            playerRef.current.setTranslation(targetPosition);
            playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
            playerRef.current.setAngvel({ x: 0, y: 0, z: 0 });
          }
          
          setAnimating(false);
          useTourStore.setState({ tourComplete: false });
        }
      });

    
      timeline.to(camera.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        ease: "power2.inOut"
      });


      timeline.to(camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 4,
        ease: "power2.inOut"
      });

      return () => timeline.kill();
    }
  }, [tourComplete, camera, setAnimating, playerRef]);

  return null;
};