import { Environment } from "@react-three/drei";

const CocktailDenLighting = () => {
  return (
    <>
      <Environment files={["/hdr/city.hdr"]} environmentIntensity={2} />
    </>
  );
};

export default CocktailDenLighting;