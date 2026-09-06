'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FractalGlassProps {
  className?: string;
  intensity?: 'subtle' | 'vibrant';
  interactive?: boolean;
  targetRef?: React.RefObject<HTMLElement | null>;
}

// Ashima 2D Simplex Noise for the offscreen domain-warp FBO
const snoise2dGLSL = /* glsl */ `
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 10.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const noiseVertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const noiseFragmentShader = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uNoiseScaleX;
uniform float uNoiseScaleY;
uniform float uWarpSpeed;
varying vec2 vUv;

${snoise2dGLSL}

void main() {
  float t = uTime * uWarpSpeed;
  // Two independent samples for x and y warp directions
  float nx = snoise(vUv * vec2(uNoiseScaleX, uNoiseScaleY) + t * 0.5);
  float ny = snoise(vUv * vec2(uNoiseScaleX, uNoiseScaleY) * 0.93 - t * 0.3);
  // Pack [-1, 1] into [0, 1] for render target storage
  gl_FragColor = vec4(nx * 0.5 + 0.5, ny * 0.5 + 0.5, 0.0, 1.0);
}
`;

const mainVertexShader = /* glsl */ `
uniform vec2 uResolution;
uniform vec2 uGrainTextureSize;
uniform float uPixelRatio;

varying vec2 vUv;
varying vec2 vUvA;

void main() {
  vUv = uv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  if (aspect < 1.0 || aspect > 2.3) {
    vUvA = uResolution * uPixelRatio / uGrainTextureSize * uv;
  } else {
    vUvA = uv * 2.0; // Subtle tile repetition for tactile film grain
  }
  gl_Position = vec4(position, 1.0);
}
`;

const mainFragmentShader = /* glsl */ `
precision highp float;

uniform float uPixelRatio;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uWarpStrength;
uniform sampler2D uNoiseMap;
uniform sampler2D uGrainTexture;
uniform float uGrainStrength;
uniform float uFluteWidth;
uniform float uFluteStrength;
uniform float uToneMapExposure;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec3 uC4;
uniform vec3 uC5;

varying vec2 vUv;
varying vec2 vUvA;

vec2 rotate2d(vec2 v, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c) * v;
}

vec3 GaussianEllipses(vec2 uv) {
  float t = uTime * 0.5 + 3.5;
  vec2 mouseInfluence = (uMouse - 0.5) * 0.12;

  // 5 organic fluid orbital attractors with subtle mouse parallax
  vec2 p1 = vec2(-0.32 + sin(t * 0.5 + 1.8) * 0.22, -0.10 + cos(t * 0.8 + 0.3) * 0.16) + mouseInfluence;
  vec2 p2 = vec2( 0.12 + sin(t * 0.6 + 2.5) * 0.16,  0.20 + cos(t * 0.3 + 1.7) * 0.18) + mouseInfluence * 0.7;
  vec2 p3 = vec2(-0.14 + sin(t * 0.9 + 0.7) * 0.22, -0.06 + cos(t * 0.5 + 2.9) * 0.12) + mouseInfluence * 0.5;
  vec2 p4 = vec2( 0.28 + sin(t * 0.4 + 3.1) * 0.18,  0.14 + cos(t * 0.6 + 0.9) * 0.18) + mouseInfluence * 0.8;
  vec2 p5 = vec2(-0.04 + sin(t * 0.7 + 4.2) * 0.14, -0.18 + cos(t * 0.9 + 1.5) * 0.15) + mouseInfluence * 0.6;

  // Domain warp from the offscreen FBO simplex noise
  vec2 warpNoise = texture2D(uNoiseMap, vUv).rg * 2.0 - 1.0;
  vec2 warpedUv = uv + vec2(warpNoise.r * uWarpStrength, warpNoise.g * uWarpStrength * 0.28);

  vec2 dv1 = warpedUv - p1;
  vec2 dv2 = warpedUv - p2;
  vec2 dv3 = warpedUv - p3;
  vec2 dv4 = warpedUv - p4;
  vec2 dv5 = warpedUv - p5;

  // Per-blob rotation angles (radians)
  float a1 =  0.35;
  float a2 = -1.10;
  float a3 =  0.85;
  float a4 = -0.55;
  float a5 =  1.35;

  vec2 r1 = rotate2d(dv1, a1);
  vec2 r2 = rotate2d(dv2, a2);
  vec2 r3 = rotate2d(dv3, a3);
  vec2 r4 = rotate2d(dv4, a4);
  vec2 r5 = rotate2d(dv5, a5);

  // Elliptical Gaussian distance calculations
  float e1 = r1.x * r1.x *  8.0 + r1.y * r1.y *  1.2;
  float e2 = r2.x * r2.x * 24.0 + r2.y * r2.y * 11.0;
  float e3 = r3.x * r3.x *  6.0 + r3.y * r3.y * 13.0;
  float e4 = r4.x * r4.x * 19.0 + r4.y * r4.y *  7.5;
  float e5 = r5.x * r5.x * 28.0 + r5.y * r5.y * 14.0;

  // Sleek deep background base
  vec3 color = vec3(0.004, 0.006, 0.016);
  color += uC1 * exp(-e1) * 1.45; // Azure / deep cyan
  color += uC2 * exp(-e2) * 1.90; // Vibrant violet / magenta
  color += uC3 * exp(-e3) * 1.50; // Neon crimson / ruby
  color += uC4 * exp(-e4) * 1.25; // Warm amber / tangerine highlight
  color += uC5 * exp(-e5) * 1.30; // Bright teal / electric cyan crest

  return color;
}

void main() {
  // Screen coordinates centered around canvas origin
  vec2 mappedCoords = gl_FragCoord.xy / uPixelRatio - uResolution * 0.5;

  // Fluted / Reeded glass prismatic coordinate distortion
  vec2 scaledUv = mappedCoords / vec2(uFluteWidth);
  vec2 fractUv = vec2(fract(scaledUv.x), scaledUv.y);

  // Horizontal zoom-out refraction within each fluted glass rib
  float flutedX = uFluteStrength * (fractUv.x - 0.5);

  // Safe vertical curvature distortion (clamped to avoid NaN at boundaries)
  float safeFractX = clamp(fractUv.x, 0.001, 0.999);
  float flutedY = -uFluteStrength * atanh(pow(safeFractX, 6.0)) * 0.35;

  vec2 flutedCoords = vec2(mappedCoords.x + flutedX, mappedCoords.y + flutedY);
  vec2 flutedUv = flutedCoords / 1000.0;

  // Sample Gaussian Ellipses with fluted glass coordinates
  vec3 color = GaussianEllipses(flutedUv);

  // Prismatic rib highlight: subtle edge reflection between flutes
  float ribEdge = 1.0 - smoothstep(0.0, 0.08, fractUv.x) * smoothstep(1.0, 0.92, fractUv.x);
  color += vec3(0.08, 0.14, 0.22) * ribEdge * 0.35;

  // Exponential tone mapping — compresses overbright, keeps rich colors
  color = 1.0 - exp(-color * uToneMapExposure);

  // Procedural film grain overlay
  float grain = texture2D(uGrainTexture, vUvA).r * 2.0 - 1.0;
  color += grain * uGrainStrength * max(color.r, max(color.g, color.b));
  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * Creates a procedural seamless film grain DataTexture.
 * Guarantees zero external network requests and consistent analog texture.
 */
function createFilmGrainTexture(): THREE.DataTexture {
  const size = 256;
  const data = new Uint8Array(size * size * 4);

  let seed = 42;
  const pseudoRandom = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < size * size; i++) {
    // Generate high-frequency noise with Gaussian-like distribution
    const r1 = pseudoRandom();
    const r2 = pseudoRandom();
    const val = Math.floor(((r1 + r2) * 0.5) * 255);

    const idx = i * 4;
    data[idx] = val;     // R
    data[idx + 1] = val; // G
    data[idx + 2] = val; // B
    data[idx + 3] = 255; // A
  }

  const texture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
    THREE.UnsignedByteType
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export const FractalGlass: React.FC<FractalGlassProps> = ({
  className = '',
  intensity = 'vibrant',
  interactive = true,
  targetRef,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseTargetRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const mouseCurrentRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const isVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene & Camera Setup (NDC Full-Screen Quad)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2.0);
    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      alpha: true,
      antialias: false,
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // 2. Offscreen FBO for Simplex Noise Domain Warping
    const noiseRenderTarget = new THREE.WebGLRenderTarget(256, 256, {
      format: THREE.RGBAFormat,
      magFilter: THREE.LinearFilter,
      minFilter: THREE.LinearFilter,
    });
    noiseRenderTarget.texture.wrapS = THREE.MirroredRepeatWrapping;
    noiseRenderTarget.texture.wrapT = THREE.MirroredRepeatWrapping;

    const noiseScene = new THREE.Scene();
    const noiseCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const noiseUniforms = {
      uTime: { value: 0 },
      uNoiseScaleX: { value: 0.35 },
      uNoiseScaleY: { value: 0.55 },
      uWarpSpeed: { value: 0.12 },
    };

    const noiseQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: noiseVertexShader,
        fragmentShader: noiseFragmentShader,
        uniforms: noiseUniforms,
      })
    );
    noiseScene.add(noiseQuad);

    // 3. Film Grain Procedural Texture
    const grainTexture = createFilmGrainTexture();

    // 4. Main Shader Quad
    // Neon Flux & Cyan Palette tuned to Daffa's dark sleek theme:
    // [0] Deep Royal Azure, [1] Magenta / Purple, [2] Crimson, [3] Amber / Tangerine, [4] Vivid Cyan / Teal
    const palette = [
      new THREE.Vector3(0.04, 0.25, 0.85), // Azure
      new THREE.Vector3(0.78, 0.08, 0.62), // Magenta
      new THREE.Vector3(0.92, 0.15, 0.25), // Crimson
      new THREE.Vector3(0.96, 0.50, 0.10), // Amber
      new THREE.Vector3(0.05, 0.88, 0.92), // Electric Teal
    ];

    const exposureValue = intensity === 'vibrant' ? 0.95 : 0.72;

    const mainUniforms = {
      uResolution: { value: new THREE.Vector2(mount.clientWidth, mount.clientHeight) },
      uPixelRatio: { value: pixelRatio },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uWarpStrength: { value: 0.38 },
      uNoiseMap: { value: noiseRenderTarget.texture },
      uGrainTexture: { value: grainTexture },
      uGrainTextureSize: { value: new THREE.Vector2(256, 256) },
      uGrainStrength: { value: 0.12 },
      uFluteWidth: { value: 65.0 },     // Width of each fluted column
      uFluteStrength: { value: 110.0 }, // Intensity of glass refraction
      uToneMapExposure: { value: exposureValue },
      uC1: { value: palette[0] },
      uC2: { value: palette[1] },
      uC3: { value: palette[2] },
      uC4: { value: palette[3] },
      uC5: { value: palette[4] },
    };

    const mainMaterial = new THREE.ShaderMaterial({
      vertexShader: mainVertexShader,
      fragmentShader: mainFragmentShader,
      uniforms: mainUniforms,
      depthTest: false,
      depthWrite: false,
    });

    const mainQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mainMaterial);
    scene.add(mainQuad);

    // 5. Mouse Interaction Listeners
    const eventTarget = targetRef?.current || mount;
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = eventTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseTargetRef.current.x = Math.max(0, Math.min(1, x));
      mouseTargetRef.current.y = Math.max(0, Math.min(1, y));
    };

    const handleMouseLeave = () => {
      mouseTargetRef.current.x = 0.5;
      mouseTargetRef.current.y = 0.5;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      eventTarget.addEventListener('mouseleave', handleMouseLeave);
    }

    // 6. Resize Observer
    const handleResize = () => {
      if (!mount) return;
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      mainUniforms.uResolution.value.set(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    // 7. Intersection Observer for Power Efficiency (Pause WebGL when off-screen)
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(mount);

    // 8. Animation Render Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth mouse lerp
      mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.05;
      mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.05;
      mainUniforms.uMouse.value.set(mouseCurrentRef.current.x, mouseCurrentRef.current.y);

      // Advance time
      noiseUniforms.uTime.value += delta;
      mainUniforms.uTime.value += delta;

      // Pass 1: Render Simplex Noise into FBO
      renderer.setRenderTarget(noiseRenderTarget);
      renderer.render(noiseScene, noiseCamera);

      // Pass 2: Render Main Fractal Glass Quad to Screen
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 9. Cleanup & Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        eventTarget.removeEventListener('mouseleave', handleMouseLeave);
      }

      noiseQuad.geometry.dispose();
      (noiseQuad.material as THREE.Material).dispose();
      noiseRenderTarget.dispose();

      mainQuad.geometry.dispose();
      mainMaterial.dispose();
      grainTexture.dispose();

      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [intensity, interactive, targetRef]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
    />
  );
};

export default FractalGlass;
