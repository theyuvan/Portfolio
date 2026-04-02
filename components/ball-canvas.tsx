'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Decal, OrbitControls, Preload, useTexture } from '@react-three/drei'
import { CanvasLoader } from './canvas-loader'
import * as THREE from 'three'

interface BallProps {
  imgUrl: string
}

function Ball({ imgUrl }: BallProps) {
  const [decal] = useTexture([imgUrl])

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[1, 1, 1]} intensity={0.8} />
      <mesh castShadow receiveShadow scale={2.75}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color='#fff8eb'
          polygonOffset
          polygonOffsetFactor={-5}
          roughness={0.5}
          metalness={0.08}
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
    </>
  )
}

interface BallCanvasProps {
  icon: string
  index: number
}

interface SmoothResetControllerProps {
  controlsRef: React.MutableRefObject<any>
  shouldReturnRef: React.MutableRefObject<boolean>
  initialCameraPosRef: React.MutableRefObject<THREE.Vector3 | null>
  initialTargetRef: React.MutableRefObject<THREE.Vector3 | null>
  initialOffsetRef: React.MutableRefObject<THREE.Vector3 | null>
}

function SmoothResetController({
  controlsRef,
  shouldReturnRef,
  initialCameraPosRef,
  initialTargetRef,
  initialOffsetRef,
}: SmoothResetControllerProps) {
  const { camera } = useThree()

  useFrame((_, delta) => {
    const controls = controlsRef.current
    if (!controls) return

    if (!initialCameraPosRef.current) {
      initialCameraPosRef.current = camera.position.clone()
    }
    if (!initialTargetRef.current) {
      initialTargetRef.current = controls.target.clone()
    }
    if (!initialOffsetRef.current && initialCameraPosRef.current && initialTargetRef.current) {
      initialOffsetRef.current = initialCameraPosRef.current.clone().sub(initialTargetRef.current)
    }

    if (!shouldReturnRef.current) return

    const initialTarget = initialTargetRef.current
    const initialOffset = initialOffsetRef.current
    if (!initialTarget || !initialOffset) return

    // Exponential smoothing with fixed radius avoids zoom while rotating back.
    const t = 1 - Math.exp(-2 * delta)

    const currentOffset = camera.position.clone().sub(initialTarget)
    const targetDirection = initialOffset.clone().normalize()
    const currentDirection = currentOffset.normalize()
    const nextDirection = currentDirection.lerp(targetDirection, t).normalize()
    const fixedRadius = initialOffset.length()

    camera.position.copy(initialTarget).add(nextDirection.multiplyScalar(fixedRadius))
    controls.target.copy(initialTarget)
    controls.update()

    const directionClose = nextDirection.angleTo(targetDirection) < 0.001

    if (directionClose) {
      camera.position.copy(initialTarget).add(initialOffset)
      controls.target.copy(initialTarget)
      controls.update()
      shouldReturnRef.current = false
    }
  })

  return null
}

export function BallCanvas({ icon, index }: BallCanvasProps) {
  const [shouldRender, setShouldRender] = useState(false)
  const controlsRef = useRef<any>(null)
  const shouldReturnRef = useRef(false)
  const initialCameraPosRef = useRef<THREE.Vector3 | null>(null)
  const initialTargetRef = useRef<THREE.Vector3 | null>(null)
  const initialOffsetRef = useRef<THREE.Vector3 | null>(null)

  const cancelReturn = () => {
    shouldReturnRef.current = false
  }

  const startSmoothReturn = () => {
    shouldReturnRef.current = true
  }

  useEffect(() => {
    // Stagger initialization to avoid hitting WebGL context limit
    const delay = index * 100 // 100ms between each canvas
    const timer = setTimeout(() => {
      setShouldRender(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [index])

  if (!shouldRender) {
    return null
  }

  return (
    <Canvas
      frameloop='always'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
          enableDamping={false}
          onStart={cancelReturn}
          onEnd={startSmoothReturn}
        />
        <SmoothResetController
          controlsRef={controlsRef}
          shouldReturnRef={shouldReturnRef}
          initialCameraPosRef={initialCameraPosRef}
          initialTargetRef={initialTargetRef}
          initialOffsetRef={initialOffsetRef}
        />
        <Ball imgUrl={icon} />
      </Suspense>
      <Preload all />
    </Canvas>
  )
}
