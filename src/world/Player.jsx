import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useRef, useState, useEffect } from "react";
import { usePersonControls } from "@/hooks.js";
import { useFrame, useThree } from "@react-three/fiber";
import nipplejs from "nipplejs";
import gsap from "gsap";
import { useComponentStore, useTouchStore } from "../stores/ZustandStores";
import { CameraController } from "./CameraController";
import { ProductGSAPUtil } from "./ProductGSAPUtil";

const MOVE_SPEED = 12;
const TOUCH_SENSITIVITY = {
  PORTRAIT: {
    x: 0.004,
    y: 0.004,
  },
  LANDSCAPE: {
    x: 0.004,
    y: 0.004,
  },
};

const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const RESPAWN_HEIGHT = -5;
const START_POSITION = new THREE.Vector3(0, 7, -5);

export const Player = () => {
  const playerRef = useRef();
  const touchRef = useRef({
    cameraTouch: null,
    previousCameraTouch: null,
  });
  const { forward, backward, left, right, jump } = usePersonControls();
  const [canJump, setCanJump] = useState(true);
  const [isAnimating, setAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|Kindle|Silk|Mobile|Tablet|Touch/i.test(
      navigator.userAgent
    )
  );
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );
  const { camera } = useThree();

  const rapier = useRapier();

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleOrientationChange);
    handleOrientationChange();

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const joystickZone = document.createElement("div");
    joystickZone.id = "joystickZone";
    joystickZone.style.position = "absolute";
    joystickZone.style.bottom = "15vh";
    joystickZone.style.left = "13vw";
    joystickZone.style.width = "150px";
    joystickZone.style.height = "150px";
    joystickZone.style.zIndex = "3";
    joystickZone.style.pointerEvents = "all";
    document.body.appendChild(joystickZone);

    const JOYSTICK_SIZE = 130;
    const PORTRAIT_MARGIN = {
      bottom: 70,
      left: 80,
    };
    const LANDSCAPE_MARGIN = {
      bottom: 80,
      left: 120,
    };

    const calculatePosition = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const isLandscape = viewportWidth > viewportHeight;

      const margins = isLandscape ? LANDSCAPE_MARGIN : PORTRAIT_MARGIN;


      const bottom = isLandscape
        ? Math.min(margins.bottom, viewportHeight * 0.45)
        : Math.min(margins.bottom, viewportHeight * 0.01);

      const left = isLandscape
        ? Math.min(margins.left, viewportWidth * 0.08)
        : Math.min(margins.left, viewportWidth * 0.12);

      return {
        bottom: `${bottom}px`,
        left: `${left}px`,
      };
    };

    const manager = nipplejs.create({
      zone: joystickZone,
      size: JOYSTICK_SIZE,
      mode: "static",
      position: calculatePosition(),
      color: "black",
      dynamicPage: true,
    });

    const handleMove = (evt, data) => {
      if (!data) return;

      const { angle, distance } = data;
      const radian = angle.radian;
      const speed = (distance / 100) * MOVE_SPEED;

      direction.set(Math.cos(radian) * speed, 0, -Math.sin(radian) * speed * 2);
    };

    const handleEnd = () => {
      direction.set(0, 0, 0);
    };

    manager.on("move", handleMove);
    manager.on("end", handleEnd);

    return () => {
      manager.destroy();
      document.body.removeChild(joystickZone);
    };
  }, [isMobile]);

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
    const handleTouchStart = (e) => {
      if (!isTouchEnabled) return;
      if ( isInfoModalOpen || isSettingsModalOpen || isTermsModalOpen || isContactModalOpen || isProductSearcherOpen || !crosshairVisible) return;

      if (e.target.closest("#joystickZone")) return;

      const touches = Array.from(e.touches);
      const rightmostTouch = touches.reduce((rightmost, touch) => {
        return !rightmost || touch.clientX > rightmost.clientX
          ? touch
          : rightmost;
      }, null);

      if (rightmostTouch) {
        touchRef.current.cameraTouch = rightmostTouch.identifier;
        touchRef.current.previousCameraTouch = {
          x: rightmostTouch.clientX,
          y: rightmostTouch.clientY,
        };
      }
    };

    const handleTouchMove = (e) => {
      if (!isTouchEnabled) return;
      if ( isInfoModalOpen || isSettingsModalOpen || isTermsModalOpen || isContactModalOpen || isProductSearcherOpen || !crosshairVisible) return;

      const touch = Array.from(e.touches).find(
        (t) => t.identifier === touchRef.current.cameraTouch
      );

      if (!touch) return;

      const deltaX = touch.clientX - touchRef.current.previousCameraTouch.x;
      const deltaY = touch.clientY - touchRef.current.previousCameraTouch.y;

      const sensitivity = TOUCH_SENSITIVITY.PORTRAIT;

      camera.rotation.order = "YXZ";
      camera.rotation.y -= deltaX * sensitivity.x;
      camera.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, camera.rotation.x - deltaY * sensitivity.y)
      );

      touchRef.current.previousCameraTouch = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const handleTouchEnd = (e) => {
      if (!isTouchEnabled) return;
      if ( isInfoModalOpen || isSettingsModalOpen || isTermsModalOpen || isContactModalOpen || isProductSearcherOpen || !crosshairVisible) return;

      const remainingTouches = Array.from(e.touches);
      if (
        !remainingTouches.some(
          (t) => t.identifier === touchRef.current.cameraTouch
        )
      ) {
        touchRef.current.cameraTouch = null;
        touchRef.current.previousCameraTouch = null;
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [camera, isPortrait, isTouchEnabled, isInfoModalOpen, isSettingsModalOpen, isTermsModalOpen, isContactModalOpen, crosshairVisible, isProductSearcherOpen]);

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


