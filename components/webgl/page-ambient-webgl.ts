import * as THREE from "three";

export type PageAmbientVariant =
  | "architecture"
  | "network"
  | "pricing"
  | "features";

const VARIANT = {
  architecture: {
    particle: 0xa5b4fc,
    gridOpacity: 0.085,
    smokeBias: 0.45,
    diskScroll: 0.22,
  },
  network: {
    particle: 0x34d399,
    gridOpacity: 0.07,
    smokeBias: 0.3,
    diskScroll: 0.18,
  },
  pricing: {
    particle: 0xe4e4e7,
    gridOpacity: 0.055,
    smokeBias: 0.38,
    diskScroll: 0.12,
  },
  features: {
    particle: 0xc7d2fe,
    gridOpacity: 0.075,
    smokeBias: 0.35,
    diskScroll: 0.2,
  },
} as const;

/** Lighter ambient scene: same visual language as the home hero (disk + fog + grid + particles), tuned per page. */
export function initPageAmbientWebGL(
  canvas: HTMLCanvasElement,
  variant: PageAmbientVariant,
): () => void {
  const cfg = VARIANT[variant];

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050507, 0.017);

  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 1000);
  camera.position.set(0, 7, 19);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const bhUniforms: {
    uTime: { value: number };
    uScroll: { value: number };
  } = {
    uTime: { value: 0 },
    uScroll: { value: cfg.diskScroll },
  };

  const bhMaterial = new THREE.ShaderMaterial({
    uniforms: bhUniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uScroll;
      varying vec2 vUv;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                   mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 6; i++) {
          v += a * noise(p);
          p = rot * p * 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        float r = length(uv);
        float coreRadius = 0.18;
        float core = smoothstep(coreRadius + 0.02, coreRadius, r);
        float warpFactor = 0.12 / (r + 0.01);
        vec2 warpedUv = uv + normalize(uv) * warpFactor;
        float warpedR = length(warpedUv);
        float warpedAngle = atan(warpedUv.y, warpedUv.x);
        float swirlSpeed = uTime * 0.08;
        float swirl = warpedAngle - warpedR * 2.5 + swirlSpeed;
        vec2 noiseCoords = vec2(cos(swirl), sin(swirl)) * 1.8 - vec2(uTime * 0.02);
        float n1 = fbm(noiseCoords * 2.5);
        float n2 = fbm(noiseCoords * 5.0 + uTime * 0.04);
        float diskMask = smoothstep(0.9, coreRadius, r);
        float innerGlowMask = smoothstep(coreRadius + 0.3, coreRadius, r);
        float intensity = (n1 * 0.5 + 0.5) * diskMask;
        float highlight = (n2 * 0.5 + 0.5) * innerGlowMask * 2.0;
        vec3 deepSpace = vec3(0.01, 0.01, 0.02);
        vec3 darkViolet = vec3(0.12, 0.04, 0.25);
        vec3 plasmaBlue = vec3(0.2, 0.5, 0.9);
        vec3 coreWhite = vec3(0.9, 0.95, 1.0);
        vec3 color = mix(deepSpace, darkViolet, intensity * 1.5);
        color = mix(color, plasmaBlue, highlight * 0.9);
        color += coreWhite * pow(innerGlowMask, 4.0) * (0.3 + 0.7 * sin(swirlSpeed * 3.0 + warpedR * 15.0));
        color = mix(color, vec3(0.0), core);
        float alpha = (intensity + highlight) * diskMask;
        alpha = max(alpha, core);
        alpha *= smoothstep(1.0, 0.5, r);
        float scrollGlow = 1.0 + uScroll * 0.35;
        float pulse = 0.96 + 0.04 * sin(uTime * 0.45);
        gl_FragColor = vec4(color * scrollGlow * pulse, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    fog: false,
  });

  const bhGeo = new THREE.PlaneGeometry(140, 140);
  const bhMesh = new THREE.Mesh(bhGeo, bhMaterial);
  bhMesh.position.set(0, 10, -42);
  bhMesh.renderOrder = -2;
  scene.add(bhMesh);

  const smokeCanvas = document.createElement("canvas");
  smokeCanvas.width = 512;
  smokeCanvas.height = 512;
  const ctx = smokeCanvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.16)");
  gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.05)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  const smokeTex = new THREE.CanvasTexture(smokeCanvas);

  const smokePlanes: THREE.Mesh[] = [];
  const smokeGeo = new THREE.PlaneGeometry(80, 80);
  const smokeCount = 18;

  for (let i = 0; i < smokeCount; i++) {
    const color = new THREE.Color();
    const rand = Math.random();
    const bias = cfg.smokeBias;
    if (rand < bias) color.setHex(0x1a153a);
    else if (rand < 0.75) color.setHex(0x0f2040);
    else color.setHex(0x050508);

    const smokeMat = new THREE.MeshBasicMaterial({
      map: smokeTex,
      color,
      transparent: true,
      opacity: Math.random() * 0.45 + 0.08,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const plane = new THREE.Mesh(smokeGeo, smokeMat);
    plane.position.set(
      (Math.random() - 0.5) * 120,
      (Math.random() - 0.5) * 70 + 4,
      -8 - Math.random() * 24,
    );
    plane.rotation.z = Math.random() * Math.PI * 2;
    plane.userData = {
      rotSpeed: (Math.random() - 0.5) * 0.0018,
      driftX: (Math.random() - 0.5) * 0.012,
      driftY: (Math.random() - 0.5) * 0.008,
      baseOpacity: smokeMat.opacity,
      phaseOffset: Math.random() * Math.PI * 2,
      baseX: plane.position.x,
      baseY: plane.position.y,
    };
    plane.renderOrder = -1;
    scene.add(plane);
    smokePlanes.push(plane);
  }

  const gridUniforms = {
    uColor: { value: new THREE.Color(0xffffff) },
    uOpacity: { value: cfg.gridOpacity },
  };

  const gridMaterial = new THREE.ShaderMaterial({
    uniforms: gridUniforms,
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec3 vWorldPosition;
      void main() {
        vec2 coord = vWorldPosition.xz * 0.55;
        vec2 grid = abs(fract(coord - 0.5) - 0.5) / (fwidth(coord) * 1.6);
        float line = min(grid.x, grid.y);
        float alpha = max(0.0, 1.0 - line);
        float dist = length(vWorldPosition.xyz - cameraPosition);
        float fade = 1.0 - smoothstep(12.0, 70.0, dist);
        gl_FragColor = vec4(uColor, alpha * fade * uOpacity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    extensions: { derivatives: true },
  } as unknown as THREE.ShaderMaterialParameters);

  const gridPlaneGeo = new THREE.PlaneGeometry(200, 200);
  gridPlaneGeo.rotateX(-Math.PI / 2);
  const gridPlane = new THREE.Mesh(gridPlaneGeo, gridMaterial);
  gridPlane.position.y = -4;
  scene.add(gridPlane);

  const pGeo = new THREE.BufferGeometry();
  const pts: number[] = [];
  const vels: number[] = [];
  const pCount = 280;
  for (let i = 0; i < pCount; i++) {
    pts.push(
      (Math.random() - 0.5) * 130,
      (Math.random() - 0.5) * 75 + 4,
      (Math.random() - 0.5) * 90 - 12,
    );
    vels.push(Math.random() * 0.012 + 0.004);
  }
  pGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  pGeo.setAttribute("aSpeed", new THREE.Float32BufferAttribute(vels, 1));

  const pMat = new THREE.PointsMaterial({
    color: cfg.particle,
    size: 0.018,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glow = new THREE.Points(pGeo, pMat);
  scene.add(glow);

  const networkNodes: THREE.Mesh[] = [];
  let nodeSphereGeo: THREE.SphereGeometry | null = null;
  let nodeGroup: THREE.Group | null = null;
  if (variant === "network") {
    nodeGroup = new THREE.Group();
    nodeSphereGeo = new THREE.SphereGeometry(0.32, 14, 14);
    for (let i = 0; i < 12; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x34d399,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(nodeSphereGeo, mat);
      const a = (i / 12) * Math.PI * 2;
      mesh.position.set(
        Math.cos(a) * 14,
        Math.sin(a * 2.1) * 3 + 3,
        Math.sin(a) * 10 - 28,
      );
      mesh.userData.phase = i * 0.4;
      nodeGroup.add(mesh);
      networkNodes.push(mesh);
    }
    scene.add(nodeGroup);
  }

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const onMouseMove = (e: MouseEvent) => {
    targetX = e.clientX / window.innerWidth - 0.5;
    targetY = e.clientY / window.innerHeight - 0.5;
  };
  window.addEventListener("mousemove", onMouseMove);

  const resize = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || 400;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(w, h, false);
  };
  resize();
  window.addEventListener("resize", resize);

  const timer = new THREE.Timer();
  timer.connect(document);
  let raf = 0;

  function animate(timestamp?: number) {
    raf = requestAnimationFrame(animate);
    timer.update(timestamp);
    if (document.visibilityState === "hidden") {
      return;
    }
    const elapsed = timer.getElapsed();
    bhUniforms.uTime.value = elapsed;
    const breathe =
      cfg.diskScroll + Math.sin(elapsed * 0.35) * 0.04 + Math.cos(elapsed * 0.11) * 0.02;
    bhUniforms.uScroll.value = breathe;

    mouseX += (targetX - mouseX) * 0.06;
    mouseY += (targetY - mouseY) * 0.06;

    camera.position.x += (mouseX * 5 - camera.position.x) * 0.04;
    camera.position.y += (7 + mouseY * 3 - camera.position.y) * 0.04;
    camera.position.z += (19 + mouseY * -1.5 - camera.position.z) * 0.03;
    camera.lookAt(0, 4, -32);
    bhMesh.lookAt(camera.position);

    gridPlane.position.x = camera.position.x;
    gridPlane.position.z = camera.position.z;

    const sceneMouseX = mouseX * 70;
    const sceneMouseY = -mouseY * 45 + 8;
    smokePlanes.forEach((plane) => {
      plane.userData.baseX += plane.userData.driftX;
      plane.userData.baseY += plane.userData.driftY;
      const dx = plane.position.x - sceneMouseX;
      const dy = plane.position.y - sceneMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let repelX = 0;
      let repelY = 0;
      if (dist < 28 && dist > 0.001) {
        const force = (28 - dist) / 28;
        repelX = (dx / dist) * force * 4;
        repelY = (dy / dist) * force * 4;
        plane.rotation.z += force * 0.008;
      }
      plane.position.x += (plane.userData.baseX + repelX - plane.position.x) * 0.045;
      plane.position.y += (plane.userData.baseY + repelY - plane.position.y) * 0.045;
      plane.rotation.z += plane.userData.rotSpeed;
      const wave = Math.sin(
        plane.position.x * 0.018 + elapsed * 0.28 + plane.userData.phaseOffset,
      );
      (plane.material as THREE.MeshBasicMaterial).opacity =
        plane.userData.baseOpacity + wave * 0.08;
      if (plane.userData.baseX > 60) plane.userData.baseX = -60;
      if (plane.userData.baseX < -60) plane.userData.baseX = 60;
      if (plane.userData.baseY > 45) plane.userData.baseY = -8;
      if (plane.userData.baseY < -8) plane.userData.baseY = 45;
    });

    const positions = glow.geometry.attributes.position.array as Float32Array;
    const speeds = glow.geometry.attributes.aSpeed.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      const px = positions[i];
      const py = positions[i + 1];
      const pz = positions[i + 2];
      const dx = bhMesh.position.x - px;
      const dy = bhMesh.position.y - py;
      const dz = bhMesh.position.z - pz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
      const si = i / 3;
      const speed = speeds[si] * 1.15;
      positions[i] += (dx / dist) * speed;
      positions[i + 1] += (dy / dist) * speed;
      positions[i + 2] += (dz / dist) * speed;
      positions[i] -= (dz / dist) * speed * 1.6;
      positions[i + 2] += (dx / dist) * speed * 1.6;
      if (dist < 4 || dist > 160) {
        const angle = Math.random() * Math.PI * 2;
        const r = 85 + Math.random() * 55;
        positions[i] = Math.cos(angle) * r;
        positions[i + 1] = bhMesh.position.y + (Math.random() - 0.5) * 55;
        positions[i + 2] = bhMesh.position.z + Math.sin(angle) * r;
      }
    }
    glow.geometry.attributes.position.needsUpdate = true;

    if (nodeGroup) {
      nodeGroup.rotation.y = elapsed * 0.12;
      networkNodes.forEach((m) => {
        const s = 1 + Math.sin(elapsed * 2 + m.userData.phase) * 0.12;
        m.scale.setScalar(s);
      });
    }

    renderer.render(scene, camera);
  }
  animate();

  return () => {
    cancelAnimationFrame(raf);
    timer.disconnect();
    timer.dispose();
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("resize", resize);
    renderer.dispose();
    bhGeo.dispose();
    bhMaterial.dispose();
    smokeGeo.dispose();
    smokeTex.dispose();
    for (const p of smokePlanes) {
      (p.material as THREE.MeshBasicMaterial).dispose();
    }
    gridPlaneGeo.dispose();
    gridMaterial.dispose();
    pGeo.dispose();
    pMat.dispose();
    if (nodeSphereGeo) nodeSphereGeo.dispose();
    networkNodes.forEach((m) => (m.material as THREE.MeshBasicMaterial).dispose());
  };
}
