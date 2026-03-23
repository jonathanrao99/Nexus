import * as THREE from "three";

/**
 * Initializes the hero WebGL scene. Call after HOME_BODY_HTML is mounted.
 * Returns a dispose function for route changes / unmount.
 */
export function initHeroWebGL(): () => void {
  const canvas = document.getElementById("hero3D") as HTMLCanvasElement | null;
  if (!canvas) return () => {};

  const scene = new THREE.Scene();
          // Richer, deeper fog for better cinematic immersion
          scene.fog = new THREE.FogExp2(0x050507, 0.015);
  
          const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
          camera.position.set(0, 8, 20);
  
          const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          });
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          renderer.setSize(window.innerWidth, window.innerHeight);
  
          /* ==========================================
             IMPROVED CINEMATIC BLACK HOLE
             ========================================== */
          const bhUniforms = {
            uTime: { value: 0 },
            uScroll: { value: 0 }
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
  
                // Absolute Event Horizon
                float coreRadius = 0.18;
                float core = smoothstep(coreRadius + 0.02, coreRadius, r);
  
                // Extreme Gravitational Lensing
                float warpFactor = 0.12 / (r + 0.01);
                vec2 warpedUv = uv + normalize(uv) * warpFactor;
                float warpedR = length(warpedUv);
                float warpedAngle = atan(warpedUv.y, warpedUv.x);
  
                float swirlSpeed = uTime * 0.08;
                float swirl = warpedAngle - warpedR * 2.5 + swirlSpeed;
  
                // High-Definition Accretion Disk
                vec2 noiseCoords = vec2(cos(swirl), sin(swirl)) * 1.8 - vec2(uTime * 0.02);
                float n1 = fbm(noiseCoords * 2.5);
                float n2 = fbm(noiseCoords * 5.0 + uTime * 0.04);
  
                float diskMask = smoothstep(0.9, coreRadius, r);
                float innerGlowMask = smoothstep(coreRadius + 0.3, coreRadius, r);
  
                float intensity = (n1 * 0.5 + 0.5) * diskMask;
                float highlight = (n2 * 0.5 + 0.5) * innerGlowMask * 2.0;
  
                // Cinematic Deep Indigo & Violet Palette
                vec3 deepSpace = vec3(0.01, 0.01, 0.02);
                vec3 darkViolet = vec3(0.12, 0.04, 0.25);
                vec3 plasmaBlue = vec3(0.2, 0.5, 0.9);
                vec3 coreWhite = vec3(0.9, 0.95, 1.0);
  
                vec3 color = mix(deepSpace, darkViolet, intensity * 1.5);
                color = mix(color, plasmaBlue, highlight * 0.9);
                color += coreWhite * pow(innerGlowMask, 4.0) * (0.3 + 0.7 * sin(swirlSpeed * 3.0 + warpedR * 15.0));
  
                // Pitch black core override
                color = mix(color, vec3(0.0), core);
  
                float alpha = (intensity + highlight) * diskMask;
                alpha = max(alpha, core);
                alpha *= smoothstep(1.0, 0.5, r); // Smoother fade at edges
  
                // Glow amplifies as we scroll closer
                float scrollGlow = 1.0 + uScroll * 0.4;
                float pulse = 0.95 + 0.05 * sin(uTime * 0.5);
  
                gl_FragColor = vec4(color * scrollGlow * pulse, alpha);
              }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending,
            fog: false
          });
  
          // Massive scale, pushed lower and further back for cinematic depth
          const bhGeo = new THREE.PlaneGeometry(180, 180);
          const bhMesh = new THREE.Mesh(bhGeo, bhMaterial);
          bhMesh.position.set(0, 12, -45); 
          bhMesh.renderOrder = -2;
          scene.add(bhMesh);
  
          /* ==========================================
             INTERACTIVE VOLUMETRIC FOG
             ========================================== */
          const smokeCanvas = document.createElement('canvas');
          smokeCanvas.width = 512;
          smokeCanvas.height = 512;
        const ctx = smokeCanvas.getContext("2d")!;
        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
          gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.05)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 512, 512);
          const smokeTex = new THREE.CanvasTexture(smokeCanvas);
  
          const smokePlanes: THREE.Mesh[] = [];
          const smokeGeo = new THREE.PlaneGeometry(100, 100);
  
          for (let i = 0; i < 28; i++) {
            const color = new THREE.Color();
            const rand = Math.random();
            if(rand < 0.4) color.setHex(0x1a153a);      // violet plasma
            else if(rand < 0.7) color.setHex(0x0f2040); // deep ocean blue
            else color.setHex(0x050508);                // pitch shadow
  
            const smokeMat = new THREE.MeshBasicMaterial({
                map: smokeTex,
                color: color,
                transparent: true,
                opacity: Math.random() * 0.5 + 0.1,
                depthWrite: false,
                blending: THREE.NormalBlending
            });
  
            const plane = new THREE.Mesh(smokeGeo, smokeMat);
            plane.position.set(
                (Math.random() - 0.5) * 140,
                (Math.random() - 0.5) * 80 + 5,
                -10 - Math.random() * 30
            );
            plane.rotation.z = Math.random() * Math.PI * 2;
            // Store base behaviors
            plane.userData = {
                rotSpeed: (Math.random() - 0.5) * 0.002,
                driftX: (Math.random() - 0.5) * 0.015,
                driftY: (Math.random() - 0.5) * 0.01,
                baseOpacity: smokeMat.opacity,
                phaseOffset: Math.random() * Math.PI * 2,
                baseX: plane.position.x,
                baseY: plane.position.y
            };
            plane.renderOrder = -1;
            scene.add(plane);
            smokePlanes.push(plane);
          }
  
          /* ==========================================
             HORIZON GRID
             ========================================== */
          const gridUniforms = {
            uColor: { value: new THREE.Color(0xffffff) },
            uOpacity: { value: 0.0 }
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
  
          const planeGeo = new THREE.PlaneGeometry(240, 240);
          planeGeo.rotateX(-Math.PI / 2);
          const gridPlane = new THREE.Mesh(planeGeo, gridMaterial);
          gridPlane.position.y = -4;
          scene.add(gridPlane);
  
          /* ==========================================
             PARTICLE FIELD
             ========================================== */
          const pGeo = new THREE.BufferGeometry();
          const pts = [];
          const vels =[];
          for (let i = 0; i < 384; i++) {
            pts.push((Math.random()-.5)*150, (Math.random()-.5)*80 + 5, (Math.random()-.5)*100 - 15);
            vels.push(Math.random() * 0.015 + 0.005);
          }
          pGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
          pGeo.setAttribute("aSpeed", new THREE.Float32BufferAttribute(vels, 1));
  
          const pMat = new THREE.PointsMaterial({
            color: 0xc7d2fe, // brighter violet-white
            size: 0.02,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
            depthWrite: false
          });
          const glow = new THREE.Points(pGeo, pMat);
          scene.add(glow);
  
          /* ==========================================
             INTERACTION & PARALLAX
             ========================================== */
          let mouseX = 0, mouseY = 0;
          let targetX = 0, targetY = 0;
  
          const onMouseMove = (e: MouseEvent) => {
            targetX = e.clientX / window.innerWidth - 0.5;
            targetY = e.clientY / window.innerHeight - 0.5;
          };
          window.addEventListener("mousemove", onMouseMove);
  
          let scrollP = 0, targetScrollP = 0;
          const heroTrack = document.getElementById("hero-track");
          
          const onScroll = () => {
            if (heroTrack) {
              const rect = heroTrack.getBoundingClientRect();
              const maxScroll = rect.height - window.innerHeight;
              const progress = -rect.top / maxScroll;
              targetScrollP = Math.min(1, Math.max(0, progress));
            } else {
              targetScrollP = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
            }
          };
          window.addEventListener("scroll", onScroll, { passive: true });
  
          const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            renderer.setSize(window.innerWidth, window.innerHeight);
          };
          window.addEventListener("resize", onResize);
  
          const timer = new THREE.Timer();
          timer.connect(document);
          const heroContents = document.querySelectorAll('.hero-content');
  
          let raf = 0;
          function animate(timestamp?: number) {
            raf = requestAnimationFrame(animate);
            timer.update(timestamp);
            if (document.visibilityState === "hidden") {
              return;
            }
  
            const elapsed = timer.getElapsed();
            bhUniforms.uTime.value = elapsed;
            
            // Smooth mouse interpolation
            mouseX += (targetX - mouseX) * 0.05;
            mouseY += (targetY - mouseY) * 0.05;
  
            // Fade grid out as we fly in
            const targetGridOpacity = 0.06 * (1.0 - scrollP);
            gridMaterial.uniforms.uOpacity.value += (targetGridOpacity - gridMaterial.uniforms.uOpacity.value) * 0.05;
  
            scrollP += (targetScrollP - scrollP) * 0.04;
            bhUniforms.uScroll.value = scrollP;
  
            /* --- Cinematic Camera Dive --- */
            // Pushes the camera deep into the Z axis towards the black hole
            const baseZ = 20 - scrollP * 65; 
            const baseY = 8 - scrollP * 6;
            const baseX = scrollP * 2;
  
            camera.position.z += (baseZ - camera.position.z) * 0.06;
            camera.position.y += ((baseY - mouseY * 2.0) - camera.position.y) * 0.06;
            camera.position.x += ((baseX + mouseX * 3.0) - camera.position.x) * 0.06;
  
            // Warp FOV for "lightspeed" effect
            const targetFov = 60 + scrollP * 45; 
            camera.fov += (targetFov - camera.fov) * 0.06;
            camera.updateProjectionMatrix();
  
            // Camera looks dynamically based on mouse and scroll
            camera.lookAt(
              mouseX * 4.0, 
              bhMesh.position.y - 4 + scrollP * 12, 
              -20 - scrollP * 30
            );
  
            gridPlane.position.x = camera.position.x;
            gridPlane.position.z = camera.position.z;
            
            bhMesh.lookAt(camera.position);
  
            /* --- Update HTML Content Scaling and Fading --- */
            heroContents.forEach((el) => {
              const node = el as HTMLElement;
              const scale = 1 + scrollP * 1.5;
              const opacity = 1 - scrollP * 2.5; // Fades out quicker to clear the view
              node.style.transform = `scale(${scale}) translateY(${scrollP * -80}px)`;
              node.style.opacity = String(Math.max(0, opacity));
              node.style.pointerEvents = opacity <= 0 ? "none" : "auto";
            });
  
            /* --- Interactive Volumetric Fog --- */
            // Map mouse roughly to scene coordinates
            const sceneMouseX = mouseX * 80;
            const sceneMouseY = -mouseY * 50 + 10;
  
            smokePlanes.forEach((plane) => {
              // Drift logic
              plane.userData.baseX += plane.userData.driftX;
              plane.userData.baseY += plane.userData.driftY;
  
              // Interactive logic: Fog repels subtly from the cursor
              const dx = plane.position.x - sceneMouseX;
              const dy = plane.position.y - sceneMouseY;
              const dist = Math.sqrt(dx*dx + dy*dy);
              
              let repelX = 0, repelY = 0;
              if(dist < 30) {
                const force = (30 - dist) / 30;
                repelX = (dx/dist) * force * 5;
                repelY = (dy/dist) * force * 5;
                plane.rotation.z += force * 0.01; // swirling reaction
              }
  
              // Spring back to base position
              plane.position.x += ((plane.userData.baseX + repelX) - plane.position.x) * 0.05;
              plane.position.y += ((plane.userData.baseY + repelY) - plane.position.y) * 0.05;
              plane.rotation.z += plane.userData.rotSpeed;
  
              // Opacity pulses
              const wave = Math.sin(plane.position.x * 0.02 + elapsed * 0.3 + plane.userData.phaseOffset);
              (plane.material as THREE.MeshBasicMaterial).opacity =
                plane.userData.baseOpacity + wave * 0.1;
  
              // Gentle bounds wrapping
              if(plane.userData.baseX > 70) plane.userData.baseX = -70;
              if(plane.userData.baseX < -70) plane.userData.baseX = 70;
              if(plane.userData.baseY > 50) plane.userData.baseY = -10;
              if(plane.userData.baseY < -10) plane.userData.baseY = 50;
            });
  
            /* --- Update Particle Flow Field --- */
            const positions = glow.geometry.attributes.position
              .array as Float32Array;
            const speeds = glow.geometry.attributes.aSpeed.array as Float32Array;

            for (let i = 0; i < positions.length; i += 3) {
              const px = positions[i];
              const py = positions[i+1];
              const pz = positions[i+2];
  
              const dx = bhMesh.position.x - px;
              const dy = bhMesh.position.y - py;
              const dz = bhMesh.position.z - pz;
              const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
  
              const si = i / 3;
              const speed = speeds[si] * (1.0 + scrollP * 4.0);
  
              // Pull towards core
              positions[i] += (dx/dist) * speed;
              positions[i+1] += (dy/dist) * speed;
              positions[i+2] += (dz/dist) * speed;
  
              // Tangential Swirl (Orbiting behavior)
              positions[i] -= (dz/dist) * speed * 2.0;
              positions[i+2] += (dx/dist) * speed * 2.0;
  
              if(dist < 5.0 || dist > 180.0) {
                const angle = Math.random() * Math.PI * 2;
                const r = 90 + Math.random() * 60;
                positions[i] = Math.cos(angle) * r;
                positions[i+1] = bhMesh.position.y + (Math.random() - 0.5) * 60;
                positions[i+2] = bhMesh.position.z + Math.sin(angle) * r;
              }
            }
            glow.geometry.attributes.position.needsUpdate = true;
  
            renderer.render(scene, camera);
          }

          animate();

          return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            timer.disconnect();
            timer.dispose();
            renderer.dispose();
            bhGeo.dispose();
            bhMaterial.dispose();
            smokeGeo.dispose();
            smokeTex.dispose();
            for (const p of smokePlanes) {
              (p.material as THREE.MeshBasicMaterial).dispose();
            }
            gridPlane.geometry.dispose();
            gridMaterial.dispose();
            pGeo.dispose();
            pMat.dispose();
          };
}
