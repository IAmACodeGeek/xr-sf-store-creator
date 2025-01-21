import { useComponentStore, EnvProduct } from "@/stores/ZustandStores";
import { Billboard, PivotControls, useGLTF, Image as DreiImage } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import type Product from '../Types/Product';
import {Box3, Euler, Mesh, Object3D, Quaternion, TextureLoader, Vector3} from 'three';
import { useLoader, useThree } from "@react-three/fiber";

interface DraggableContainerProps {
  position?: [number, number, number] | undefined;
  rotation?: [number, number, number];
  scale?: number;
  envProduct: EnvProduct;
}

const DraggableContainer = ({
  position = undefined,
  rotation = [0, 0, 0],
  scale = 1,
  envProduct
}: DraggableContainerProps) => {
  const { products, selectedProduct, setSelectedProduct } = useComponentStore();
  const {camera} = useThree();

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
    const rotArray = rotation || [0, 0, 0];
    return new Euler(
      rotArray[0] * Math.PI / 180,
      rotArray[1] * Math.PI / 180,
      rotArray[2] * Math.PI / 180
    )
  }, [rotation]);
  
  // Manually compute scale such that object has unit height
  const computedScaleForModel = useMemo(() => {
    if(!scene) return null;

    const box = new Box3().setFromObject(scene);

    const size = new Vector3();
    box.getSize(size);

    return scale / size.y;
  }, [scene, scale]);

  const {computedPositionForModel, boxCenter} = useMemo(() => {
    if(!computedScaleForModel || !scene) return {
      computedPositionForModel: null,
      boxCenter: null
    };

    const cameraPosition = new Vector3(); camera.getWorldPosition(cameraPosition);
    const cameraDirection = new Vector3(); camera.getWorldDirection(cameraDirection);
    cameraDirection.multiplyScalar(5);
    cameraPosition.add(cameraDirection);
    const positionVector = position? new Vector3(position[0], position[1], position[2]) : cameraPosition;
    
    // Get the bounding box AFTER applying scale
    const scaledScene = scene.clone();
    scaledScene.scale.set(computedScaleForModel, computedScaleForModel, computedScaleForModel);
    const box = new Box3().setFromObject(scaledScene);
    
    // Calculate center offset
    const boxCenter = new Vector3();
    box.getCenter(boxCenter);
    
    // Adjust position to account for scaled center offset
    const newPosition = positionVector.clone().sub(boxCenter.clone());
    
    return {
      computedPositionForModel: [newPosition.x, newPosition.y, newPosition.z],
      boxCenter: boxCenter
    }
  }, [scene, computedScaleForModel, position, camera]);

  // Set position and rotation
  const objectRef = useRef<Mesh | Object3D>(null);
  useEffect(() => {
    if(!objectRef.current) return;

    // Position
    let worldPosition = new Vector3(0, 0, 0);
    
    if(envProduct.type === "PHOTO" || envProduct.type === "PSEUDO_3D"){
      const cameraPosition = new Vector3(); camera.getWorldPosition(cameraPosition);
      const cameraDirection = new Vector3(); camera.getWorldDirection(cameraDirection);
      cameraDirection.multiplyScalar(5);
      cameraPosition.add(cameraDirection);

      worldPosition = position? new Vector3(...position) : cameraPosition;
      // console.log("photo");
      // console.log(position);
    }
    else if(envProduct.type === "MODEL_3D" && computedPositionForModel){
      worldPosition = new Vector3(...computedPositionForModel);
      // console.log("model", worldPosition);
    }
    
    objectRef.current.matrixWorld.setPosition(worldPosition);
    if (objectRef.current.parent) {
      worldPosition.applyMatrix4(objectRef.current.parent.matrixWorld.invert());
    }
    objectRef.current.position.copy(worldPosition);

    // Rotation
    const worldRotation = computedRotation;
    const quaternion = new Quaternion();
    quaternion.setFromEuler(worldRotation);

    if (objectRef.current.parent){
      const parentQuaternion = new Quaternion();
      objectRef.current.parent.getWorldQuaternion(parentQuaternion);

      parentQuaternion.invert();
      quaternion.multiplyQuaternions(parentQuaternion, quaternion);
    }
    objectRef.current.setRotationFromQuaternion(quaternion);

  }, [position, computedPositionForModel, envProduct.type, computedRotation, camera]);

  const imageUrl = useMemo(() => {
    if(!envProduct.imageIndex || !["PSEUDO_3D", "PHOTO"].includes(envProduct.type)) return null;
    return product?.images[envProduct.imageIndex].src || "";
  }, [envProduct.type, envProduct.imageIndex, product?.images]);

  const imageTexture = useMemo(() => {
    if(!imageUrl) return null;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useLoader(TextureLoader, imageUrl);
  }, [imageUrl]);

  const computedSizeForImage = useMemo(() => {
    if(!imageTexture) return null;

    const width = imageTexture.image.width;
    const height = imageTexture.image.height;

    // Convert to world size
    const convertPixelToWorldSize = (i: number) => { return i / 100 };
    const imageWidthInWorld = convertPixelToWorldSize(width);
    const imageHeightInWorld = convertPixelToWorldSize(height)

    // Scale
    const computedScale = scale / imageHeightInWorld;
    return [
      computedScale * imageWidthInWorld,
      computedScale * imageHeightInWorld
    ];
  }, [imageTexture, scale]);

  const handleClick = (event) => {
    event.stopPropagation();
    if (envProduct && envProduct.id !== selectedProduct?.id) {
      setSelectedProduct(envProduct.id);
    }
  };

  const handleObjectMove = () => {
    if(!objectRef.current) return;

    objectRef.current.updateMatrixWorld();

    const position = new Vector3();
    objectRef.current.getWorldPosition(position);
    if(envProduct.type === "MODEL_3D" && boxCenter){ // Neutralize the auto generated offset
      position.add(boxCenter);
    }

    const quaternion = new Quaternion();
    objectRef.current.getWorldQuaternion(quaternion);

    const euler = new Euler();
    euler.setFromQuaternion(quaternion);

    const pos = [position.x, position.y, position.z];
    const rot =  [
      euler.x * 180 / Math.PI,
      euler.y * 180 / Math.PI,
      euler.z * 180 / Math.PI
    ];
    
    envProduct.position = pos;
    envProduct.rotation = rot;
  };

  return (
    <RigidBody type="fixed">
      <group
        position={[0, 0, 0]}
        rotation={new Euler(0, 0, 0)}
      >
        <PivotControls
          anchor={[0, 0, 0]}
          scale={1.25}
          activeAxes={[isSelected, isSelected, isSelected]}
          visible={isSelected}
          onDragEnd={handleObjectMove}
          disableScaling
        >
          {envProduct.type === "MODEL_3D" && memoizedModelScene &&
            <primitive
              ref={objectRef}
              object={memoizedModelScene}
              scale={[computedScaleForModel, computedScaleForModel, computedScaleForModel]}
              onClick={handleClick}
              onPointerDown={handleClick}
              castShadow
              receiveShadow
            />
          }
          {envProduct.type === "PSEUDO_3D" &&
            <Billboard follow={true} lockX={false} lockY={false} lockZ={false}
              ref={objectRef}
            >
              <DreiImage 
                url={product?.images?.[envProduct.imageIndex || 0].src || ""}
                scale={[scale || 1, scale || 1]} 
                transparent={true} 
              />
            </Billboard>
          }
          {envProduct.type === "PHOTO" && computedSizeForImage &&
            <mesh
              rotation={computedRotation}
              ref={objectRef}
            >
              <planeGeometry args={[computedSizeForImage[0], computedSizeForImage[1]]} />
              <meshBasicMaterial 
                map={imageTexture}
                transparent={false}
              />
            </mesh>
          }
        </PivotControls>
      </group>
    </RigidBody>
  );
};

export default DraggableContainer;