import { Environment } from "@react-three/drei";

const PetalPavilionLighting = () => {
  return (
    <>
      <Environment preset={"city"} environmentIntensity={1} background={false} />
    </>
  );
};

export default PetalPavilionLighting;