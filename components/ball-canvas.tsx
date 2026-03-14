'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Decal, Float, OrbitControls, Preload, useTexture } from '@react-three/drei'
import { CanvasLoader } from './canvas-loader'

interface BallProps {
  imgUrl: string
}

function Ball({ imgUrl }: BallProps) {
  const [decal] = useTexture([imgUrl])

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color='#fff8eb'
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          map={decal}
          // @ts-ignore
          flatShading
        />
      </mesh>
    </Float>
  )
}

interface BallCanvasProps {
  icon: string
}

export function BallCanvas({ icon }: BallCanvasProps) {
  return (
    <Canvas
      frameloop='always'
      dpr={[1, 1]}
      gl={{ preserveDrawingBuffer: false, antialias: false, powerPreference: 'low-power' }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.8} />
        <Ball imgUrl={icon} />
      </Suspense>
      <Preload all />
    </Canvas>
  )
}
