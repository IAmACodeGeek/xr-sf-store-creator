import { Environment } from '@react-three/drei'
import React from 'react'

const Lights = () => {
  return (
    <>
    <Environment preset='studio' environmentIntensity={0.1} />
    <ambientLight intensity={1} color={"#ffffff"} />
    </>
  )
}

export default Lights