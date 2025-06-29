import { useEnvironmentStore } from '@/stores/ZustandStores';
import BigRoomLighting from '@/data/environment/environmentLighting/BigRoom';
import CastleLighting from '@/data/environment/environmentLighting/Castle';
import SingleRoomLighting from '@/data/environment/environmentLighting/SingleRoom';
import ShowroomLighting from '@/data/environment/environmentLighting/ShowRoom';
import LotusDomeLighting from '@/data/environment/environmentLighting/LotusDome';

const Lights = () => {
  const {environmentType} = useEnvironmentStore();

  return (
    <>
      {environmentType === "BIGROOM" && <BigRoomLighting/>}
      {environmentType === "CASTLE" && <CastleLighting/>}
      {environmentType === "SINGLEROOM" && <SingleRoomLighting/>}
      {environmentType === "SHOWROOM" && <ShowroomLighting/>}
      {environmentType === "LOTUSDOME" && <LotusDomeLighting/>}
    </>
  );
};

export default Lights;