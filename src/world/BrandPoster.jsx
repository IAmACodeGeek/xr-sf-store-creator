import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function BrandPoster({
  imageUrl,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1
}) {
  const texture = useLoader(TextureLoader, imageUrl);

  const computedSize = React.useMemo(() => {
    const width = texture.image.width;
    const height = texture.image.height;

    const scaleUpOrDown = scale / height;
    return {
      width: width * scaleUpOrDown,
      height: height * scaleUpOrDown
    }
  }, [texture, scale]);

  return (
    <group
      position={position}
      rotation={rotation.map((r) => r * (Math.PI / 180))} 
    >
      <mesh>
        <planeGeometry args={[computedSize.width, computedSize.height]} />
        <meshBasicMaterial 
          map={texture}
          transparent={true}
        />
      </mesh>
    </group>
  );
}