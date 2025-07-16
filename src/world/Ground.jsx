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

export function Ground() {
  const { environmentType } = useEnvironmentStore();
  return (
    environmentType && (
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
      </RigidBody>
    )
  );
}
