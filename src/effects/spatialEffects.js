import * as THREE from 'three';

/**
 * Crea un halo atmosférico GLSL alrededor del globo estilo showcase Art-Toy.
 * @param {number} globeRadius
 */
export function createAtmosphericHalo(globeRadius) {
  const geo = new THREE.SphereGeometry(globeRadius * 1.11, 64, 64);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColorInner: { value: new THREE.Color('#4CC4B9') },
      uColorOuter: { value: new THREE.Color('#38BDF8') }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPos;
      void main() {
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPos = -mvPos.xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColorInner;
      uniform vec3 uColorOuter;
      varying vec3 vNormal;
      varying vec3 vViewPos;
      void main() {
        vec3 viewDir = normalize(vViewPos);
        float rim = clamp(0.62 - dot(vNormal, viewDir), 0.0, 1.0);
        float pulse = 0.92 + 0.08 * sin(uTime * 1.4);
        float intensity = pow(rim, 2.6) * 0.65 * pulse;
        vec3 col = mix(uColorInner, uColorOuter, rim);
        gl_FragColor = vec4(col, intensity);
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    toneMapped: false
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.raycast = () => {};
  mesh.renderOrder = -2;
  return { mesh, material: mat };
}

/**
 * Sistema de partículas botánicas (polen luminoso) en 1 sola draw call con GLSL.
 * @param {number} count
 */
export function createBotanicalMotes(count = 130) {
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const sizes = new Float32Array(count);
  const colors = new Float32Array(count * 3);

  const palette = [
    new THREE.Color('#FCD34D'), // Polen cálido
    new THREE.Color('#9CCC3D'), // Verde brote
    new THREE.Color('#E0F2FE'), // Brisa celeste
    new THREE.Color('#F28BB2')  // Orquídea suave
  ];

  for (let i = 0; i < count; i++) {
    const radius = 4.2 + Math.random() * 4.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi) * 0.72;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    phases[i] = Math.random() * Math.PI * 2;
    sizes[i] = 14.0 + Math.random() * 20.0;

    const c = palette[i % palette.length];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) }
    },
    vertexShader: `
      attribute float aPhase;
      attribute float aSize;
      attribute vec3 aColor;
      uniform float uTime;
      uniform vec2 uPointer;
      uniform float uPixelRatio;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vColor = aColor;
        vec3 pos = position;
        pos.y += sin(uTime * 0.75 + aPhase) * 0.22;
        pos.x += cos(uTime * 0.52 + aPhase * 1.3) * 0.16 + uPointer.x * 0.35;
        pos.z += sin(uTime * 0.45 + aPhase * 0.7) * 0.16 - uPointer.y * 0.25;

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPos;
        gl_PointSize = aSize * uPixelRatio * (5.5 / max(-mvPos.z, 1.0));
        vAlpha = 0.45 + 0.35 * sin(uTime * 1.2 + aPhase);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float glow = smoothstep(0.5, 0.05, dist);
        gl_FragColor = vec4(vColor, glow * vAlpha * 0.75);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false
  });

  const points = new THREE.Points(geo, mat);
  points.raycast = () => {};
  return { points, material: mat };
}
