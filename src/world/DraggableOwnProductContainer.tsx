import {
  useComponentStore,
  EnvProduct,
  useToolStore,
  useOwnEnvProductStore,
  useBrandStore,
} from "@/stores/ZustandStores";
import { PivotControls, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import type Product from "../Types/Product";
import {
  BackSide,
  Box3,
  Euler,
  FrontSide,
  Mesh,
  Object3D,
  Quaternion,
  TextureLoader,
  Vector3,
} from "three";
import { useLoader, useThree } from "@react-three/fiber";
import environmentData from "../data/environment/EnvironmentData";

interface DraggableOwnProductContainerProps {
  placeHolderId?: number | undefined;
  envPosition?: [number, number, number];
  envRotation?: [number, number, number];
  envScale?: number;
  ownEnvProduct: EnvProduct;
}

const DraggableOwnProductContainer = ({
  placeHolderId = undefined,
  envPosition = undefined,
  envRotation = undefined,
  envScale = 1,
  ownEnvProduct,
}: DraggableOwnProductContainerProps) => {
  const { ownProducts } = useComponentStore();
  const { camera } = useThree();
  const { toolType } = useToolStore();
  const { modifyOwnEnvProduct, activeOwnProductId } = useOwnEnvProductStore();
  const { brandData } = useBrandStore();

  // Placeholder data
  const placeHolderData = useMemo(() => {
    if (!brandData) return null;
    return environmentData[brandData.environment_name.toUpperCase()]
      .placeHolderData;
  }, [brandData]);

  // Find the corresponding product for the envProduct
  const ownProduct = useMemo(() => {
    return ownProducts.find((p: Product) => p.id === ownEnvProduct.id);
  }, [ownProducts, ownEnvProduct.id]);

  // To show axes when selected
  const isActive = useMemo(() => {
    return (
      activeOwnProductId === ownEnvProduct.id &&
      toolType === "3DPARAMS" &&
      ownEnvProduct.placeHolderId === undefined
    );
  }, [
    activeOwnProductId,
    ownEnvProduct.id,
    ownEnvProduct.placeHolderId,
    toolType,
  ]);

  // Fetch position, rotation & scale from placeholder
  const position = useMemo(() => {
    if (placeHolderData && placeHolderId !== undefined) {
      const placeHolder = placeHolderData.find(
        (placeHolder) => placeHolder.id === placeHolderId
      );
      return placeHolder?.position || envPosition;
    }
    return envPosition;
  }, [placeHolderId, envPosition, placeHolderData]);

  const rotation = useMemo(() => {
    if (placeHolderData && placeHolderId !== undefined) {
      const placeHolder = placeHolderData.find(
        (placeHolder) => placeHolder.id === placeHolderId
      );
      return placeHolder?.rotation || envRotation;
    }
    return envRotation;
  }, [placeHolderId, envRotation, placeHolderData]);

  const scale = useMemo(() => {
    if (placeHolderData && placeHolderId !== undefined) {
      const placeHolder = placeHolderData.find(
        (placeHolder) => placeHolder.id === placeHolderId
      );
      return placeHolder?.scale || envScale;
    }
    return envScale;
  }, [placeHolderId, envScale, placeHolderData]);

  // Convert rotation from degrees to radians
  const computedRotation = useMemo(() => {
    const rotArray = [0, 0, 0];
    if (!rotation) {
      const direction = new Vector3();
      camera.getWorldDirection(direction);
      direction.y = 0;
      const angle = (Math.atan(direction.x / direction.z) * 180) / Math.PI;
      rotArray[1] = angle - (direction.z > 0 ? 180 : 0);
    } else {
      rotArray[0] = rotation[0];
      rotArray[1] = rotation[1];
      rotArray[2] = rotation[2];
    }
    return new Euler(
      (rotArray[0] * Math.PI) / 180,
      (rotArray[1] * Math.PI) / 180,
      (rotArray[2] * Math.PI) / 180,
      "YZX"
    );
  }, [rotation, position]);

  // Get the model URL based on modelIndex
  const modelUrl = useMemo(() => {
    if (
      ownEnvProduct.type !== "MODEL_3D" ||
      !ownProduct?.models ||
      ownEnvProduct.modelIndex === undefined
    ) {
      return null;
    }

    const model = ownProduct.models[ownEnvProduct.modelIndex];
    if (!model?.sources?.[0]?.url) {
      return null;
    }

    return model.sources[0].url;
  }, [ownProduct, ownEnvProduct.modelIndex, ownEnvProduct.type]);

  // Load the GLTF model
  const model = useMemo(() => {
    if (!modelUrl) return null;
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useGLTF(modelUrl);
    } catch (error) {
      console.error("Error loading model:", error);
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

  // Manually compute scale such that object has unit height
  const computedScaleForModel = useMemo(() => {
    if (!scene) return null;

    const box = new Box3().setFromObject(scene);

    const size = new Vector3();
    box.getSize(size);

    return scale / size.y;
  }, [scene, scale]);

  const { computedPositionForModel, boxCenter } = useMemo(() => {
    if (!computedScaleForModel || !scene)
      return {
        computedPositionForModel: null,
        boxCenter: null,
      };

    const cameraPosition = new Vector3();
    camera.getWorldPosition(cameraPosition);
    const cameraDirection = new Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.multiplyScalar(5);
    cameraPosition.add(cameraDirection);
    const positionVector = position
      ? new Vector3(position[0], position[1], position[2])
      : cameraPosition;

    // Get the bounding box AFTER applying scale
    const scaledScene = scene.clone();
    scaledScene.scale.set(
      computedScaleForModel,
      computedScaleForModel,
      computedScaleForModel
    );
    const box = new Box3().setFromObject(scaledScene);

    // Calculate center offset
    const boxCenter = new Vector3();
    box.getCenter(boxCenter);

    // Adjust position to account for scaled center offset
    const newPosition = positionVector.clone().sub(boxCenter.clone());
    return {
      computedPositionForModel: [newPosition.x, newPosition.y, newPosition.z],
      boxCenter: boxCenter,
    };
  }, [scene, computedScaleForModel, position, camera]);

  // Set position and rotation
  const modelRef = useRef<Object3D>(null);
  const meshRef = useRef<Mesh>(null);
  const backMeshRef = useRef<Mesh>(null);
  useEffect(() => {
    if (!modelRef.current || ownEnvProduct.type !== "MODEL_3D") return;

    // Position
    const worldPosition = new Vector3(
      ...(computedPositionForModel || [0, 0, 0])
    );

    modelRef.current.matrixWorld.setPosition(worldPosition);
    if (modelRef.current.parent) {
      worldPosition.applyMatrix4(modelRef.current.parent.matrixWorld.invert());
    }
    modelRef.current.position.copy(worldPosition);

    // Rotation
    const worldRotation = computedRotation;
    const quaternion = new Quaternion();
    quaternion.setFromEuler(worldRotation);

    if (modelRef.current.parent) {
      const parentQuaternion = new Quaternion();
      modelRef.current.parent.getWorldQuaternion(parentQuaternion);

      parentQuaternion.invert();
      quaternion.multiplyQuaternions(parentQuaternion, quaternion);
    }
    modelRef.current.setRotationFromQuaternion(quaternion);
  }, [
    position,
    computedPositionForModel,
    ownEnvProduct.type,
    computedRotation,
    camera,
    modelRef,
  ]);

  useEffect(() => {
    if (
      !meshRef.current ||
      !backMeshRef.current ||
      ownEnvProduct.type !== "PHOTO"
    )
      return;

    // Position
    const cameraPosition = new Vector3();
    camera.getWorldPosition(cameraPosition);
    const cameraDirection = new Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.multiplyScalar(5);
    cameraPosition.add(cameraDirection);

    const worldPosition = position ? new Vector3(...position) : cameraPosition;

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

    if (meshRef.current.parent) {
      const parentQuaternion = new Quaternion();
      meshRef.current.parent.getWorldQuaternion(parentQuaternion);

      parentQuaternion.invert();
      quaternion.multiplyQuaternions(parentQuaternion, quaternion);
    }
    meshRef.current.setRotationFromQuaternion(quaternion);
    backMeshRef.current.setRotationFromQuaternion(quaternion);
  }, [
    position,
    computedPositionForModel,
    ownEnvProduct.type,
    computedRotation,
    camera,
    meshRef,
    backMeshRef,
  ]);

  const imageUrl = useMemo(() => {
    if (
      ownEnvProduct.imageIndex === undefined ||
      ownEnvProduct.type !== "PHOTO"
    )
      return null;
    return ownProduct?.images[ownEnvProduct.imageIndex].src || "";
  }, [ownEnvProduct.type, ownEnvProduct.imageIndex, ownProduct?.images]);

  const imageTexture = useMemo(() => {
    if (!imageUrl) return null;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useLoader(TextureLoader, imageUrl);
  }, [imageUrl]);

  const computedSizeForImage = useMemo(() => {
    if (!imageTexture) return null;

    const width = imageTexture.image.width;
    const height = imageTexture.image.height;

    // Convert to world size
    const convertPixelToWorldSize = (i: number) => {
      return i / 100;
    };
    const imageWidthInWorld = convertPixelToWorldSize(width);
    const imageHeightInWorld = convertPixelToWorldSize(height);

    // Scale
    const computedScale = scale / imageHeightInWorld;
    return [
      computedScale * imageWidthInWorld,
      computedScale * imageHeightInWorld,
    ];
  }, [imageTexture, scale]);

  const handleObjectTranslate = () => {
    if (ownEnvProduct.type === "MODEL_3D") {
      if (!modelRef.current) return;

      modelRef.current.updateMatrixWorld();

      const position = new Vector3();
      modelRef.current.getWorldPosition(position);

      if (boxCenter) {
        // Neutralize the auto generated offset
        position.add(boxCenter);
      }

      const pos = [
        Math.round(position.x * 1000) / 1000,
        Math.round(position.y * 1000) / 1000,
        Math.round(position.z * 1000) / 1000,
      ];

      const newEnvProduct: EnvProduct = {
        id: ownEnvProduct.id,
        position: pos,
        scale: envScale,
        isEnvironmentProduct: true,
      };

      modifyOwnEnvProduct(newEnvProduct.id, newEnvProduct);
    } else if (ownEnvProduct.type === "PHOTO") {
      if (!meshRef.current) return;

      meshRef.current.updateMatrixWorld();

      const position = new Vector3();
      meshRef.current.getWorldPosition(position);

      const pos = [
        Math.round(position.x * 1000) / 1000,
        Math.round(position.y * 1000) / 1000,
        Math.round(position.z * 1000) / 1000,
      ];

      const newEnvProduct: EnvProduct = {
        id: ownEnvProduct.id,
        position: pos,
        scale: envScale,
        isEnvironmentProduct: true,
      };

      modifyOwnEnvProduct(newEnvProduct.id, newEnvProduct);
    }
  };

  const handleObjectMove = () => {
    if (ownEnvProduct.type === "MODEL_3D") {
      if (!modelRef.current) return;

      modelRef.current.updateMatrixWorld();

      const position = new Vector3();
      modelRef.current.getWorldPosition(position);

      if (boxCenter) {
        // Neutralize the auto generated offset
        position.add(boxCenter);
      }

      const quaternion = new Quaternion();
      modelRef.current.getWorldQuaternion(quaternion);

      const euler = new Euler();
      euler.setFromQuaternion(quaternion);
      euler.reorder("YZX");

      const pos = [
        Math.round(position.x * 1000) / 1000,
        Math.round(position.y * 1000) / 1000,
        Math.round(position.z * 1000) / 1000,
      ];
      const rot = [
        Math.round(((euler.x * 180) / Math.PI) * 1000) / 1000,
        Math.round(((euler.y * 180) / Math.PI) * 1000) / 1000,
        Math.round(((euler.z * 180) / Math.PI) * 1000) / 1000,
      ];

      const newEnvProduct: EnvProduct = {
        id: ownEnvProduct.id,
        position: pos,
        rotation: rot,
        scale: envScale,
        isEnvironmentProduct: true,
      };

      modifyOwnEnvProduct(newEnvProduct.id, newEnvProduct);
    } else if (ownEnvProduct.type === "PHOTO") {
      if (!meshRef.current) return;

      meshRef.current.updateMatrixWorld();

      const position = new Vector3();
      meshRef.current.getWorldPosition(position);

      const quaternion = new Quaternion();
      meshRef.current.getWorldQuaternion(quaternion);

      const euler = new Euler();
      euler.setFromQuaternion(quaternion);
      euler.reorder("YZX");

      const pos = [
        Math.round(position.x * 1000) / 1000,
        Math.round(position.y * 1000) / 1000,
        Math.round(position.z * 1000) / 1000,
      ];
      const rot = [
        Math.round(((euler.x * 180) / Math.PI) * 1000) / 1000,
        Math.round(((euler.y * 180) / Math.PI) * 1000) / 1000,
        Math.round(((euler.z * 180) / Math.PI) * 1000) / 1000,
      ];

      const newEnvProduct: EnvProduct = {
        id: ownEnvProduct.id,
        position: pos,
        rotation: rot,
        scale: envScale,
        isEnvironmentProduct: true,
      };

      modifyOwnEnvProduct(newEnvProduct.id, newEnvProduct);
    }
  };

  useEffect(() => {
    handleObjectTranslate();
  }, [ownEnvProduct.imageIndex, ownEnvProduct.modelIndex]);

  useEffect(() => {
    handleObjectMove();
  }, [activeOwnProductId]);

  return (
    <RigidBody type="fixed">
      <group position={[0, 0, 0]} rotation={new Euler(0, 0, 0, "YZX")}>
        <PivotControls
          anchor={[0, 0, 0]}
          scale={1.25 * (scale >= 1 ? scale : 1)}
          activeAxes={[isActive, isActive, isActive]}
          visible={isActive}
          onDragEnd={handleObjectMove}
          disableScaling
        >
          {ownEnvProduct.type === "MODEL_3D" && memoizedModelScene && (
            <primitive
              ref={modelRef}
              object={memoizedModelScene}
              scale={[
                computedScaleForModel,
                computedScaleForModel,
                computedScaleForModel,
              ]}
              castShadow
              receiveShadow
            />
          )}
          {ownEnvProduct.type === "PHOTO" && computedSizeForImage && (
            <>
              <mesh rotation={computedRotation} ref={meshRef}>
                <planeGeometry
                  args={[computedSizeForImage[0], computedSizeForImage[1]]}
                />
                <meshBasicMaterial
                  map={imageTexture}
                  transparent={true}
                  side={FrontSide}
                />
              </mesh>
              <mesh ref={backMeshRef} rotation={computedRotation}>
                <planeGeometry
                  args={[computedSizeForImage[0], computedSizeForImage[1]]}
                />
                <meshBasicMaterial color={0xffffff} side={BackSide} />
              </mesh>
            </>
          )}
        </PivotControls>
      </group>
    </RigidBody>
  );
};

export default DraggableOwnProductContainer;
