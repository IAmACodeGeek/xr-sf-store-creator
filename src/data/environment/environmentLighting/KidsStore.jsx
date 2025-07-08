import { Environment } from "@react-three/drei";

const KidsStoreLighting = () => {
  return (
    <>
      <Environment preset={"city"} environmentIntensity={1} />
      <ambientLight intensity={1} />
    </>
  );
};

export default KidsStoreLighting;
