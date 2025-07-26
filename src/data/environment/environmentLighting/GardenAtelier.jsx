import { Environment } from "@react-three/drei";

const GardenAtelierLighting = () => {
  return (
    <>
      <Environment files={["/hdr/city.hdr"]} environmentIntensity={2} />
    </>
  );
};

export default GardenAtelierLighting;