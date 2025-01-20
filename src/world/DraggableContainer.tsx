import { useComponentStore, EnvProduct } from "@/stores/ZustandStores";
import { Billboard, PivotControls, useGLTF, Image as DreiImage } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useState } from "react";
import type Product from '../Types/Product';
import {Box3, Vector3} from 'three';

interface DraggableContainerProps {
  position?: [number, number, number] | undefined;
  rotation?: [number, number, number] | undefined;
  scale?: number | undefined;
  envProduct: EnvProduct;
}

const DraggableContainer = ({
  position = [0, 0, 0],
  rotation = undefined,
  scale = undefined,
  envProduct
}: DraggableContainerProps) => {
  const { products, selectedProduct, setSelectedProduct } = useComponentStore();
  
  // Find the corresponding product for the envProduct
  const product = useMemo(() => {
    return products.find((p: Product) => p.id === envProduct.id);
  }, [products, envProduct.id]);

  // To show axes when selected
  const [isSelected, setIsSelected] = useState(false);
  useEffect(() => {
    setIsSelected(selectedProduct?.id === envProduct.id);
  }, [selectedProduct, envProduct.id]);

  // Get the model URL based on modelIndex
  const modelUrl = useMemo(() => {
    if (envProduct.type !== "MODEL_3D" || !product?.models || envProduct.modelIndex === undefined) {
      return null;
    }

    const model = product.models[envProduct.modelIndex];
    if (!model?.sources?.[0]?.url) {
      return null;
    }
    
    return model.sources[0].url;
  }, [product, envProduct.modelIndex, envProduct.type]);

  // Load the GLTF model
  const model = useMemo(() => {
    if (!modelUrl) return null;
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useGLTF(modelUrl);
    } catch (error) {
      console.error('Error loading model:', error);
      return null;
    }
  }, [modelUrl]);

  const scene = model?.scene;

  // Memoize the scene to prevent unnecessary rerenders
  const memoizedModelScene = useMemo(() => {
    if (!scene) return null;
    const clonedScene = scene.clone();
    return clonedScene;
  }, [scene]);

  // Convert rotation from degrees to radians
  const computedRotation = useMemo(() => {
    if(rotation)
      return rotation.map((deg) => (deg * Math.PI) / 180) as [number, number, number];
    else
      return [0, 0, 0];
  }, [rotation]);
  
  // Manually compute scale such that object has unit height
  const computedScaleForModel = useMemo(() => {
    if(!scene) return null;

    if(scale) return scale;

    const box = new Box3().setFromObject(scene);
    const standardHeight = 1.5;
    const size = new Vector3();
    box.getSize(size);
    return standardHeight / size.y;
  }, [scene, scale, envProduct.type]);

  const computedPositionForModel = useMemo(() => {
    if(!computedScaleForModel || !scene) return null;

    const positionVector = new Vector3(position[0], position[1], position[2]);
    
    // Get the bounding box AFTER applying scale
    const scaledScene = scene.clone();
    scaledScene.scale.set(computedScaleForModel, computedScaleForModel, computedScaleForModel);
    const box = new Box3().setFromObject(scaledScene);
    
    // Calculate center offset
    const boxCenter = new Vector3();
    box.getCenter(boxCenter);
    
    // Adjust position to account for scaled center offset
    const newPosition = positionVector.clone().sub(boxCenter.clone().sub(positionVector));
    
    return [newPosition.x, newPosition.y, newPosition.z];
  }, [scene, computedScaleForModel, position]);

  const handleClick = (event) => {
    event.stopPropagation();
    if (envProduct && envProduct.id !== selectedProduct?.id) {
      setSelectedProduct(envProduct.id);
    }
  };

  return (
    <RigidBody type="fixed">
      <PivotControls
        anchor={[0, 0, 0]}
        scale={1.25}
        activeAxes={[isSelected, isSelected, isSelected]}
        visible={isSelected}
        disableScaling
      >
        {envProduct.type === "MODEL_3D" && memoizedModelScene &&
          <primitive
            object={memoizedModelScene}
            position={computedPositionForModel}
            rotation={computedRotation}
            scale={[computedScaleForModel, computedScaleForModel, computedScaleForModel]}
            onClick={handleClick}
            onPointerDown={handleClick}
            castShadow
            receiveShadow
          />
        }
        {envProduct.type === "PSEUDO_3D" &&
          <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
            <DreiImage 
              url={product?.images?.[envProduct.imageIndex || 0].src || ""}
              scale={[scale || 1, scale || 1]} 
              transparent={true} 
            />
          </Billboard>
        }
      </PivotControls>
    </RigidBody>
  );
};

export default DraggableContainer;