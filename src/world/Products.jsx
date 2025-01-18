import React, { Suspense } from "react";
import { useGLTFWithKTX2 } from "./useGTLFwithKTX";
import mannequinData from "../data/MannequinData";
const LazyMannequin = React.lazy(() => import("./Mannequin"));

const Products = () => {
  return (
    <Suspense fallback={null}>
      {mannequinData.map((data, index) => (
        <ModelWrapper
          key={index}
          productId={data.id}
          modelPath={data.modelPath}
          position={data.position}
          scale={data.scale}
          sale={data.sale || false }
        />
      ))}
    </Suspense>
  );
};


const ModelWrapper = ({ productId, modelPath, position, scale ,sale}) => {
  const { scene } = useGLTFWithKTX2(modelPath); 

  return scene ? ( 
    <LazyMannequin
      productId={productId}
      position={position}
      modelPath={modelPath}
      sale = {sale}
      scale={scale}
      model={{ scene }}
    />
  ) : null; 
};

export default Products;
