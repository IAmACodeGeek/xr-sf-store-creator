import { Environment } from "@react-three/drei";

const ShelfscapeLighting = () => {
    return (
      <>
        <Environment preset={"city"} environmentIntensity={1} />
        <ambientLight intensity={2}  />
      </>
    );
  };
  
  export default ShelfscapeLighting;