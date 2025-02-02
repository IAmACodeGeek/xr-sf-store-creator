import * as THREE from "three";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useRef, useState, useEffect } from "react";
import { usePersonControls } from "@/hooks.js";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useComponentStore, usePivotStore, useTouchStore } from "../stores/ZustandStores";
import { CameraController } from "./CameraController";
import { ProductGSAPUtil } from "./ProductGSAPUtil";

const MOVE_SPEED = 12;

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

  const {isPivotActive} = usePivotStore();
  const { isTouchEnabled, enableTouch } = useTouchStore();


  const TOUCH_SENSITIVITY = {x: 0.003, y: 0.003};

  useEffect(() => {
    if (!playerRef.current || initialTourComplete.current) return;
  
    // Set initial position off-screen
    const startPosition = new THREE.Vector3(40, 5, 0);
    playerRef.current.setTranslation(startPosition);
    camera.position.copy(startPosition);
    camera.rotation.set(0, -Math.PI / 2, 0); 
  
    // Single smooth transition to spawn point
    const timeline = gsap.timeline({
      onComplete: () => {
        initialTourComplete.current = true;
        enableTouch();
  
        // Reset physics state
        playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
        playerRef.current.setAngvel({ x: 0, y: 0, z: 0 });
      },
    });
  
    // Add 360-degree spin around the current position
    timeline.to(camera.rotation, {
      duration: 5, // Time to complete the 360-degree rotation
      y: camera.rotation.y + Math.PI * 2, // A full 360-degree rotation
      ease: "power2.inOut",
      onUpdate: () => {
        // Sync player position to the camera's during rotation
        if (playerRef.current) {
          playerRef.current.setTranslation(camera.position);
        }
      },
    });
  
    // Transition to (0, 0, 0) after the spin
    timeline.to(camera.position, {
      duration: 1,
      x: 0,
      y: 2,
      z: 0,
      ease: "power2.inOut",
      onUpdate: () => {
        // Sync physics body with camera
        if (playerRef.current) {
          playerRef.current.setTranslation(camera.position);
          playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
        }
      },
    });
  
  
    const animationFrameId = setInterval(() => {
      if (!playerRef.current || initialTourComplete.current) return;
  
      playerRef.current.wakeUp();
      playerRef.current.setTranslation(camera.position);
      playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
    }, 1000 / 60);
  
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

    document.querySelector(".canvas-container").addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.querySelector(".canvas-container").removeEventListener("mousestart", handleMouseDown);
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
      mass={1}
      ref={playerRef}
      lockRotations
      canSleep={false} //IMP: May lead to Player Halt
    >
      <ProductGSAPUtil setAnimating={setAnimating} playerRef={playerRef} />
      <CameraController setAnimating={setAnimating} playerRef={playerRef} />
      <mesh castShadow>
        <CapsuleCollider args={[2, 1]} />
      </mesh>
    </RigidBody>
  );
};


