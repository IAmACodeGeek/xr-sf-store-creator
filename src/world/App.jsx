import * as TWEEN from "@tweenjs/tween.js";
import { Ground } from "./Ground.jsx";
import { Physics } from "@react-three/rapier";
import { Player } from "./Player.jsx";
import { useFrame } from "@react-three/fiber";
import Television from "./Television";
import BrandPoster from "./BrandPoster";
import Products from "./Products";
import { Suspense, useState, useEffect } from "react";
import Skybox from "./Skybox";
import environmentData from "@/data/environment/EnvironmentData";
import { useBrandStore, useEnvironmentStore } from "@/stores/ZustandStores";
const shadowOffset = 50;

export const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const {brandData} = useBrandStore();
  const {environmentType} = useEnvironmentStore();
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  useFrame(() => {
    TWEEN.update();
  });

  return (
    <>
      <Skybox />
      <ambientLight intensity={3.5} />
      <directionalLight
        castShadow
        intensity={1.5}
        shadow-mapSize={4096}
        shadow-camera-top={shadowOffset}
        shadow-camera-bottom={-shadowOffset}
        shadow-camera-left={shadowOffset}
        shadow-camera-right={-shadowOffset}
        position={[100, 100, 0]}
      />

      <Physics gravity={[0, -20, 0]}>
        <Ground />
        <Suspense fallback={null}>
          <Player />
        </Suspense>
        <Products />
        {brandData && (
          <>
            {environmentData[environmentType].televisions && 
              environmentData[environmentType].televisions.map((television, index) => {
                return (
                  <Television
                    videoPath={brandData.brand_video_url}
                    scale={television.scale}
                    position={television.position}
                    rotation={television.rotation}
                    key={index}
                  />
                );
              })
            }
            {
              environmentData[environmentType].brandPosters &&
                environmentData[environmentType].brandPosters.map((brandPoster, index) => {
                  return (
                    <BrandPoster
                      imageUrl={brandData.brand_poster_url}
                      position={brandPoster.position}
                      rotation={brandPoster.rotation}
                      scale={brandPoster.scale}
                      key={index}
                    />
                  );
                })
            }
          </>
        )}
      </Physics>
    </>
  );
};

export default App;
