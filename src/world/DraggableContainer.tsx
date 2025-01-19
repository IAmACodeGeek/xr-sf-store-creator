import { useComponentStore, EnvProduct } from "@/stores/ZustandStores";
import { PivotControls, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useState } from "react";
import type Product from '../Types/Product';
import {Box3, Vector3} from 'three';

interface DraggableContainerProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale: number | undefined;
  envProduct: EnvProduct;
}

const DraggableContainer = ({
  position = [2, -4, -77],
  rotation = [0, 0, 0],
  scale,
  envProduct
}: DraggableContainerProps) => {
  const { products, selectedProduct, setSelectedProduct } = useComponentStore();
  const [isSelected, setIsSelected] = useState(false);
  const [currentModel, setCurrentModel] = useState<string | null>(null);

  // Find the corresponding product for the envProduct
  const product = useMemo(() => {
    return products.find((p: Product) => p.id === envProduct.id);
  }, [products, envProduct.id]);

  // Get the model URL based on modelIndex
  const modelUrl = useMemo(() => {
    if (!product?.models || typeof envProduct.modelIndex !== 'number') {
      return null;
    }

    const model = product.models[envProduct.modelIndex];
    if (!model?.sources?.[0]?.url) {
      return null;
    }
    
    return model.sources[0].url;
  }, [product, envProduct.modelIndex]);

  // Update current model when modelUrl changes
  useEffect(() => {
    if (modelUrl && modelUrl !== currentModel) {
      setCurrentModel(modelUrl);
    }
  }, [modelUrl]);

  // Load the GLTF model
  const { scene } = useGLTF(modelUrl || '');

  // Memoize the scene to prevent unnecessary rerenders
  const memoizedModelScene = useMemo(() => {
    if (!scene) return null;
    const clonedScene = scene.clone();
    return clonedScene;
  }, [scene, modelUrl]);

  // Update selection state
  useEffect(() => {
    setIsSelected(selectedProduct?.id === envProduct.id);
  }, [selectedProduct, envProduct.id]);

  // Convert rotation from degrees to radians
  const computedRotation = useMemo(() => {
    return rotation.map((deg) => (deg * Math.PI) / 180) as [number, number, number];
  }, [rotation]);

  const computedScale = useMemo(() => {
    if(scale) 
      return scale;

    // Manually compute scale such that object not too big
    const box = new Box3().setFromObject(scene);
    const standardHeight = 1;
    const size = new Vector3();
    box.getSize(size);
    return standardHeight / size.z;
  }, [scene])

  const handleClick = (event) => {
    event.stopPropagation();
    if (envProduct) {
      setSelectedProduct(envProduct.id);
    }
  };

  // Don't render anything if we don't have a valid model
  if (!memoizedModelScene || !modelUrl) {
    return null;
  }

  return (
    <RigidBody type="fixed">
      <PivotControls
        anchor={[0, 0, 0]}
        scale={1}
        activeAxes={[isSelected, isSelected, isSelected]}
        visible={isSelected}
        disableScaling
      >
        <primitive
          object={memoizedModelScene}
          position={position}
          rotation={computedRotation}
          scale={[computedScale, computedScale, computedScale]}
          onClick={handleClick}
          onPointerDown={handleClick}
          castShadow
          receiveShadow
        />
      </PivotControls>
    </RigidBody>
  );
};

export default DraggableContainer;