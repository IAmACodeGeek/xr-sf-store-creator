import { Environment } from "@react-three/drei";

const GlowBarLighting = () => {
    return (
      <>
       <Environment preset={"city"}  environmentIntensity={1} background={false} />
       <ambientLight intensity={1} />
      </>
    );
  };
  
  export default GlowBarLighting;