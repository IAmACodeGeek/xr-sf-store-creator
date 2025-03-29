import { useEnvironmentStore } from '@/stores/ZustandStores';
import BigRoomLighting from '@/data/environment/environmentLighting/BigRoom';
import CastleLighting from '@/data/environment/environmentLighting/Castle';
import SingleRoomLighting from '@/data/environment/environmentLighting/SingleRoom';

const Lights = () => {
  const {environmentType} = useEnvironmentStore();

  return (
    <>
      {environmentType === "BIGROOM" && <BigRoomLighting/>}
      {environmentType === "CASTLE" && <CastleLighting/>}
      {environmentType === "SINGLEROOM" && <SingleRoomLighting/>}
    </>
  );
};

export default Lights;