import { RigidBody } from "@react-three/rapier";
import BigRoomModel from "@/data/environment/environmentModel/BigRoom";
import CastleModel from "@/data/environment/environmentModel/Castle";
import SingleRoomModel from "@/data/environment/environmentModel/SingleRoom";
import { useEnvironmentStore } from "@/stores/ZustandStores";
import ShowroomModel from "@/data/environment/environmentModel/Showroom";
import { LotusDomeModel } from "@/data/environment/environmentModel/LotusDome";
import { LunoxModel } from "@/data/environment/environmentModel/Lunox";
import { ShelfscapeModel } from "@/data/environment/environmentModel/Shelfscape";
import { KidsStoreModel } from "@/data/environment/environmentModel/KidsStore";
import { ArcadeZoneModel } from "@/data/environment/environmentModel/ArcadeZone";
import { VarsityVaultModel } from "@/data/environment/environmentModel/VarsityVault";
import { GlowBarModel } from "@/data/environment/environmentModel/Glowbar";
import { LuxeCradleModel } from "@/data/environment/environmentModel/LuxeCradle";
import { FlareSuiteModel } from "@/data/environment/environmentModel/FlareSuite";
import { GardenAtelierModel } from "@/data/environment/environmentModel/GardenAtelier";
import { CocktailDenModel } from "@/data/environment/environmentModel/CocktailDen";
import { PetalPavilionModel } from "@/data/environment/environmentModel/PetalPavilion";

export function Ground() {
  const { environmentType } = useEnvironmentStore();
  return (
    environmentType && (
      <>
      <RigidBody type="fixed" colliders="trimesh">
        {environmentType === "BIGROOM" && <BigRoomModel />}
        {environmentType === "CASTLE" && <CastleModel />}
        {environmentType === "SINGLEROOM" && <SingleRoomModel />}
        {environmentType === "SHOWROOM" && <ShowroomModel />}
        {environmentType === "LOTUSDOME" && <LotusDomeModel />}
        {environmentType === "LUNOX" && <LunoxModel />}
        {environmentType === "SHELFSCAPE" && <ShelfscapeModel />}
        {environmentType === "KIDSSTORE" && <KidsStoreModel />}
        {environmentType === "ARCADEZONE" && <ArcadeZoneModel />}
        {environmentType === "VARSITYVAULT" && <VarsityVaultModel />}
        {environmentType === "GLOWBAR" && <GlowBarModel />}
        {environmentType === "LUXECRADLE" && <LuxeCradleModel />}
        {environmentType === "FLARESUITE" && <FlareSuiteModel />}
        {environmentType === "GARDENATELIER" && <GardenAtelierModel />}
        {environmentType === "COCKTAILDEN" && <CocktailDenModel />}
      </RigidBody>
      // Custom Physics
        {environmentType === "PETALPAVILION" && <PetalPavilionModel />}
      </>
    )
  );
}
