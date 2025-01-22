import * as THREE from "three";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useRef, useState, useEffect } from "react";
import { usePersonControls } from "@/hooks.js";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useComponentStore, useTouchStore } from "../stores/ZustandStores";
import { CameraController } from "./CameraController";
import { ProductGSAPUtil } from "./ProductGSAPUtil";

const MOVE_SPEED = 12;
const TOUCH_SENSITIVITY = {
  x: 0.005,
  y: 0.005
};

const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const RESPAWN_HEIGHT = -5;
const START_POSITION = new THREE.Vector3(0, 7, -5);

export const Player = () => {
  const playerRef = useRef();

  const previousMousePosition = useRef(null);
  const [isMouseDown, setMouseDown] = useState(false);

  const { forward, backward, left, right, jump } = usePersonControls();
  const [canJump, setCanJump] = useState(true);
  const [isAnimating, setAnimating] = useState(false);
  
  const { camera } = useThree();

  const initialTourComplete = useRef(false);
  const {
    crosshairVisible,
    isInfoModalOpen, isSettingsModalOpen, isTermsModalOpen, isContactModalOpen, isProductSearcherOpen,
  } = useComponentStore();

  const { isTouchEnabled, enableTouch } = useTouchStore();

  useEffect(() => {
    if (!playerRef.current || initialTourComplete.current) return;

    const startPosition = new THREE.Vector3(-3, 55, 80);
    playerRef.current.setTranslation(startPosition);
    camera.position.copy(startPosition);

    const timeline = gsap.timeline({
      onComplete: () => {
        initialTourComplete.current = true;
        enableTouch();

        playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
        playerRef.current.setAngvel({ x: 0, y: 0, z: 0 });
      },
    });

    timeline.to(camera.position, {
      duration: 3,
      x: START_POSITION.x,
      y: START_POSITION.y,
      z: START_POSITION.z,
      ease: "power2.inOut",
    });

    const updatePhysicsBody = () => {
      if (!playerRef.current || initialTourComplete.current) return;

      playerRef.current.wakeUp();
      playerRef.current.setTranslation(camera.position);
      playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
    };

    const animationFrameId = setInterval(updatePhysicsBody, 1000 / 60);

    return () => {
      timeline.kill();
      clearInterval(animationFrameId);
    };
  }, [camera]);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (!isTouchEnabled) return;
      if ( isInfoModalOpen || isSettingsModalOpen || isTermsModalOpen || isContactModalOpen || isProductSearcherOpen || !crosshairVisible) return;
      
      setMouseDown(true);
    };

    const handleMouseMove = (e) => {
      if(!isMouseDown) return;
      if (!isTouchEnabled) return;
      if ( isInfoModalOpen || isSettingsModalOpen || isTermsModalOpen || isContactModalOpen || isProductSearcherOpen || !crosshairVisible) return;
      
      const deltaX = previousMousePosition.current? e.clientX - previousMousePosition.current.x : 0;
      const deltaY = previousMousePosition.current? e.clientY - previousMousePosition.current.y : 0;

      camera.rotation.order = "YXZ";
      camera.rotation.y -= deltaX * TOUCH_SENSITIVITY.x;
      camera.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, camera.rotation.x - deltaY * TOUCH_SENSITIVITY.y)
      );

      previousMousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleMouseUp = (e) => {
      if (!isTouchEnabled) return;
      if ( isInfoModalOpen || isSettingsModalOpen || isTermsModalOpen || isContactModalOpen || isProductSearcherOpen || !crosshairVisible) return;
      
      setMouseDown(false);
      previousMousePosition.current = null;
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousestart", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMouseDown, camera, isTouchEnabled, isInfoModalOpen, isSettingsModalOpen, isTermsModalOpen, isContactModalOpen, crosshairVisible, isProductSearcherOpen]);

  const combinedInput = new THREE.Vector3();
  const movementDirection = new THREE.Vector3();
  useFrame((state) => {
    if (!playerRef.current || isAnimating) return;

    const { y: playerY } = playerRef.current.translation();
    if (playerY < RESPAWN_HEIGHT) {
      respawnPlayer();
    }

    if ( !isInfoModalOpen && !isSettingsModalOpen && !isTermsModalOpen && !isContactModalOpen && !isProductSearcherOpen && crosshairVisible) {
      const velocity = playerRef.current.linvel();

      frontVector.set(0, 0, backward - forward);
      sideVector.set(right - left, 0, 0);

      combinedInput
        .copy(frontVector)
        .add(sideVector)
        .add(direction)
        .normalize();

      movementDirection
        .copy(combinedInput)
        .applyQuaternion(state.camera.quaternion)
        .normalize()
        .multiplyScalar(MOVE_SPEED);


      playerRef.current.wakeUp();
      playerRef.current.setLinvel({
        x: movementDirection.x,
        y: velocity.y,
        z: movementDirection.z,
      });

      if (jump && canJump) {
        doJump();
        setCanJump(false);
        setTimeout(() => setCanJump(true), 500);
      }
    }

    const { x, y, z } = playerRef.current.translation();
    const lerpFactor = 0.1;
    state.camera.position.lerp({ x, y, z }, lerpFactor);
  });

  const doJump = () => {
    playerRef.current.setLinvel({ x: 0, y: 5, z: 0 });
  };


  const respawnPlayer = () => {
    if (!initialTourComplete.current) return;

    playerRef.current.setTranslation(START_POSITION);
    playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
    playerRef.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  return (
    <RigidBody
      colliders={false}
      mass={1}
      ref={playerRef}
      lockRotations
      canSleep={false} //IMP: May lead to Player Halt
    >
      <ProductGSAPUtil setAnimating={setAnimating} playerRef={playerRef} />
      <CameraController setAnimating={setAnimating} playerRef={playerRef} />
      <mesh castShadow>
        <CapsuleCollider args={[1.2, 1]} />
      </mesh>
    </RigidBody>
  );
};


