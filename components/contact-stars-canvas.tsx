'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PointMaterial, Points, Preload } from '@react-three/drei'
import * as THREE from 'three'
import { CanvasLoader } from './canvas-loader'

function Stars() {
  const pointsRef = useRef<THREE.Points>(null)

  const sphere = useMemo(() => {
    const vertices = new Float32Array(4200 * 3)
    for (let i = 0; i < vertices.length; i += 1) {
      vertices[i] = (Math.random() - 0.5) * 2.4
    }
    return vertices
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.x -= delta / 12
    pointsRef.current.rotation.y -= delta / 16
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={pointsRef} positions={sphere} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color='#f5f7ff'
          size={0.0022}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

export function ContactStarsCanvas() {
  return (
    <div className='absolute inset-0 z-0 h-full w-full pointer-events-none'>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 1] }}
        gl={{
          outputColorSpace: THREE.SRGBColorSpace,
          alpha: true,
        }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <Stars />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  )
}
