import { EnvAsset, useEnvAssetStore } from "@/stores/ZustandStores";
import { PivotControls, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import {BackSide, Box3, Euler, Mesh, Object3D, Quaternion, TextureLoader, Vector3} from 'three';
import { useLoader, useThree } from "@react-three/fiber";

interface DraggableAssetContainerProps {
  envPosition?: [number, number, number];
  envRotation?: [number, number, number];
  envScale?: number;
  envAsset: EnvAsset;
}

const DraggableAssetContainer = ({
  envPosition = undefined,
  envRotation = undefined,
  envScale = 1,
  envAsset
}: DraggableAssetContainerProps) => {
  const {camera} = useThree();
  const {modifyEnvAsset, activeAssetId} = useEnvAssetStore();

  // To show axes when selected
  const isActive = useMemo(() => {
    return activeAssetId === envAsset.id;
  }, [activeAssetId, envAsset.id]);
  
  // Get the model URL based on modelIndex
  const modelUrl = useMemo(() => {
    if (envAsset.type !== "MODEL_3D" || !envAsset.src) {
      return null;
    }
    
    return envAsset.src;
  }, [envAsset.type, envAsset.src]);

  // Load the GLTF model
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const gltf = modelUrl? useGLTF(modelUrl) : null;
  const model = useMemo(() => {
    if (!modelUrl) return null;
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return gltf;
    } catch (error) {
      console.error('Error loading model:', error);
      return null;
    }
  }, [modelUrl, gltf]);

  const scene = model?.scene;

  // Memoize the scene to prevent unnecessary rerenders
  const memoizedModelScene = useMemo(() => {
    if (!scene) return null;
    const clonedScene = scene.clone();
    return clonedScene;
  }, [scene]);

  // Get the position, rotation and scale
  const position = useMemo(() => {
    return envPosition;
  }, [envPosition]);

  const rotation = useMemo(() => {
    return envRotation;
  }, [envRotation]);

  const scale = useMemo(() => {
    return envScale;
  }, [envScale]);

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
  }, [rotation, camera]);
  
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
  const backMeshRef = useRef<Mesh>(null);
  useEffect(() => {
    if(!modelRef.current || envAsset.type !== "MODEL_3D") return;

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

  }, [position, computedPositionForModel, envAsset.type, computedRotation, camera, modelRef]);

  useEffect(() => {
    if(!meshRef.current || !backMeshRef.current || envAsset.type !== "PHOTO") return;

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
    backMeshRef.current.position.copy(worldPosition);

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
    backMeshRef.current.setRotationFromQuaternion(quaternion);

  }, [position, computedPositionForModel, envAsset.type, computedRotation, camera, meshRef, backMeshRef]);

  const imageUrl = useMemo(() => {
    if(envAsset.type !== "PHOTO" || !envAsset.src) return null;
    return envAsset.src;
  }, [envAsset.type, envAsset.src]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const texture = imageUrl? useLoader(TextureLoader, imageUrl) : null;
  const imageTexture = useMemo(() => {
    if(!imageUrl) return null;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    try{
      return texture;
    }
    catch(error){
      console.error('Error Loading Asset Image: ', error);
      return null;
    }
  }, [imageUrl, texture]);

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
    if(envAsset.type === "MODEL_3D"){
      if(!modelRef.current) return;
  
      modelRef.current.updateMatrixWorld();
  
      const position = new Vector3();
      modelRef.current.getWorldPosition(position);
      
      if(boxCenter){ // Neutralize the auto generated offset
        position.add(boxCenter);
      }
  
      const pos = [Math.round(position.x * 1000) / 1000, Math.round(position.y * 1000) / 1000, Math.round(position.z * 1000) / 1000];
      
      const newEnvAsset: EnvAsset = {
        id: envAsset.id,
        name: envAsset.name,
        type: envAsset.type,
        src: envAsset.src,
        isEnvironmentAsset: true,
        status: envAsset.status,
        position: pos,
        scale: envScale
      };

      modifyEnvAsset(newEnvAsset.id, newEnvAsset);
    }
    else if(envAsset.type === "PHOTO"){
      if(!meshRef.current) return;
  
      meshRef.current.updateMatrixWorld();
  
      const position = new Vector3();
      meshRef.current.getWorldPosition(position);
  
      const pos = [Math.round(position.x * 1000) / 1000, Math.round(position.y * 1000) / 1000, Math.round(position.z * 1000) / 1000];
      
      const newEnvAsset: EnvAsset = {
        id: envAsset.id,
        name: envAsset.name,
        type: envAsset.type,
        src: envAsset.src,
        isEnvironmentAsset: true,
        status: envAsset.status,
        position: pos,
        scale: envScale
      };

      modifyEnvAsset(newEnvAsset.id, newEnvAsset);
    }
  };

  const handleObjectMove = () => {
    if(envAsset.type === "MODEL_3D"){
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
      
      const newEnvAsset: EnvAsset = {
        id: envAsset.id,
        name: envAsset.name,
        type: envAsset.type,
        src: envAsset.src,
        isEnvironmentAsset: true,
        status: envAsset.status,
        position: pos,
        rotation: rot,
        scale: envScale
      };

      modifyEnvAsset(newEnvAsset.id, newEnvAsset);
    }
    else if(envAsset.type === "PHOTO"){
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
      
      const newEnvAsset: EnvAsset = {
        id: envAsset.id,
        name: envAsset.name,
        type: envAsset.type,
        src: envAsset.src,
        isEnvironmentAsset: true,
        status: envAsset.status,
        position: pos,
        rotation: rot,
        scale: envScale
      };

      modifyEnvAsset(newEnvAsset.id, newEnvAsset);
    }
  };

  useEffect(() => {
    handleObjectTranslate();
  }, [envAsset.src]);

  useEffect(() => {
    handleObjectMove();
  }, [activeAssetId]);

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
          {envAsset.type === "MODEL_3D" && memoizedModelScene &&
            <primitive
              ref={modelRef}
              object={memoizedModelScene}
              scale={[computedScaleForModel, computedScaleForModel, computedScaleForModel]}
              castShadow
              receiveShadow
            />
          }
          {envAsset.type === "PHOTO" && computedSizeForImage &&
            <>
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
                <mesh
                ref={backMeshRef}
                rotation={computedRotation}
              >
                <planeGeometry args={[computedSizeForImage[0], computedSizeForImage[1]]} />
                <meshBasicMaterial 
                  color={0xffffff}
                  side={BackSide}
                />
              </mesh>
            </>
          }
        </PivotControls>
      </group>
    </RigidBody>
  );
};

export default DraggableAssetContainer;