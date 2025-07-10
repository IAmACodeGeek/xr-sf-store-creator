import { Environment } from "@react-three/drei";

const VarsityVaultLighting = () => {
  return (
    <>
      <Environment preset={"city"} environmentIntensity={1} background={true} />
    </>
  );
};

export default VarsityVaultLighting;
