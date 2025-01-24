import { useComponentStore, EnvProduct, useActiveProductStore, useToolStore, useEnvProductStore, usePivotStore } from "@/stores/ZustandStores";
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
  const { products, setSelectedProduct } = useComponentStore();
  const {camera} = useThree();
  const {activeProductId} = useActiveProductStore();
  const {toolType} = useToolStore();
  const {modifyEnvProduct} = useEnvProductStore();
  const {setPivotActive} = usePivotStore();

  // Find the corresponding product for the envProduct
  const product = useMemo(() => {
    return products.find((p: Product) => p.id === envProduct.id);
  }, [products, envProduct.id]);

  // To show axes when selected
  const isActive = useMemo(() => {
    return activeProductId === envProduct.id && toolType === "3DPARAMS";
  }, [activeProductId, envProduct.id, toolType]);
  
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
  const modelRef = useRef<Object3D>(null);
  const meshRef = useRef<Mesh>(null);
  useEffect(() => {
    if(!modelRef.current || envProduct.type !== "MODEL_3D") return;

    // Position
    const worldPosition = new Vector3(...(computedPositionForModel || [0, 0, 0]));
    
    modelRef.current.matrixWorld.setPosition(worldPosition);
    if (modelRef.current.parent) {
      worldPosition.applyMatrix4(modelRef.current.parent.matrixWorld.invert());
    }
    modelRef.current.position.copy(worldPosition);

    // Rotation
    const worldRotation = computedRotation;
    const quaternion = new Quaternion();
    quaternion.setFromEuler(worldRotation);

    if (modelRef.current.parent){
      const parentQuaternion = new Quaternion();
      modelRef.current.parent.getWorldQuaternion(parentQuaternion);

      parentQuaternion.invert();
      quaternion.multiplyQuaternions(parentQuaternion, quaternion);
    }
    modelRef.current.setRotationFromQuaternion(quaternion);

  }, [position, computedPositionForModel, envProduct.type, computedRotation, camera, modelRef]);

  useEffect(() => {
    if(!meshRef.current || envProduct.type !== "PHOTO") return;

    // Position
    const cameraPosition = new Vector3(); camera.getWorldPosition(cameraPosition);
    const cameraDirection = new Vector3(); camera.getWorldDirection(cameraDirection);
    cameraDirection.multiplyScalar(5);
    cameraPosition.add(cameraDirection);

    const worldPosition = position? new Vector3(...position) : cameraPosition;
    
    meshRef.current.matrixWorld.setPosition(worldPosition);
    if (meshRef.current.parent) {
      worldPosition.applyMatrix4(meshRef.current.parent.matrixWorld.invert());
    }
    meshRef.current.position.copy(worldPosition);

    // Rotation
    const worldRotation = computedRotation;
    const quaternion = new Quaternion();
    quaternion.setFromEuler(worldRotation);

    if (meshRef.current.parent){
      const parentQuaternion = new Quaternion();
      meshRef.current.parent.getWorldQuaternion(parentQuaternion);

      parentQuaternion.invert();
      quaternion.multiplyQuaternions(parentQuaternion, quaternion);
    }
    meshRef.current.setRotationFromQuaternion(quaternion);

  }, [position, computedPositionForModel, envProduct.type, computedRotation, camera, meshRef]);

  const imageUrl = useMemo(() => {
    if((envProduct.imageIndex === undefined) || envProduct.type !== "PHOTO") return null;
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

  const handleClick = (event: React.MouseEvent<Object3D>) => {
    event.stopPropagation();
    if (envProduct && envProduct.id !== activeProductId) {
      setSelectedProduct(envProduct.id);
    }
  };

  const handleObjectMove = () => {
    if(envProduct.type === "MODEL_3D"){
      if(!modelRef.current) return;
  
      modelRef.current.updateMatrixWorld();
  
      const position = new Vector3();
      modelRef.current.getWorldPosition(position);
      
      if(boxCenter){ // Neutralize the auto generated offset
        position.add(boxCenter);
      }
  
      const quaternion = new Quaternion();
      modelRef.current.getWorldQuaternion(quaternion);
  
      const euler = new Euler();
      euler.setFromQuaternion(quaternion);
  
      const pos = [Math.round(position.x * 1000) / 1000, Math.round(position.y * 1000) / 1000, Math.round(position.z * 1000) / 1000];
      const rot =  [
        Math.round(euler.x * 180 / Math.PI * 1000) / 1000,
        Math.round(euler.y * 180 / Math.PI * 1000) / 1000,
        Math.round(euler.z * 180 / Math.PI * 1000) / 1000
      ];
      
      const newEnvProduct: EnvProduct = {
        id: envProduct.id,
        position: pos,
        rotation: rot,
        isEnvironmentProduct: true
      };

      modifyEnvProduct(newEnvProduct.id, newEnvProduct);
    }
    else if(envProduct.type === "PHOTO"){
      if(!meshRef.current) return;
  
      meshRef.current.updateMatrixWorld();
  
      const position = new Vector3();
      meshRef.current.getWorldPosition(position);
  
      const quaternion = new Quaternion();
      meshRef.current.getWorldQuaternion(quaternion);
  
      const euler = new Euler();
      euler.setFromQuaternion(quaternion);
  
      const pos = [Math.round(position.x * 1000) / 1000, Math.round(position.y * 1000) / 1000, Math.round(position.z * 1000) / 1000];
      const rot =  [
        Math.round(euler.x * 180 / Math.PI * 1000) / 1000,
        Math.round(euler.y * 180 / Math.PI * 1000) / 1000,
        Math.round(euler.z * 180 / Math.PI * 1000) / 1000
      ];
      
      const newEnvProduct: EnvProduct = {
        id: envProduct.id,
        position: pos,
        rotation: rot,
        isEnvironmentProduct: true
      };

      modifyEnvProduct(newEnvProduct.id, newEnvProduct);
    }
  };

  useEffect(() => {
    if(toolType === "3DPARAMS") handleObjectMove();
  }, [toolType]);

  return (
    <RigidBody type="fixed">
      <group
        position={[0, 0, 0]}
        rotation={new Euler(0, 0, 0)}
      >
        <PivotControls
          anchor={[0, 0, 0]}
          scale={1.25 * scale}
          activeAxes={[isActive, isActive, isActive]}
          visible={isActive}
          onDragStart={() => {setPivotActive(true)}}
          onDragEnd={() => {handleObjectMove(); setPivotActive(false);}}
          disableScaling
        >
          {envProduct.type === "MODEL_3D" && memoizedModelScene &&
            <primitive
              ref={modelRef}
              object={memoizedModelScene}
              scale={[computedScaleForModel, computedScaleForModel, computedScaleForModel]}
              onClick={handleClick}
              onPointerDown={handleClick}
              castShadow
              receiveShadow
            />
          }
          {envProduct.type === "PHOTO" && computedSizeForImage &&
            <mesh
              rotation={computedRotation}
              ref={meshRef}
            >
              <planeGeometry args={[computedSizeForImage[0], computedSizeForImage[1]]} />
              <meshBasicMaterial 
                map={imageTexture}
                transparent={true}
              />
            </mesh>
          }
        </PivotControls>
      </group>
    </RigidBody>
  );
};

export default DraggableContainer;