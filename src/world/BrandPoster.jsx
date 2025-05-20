import React, { useEffect, useState, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function BrandPoster({
  imageUrl,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  maxRetries = 3,
  retryDelay = 2000 // ms
}) {
  const [texture, setTexture] = useState(null);
  const [error, setError] = useState(null);
  const { gl } = useThree();
  
  useEffect(() => {
    let retries = 0;
    let isMounted = true;

    const loadTexture = () => {
      const loader = new TextureLoader();

      loader.load(
        imageUrl,
        (loadedTexture) => {
          if (isMounted) {
            setTexture(loadedTexture);
            setError(null);
          }
        },
        undefined,
        (err) => {
          if (retries < maxRetries) {
            retries++;
            console.warn(`Retrying texture load... attempt ${retries}`);
            setTimeout(loadTexture, retryDelay);
          } else {
            if (isMounted) {
              console.error('Failed to load texture:', err);
              setError(err);
            }
          }
        }
      );
    };

    loadTexture();

    return () => {
      isMounted = false;
    };
  }, [imageUrl, maxRetries, retryDelay]);

  const computedSize = useMemo(() => {
    if (!texture?.image) return { width: 1, height: 1 };

    const width = texture.image.width;
    const height = texture.image.height;

    const scaleUpOrDown = scale / height;
    return {
      width: width * scaleUpOrDown,
      height: height * scaleUpOrDown,
    };
  }, [texture, scale]);

  if (!texture) return null;

  return (
    <group position={position} rotation={rotation.map(r => r * (Math.PI / 180))}>
      <mesh>
        <planeGeometry args={[computedSize.width, computedSize.height]} />
        <meshBasicMaterial map={texture} transparent={true} />
      </mesh>
    </group>
  );
}
