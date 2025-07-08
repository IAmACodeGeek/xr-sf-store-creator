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
      </RigidBody>
    )
  );
}
