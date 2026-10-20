'use client';

import React, { useEffect, useRef } from 'react';
import { lerp } from '@/utils/math';

const MOUSE_LERP_FACTOR = 0.05;

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
 * Creates the procedural seamless film grain pixels (256x256 RGBA).
 * Guarantees zero external network requests and consistent analog texture.
 */
const GRAIN_SIZE = 256;
const NOISE_FBO_SIZE = 256;
const FRAME_MS = 1000 / 30;

function createFilmGrainData(): Uint8Array {
  const size = GRAIN_SIZE;
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
  return data;
}

type GL = WebGLRenderingContext | WebGL2RenderingContext;

interface GLResources {
  noiseProgram: WebGLProgram;
  mainProgram: WebGLProgram;
  vertexBuffer: WebGLBuffer;
  noiseFramebuffer: WebGLFramebuffer;
  noiseTexture: WebGLTexture;
  grainTexture: WebGLTexture;
  noiseTimeLoc: WebGLUniformLocation | null;
  resolutionLoc: WebGLUniformLocation | null;
  mainTimeLoc: WebGLUniformLocation | null;
  mouseLoc: WebGLUniformLocation | null;
}

/** The GL objects to delete, each nullable so a half-built set from a failed init can be passed as is. */
type OwnedResources = {
  [K in 'noiseProgram' | 'mainProgram' | 'vertexBuffer' | 'noiseFramebuffer' | 'noiseTexture' | 'grainTexture']:
    GLResources[K] | null;
};

/**
 * Shader prefixes mirroring what three's ShaderMaterial injected (three 0.185):
 * on WebGL2 the GLSL ES 1.00-style sources are compiled as GLSL ES 3.00 via
 * defines (atanh needs 3.00). The full-screen triangle feeds `position` (xy, z = 0)
 * and `uv` is derived from it, matching PlaneGeometry(2, 2) UVs exactly.
 * No output color-space conversion or tone mapping: three only applies those in a
 * ShaderMaterial when the shader includes the colorspace/tonemapping chunks, which
 * these shaders never did.
 */
function vertexPrefix(isGL2: boolean): string {
  return (
    (isGL2 ? '#version 300 es\n#define attribute in\n#define varying out\n' : '') +
    'precision highp float;\nprecision highp int;\n' +
    'attribute vec3 position;\n#define uv (position.xy * 0.5 + 0.5)\n'
  );
}

function fragmentPrefix(isGL2: boolean): string {
  return isGL2
    ? '#version 300 es\n#define varying in\nlayout(location = 0) out highp vec4 pc_fragColor;\n#define gl_FragColor pc_fragColor\n#define texture2D texture\nprecision highp float;\nprecision highp int;\n'
    : 'precision highp float;\nprecision highp int;\nfloat atanh(float x) { return 0.5 * log((1.0 + x) / (1.0 - x)); }\n';
}

function createProgram(gl: GL, isGL2: boolean, vs: string, fs: string): WebGLProgram | null {
  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      if (process.env.NODE_ENV !== 'production') console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const v = compile(gl.VERTEX_SHADER, vertexPrefix(isGL2) + vs);
  const f = compile(gl.FRAGMENT_SHADER, fragmentPrefix(isGL2) + fs);
  const program = v && f ? gl.createProgram() : null;
  if (program && v && f) {
    gl.attachShader(program, v);
    gl.attachShader(program, f);
    gl.bindAttribLocation(program, 0, 'position');
    gl.linkProgram(program);
  }
  if (v) gl.deleteShader(v);
  if (f) gl.deleteShader(f);
  if (program && !gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV !== 'production') console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function createTexture(
  gl: GL,
  size: number,
  data: Uint8Array | null,
  wrap: number
): WebGLTexture | null {
  const tex = gl.createTexture();
  if (!tex) return null;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
  return tex;
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

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Raw WebGL context (WebGL2, WebGL1 fallback).
    // Ambient background: 1x is enough for a soft blurred shader and keeps fill cost
    // low on high-DPI screens. Low-power lets laptops stay on the integrated GPU.
    const pixelRatio = 1;
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    const contextAttributes: WebGLContextAttributes = {
      powerPreference: 'low-power',
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    };
    let gl: GL | null = null;
    let isGL2 = false;
    try {
      gl = canvas.getContext('webgl2', contextAttributes);
      isGL2 = !!gl;
      if (!gl) gl = canvas.getContext('webgl', contextAttributes);
    } catch {
      gl = null;
    }
    // No WebGL: leave the mount empty so the caller's static fallback shows through.
    if (!gl) return;
    const ctx: GL = gl;
    const loseContext = ctx.getExtension('WEBGL_lose_context');

    // Neon Flux & Cyan Palette tuned to Daffa's dark sleek theme:
    // [0] Deep Royal Azure, [1] Magenta / Purple, [2] Crimson, [3] Amber / Tangerine, [4] Vivid Cyan / Teal
    const palette: [number, number, number][] = [
      [0.04, 0.25, 0.85], // Azure
      [0.78, 0.08, 0.62], // Magenta
      [0.92, 0.15, 0.25], // Crimson
      [0.96, 0.50, 0.10], // Amber
      [0.05, 0.88, 0.92], // Electric Teal
    ];

    const exposureValue = intensity === 'vibrant' ? 0.95 : 0.72;

    const deleteResources = (r: OwnedResources) => {
      ctx.deleteProgram(r.noiseProgram);
      ctx.deleteProgram(r.mainProgram);
      ctx.deleteBuffer(r.vertexBuffer);
      ctx.deleteFramebuffer(r.noiseFramebuffer);
      ctx.deleteTexture(r.noiseTexture);
      ctx.deleteTexture(r.grainTexture);
    };

    // Builds every GL object and uploads the fixed state. Runs on mount and again after a
    // context restore, since a lost context invalidates all of it.
    const initGL = (): GLResources | null => {
      const noiseProgram = createProgram(ctx, isGL2, noiseVertexShader, noiseFragmentShader);
      const mainProgram = createProgram(ctx, isGL2, mainVertexShader, mainFragmentShader);

      // 2. Full-screen triangle (covers clip space; uv derived from position)
      const vertexBuffer = ctx.createBuffer();
      ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);
      ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), ctx.STATIC_DRAW);

      // 3. Offscreen FBO for Simplex Noise Domain Warping (256x256 RGBA8, mirrored repeat)
      const noiseTexture = createTexture(ctx, NOISE_FBO_SIZE, null, ctx.MIRRORED_REPEAT);
      const noiseFramebuffer = ctx.createFramebuffer();
      ctx.bindFramebuffer(ctx.FRAMEBUFFER, noiseFramebuffer);
      ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, noiseTexture, 0);
      ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);

      // 4. Film Grain Procedural Texture (the 256 KB pixel array is built here and dropped after upload)
      const grainTexture = createTexture(ctx, GRAIN_SIZE, createFilmGrainData(), ctx.REPEAT);

      if (!noiseProgram || !mainProgram || !vertexBuffer || !noiseFramebuffer || !noiseTexture || !grainTexture) {
        deleteResources({ noiseProgram, mainProgram, vertexBuffer, noiseFramebuffer, noiseTexture, grainTexture });
        return null;
      }

      // Fixed GL state: no blending / depth (three disabled blending for opaque ShaderMaterials)
      ctx.disable(ctx.BLEND);
      ctx.disable(ctx.DEPTH_TEST);
      ctx.disable(ctx.CULL_FACE);
      ctx.clearColor(0, 0, 0, 0);
      ctx.enableVertexAttribArray(0);
      ctx.vertexAttribPointer(0, 2, ctx.FLOAT, false, 0, 0);

      const loc = (program: WebGLProgram, name: string) => ctx.getUniformLocation(program, name);

      // Noise pass uniforms
      const noiseTimeLoc = loc(noiseProgram, 'uTime');
      ctx.useProgram(noiseProgram);
      ctx.uniform1f(loc(noiseProgram, 'uNoiseScaleX'), 0.35);
      ctx.uniform1f(loc(noiseProgram, 'uNoiseScaleY'), 0.55);
      ctx.uniform1f(loc(noiseProgram, 'uWarpSpeed'), 0.12);

      // 5. Main Shader
      const resolutionLoc = loc(mainProgram, 'uResolution');
      const mainTimeLoc = loc(mainProgram, 'uTime');
      const mouseLoc = loc(mainProgram, 'uMouse');
      ctx.useProgram(mainProgram);
      ctx.uniform1f(loc(mainProgram, 'uPixelRatio'), pixelRatio);
      ctx.uniform2f(mouseLoc, 0.5, 0.5);
      ctx.uniform1f(loc(mainProgram, 'uWarpStrength'), 0.38);
      ctx.uniform1i(loc(mainProgram, 'uNoiseMap'), 0);
      ctx.uniform1i(loc(mainProgram, 'uGrainTexture'), 1);
      ctx.uniform2f(loc(mainProgram, 'uGrainTextureSize'), GRAIN_SIZE, GRAIN_SIZE);
      ctx.uniform1f(loc(mainProgram, 'uGrainStrength'), 0.12);
      ctx.uniform1f(loc(mainProgram, 'uFluteWidth'), 65.0);     // Width of each fluted column
      ctx.uniform1f(loc(mainProgram, 'uFluteStrength'), 110.0); // Intensity of glass refraction
      ctx.uniform1f(loc(mainProgram, 'uToneMapExposure'), exposureValue);
      palette.forEach((c, i) => ctx.uniform3f(loc(mainProgram, `uC${i + 1}`), c[0], c[1], c[2]));

      // Texture units are fixed for the context's lifetime.
      ctx.activeTexture(ctx.TEXTURE1);
      ctx.bindTexture(ctx.TEXTURE_2D, grainTexture);
      ctx.activeTexture(ctx.TEXTURE0);
      ctx.bindTexture(ctx.TEXTURE_2D, noiseTexture);

      return {
        noiseProgram,
        mainProgram,
        vertexBuffer,
        noiseFramebuffer,
        noiseTexture,
        grainTexture,
        noiseTimeLoc,
        resolutionLoc,
        mainTimeLoc,
        mouseLoc,
      };
    };

    let res = initGL();
    if (!res) {
      loseContext?.loseContext();
      return;
    }

    const setSize = (w: number, h: number) => {
      canvas.width = Math.floor(w * pixelRatio);
      canvas.height = Math.floor(h * pixelRatio);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      if (!res) return;
      ctx.useProgram(res.mainProgram);
      ctx.uniform2f(res.resolutionLoc, w, h);
    };
    setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(canvas);

    // 6. Mouse Interaction Listeners
    let isOnScreen = false;
    const eventTarget = targetRef?.current || mount;
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !isOnScreen) return;
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

    // 7. Resize Observer
    const handleResize = () => {
      if (!mount) return;
      setSize(mount.clientWidth, mount.clientHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    // 8. Animation Render Loop (only scheduled while on screen, see step 9)
    let animationFrameId: number | null = null;
    let lastTime = performance.now();
    let time = 0;
    let frameIndex = 0;

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);
      if (!res || ctx.isContextLost()) return;

      // Capped at ~30 fps: a slow ambient blur gains nothing from 60-120 Hz, and each frame is
      // two passes. `time` advances by real elapsed time, so the motion speed is unchanged.
      if (now - lastTime < FRAME_MS - 1) return;
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth mouse lerp. MOUSE_LERP_FACTOR is the step per 60 Hz frame; scaling it by the elapsed
      // time keeps the follow speed the same under the 30 fps cap (or any frame rate).
      const mouseStep = 1 - Math.pow(1 - MOUSE_LERP_FACTOR, delta * 60);
      mouseCurrentRef.current.x = lerp(mouseCurrentRef.current.x, mouseTargetRef.current.x, mouseStep);
      mouseCurrentRef.current.y = lerp(mouseCurrentRef.current.y, mouseTargetRef.current.y, mouseStep);

      // Advance time
      time += delta;

      // Pass 1: Render Simplex Noise into FBO. The warp field drifts slowly (uWarpSpeed 0.12), so
      // refreshing it every other frame (~15 Hz) looks the same and halves that pass.
      if ((frameIndex++ & 1) === 0) {
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, res.noiseFramebuffer);
        ctx.viewport(0, 0, NOISE_FBO_SIZE, NOISE_FBO_SIZE);
        ctx.useProgram(res.noiseProgram);
        ctx.uniform1f(res.noiseTimeLoc, time);
        ctx.drawArrays(ctx.TRIANGLES, 0, 3);
        ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
      }

      // Pass 2: Render Main Fractal Glass to Screen
      ctx.viewport(0, 0, canvas.width, canvas.height);
      ctx.clear(ctx.COLOR_BUFFER_BIT);
      ctx.useProgram(res.mainProgram);
      ctx.uniform1f(res.mainTimeLoc, time);
      ctx.uniform2f(res.mouseLoc, mouseCurrentRef.current.x, mouseCurrentRef.current.y);
      ctx.drawArrays(ctx.TRIANGLES, 0, 3);
    };

    const start = () => {
      if (animationFrameId !== null || document.hidden || !isOnScreen || !res) return;
      // Reset the clock so the first frame after a pause does not jump (and is not skipped by the cap).
      lastTime = performance.now() - FRAME_MS;
      // Frame 0 always refreshes the noise FBO, which is empty after a context restore.
      frameIndex = 0;
      animationFrameId = requestAnimationFrame(animate);
    };

    const stop = () => {
      if (animationFrameId === null) return;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else if (isOnScreen) start();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Context loss (common on iOS after backgrounding): stop the loop and drop the dead handles.
    // preventDefault() opts in to `webglcontextrestored`, where everything is rebuilt. If the
    // rebuild fails, the canvas is removed so the caller's static gradient shows through.
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      stop();
      res = null;
    };
    const handleContextRestored = () => {
      res = initGL();
      if (!res) {
        if (mount.contains(canvas)) mount.removeChild(canvas);
        return;
      }
      setSize(mount.clientWidth, mount.clientHeight);
      start();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    // 9. Intersection Observer for Power Efficiency (no rAF at all while off-screen)
    // Observe the in-flow target, not `mount`: the Footer renders this inside a
    // `position: fixed` layer, which always intersects the viewport even while page
    // content covers it, so observing `mount` never paused the shader.
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isOnScreen = entry.isIntersecting;
          if (entry.isIntersecting) start();
          else stop();
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(targetRef?.current ?? mount);

    // 10. Cleanup & Resource Disposal
    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      // Detach first: loseContext() below would otherwise fire handleContextLost.
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        eventTarget.removeEventListener('mouseleave', handleMouseLeave);
      }

      if (res) deleteResources(res);
      loseContext?.loseContext();
      if (mount.contains(canvas)) {
        mount.removeChild(canvas);
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
