// Poste de barbero 3D en la paleta de A&S (óxido / hueso / cobre) — gira con el tiempo y acelera con la velocidad del scroll.
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { scrollState } from '../lib/motion'

const stripeVert = /* glsl */ `
varying vec2 vUv; varying vec3 vN; varying vec3 vV;
void main(){ vUv = uv; vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }
`
const stripeFrag = /* glsl */ `
uniform float uOffset;
varying vec2 vUv; varying vec3 vN; varying vec3 vV;
const vec3 OXI = vec3(0.400,0.165,0.043);
const vec3 COB = vec3(0.631,0.424,0.188);
const vec3 HUE = vec3(0.976,0.973,0.925);
void main(){
  float s = fract(vUv.x*3.0 + vUv.y*2.2 + uOffset);
  vec3 c = s < 0.25 ? OXI : s < 0.5 ? HUE : s < 0.75 ? COB : HUE;
  float aa = 0.0;
  float diff = clamp(dot(vN, normalize(vec3(0.6,0.5,0.8))), 0.0, 1.0);
  float rim = pow(1.0 - clamp(dot(vN, vV),0.0,1.0), 2.5);
  c *= 0.45 + diff*0.75;
  c += vec3(0.867,0.749,0.416)*rim*0.35 + aa;
  gl_FragColor = vec4(c, 1.0);
}
`

function Pole() {
  const g = useRef<THREE.Group>(null)
  const mat = useMemo(() => new THREE.ShaderMaterial({ vertexShader: stripeVert, fragmentShader: stripeFrag, uniforms: { uOffset: { value: 0 } } }), [])
  const brass = useMemo(() => new THREE.MeshStandardMaterial({ color: '#A16C30', metalness: 0.75, roughness: 0.28, emissive: '#3A2812', emissiveIntensity: 0.4 }), [])
  const glass = useMemo(() => new THREE.MeshStandardMaterial({ color: '#F9F8EC', transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.1, depthWrite: false }), [])
  const speed = useRef(0)
  useFrame((_, dt) => {
    const v = Math.min(Math.abs(scrollState.velocity), 60)
    speed.current += (0.25 + v * 0.05 - speed.current) * 0.08
    mat.uniforms.uOffset.value -= dt * speed.current
    if (g.current) g.current.rotation.y += dt * 0.15
  })
  return (
    <group ref={g} rotation={[0, 0, 0.08]}>
      <mesh material={mat}><cylinderGeometry args={[0.42, 0.42, 3.2, 64, 1, true]} /></mesh>
      <mesh material={glass}><cylinderGeometry args={[0.5, 0.5, 3.3, 64, 1, true]} /></mesh>
      {[1.72, -1.72].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <mesh material={brass}><cylinderGeometry args={[0.58, 0.58, 0.18, 64]} /></mesh>
          <mesh material={brass} position={[0, y > 0 ? 0.14 : -0.14, 0]}><cylinderGeometry args={[0.5, 0.62, 0.1, 64]} /></mesh>
        </group>
      ))}
      <mesh material={brass} position={[0, 2.05, 0]}><sphereGeometry args={[0.36, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
      <mesh material={brass} position={[0, 2.45, 0]}><sphereGeometry args={[0.1, 24, 16]} /></mesh>
      <mesh material={brass} position={[0, -2.0, 0]}><cylinderGeometry args={[0.16, 0.3, 0.4, 32]} /></mesh>
    </group>
  )
}

export default function BarberPole() {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' })
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={wrap} className="h-full w-full" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} frameloop={visible ? 'always' : 'never'} camera={{ position: [0, 0.2, 7.2], fov: 38 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} color="#F9F8EC" />
        <pointLight position={[-3, -1, 2]} intensity={6} color="#DDBF6A" />
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
          <Pole />
        </Float>
      </Canvas>
    </div>
  )
}
