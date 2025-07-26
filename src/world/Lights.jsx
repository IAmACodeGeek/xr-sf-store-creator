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
import VarsityVaultLighting from "@/data/environment/environmentLighting/VarsityVault";
import GlowBarLighting from "@/data/environment/environmentLighting/Glowbar";
import LuxeCradleLighting from "@/data/environment/environmentLighting/LuxeCradle";
import FlareSuiteLighting from "@/data/environment/environmentLighting/FlareSuite";
import GardenAtelierLighting from "@/data/environment/environmentLighting/GardenAtelier";
import CocktailDenLighting from "@/data/environment/environmentLighting/CocktailDen";
import PetalPavilionLighting from "@/data/environment/environmentLighting/PetalPavilion";

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
      {environmentType === "VARSITYVAULT" && <VarsityVaultLighting />}
      {environmentType === "GLOWBAR" && <GlowBarLighting />}
      {environmentType === "LUXECRADLE" && <LuxeCradleLighting />}
      {environmentType === "FLARESUITE" && <FlareSuiteLighting />}
      {environmentType === "GARDENATELIER" && <GardenAtelierLighting />}
      {environmentType === "COCKTAILDEN" && <CocktailDenLighting />}
      {environmentType === "PETALPAVILION" && <PetalPavilionLighting />}
    </>
  );
};

export default Lights;
