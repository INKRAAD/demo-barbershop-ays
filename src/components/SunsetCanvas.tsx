// Hero WebGL: atardecer sobre el Pacífico de Miraflores (el fondo del logo original), hecho con shader propio.
// El progreso de scroll (uSet) pone el sol y oscurece la escena: "bajamos al sótano".
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import * as THREE from 'three'

const vert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`
const frag = /* glsl */ `
precision highp float;
uniform float uTime; uniform float uSet; uniform vec2 uRes; uniform vec2 uMouse; uniform float uHz;
varying vec2 vUv;
const vec3 ESP = vec3(0.106,0.082,0.043);
const vec3 TAB = vec3(0.227,0.157,0.071);
const vec3 OXI = vec3(0.400,0.165,0.043);
const vec3 COB = vec3(0.631,0.424,0.188);
const vec3 DOR = vec3(0.867,0.749,0.416);
const vec3 HUE = vec3(0.976,0.973,0.925);
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x), mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x), u.y); }
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=.5; } return v; }
void main(){
  vec2 uv = vUv; float aspect = uRes.x/uRes.y;
  vec2 p = vec2((uv.x-.5)*aspect, uv.y);
  float hz = uHz; float set = clamp(uSet,0.,1.);
  vec2 sunPos = vec2(uMouse.x*0.05, hz + 0.25 - set*0.36 + uMouse.y*0.01);
  float sunR = 0.09;
  vec3 col;
  float sunVis = smoothstep(hz-0.09, hz+0.06, sunPos.y);
  if (p.y > hz) {
    float h = (p.y-hz)/(1.-hz);
    vec3 skyLow = mix(DOR, COB, set*0.9);
    vec3 skyMid = mix(COB*0.85, OXI*0.65, set);
    vec3 skyTop = mix(TAB*0.9, ESP, 0.35+set*0.65);
    col = mix(skyLow, skyMid, smoothstep(0.0,0.22,h));
    col = mix(col, skyTop, smoothstep(0.18,0.85,h));
    float c = fbm(vec2(p.x*1.4 + uTime*0.012, h*5.0 + 3.0));
    float bands = smoothstep(0.52,0.78,c) * smoothstep(0.75,0.08,h);
    col = mix(col, mix(TAB, OXI, 0.45)*0.85, bands*0.6);
    float d = length(p - sunPos);
    col += DOR * exp(-d*4.2) * 0.6 * (1.0-set*0.7);
    col += HUE * exp(-d*14.0) * 0.25 * (1.0-set);
    float disc = smoothstep(sunR, sunR-0.003, d);
    float streak = smoothstep(0.5,0.78, fbm(vec2(p.x*2.5 + uTime*0.03, p.y*38.0)));
    col = mix(col, mix(HUE, DOR, 0.3 + set*0.5), disc*(1.0 - streak*0.55));
  } else {
    float depth = hz - p.y;
    float z = 0.09/(depth+0.015);
    vec2 sp = vec2(p.x*z*1.3, z*2.2 + uTime*0.22);
    float w = fbm(sp*vec2(1.6, 1.0));
    float w2 = fbm(sp*vec2(7.0,3.2) + vec2(0.0, uTime*0.35));
    vec3 sea = mix(ESP, TAB, 0.35 + 0.9*(w-0.5));
    sea = mix(sea, ESP*0.8, smoothstep(0.0,0.5,depth));
    float lines = smoothstep(0.62,0.7, fbm(vec2(p.x*z*0.6, z*9.0 + uTime*0.25)));
    sea = mix(sea, ESP*0.6, lines*0.6);
    float dx = abs(p.x - sunPos.x);
    float width = 0.045 + depth*0.55;
    float column = exp(-pow(dx/width,2.0)*2.2);
    float glitter = smoothstep(0.5, 0.82, w2);
    sea += mix(COB, HUE, glitter*glitter) * column * glitter * 1.35 * sunVis;
    sea += DOR * column * 0.12 * sunVis;
    sea = mix(sea, mix(DOR, COB, set), exp(-depth*38.0)*0.55*(1.0-set*0.6));
    col = sea;
  }
  col *= 1.0 - smoothstep(0.5,1.0,set)*0.8;
  vec2 q = uv-0.5; col *= 1.0 - dot(q,q)*1.15;
  col += (hash(uv*uRes + fract(uTime)*91.7)-0.5)*0.035;
  gl_FragColor = vec4(col,1.0);
}
`

function Sea({ setRef, reduced }: { setRef: MutableRefObject<number>; reduced: boolean }) {
  const { size, invalidate } = useThree()
  const mouse = useRef(new THREE.Vector2())
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: vert, fragmentShader: frag, depthWrite: false, depthTest: false,
    uniforms: { uTime: { value: 8 }, uSet: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2() }, uHz: { value: 0.4 } },
  }), [])
  useEffect(() => {
    mat.uniforms.uRes.value.set(size.width, size.height)
    mat.uniforms.uHz.value = size.width < 768 ? 0.36 : 0.4
    invalidate()
  }, [size, mat, invalidate])
  useEffect(() => {
    const f = (e: PointerEvent) => mouse.current.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1))
    addEventListener('pointermove', f, { passive: true })
    return () => removeEventListener('pointermove', f)
  }, [])
  useEffect(() => {
    if (!reduced) return
    const f = () => invalidate()
    addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [reduced, invalidate])
  useFrame((_, dt) => {
    const u = mat.uniforms
    if (!reduced) u.uTime.value += Math.min(dt, 0.05)
    u.uSet.value += (setRef.current - u.uSet.value) * (reduced ? 1 : 0.12)
    u.uMouse.value.lerp(mouse.current, 0.04)
  })
  return (
    <mesh frustumCulled={false} material={mat}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  )
}

export default function SunsetCanvas({ setRef, reduced, mobile }: { setRef: MutableRefObject<number>; reduced: boolean; mobile: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '100px' })
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={mobile ? [0.6, 1] : [0.8, 1.5]}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        frameloop={!visible ? 'never' : reduced ? 'demand' : 'always'}
        camera={{ position: [0, 0, 1] }}
      >
        <Sea setRef={setRef} reduced={reduced} />
      </Canvas>
    </div>
  )
}
