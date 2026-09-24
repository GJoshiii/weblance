import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { store, lerp, smooth } from '../utils/store'

// One coherent universe, driven by store.p (scroll 0..1):
//  0.00-0.14  Character   -> 0.14-0.36 W (shatters into bars) -> 0.32+ Ecosystem (nodes, links, interface fragments)
const SERVICE_COLORS = ['#6E8BFF', '#B58CFF', '#FF5C8A', '#FFB86B', '#5CF2C2', '#9CE86B']
const ACCENT = new THREE.Color('#8B6CFF')

function Character() {
  const g = useRef(), head = useRef(), eyes = useRef(), eL = useRef(), eR = useRef()
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime, w = 1 - smooth(0.07, 0.19, store.p)
    g.current.visible = w > 0.01
    g.current.scale.setScalar(Math.max(w, 0.001))
    g.current.position.y = Math.sin(t * 1.2) * 0.07 + store.p * 6
    g.current.rotation.y = store.p * 8
    // head + neck follow the cursor with easing
    head.current.rotation.y = lerp(head.current.rotation.y, store.mx * 0.55, 1 - Math.exp(-6 * dt))
    head.current.rotation.x = lerp(head.current.rotation.x, -store.my * 0.3, 1 - Math.exp(-6 * dt))
    head.current.rotation.z = Math.sin(t * 0.8) * 0.03
    // eyes slide inside the visor toward the cursor; blink every ~4s; squint while scrolling
    eyes.current.position.x = lerp(eyes.current.position.x, store.mx * 0.22, 1 - Math.exp(-10 * dt))
    eyes.current.position.y = lerp(eyes.current.position.y, store.my * 0.12, 1 - Math.exp(-10 * dt))
    const blink = t % 4 < 0.12 ? 0.08 : 1, squint = 1 - Math.min(Math.abs(store.p) * 6, 0.35)
    ;[eL, eR].forEach((e) => (e.current.scale.y = lerp(e.current.scale.y, blink * squint, 0.4)))
  })
  return (
    <group ref={g}>
      <mesh position={[0, -1.55, 0]} scale={[1.05, 1.15, 0.85]}><sphereGeometry args={[1, 40, 40]} /><meshPhysicalMaterial color="#EDEBFF" roughness={0.25} clearcoat={1} /></mesh>
      <mesh position={[0, -0.75, 0]}><cylinderGeometry args={[0.22, 0.3, 0.5, 20]} /><meshStandardMaterial color="#6E6A99" metalness={0.6} roughness={0.3} /></mesh>
      <group ref={head} position={[0, 0.15, 0]}>
        <RoundedBox args={[2.1, 1.6, 1.5]} radius={0.55} smoothness={5}><meshPhysicalMaterial color="#F4F2FF" roughness={0.2} clearcoat={1} /></RoundedBox>
        <RoundedBox args={[1.7, 0.95, 0.2]} radius={0.4} smoothness={4} position={[0, 0.05, 0.74]}><meshStandardMaterial color="#0B0A1E" roughness={0.1} metalness={0.4} /></RoundedBox>
        <group ref={eyes} position={[0, 0.08, 0.86]}>
          <mesh ref={eL} position={[-0.42, 0, 0]} scale={[0.75, 1, 0.4]}><sphereGeometry args={[0.2, 24, 24]} /><meshBasicMaterial color="#9CF0FF" /></mesh>
          <mesh ref={eR} position={[0.42, 0, 0]} scale={[0.75, 1, 0.4]}><sphereGeometry args={[0.2, 24, 24]} /><meshBasicMaterial color="#9CF0FF" /></mesh>
        </group>
        <mesh position={[0, 0.98, 0]}><cylinderGeometry args={[0.02, 0.02, 0.4]} /><meshBasicMaterial color="#8B6CFF" /></mesh>
        <mesh position={[0, 1.22, 0]}><sphereGeometry args={[0.1, 16, 16]} /><meshBasicMaterial color="#FF5C8A" /></mesh>
      </group>
    </group>
  )
}

// The Weblance W: four rounded bars. On scroll the bars drift apart and dissolve into the ecosystem.
const WP = [[-2, 1], [-1, -1], [0, 1], [1, -1], [2, 1]]
const BARS = WP.slice(0, -1).map((a, i) => {
  const b = WP[i + 1], dx = b[0] - a[0], dy = b[1] - a[1]
  return { mid: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], len: Math.hypot(dx, dy), ang: Math.atan2(dy, dx) }
})
function WeblanceW() {
  const g = useRef(), bars = useRef([])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime, p = store.p
    const inW = smooth(0.1, 0.18, p) * (1 - smooth(0.34, 0.46, p)), ex = smooth(0.24, 0.38, p)
    g.current.visible = inW > 0.01
    g.current.scale.setScalar(Math.max(inW, 0.001) * (store.mobile ? 0.7 : 1))
    g.current.rotation.y = lerp(g.current.rotation.y, store.mx * 0.6 + Math.sin(t * 0.5) * 0.25 + p * 10, 0.08)
    g.current.rotation.x = lerp(g.current.rotation.x, -store.my * 0.3, 0.08)
    g.current.position.y = Math.sin(t) * 0.1
    bars.current.forEach((m, i) => {
      if (!m) return
      const B = BARS[i], k = 1 + ex * 1.8
      m.position.set(B.mid[0] * k, B.mid[1] * k, Math.sin(i * 2 + t) * ex * 0.8)
      m.rotation.z = B.ang + ex * (i - 1.5) * 0.4
    })
  })
  return (
    <group ref={g}>
      {BARS.map((B, i) => (
        <RoundedBox key={i} ref={(el) => (bars.current[i] = el)} args={[B.len + 0.4, 0.46, 0.56]} radius={0.2} smoothness={4}>
          <meshPhysicalMaterial color={i % 2 ? '#8B6CFF' : '#FF5C8A'} metalness={0.3} roughness={0.18} clearcoat={1} emissive={i % 2 ? '#2B1A99' : '#7A1238'} emissiveIntensity={0.5} />
        </RoundedBox>
      ))}
    </group>
  )
}

// Ecosystem: fibonacci-sphere nodes + proximity links + six orbiting interface fragments (one per service).
const FRAGS = ['web', 'ui', 'brand', 'shop', 'seo', 'growth']
function Ecosystem() {
  const g = useRef(), inst = useRef(), lines = useRef(), frags = useRef([]), mat = useRef()
  const N = store.mobile ? 40 : 90
  const { pos, linePos } = useMemo(() => {
    const pos = [], lp = []
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963
      pos.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(3.2))
    }
    pos.forEach((a, i) => pos.forEach((b, j) => { if (j > i && a.distanceTo(b) < 1.5) lp.push(a.x, a.y, a.z, b.x, b.y, b.z) }))
    return { pos, linePos: new Float32Array(lp) }
  }, [N])
  const d = useMemo(() => new THREE.Object3D(), [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime, p = store.p, s = smooth(0.3, 0.5, p), sv = store.service
    g.current.visible = s > 0.01
    const target = sv >= 0 ? 1.12 : 1
    g.current.scale.setScalar(lerp(g.current.scale.x, Math.max(s, 0.001) * target * (store.mobile ? 0.75 : 1), 0.08))
    g.current.rotation.y = t * 0.08 + p * 5 + store.mx * 0.3
    g.current.rotation.x = store.my * 0.15 + smooth(0.8, 1, p) * 0.5
    const col = sv >= 0 ? new THREE.Color(SERVICE_COLORS[sv]) : ACCENT
    mat.current.color.lerp(col, 0.08); lines.current.material.color.lerp(col, 0.08)
    pos.forEach((v, i) => {
      const pulse = 1 + Math.sin(t * 2 + i) * 0.25 + (sv === 4 ? Math.sin(t * 6 + i) * 0.4 : 0)
      d.position.copy(v).multiplyScalar(1 + (sv === 5 ? 0.12 : 0)); d.scale.setScalar(0.07 * pulse); d.updateMatrix(); inst.current.setMatrixAt(i, d.matrix)
    })
    inst.current.instanceMatrix.needsUpdate = true
    frags.current.forEach((f, i) => {
      const a = (i / 6) * Math.PI * 2 + t * 0.15, act = sv === i ? 1 : 0
      f.position.set(Math.cos(a) * 4.2, Math.sin(a * 2) * 1.4, Math.sin(a) * 4.2)
      f.lookAt(0, 0, 0); f.scale.setScalar(lerp(f.scale.x, 0.6 + act * 0.7, 0.1))
      f.material.emissiveIntensity = lerp(f.material.emissiveIntensity, 0.3 + act * 2, 0.1)
      f.material.emissive.set(SERVICE_COLORS[i])
    })
  })
  return (
    <group ref={g}>
      <instancedMesh ref={inst} args={[null, null, N]}><icosahedronGeometry args={[1, 1]} /><meshBasicMaterial ref={mat} color="#8B6CFF" /></instancedMesh>
      <lineSegments ref={lines}><bufferGeometry><bufferAttribute attach="attributes-position" array={linePos} count={linePos.length / 3} itemSize={3} /></bufferGeometry><lineBasicMaterial color="#8B6CFF" transparent opacity={0.35} /></lineSegments>
      {FRAGS.map((k, i) => (
        <RoundedBox key={k} ref={(el) => (frags.current[i] = el)} args={[1.6, 1, 0.06]} radius={0.05}>
          <meshStandardMaterial color="#14123A" emissive={SERVICE_COLORS[i]} emissiveIntensity={0.3} roughness={0.3} />
        </RoundedBox>
      ))}
    </group>
  )
}

function Particles() {
  const ref = useRef(), n = store.mobile ? 250 : 700
  const arr = useMemo(() => Float32Array.from({ length: n * 3 }, () => (Math.random() - 0.5) * 24), [n])
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * 0.02 + store.p * 2; ref.current.position.y = -store.p * 4 })
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" array={arr} count={n} itemSize={3} /></bufferGeometry><pointsMaterial size={0.035} color="#DCE6FF" transparent opacity={0.6} sizeAttenuation /></points>
}

function Rig() {
  useFrame(({ camera }) => {
    const p = store.p
    camera.position.x = lerp(camera.position.x, store.mx * 0.5, 0.05)
    camera.position.y = lerp(camera.position.y, store.my * 0.3 + smooth(0.9, 1, p) * 1.5, 0.05)
    camera.position.z = lerp(camera.position.z, (store.mobile ? 10 : 7.5) + smooth(0.3, 0.6, p) * 2.5 - smooth(0.85, 1, p) * 2, 0.05)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function WorldScene() {
  return (
    <Canvas className="world" aria-hidden="true" dpr={[1, store.mobile ? 1.5 : 2]} camera={{ fov: 42, position: [0, 0, 7.5] }} gl={{ antialias: !store.mobile, powerPreference: 'high-performance' }}>
      <color attach="background" args={['#0B0A1E']} />
      <fog attach="fog" args={['#0B0A1E', 10, 22]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#FFFFFF" />
      <pointLight position={[-4, -2, 3]} intensity={30} color="#FF5C8A" />
      <pointLight position={[4, 2, -2]} intensity={25} color="#6E8BFF" />
      <Character /><WeblanceW /><Ecosystem /><Particles /><Rig />
    </Canvas>
  )
}
