import { Environment } from "@react-three/drei";

const LotusDomeLighting = () => {
    return (
      <>
        <Environment preset="city" environmentIntensity={2} />
        <ambientLight colo intensity={2}  />
      </>
    );
  };
  
  export default LotusDomeLighting;