import { Environment } from "@react-three/drei";

const FlareSuiteLighting = () => {
  return (
    <>
      <Environment preset={"city"} environmentIntensity={1} background={true} />
    </>
  );
};

export default FlareSuiteLighting;