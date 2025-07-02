import { useGLTF } from '@react-three/drei'

export function LotusDomeModel() {
  const { scene } = useGLTF('/models/lotus dome store.glb')
  return (
   <primitive object={scene} scale={20} />
  )
}

useGLTF.preload('/models/lotus dome store.glb')
