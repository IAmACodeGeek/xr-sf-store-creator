import { Environment } from "@react-three/drei";
import hdr from "/hdr/Arcade Zone.hdr?url";

const ArcadeZoneLighting = () => {
    return (
      <>
      <Environment files={[hdr]}  environmentIntensity={1} background={true} />
      </>
    );
  };
  
  export default ArcadeZoneLighting;