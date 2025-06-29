import { RigidBody } from '@react-three/rapier';
import BigRoomModel from '@/data/environment/environmentModel/BigRoom';
import CastleModel from '@/data/environment/environmentModel/Castle';
import SingleRoomModel from '@/data/environment/environmentModel/SingleRoom';
import { useEnvironmentStore } from '@/stores/ZustandStores';
import ShowroomModel from '@/data/environment/environmentModel/Showroom';
import { LotusDomeModel } from '@/data/environment/environmentModel/LotusDome';

export function Ground() {
  const { environmentType } = useEnvironmentStore();
  return (environmentType &&
    <RigidBody type="fixed" colliders="trimesh">
      {environmentType === "BIGROOM" && <BigRoomModel/>}
      {environmentType === "CASTLE" && <CastleModel/>}
      {environmentType === "SINGLEROOM" && <SingleRoomModel/>}
      {environmentType === "SHOWROOM" && <ShowroomModel/>}
      {environmentType === "LOTUSDOME" && <LotusDomeModel/>}  
    </RigidBody>
  );
}


