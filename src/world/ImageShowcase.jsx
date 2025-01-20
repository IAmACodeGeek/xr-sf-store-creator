import React from 'react';
import { Billboard, Image as DreiImage } from '@react-three/drei';
import { RigidBody } from "@react-three/rapier";

export default function ImageShowcase({
  url,
  width = 1920, 
  height = 1080, 
  position = [0, 0, 0],
  transparent = true,
  scale = 1,
}) {
  // Convert pixels to Three.js world units
  const pixelsToUnits = (pixels) => pixels / 100;
  const widthInUnits = pixelsToUnits(width) * scale;
  const heightInUnits = pixelsToUnits(height) * scale;

  return (
    <RigidBody mass={1}>
    <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
      <DreiImage 
        url={url}
        scale={[widthInUnits, heightInUnits, 1]} 
        transparent={transparent} 
      />
    </Billboard>
    </RigidBody>
  );
}
