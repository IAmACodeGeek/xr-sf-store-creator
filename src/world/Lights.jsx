import { useEnvironmentStore } from "@/stores/ZustandStores";
import BigRoomLighting from "@/data/environment/environmentLighting/BigRoom";
import CastleLighting from "@/data/environment/environmentLighting/Castle";
import SingleRoomLighting from "@/data/environment/environmentLighting/SingleRoom";
import ShowroomLighting from "@/data/environment/environmentLighting/ShowRoom";
import LotusDomeLighting from "@/data/environment/environmentLighting/LotusDome";
import LunoxLighting from "@/data/environment/environmentLighting/Lunox";
import ShelfscapeLighting from "@/data/environment/environmentLighting/Shelfscape";
import KidsStoreLighting from "@/data/environment/environmentLighting/KidsStore";
import ArcadeZoneLighting from "@/data/environment/environmentLighting/ArcadeZone";

const Lights = () => {
  const { environmentType } = useEnvironmentStore();

  return (
    <>
      {environmentType === "BIGROOM" && <BigRoomLighting />}
      {environmentType === "CASTLE" && <CastleLighting />}
      {environmentType === "SINGLEROOM" && <SingleRoomLighting />}
      {environmentType === "SHOWROOM" && <ShowroomLighting />}
      {environmentType === "LOTUSDOME" && <LotusDomeLighting />}
      {environmentType === "LUNOX" && <LunoxLighting />}
      {environmentType === "SHELFSCAPE" && <ShelfscapeLighting />}
      {environmentType === "KIDSSTORE" && <KidsStoreLighting />}
      {environmentType === "ARCADEZONE" && <ArcadeZoneLighting />}
    </>
  );
};

export default Lights;
