import { useComponentStore, EnvProduct, useToolStore, useEnvProductStore, useBrandStore } from "@/stores/ZustandStores";
import { PivotControls, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import type Product from '../Types/Product';
import {Box3, Euler, Mesh, Object3D, Quaternion, TextureLoader, Vector3} from 'three';
import { useLoader, useThree } from "@react-three/fiber";
import environmentData from "../data/environment/EnvironmentData";

interface DraggableProductContainerProps {
  placeHolderId?: number | undefined;
  envPosition?: [number, number, number];
  envRotation?: [number, number, number];
  envScale?: number;
  envProduct: EnvProduct;
}

const DraggableProductContainer = ({
  placeHolderId = undefined,
  envPosition = undefined,
  envRotation = undefined,
  envScale = 1,
  envProduct
}: DraggableProductContainerProps) => {
  const { products } = useComponentStore();
  const {camera} = useThree();
  const {toolType} = useToolStore();
  const {modifyEnvProduct, activeProductId} = useEnvProductStore();
  const {brandData} = useBrandStore();

  // Placeholder data
  const placeHolderData = useMemo(() => {
    if(!brandData) return null;
    return environmentData[brandData.brand_name].placeHolderData;
  }, [brandData]);
  
  // Find the corresponding product for the envProduct
  const product = useMemo(() => {
    return products.find((p: Product) => p.id === envProduct.id);
  }, [products, envProduct.id]);

  // To show axes when selected
  const isActive = useMemo(() => {
    return activeProductId === envProduct.id && toolType === "3DPARAMS" && envProduct.placeHolderId === undefined;
  }, [activeProductId, envProduct.id, envProduct.placeHolderId, toolType]);
  
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
      console.log(modelUrl);
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

  // Fetch position, rotation & scale from placeholder
  const position = useMemo(() => {
    if(placeHolderData && placeHolderId !== undefined){
      const placeHolder = placeHolderData.find((placeHolder) => placeHolder.id === placeHolderId);
      return placeHolder?.position || envPosition;
    }
    return envPosition;
  }, [placeHolderId, envPosition, placeHolderData]);
  const rotation = useMemo(() => {
    if(placeHolderData && placeHolderId !== undefined){
      const placeHolder = placeHolderData.find((placeHolder) => placeHolder.id === placeHolderId);
      return placeHolder?.rotation || envRotation;
    }
    return envRotation;
  }, [placeHolderId, envRotation, placeHolderData]);
  const scale = useMemo(() => {
    if(placeHolderData && placeHolderId !== undefined){
      const placeHolder = placeHolderData.find((placeHolder) => placeHolder.id === placeHolderId);
      return placeHolder?.scale || envScale;
    }
    return envScale;
  }, [placeHolderId, envScale, placeHolderData]);

  // Convert rotation from degrees to radians
  const computedRotation = useMemo(() => {
    const rotArray = [0, 0, 0];
    if(!rotation){
      const direction = new Vector3(); camera.getWorldDirection(direction);
      direction.y = 0;
      const angle = Math.atan(direction.x / direction.z) * 180 / Math.PI;
      rotArray[1] = angle - (direction.z > 0 ? 180: 0);
    }
    else{
      rotArray[0] = rotation[0]; rotArray[1] = rotation[1]; rotArray[2] = rotation[2];
    }
    return new Euler(
      rotArray[0] * Math.PI / 180,
      rotArray[1] * Math.PI / 180,
      rotArray[2] * Math.PI / 180,
      'YZX'
    );
  }, [rotation, position]);
  
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

  const handleObjectTranslate = () => {
    if(envProduct.type === "MODEL_3D"){
      if(!modelRef.current) return;
  
      modelRef.current.updateMatrixWorld();
  
      const position = new Vector3();
      modelRef.current.getWorldPosition(position);
      
      if(boxCenter){ // Neutralize the auto generated offset
        position.add(boxCenter);
      }
  
      const pos = [Math.round(position.x * 1000) / 1000, Math.round(position.y * 1000) / 1000, Math.round(position.z * 1000) / 1000];
      
      const newEnvProduct: EnvProduct = {
        id: envProduct.id,
        position: pos,
        scale: envScale,
        isEnvironmentProduct: true
      };

      modifyEnvProduct(newEnvProduct.id, newEnvProduct);
    }
    else if(envProduct.type === "PHOTO"){
      if(!meshRef.current) return;
  
      meshRef.current.updateMatrixWorld();
  
      const position = new Vector3();
      meshRef.current.getWorldPosition(position);
  
      const pos = [Math.round(position.x * 1000) / 1000, Math.round(position.y * 1000) / 1000, Math.round(position.z * 1000) / 1000];
      
      const newEnvProduct: EnvProduct = {
        id: envProduct.id,
        position: pos,
        scale: envScale,
        isEnvironmentProduct: true
      };

      modifyEnvProduct(newEnvProduct.id, newEnvProduct);
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
      euler.reorder('YZX');
  
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
        scale: envScale,
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
      euler.reorder('YZX');
  
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
        scale: envScale,
        isEnvironmentProduct: true
      };

      modifyEnvProduct(newEnvProduct.id, newEnvProduct);
    }
  };

  useEffect(() => {
    handleObjectTranslate();
  }, [envProduct.imageIndex, envProduct.modelIndex]);

  useEffect(() => {
    handleObjectMove();
  }, [activeProductId]);

  return (
    <RigidBody type="fixed">
      <group
        position={[0, 0, 0]}
        rotation={new Euler(0, 0, 0, 'YZX')}
      >
        <PivotControls
          anchor={[0, 0, 0]}
          scale={1.25 * scale}
          activeAxes={[isActive, isActive, isActive]}
          visible={isActive}
          onDragEnd={handleObjectMove}
          disableScaling
        >
          {envProduct.type === "MODEL_3D" && memoizedModelScene &&
            <primitive
              ref={modelRef}
              object={memoizedModelScene}
              scale={[computedScaleForModel, computedScaleForModel, computedScaleForModel]}
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

export default DraggableProductContainer;