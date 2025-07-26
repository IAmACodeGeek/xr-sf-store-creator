import { RigidBody } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
export function PetalPavilionModel() {
  const { nodes,materials } = useGLTF("/models/Petal pavilion.glb");
  return (
    <>
      <group scale={10} dispose={null}>
      <RigidBody type="fixed" colliders="trimesh">
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface4281008.geometry}
          material={materials.standardSurface3}
          position={[-0.021, -0.011, -18.456]}
          rotation={[0, 0, 1.152]}
          scale={2.69}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface428906.geometry}
          material={materials.standardSurface3}
          position={[-0.021, -0.011, -18.456]}
          rotation={[0, 0, 1.152]}
          scale={2.69}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface428910.geometry}
          material={materials.room_coler}
          position={[-0.021, -0.011, -18.456]}
          rotation={[0, 0, 1.152]}
          scale={2.69}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface428918.geometry}
          material={materials.standardSurface3}
          position={[-0.021, -0.011, -18.456]}
          rotation={[0, 0, 1.152]}
          scale={2.69}
        />
        <group position={[-0.021, -0.011, -18.456]} rotation={[0, 0, 1.152]} scale={2.69}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.polySurface501.geometry}
            material={materials['Material.004']}
            scale={[0.975, 0.975, 1]}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface428924.geometry}
          material={materials.standardSurface3}
          position={[-0.021, -0.011, -18.456]}
          rotation={[0, 0, 1.152]}
          scale={2.69}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface428929.geometry}
          material={materials.room_coler}
          position={[-0.021, -0.011, -18.456]}
          rotation={[0, 0, 1.152]}
          scale={2.69}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface428932.geometry}
          material={materials.room_coler}
          position={[-0.021, -0.011, -18.456]}
          rotation={[0, 0, 1.152]}
          scale={2.69}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.polySurface428943.geometry}
          material={materials['Material.003']}
          position={[-0.021, -0.011, -18.456]}
          rotation={[0, 0, 1.152]}
          scale={2.69}
        />
      </group>
      <group position={[-0.038, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <group position={[11.603, 510.001, -71.267]} rotation={[0.618, 0, 0]} scale={2.255}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh011.geometry}
            material={materials.standardSurface7}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh011_1.geometry}
            material={materials.butterfliy}
          />
        </group>
        <group position={[-264.498, 493.848, -276.584]} rotation={[-0.25, -0.745, -1.931]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh013.geometry}
            material={materials.standardSurface7}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh013_1.geometry}
            material={materials.butterfliy}
          />
        </group>
        <group position={[-271.255, 504.261, -256.252]} rotation={[-0.25, -0.745, -1.931]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh009.geometry}
            material={materials.standardSurface7}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh009_1.geometry}
            material={materials.butterfliy}
          />
        </group>
        <group position={[269.36, 535.148, -276.29]} rotation={[-0.458, 0.653, 2.252]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh014.geometry}
            material={materials.standardSurface7}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh014_1.geometry}
            material={materials.butterfliy}
          />
        </group>
        <group position={[302.361, 479.548, -254.995]} rotation={[-0.25, 0.745, 1.931]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh012.geometry}
            material={materials.standardSurface7}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh012_1.geometry}
            material={materials.butterfliy}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.pPlane29.geometry}
          material={materials.standardSurface1}
          position={[11.375, 411.784, 26.851]}
          scale={0.19}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface492001.geometry}
        material={materials.standardSurface10}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface428002.geometry}
        material={materials['Material.002']}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface428003.geometry}
        material={materials.standardSurface3}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface428004.geometry}
        material={materials.standardSurface3}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <group position={[-1.703, 0.634, 1.795]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh020.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh020_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[-2.301, 0.634, 1.019]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh021.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh021_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[-2.462, 0.634, 0.068]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh022.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh022_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[-2.442, 0.634, -0.937]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh023.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh023_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[-1.837, 0.634, -1.747]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh024.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh024_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[-1.082, 0.634, -2.438]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh025.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh025_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[-0.064, 0.634, -2.53]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh026.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh026_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[0.974, 0.634, -2.531]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh027.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh027_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[1.753, 0.634, -1.851]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh028.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh028_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[2.447, 0.634, -1.088]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh029.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh029_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[2.56, 0.634, -0.101]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh030.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh030_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[2.477, 0.634, 0.955]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh031.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh031_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[1.831, 0.634, 1.726]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh032.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh032_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[1.081, 0.634, 2.394]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh033.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh033_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[0.078, 0.634, 2.541]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh034.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh034_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[-0.956, 0.634, 2.503]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh035.geometry}
          material={materials.light_w}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh035_1.geometry}
          material={materials.light}
        />
      </group>
      <group position={[0.074, 0.231, 2.873]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <group position={[0, 0, -16.593]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh036.geometry}
            material={materials.light_w}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh036_1.geometry}
            material={materials.light}
          />
        </group>
      </group>
      <group position={[0.074, 0.231, 3.137]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <group position={[0, 0, -16.593]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh037.geometry}
            material={materials.light_w}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh037_1.geometry}
            material={materials.light}
          />
        </group>
      </group>
      <group position={[0.074, 0.231, 3.4]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <group position={[0, 0, -16.593]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh038.geometry}
            material={materials.light_w}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh038_1.geometry}
            material={materials.light}
          />
        </group>
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.polySurface4281024.geometry}
        material={materials.peller_coler}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <group position={[-0.015, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.012, 0.01, 0.01]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh040.geometry}
          material={materials.room_coler}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh040_1.geometry}
          material={materials.room_coler}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.out_side_floor.geometry}
        material={materials['Material.001']}
        position={[-0.008, -0.414, 4.256]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={5.769}
      />
      <group position={[0, -0.066, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh042.geometry}
          material={materials.pink_no1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh042_1.geometry}
          material={materials.pink_no1}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh042_2.geometry}
          material={materials.pink_no1}
        />
      </group>
      <group position={[0.236, 0.387, 4.077]} rotation={[0, -0.912, -Math.PI / 2]} scale={0.01}>
        <group position={[-4.042, 6.846, 3.586]} rotation={[-0.723, Math.PI / 2, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh043.geometry}
            material={materials.light_w}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh043_1.geometry}
            material={materials.light}
          />
        </group>
      </group>
      <group position={[0.022, 0.387, 3.961]} rotation={[0, 0.738, -Math.PI / 2]} scale={0.01}>
        <group position={[-4.042, 6.846, 3.586]} rotation={[-0.723, 1.571, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh044.geometry}
            material={materials.light_w}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh044_1.geometry}
            material={materials.light}
          />
        </group>
      </group>
      <group
        position={[-0.081, 0.387, 4.174]}
        rotation={[-Math.PI, 0.82, Math.PI / 2]}
        scale={0.01}>
        <group position={[-4.042, 6.846, 3.586]} rotation={[-0.723, Math.PI / 2, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh045.geometry}
            material={materials.light_w}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh045_1.geometry}
            material={materials.light}
          />
        </group>
      </group>
      <group
        position={[0.135, 0.387, 4.272]}
        rotation={[Math.PI, -0.777, Math.PI / 2]}
        scale={0.01}>
        <group position={[-4.042, 6.846, 3.586]} rotation={[-0.723, Math.PI / 2, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh046.geometry}
            material={materials.light_w}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Mesh046_1.geometry}
            material={materials.light}
          />
        </group>
      </group>
      <group position={[0, 0.138, 0]} rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh047.geometry}
          material={materials.aiMixShader2}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh047_1.geometry}
          material={materials.aiMixShader2}
        />
      </group>
      </RigidBody>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Sphere.geometry}
        material={materials.Material}
        position={[0, 4.429, 0]}
        scale={25}
      />
    </group>
    </>
  );

}