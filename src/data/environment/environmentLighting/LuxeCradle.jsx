import { Environment } from "@react-three/drei";

const LuxeCradleLighting = () => {
  return (
    <>
      <Environment preset={"city"} environmentIntensity={1} background={true} />
    </>
  );
};

export default LuxeCradleLighting;
