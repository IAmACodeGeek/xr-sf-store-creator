import { Environment } from "@react-three/drei";

const ShowroomLighting = () => {
    return (
      <>
       <ambientLight intensity={1} color={"#ffffff"} />
       <Environment preset="city" environmentIntensity={0.6} />
      </>
    );
  };
  
  export default ShowroomLighting;