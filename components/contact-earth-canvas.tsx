'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Preload, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { CanvasLoader } from './canvas-loader'

interface EarthProps {
  isMobile: boolean
}

function EarthModel({ earthRef }: { earthRef: React.RefObject<any> }) {
  const { nodes, materials } = useGLTF('/models/planet/scene.gltf') as any

  return (
    <group dispose={null} scale={3.0} position={[0, -0.28, 0]} ref={earthRef}>
      <group name='Sketchfab_Scene'>
        <group name='Sketchfab_model' rotation={[-1.54, -0.064, 0]}>
          <group name='root'>
            <group name='GLTF_SceneRootNode' rotation={[Math.PI / 2, 0, 0]}>
              <group name='Clouds_1'>
                <mesh
                  name='Object_4'
                  geometry={nodes.Object_4.geometry}
                  material={materials.Clouds}
                />
              </group>
              <group name='Planet_2'>
                <mesh
                  name='Object_6'
                  geometry={nodes.Object_6.geometry}
                  material={materials.Planet}
                />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

function Earth({ isMobile }: EarthProps) {
  const earthRef = useRef<any>(null)

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0045
    }
  })

  return (
    <>
      {!isMobile && (
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.6}
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          enableDamping
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          makeDefault
        />
      )}
      <EarthModel earthRef={earthRef} />
    </>
  )
}

interface ContactEarthCanvasProps {
  isMobile?: boolean
}

export function ContactEarthCanvas({ isMobile = false }: ContactEarthCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        outputColorSpace: THREE.SRGBColorSpace,
        alpha: true,
        antialias: true,
      }}
      camera={{ position: [0, 0, 6.4], fov: 52 }}
      className='cursor-grab active:cursor-grabbing'
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[2.6, 1.7, 2]} intensity={0.9} />
        <pointLight position={[-2.6, -1.2, -2]} intensity={0.25} color='#a592ff' />
        <Earth isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  )
}
