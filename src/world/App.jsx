import * as TWEEN from "@tweenjs/tween.js";
import { Ground } from "./Ground.jsx";
import { Physics } from "@react-three/rapier";
import { Player } from "./Player.jsx";
import { useFrame } from "@react-three/fiber";
import Television from "./Television";
import BrandPoster from "./BrandPoster";
import Products from "./Products";
import { Suspense } from "react";
import Skybox from "./Skybox";
import environmentData from "@/data/environment/EnvironmentData";
import { useBrandStore, useEnvironmentStore } from "@/stores/ZustandStores";
import Lights from "./Lights.jsx";

export const App = () => {
  const {brandData} = useBrandStore();
  const {environmentType} = useEnvironmentStore();

  useFrame(() => {
    TWEEN.update();
  });

  return (
    <>
      <Skybox />
      <Lights />
      <Physics gravity={[0, -20, 0]}>
        <Ground />
        <Suspense fallback={null}>
          <Player />
        </Suspense>
        <Products />
        {environmentData[environmentType].compasses &&
          environmentData[environmentType].compasses.map((compass, index) => {
            return (
              <BrandPoster
                imageUrl={"https://cdn.creazilla.com/cliparts/3868244/compass-rose-clipart-original.png"}
                position={compass.position}
                rotation={compass.rotation}
                scale={compass.scale}
                key={index}
              />
            );
          })
        }
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
