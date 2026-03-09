// src/components/sections/HeroSection.jsx

import { useEffect, useState, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { personal } from '../../data/personal'
import { useParallax } from '../../hooks/useParallax'

// ─── Silk Fabric Shader Mesh ─────────────────────────────
function SilkMesh({ scrollY, mousePos }) {
  const materialRef = useRef()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  )

  const vertexShader = `
    uniform float uTime;
    uniform float uScroll;
    uniform vec2 uMouse;
    varying vec2 vUv;
    varying float vElevation;

    vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472786985 * r; }

    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x2_ = x_ * ns.x + ns.yyyy;
      vec4 y2_ = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x2_) - abs(y2_);
      vec4 b0 = vec4(x2_.xy, y2_.xy);
      vec4 b1 = vec4(x2_.zw, y2_.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    void main() {
      vUv = uv;
      vec3 pos = position;

      float mouseInf = smoothstep(0.8, 0.0,
        length(vec2(uv.x - uMouse.x, uv.y - (1.0 - uMouse.y)))
      );

      float n1 = snoise(vec3(pos.x * 0.6, pos.y * 0.5, uTime * 0.12)) * 0.5;
      float n2 = snoise(vec3(pos.x * 1.4, pos.y * 1.1, uTime * 0.08 + 10.0)) * 0.2;
      float n3 = snoise(vec3(pos.x * 2.8, pos.y * 2.2, uTime * 0.06 + 20.0)) * 0.08;
      float scrollW = sin(pos.y * 0.4 + uScroll * 0.002) * 0.2;

      float elev = n1 + n2 + n3 + scrollW + mouseInf * 0.35;
      pos.z += elev;
      vElevation = elev;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      vec3 cream = vec3(1.0, 0.953, 0.902);
      vec3 warm = vec3(0.961, 0.902, 0.827);
      vec3 burgundy = vec3(0.22, 0.098, 0.196);

      float mix1 = smoothstep(-0.3, 0.6, vElevation);
      vec3 color = mix(cream, warm, mix1);

      float darkMix = smoothstep(0.35, 0.85, vElevation);
      color = mix(color, burgundy, darkMix * 0.12);

      float grain = fract(sin(dot(vUv * 300.0, vec2(12.9898, 78.233))) * 43758.5453) * 0.02;
      color += grain - 0.01;

      float edgeFade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x)
                     * smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);

      float alpha = 0.5 + vElevation * 0.08;
      alpha *= edgeFade;

      gl_FragColor = vec4(color, alpha);
    }
  `

  useFrame((state) => {
    if (!materialRef.current) return
    const u = materialRef.current.uniforms
    u.uTime.value = state.clock.elapsedTime
    u.uScroll.value += (scrollY - u.uScroll.value) * 0.05
    u.uMouse.value.x += (mousePos.x - u.uMouse.value.x) * 0.03
    u.uMouse.value.y += (mousePos.y - u.uMouse.value.y) * 0.03
  })

  return (
    <mesh rotation={[-0.15, 0, 0.08]} position={[0, 0, -1.5]}>
      <planeGeometry args={[14, 10, 100, 100]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── Floating Ink Particles ──────────────────────────────
function InkParticles({ scrollY, count }) {
  const pointsRef = useRef()

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8
      speeds[i] = 0.002 + Math.random() * 0.006
    }
    return { positions, speeds }
  }, [count])

  const dotTexture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 64
    c.height = 64
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(56,25,50,0.5)')
    g.addColorStop(0.5, 'rgba(56,25,50,0.1)')
    g.addColorStop(1, 'rgba(56,25,50,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const arr = pointsRef.current.geometry.attributes.position.array
    const t = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      arr[i3] += Math.sin(t * 0.2 + i * 0.7) * 0.002
      arr[i3 + 1] += speeds[i]
      arr[i3 + 2] += Math.cos(t * 0.15 + i * 0.5) * 0.001

      if (arr[i3 + 1] > 6.5) {
        arr[i3 + 1] = -6.5
        arr[i3] = (Math.random() - 0.5) * 16
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.position.y = scrollY * -0.001
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation
        transparent
        opacity={0.1}
        map={dotTexture}
        depthWrite={false}
        color="#381932"
      />
    </points>
  )
}

// ─── Orbiting Devanagari Glyphs ──────────────────────────
function FloatingGlyphs({ scrollY, mousePos }) {
  const groupRef = useRef()

  const glyphData = useMemo(() => {
    const chars = 'अआइईउऊएऐओऔकख'.split('')
    return chars.map((char, i) => {
      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 128
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, 128, 128)
      ctx.font = '300 72px "Cormorant", Georgia, serif'
      ctx.fillStyle = '#381932'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(char, 64, 64)
      return {
        texture: new THREE.CanvasTexture(canvas),
        radius: 2.8 + Math.random() * 2,
        speed: 0.025 + Math.random() * 0.035,
        offset: (Math.PI * 2 * i) / chars.length,
        yOff: (Math.random() - 0.5) * 3,
        scale: 0.6 + Math.random() * 0.5,
        baseOpacity: 0.03 + Math.random() * 0.05,
      }
    })
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y =
      Math.sin(t * 0.02) * 0.12 + (mousePos.x - 0.5) * 0.2
    groupRef.current.rotation.x =
      Math.cos(t * 0.015) * 0.06 + (mousePos.y - 0.5) * 0.1
    groupRef.current.position.y = scrollY * -0.0008

    groupRef.current.children.forEach((child, i) => {
      const d = glyphData[i]
      if (!d) return
      const angle = t * d.speed + d.offset
      child.position.x = Math.cos(angle) * d.radius
      child.position.z = Math.sin(angle) * d.radius * 0.5
      child.position.y = d.yOff + Math.sin(angle * 0.6) * 0.5
      child.material.opacity =
        d.baseOpacity * (0.6 + Math.sin(t * 0.4 + i) * 0.4)
    })
  })

  return (
    <group ref={groupRef} position={[0, 0, -0.5]}>
      {glyphData.map((d, i) => (
        <sprite key={i} scale={[d.scale * 3, d.scale * 3, 1]}>
          <spriteMaterial
            map={d.texture}
            transparent
            opacity={d.baseOpacity}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  )
}

// ─── Thin Ring Accent ────────────────────────────────────
function ThinRing({ scrollY }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x =
      Math.PI * 0.42 + Math.sin(state.clock.elapsedTime * 0.08) * 0.06
    ref.current.rotation.z = state.clock.elapsedTime * 0.015
    ref.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.12) * 0.2 + scrollY * -0.0004
  })

  return (
    <mesh ref={ref} position={[0, 0, -2.5]}>
      <torusGeometry args={[3, 0.006, 16, 120]} />
      <meshBasicMaterial color="#381932" transparent opacity={0.07} />
    </mesh>
  )
}

// ─── Second Ring ─────────────────────────────────────────
function ThinRing2({ scrollY }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x =
      Math.PI * 0.55 + Math.cos(state.clock.elapsedTime * 0.06) * 0.04
    ref.current.rotation.z = -state.clock.elapsedTime * 0.01
    ref.current.position.y =
      Math.cos(state.clock.elapsedTime * 0.1) * 0.15 + scrollY * -0.0003
  })

  return (
    <mesh ref={ref} position={[0.5, -0.3, -3]}>
      <torusGeometry args={[4.2, 0.004, 16, 120]} />
      <meshBasicMaterial color="#381932" transparent opacity={0.035} />
    </mesh>
  )
}

// ─── Camera Rig ──────────────────────────────────────────
function CameraRig({ mousePos }) {
  const { camera } = useThree()
  useFrame((state) => {
    const tx = (mousePos.x - 0.5) * 0.4
    const ty = (mousePos.y - 0.5) * 0.2 + 0.1
    camera.position.x += (tx - camera.position.x) * 0.02
    camera.position.y += (ty - camera.position.y) * 0.02
    camera.position.z = 5 + Math.sin(state.clock.elapsedTime * 0.08) * 0.15
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ═════════════════════════════════════════════════════════
// MAIN HERO
// ═════════════════════════════════════════════════════════
export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const { scrollY } = useParallax()
  const isMobile = useRef(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    isMobile.current =
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 150)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (isMobile.current) return
    const onMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const fadeOpacity = Math.max(0, 1 - scrollY / 600)
  const parallaxY = scrollY * 0.2

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#FFF3E6',
      }}
    >
      {/* ── Inline Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');

        @keyframes heroReveal {
          0% { opacity: 0; transform: translateY(50px); filter: blur(10px); }
          60% { filter: blur(2px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes heroRevealMobile {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroLineGrow {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes heroGrain {
          0%, 100% { transform: translate(0,0); }
          20% { transform: translate(-2%,-1%); }
          40% { transform: translate(1%,2%); }
          60% { transform: translate(-1%,-2%); }
          80% { transform: translate(2%,1%); }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.12; }
        }
        @keyframes heroScrollDot {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(12px); opacity: 0.8; }
        }
        @keyframes heroCorner {
          0% { stroke-dashoffset: 80; opacity: 0; }
          100% { stroke-dashoffset: 0; opacity: 0.12; }
        }

        .hero-cta-primary {
          font-family: 'Cormorant', Georgia, serif;
          font-weight: 500;
          font-size: 0.8rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #FFF3E6;
          background: #381932;
          border: 1px solid #381932;
          padding: 15px 38px;
          text-decoration: none;
          display: inline-block;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25,0.1,0.25,1);
        }
        .hero-cta-primary:hover {
          background: #4a2245;
          border-color: #4a2245;
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(56,25,50,0.18);
        }
        .hero-cta-secondary {
          font-family: 'Cormorant', Georgia, serif;
          font-weight: 500;
          font-size: 0.8rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #381932;
          background: transparent;
          border: 1px solid rgba(56,25,50,0.15);
          padding: 15px 38px;
          text-decoration: none;
          display: inline-block;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25,0.1,0.25,1);
        }
        .hero-cta-secondary:hover {
          border-color: rgba(56,25,50,0.4);
          background: rgba(56,25,50,0.03);
          transform: translateY(-2px);
        }
      `}</style>

      {/* ── 3D Canvas Background ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          transform: `translateY(${scrollY * 0.12}px)`,
        }}
      >
        <Canvas
          dpr={isMobile.current ? 1 : Math.min(window.devicePixelRatio, 2)}
          gl={{
            antialias: !isMobile.current,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <CameraRig mousePos={mousePos} />
          <SilkMesh scrollY={scrollY} mousePos={mousePos} />
          <InkParticles
            scrollY={scrollY}
            count={isMobile.current ? 25 : 70}
          />
          {!isMobile.current && (
            <FloatingGlyphs scrollY={scrollY} mousePos={mousePos} />
          )}
          <ThinRing scrollY={scrollY} />
          {!isMobile.current && <ThinRing2 scrollY={scrollY} />}
        </Canvas>
      </div>

      {/* ── Film Grain ── */}
      {!isMobile.current && (
        <div
          style={{
            position: 'absolute',
            inset: '-50%',
            zIndex: 1,
            opacity: 0.025,
            pointerEvents: 'none',
            mixBlendMode: 'multiply',
            animation: 'heroGrain 0.5s steps(1) infinite',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      )}

      {/* ── Vignette ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 75% 65% at 50% 45%, transparent 35%, rgba(56,25,50,0.04) 100%)',
        }}
      />

      {/* ── Bottom Fade ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '25vh',
          zIndex: 2,
          pointerEvents: 'none',
          background:
            'linear-gradient(to bottom, transparent, rgba(255,243,230,0.7))',
        }}
      />

      {/* ── Corner Brackets ── */}
      {isLoaded && !isMobile.current && (
        <>
          {[
            {
              pos: { top: 'clamp(28px,5vw,50px)', left: 'clamp(28px,5vw,50px)' },
              d: 'M0 30 L0 0 L30 0',
              delay: '0.6s',
            },
            {
              pos: {
                top: 'clamp(28px,5vw,50px)',
                right: 'clamp(28px,5vw,50px)',
              },
              d: 'M0 0 L30 0 L30 30',
              delay: '0.8s',
            },
            {
              pos: {
                bottom: 'clamp(28px,5vw,50px)',
                left: 'clamp(28px,5vw,50px)',
              },
              d: 'M0 0 L0 30 L30 30',
              delay: '1.0s',
            },
            {
              pos: {
                bottom: 'clamp(28px,5vw,50px)',
                right: 'clamp(28px,5vw,50px)',
              },
              d: 'M30 0 L30 30 L0 30',
              delay: '1.2s',
            },
          ].map((corner, i) => (
            <svg
              key={i}
              width="30"
              height="30"
              style={{ position: 'absolute', zIndex: 5, ...corner.pos }}
            >
              <path
                d={corner.d}
                fill="none"
                stroke="#381932"
                strokeWidth="0.5"
                strokeDasharray="80"
                style={{
                  animation: `heroCorner 0.8s ease ${corner.delay} both`,
                }}
              />
            </svg>
          ))}
        </>
      )}

      {/* ═══ CONTENT ═══ */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 24px',
          opacity: fadeOpacity,
          transform: `translateY(${parallaxY}px)`,
        }}
      >
        {/* Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 22px',
            border: '1px solid rgba(56,25,50,0.08)',
            marginBottom: 'clamp(24px,4vw,44px)',
            opacity: 0,
            animation: isLoaded
              ? 'heroFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s forwards'
              : 'none',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#381932',
              animation: 'heroPulse 2.5s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: '"Cormorant", Georgia, serif',
              fontWeight: 400,
              fontSize: '0.65rem',
              color: '#381932',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              opacity: 0.4,
            }}
          >
            Available for work
          </span>
        </div>

        {/* Hindi Epigraph */}
        <div
          style={{
            marginBottom: 'clamp(14px,2.5vw,24px)',
            opacity: 0,
            animation: isLoaded
              ? 'heroFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.6s forwards'
              : 'none',
          }}
        >
          <span
            style={{
              fontFamily: '"Cormorant", Georgia, serif',
              fontWeight: 400,
              fontSize: 'clamp(0.6rem,1.1vw,0.8rem)',
              color: '#381932',
              letterSpacing: '0.06em',
              opacity: 0.3,
            }}
          >
            मेरा हौसला मेरी जीवन रेखा से गहरा है
          </span>
        </div>

        {/* Name */}
        <h1
          style={{
            fontFamily: '"Cormorant", Georgia, serif',
            fontWeight: 300,
            fontSize: 'clamp(3.2rem,11vw,9.5rem)',
            color: '#381932',
            letterSpacing: '-0.03em',
            lineHeight: 0.85,
            marginBottom: 'clamp(10px,1.8vw,18px)',
            opacity: 0,
            animation: isLoaded
              ? `${isMobile.current ? 'heroRevealMobile' : 'heroReveal'} 1s cubic-bezier(0.16,1,0.3,1) 0.2s forwards`
              : 'none',
          }}
        >
          {personal.name}
        </h1>

        {/* Line */}
        <div
          style={{
            width: 'clamp(36px,7vw,70px)',
            height: 1,
            background: 'rgba(56,25,50,0.12)',
            marginBottom: 'clamp(14px,2.5vw,24px)',
            transformOrigin: 'center',
            transform: 'scaleX(0)',
            animation: isLoaded
              ? 'heroLineGrow 0.7s cubic-bezier(0.16,1,0.3,1) 0.7s forwards'
              : 'none',
          }}
        />

        {/* Role */}
        <p
          style={{
            fontFamily: '"Cormorant", Georgia, serif',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 'clamp(0.95rem,2.2vw,1.35rem)',
            color: '#381932',
            maxWidth: 480,
            lineHeight: 1.65,
            marginBottom: 'clamp(28px,4.5vw,52px)',
            opacity: 0,
            animation: isLoaded
              ? `${isMobile.current ? 'heroRevealMobile' : 'heroReveal'} 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s forwards`
              : 'none',
          }}
        >
          {personal.role}
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(10px,2vw,18px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            opacity: 0,
            animation: isLoaded
              ? 'heroFadeIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.9s forwards'
              : 'none',
          }}
        >
          <a href="#projects" className="hero-cta-primary">
            View My Work
          </a>
          <a href="#contact" className="hero-cta-secondary">
            Get In Touch
          </a>
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(28px,5vw,50px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          opacity: 0,
          animation: isLoaded
            ? 'heroFadeIn 0.5s ease 1.3s forwards'
            : 'none',
        }}
      >
        <span
          style={{
            fontFamily: '"Cormorant", Georgia, serif',
            fontWeight: 400,
            fontSize: '0.5rem',
            color: '#381932',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            opacity: Math.max(0, 0.3 - scrollY / 400),
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 28,
            background: 'rgba(56,25,50,0.08)',
            position: 'relative',
            overflow: 'hidden',
            opacity: Math.max(0, 1 - scrollY / 200),
          }}
        >
          <div
            style={{
              width: 1,
              height: 8,
              background: 'rgba(56,25,50,0.3)',
              borderRadius: 1,
              animation: 'heroScrollDot 2.2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* ── Year ── */}
      {!isMobile.current && (
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(28px,5vw,50px)',
            right: 'clamp(32px,5vw,56px)',
            zIndex: 5,
            opacity: 0,
            animation: isLoaded
              ? 'heroFadeIn 0.5s ease 1.1s forwards'
              : 'none',
          }}
        >
          <span
            style={{
              fontFamily: '"Cormorant", Georgia, serif',
              fontWeight: 300,
              fontSize: '0.45rem',
              color: '#381932',
              letterSpacing: '0.3em',
              opacity: 0.12,
              writingMode: 'vertical-rl',
            }}
          >
            © {new Date().getFullYear()}
          </span>
        </div>
      )}
    </section>
  )
}