/**
 * FloraSense Smart Greenhouse - BioGlass AgTech
 * Enhanced Interactive Web Application Scripts with 3D Model Loading & SVG UI Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollAnimations();
  init3DModelViewer();
  initVideoPlayer();
  initCarousels();
  initComparisonSlider();
  initLightbox();
  initTelemetrySimulator();
  initDemoModal();
  initMobileNav();
  initSmoothScroll();
});

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  document.documentElement.classList.add('js-ready');

  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale, .reveal-fade');
  if (!revealElements.length) return;

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.05
  });

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/* ==========================================================================
   0. THEME TOGGLE (LIGHT & DARK THEMES)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle-btn');

  function getActiveTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    updateThemeAria(theme);
  }

  function updateThemeAria(theme) {
    const isDark = theme === 'dark';
    const label = isDark ? 'Включить светлую тему' : 'Включить темную тему';
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', label);
      themeToggleBtn.setAttribute('title', label);
    }
    if (mobileThemeToggleBtn) {
      mobileThemeToggleBtn.setAttribute('aria-label', label);
      const textSpan = mobileThemeToggleBtn.querySelector('.theme-mode-text');
      if (textSpan) {
        textSpan.textContent = isDark ? 'Темная' : 'Светлая';
      }
    }
  }

  function toggleTheme() {
    const currentTheme = getActiveTheme();
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  if (mobileThemeToggleBtn) {
    mobileThemeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Set initial aria labels based on current theme
  updateThemeAria(getActiveTheme());

  // Listen for OS scheme changes if user hasn't set an explicit preference
  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  } catch (e) {}
}

/* ==========================================================================
   1. THREE.JS 3D MODEL VIEWER (GLTFLoader + OrbitControls + File Picker)
   ========================================================================== */
function init3DModelViewer() {
  const container = document.getElementById('threejs-canvas-container');
  const loadingOverlay = document.getElementById('model-loading-overlay');
  const progressBar = document.getElementById('model-progress-bar');
  const progressText = document.getElementById('model-progress-text');
  const fileInput = document.getElementById('model-file-input');
  const loadPrompt = document.getElementById('model-local-prompt');
  
  const autoRotateBtn = document.getElementById('btn-auto-rotate');
  const resetCamBtn = document.getElementById('btn-reset-cam');
  const fullscreenBtn = document.getElementById('btn-fullscreen-3d');
  const wireframeBtn = document.getElementById('btn-wireframe-3d');
  const gridBtn = document.getElementById('btn-grid-3d');
  const lightDayBtn = document.getElementById('btn-light-day');
  const lightGrowBtn = document.getElementById('btn-light-grow');
  const lightNightBtn = document.getElementById('btn-light-night');

  if (!container) return;

  // Scene, Camera, Renderer setup
  const scene = new THREE.Scene();
  scene.background = null;

  const width = container.clientWidth || 800;
  const height = container.clientHeight || 580;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
  camera.position.set(24, 18, 30);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // OrbitControls
  let controls;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 2;
    controls.maxDistance = 180;
    controls.target.set(0, 3, 0);
  }

  // Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(25, 45, 25);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  scene.add(dirLight);

  const growLight = new THREE.PointLight(0xd946ef, 0, 80);
  growLight.position.set(0, 15, 0);
  scene.add(growLight);

  const cyanFill = new THREE.PointLight(0x06b6d4, 0.9, 70);
  cyanFill.position.set(-18, 12, -18);
  scene.add(cyanFill);

  const emeraldFill = new THREE.PointLight(0x10b981, 1.3, 70);
  emeraldFill.position.set(18, 10, -12);
  scene.add(emeraldFill);

  // Ground Grid Helper
  const gridHelper = new THREE.GridHelper(60, 60, 0x10b981, 0x1e293b);
  gridHelper.position.y = -0.01;
  scene.add(gridHelper);

  let loadedModel = null;
  let isWireframe = false;
  let isGridVisible = true;
  let isAutoRotate = true;
  let defaultCameraPos = new THREE.Vector3(24, 18, 30);
  let defaultTarget = new THREE.Vector3(0, 3, 0);

  // Function to process loaded GLTF / GLB model
  function applyModelToScene(gltfScene) {
    if (loadedModel) {
      scene.remove(loadedModel);
    }

    loadedModel = gltfScene;

    // Compute Bounding Box
    const box = new THREE.Box3().setFromObject(loadedModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    loadedModel.position.x -= center.x;
    loadedModel.position.y -= box.min.y; // Align bottom with ground plane y = 0
    loadedModel.position.z -= center.z;

    const maxDim = Math.max(size.x, size.y, size.z);

    // Enhance materials and shadows
    loadedModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.side = THREE.DoubleSide;
          // If glass material or transparent name
          const matName = (child.material.name || '').toLowerCase();
          if (matName.includes('glass') || matName.includes('стекло') || child.material.opacity < 1) {
            child.material.transparent = true;
            child.material.opacity = 0.35;
            child.material.roughness = 0.1;
            child.material.metalness = 0.1;
          } else {
            child.material.roughness = Math.min(child.material.roughness || 0.5, 0.7);
          }
        }
      }
    });

    scene.add(loadedModel);

    // Optimal Camera Distance Calculation
    const fov = camera.fov * (Math.PI / 180);
    let distance = Math.abs(maxDim / Math.sin(fov / 2)) * 0.75;
    if (distance < 12) distance = 28;

    defaultCameraPos.set(distance * 0.75, distance * 0.55, distance * 0.85);
    defaultTarget.set(0, size.y * 0.35, 0);

    camera.position.copy(defaultCameraPos);
    if (controls) {
      controls.target.copy(defaultTarget);
      controls.update();
    }

    // Hide Loading Overlay
    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 350);
    }

    // Hide local prompt if open
    if (loadPrompt) loadPrompt.classList.add('hidden');
  }

  // Load GLTF / GLB from URL
  function loadModelFromUrl(url) {
    if (typeof THREE.GLTFLoader === 'undefined') {
      buildProceduralFallback();
      return;
    }

    const loader = new THREE.GLTFLoader();

    loader.load(
      encodeURI(url),
      (gltf) => {
        applyModelToScene(gltf.scene);
      },
      (xhr) => {
        if (xhr.lengthComputable && xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          if (progressBar) progressBar.style.width = percent + '%';
          if (progressText) progressText.innerText = `Загрузка 3D модели (${percent}%) • Мой первый 3D.glb`;
        } else {
          if (progressText) progressText.innerText = `Чтение 3D геометрии (26 МБ)...`;
        }
      },
      (error) => {
        console.warn('GLTFLoader fetch warning (file:// security or network):', error);
        if (loadPrompt) {
          loadPrompt.classList.remove('hidden');
        }
        buildProceduralFallback();
      }
    );
  }

  // Start initial auto-load
  loadModelFromUrl('3D Модель/Мой первый 3D.glb');

  // File Picker / Drag and Drop Support for 100% reliable local file:// execution
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.opacity = '1';
        if (progressText) progressText.innerText = `Обработка файла ${file.name}...`;
        if (progressBar) progressBar.style.width = '70%';
      }

      const fileUrl = URL.createObjectURL(file);
      const loader = new THREE.GLTFLoader();
      loader.load(
        fileUrl,
        (gltf) => {
          applyModelToScene(gltf.scene);
        },
        undefined,
        (err) => {
          console.error('File load error:', err);
          alert('Ошибка чтения 3D файла. Пожалуйста, убедитесь, что выбран файл формата .glb');
          if (loadingOverlay) loadingOverlay.style.display = 'none';
        }
      );
    });
  }

  // Drag & drop on canvas
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  container.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
        const fileUrl = URL.createObjectURL(file);
        const loader = new THREE.GLTFLoader();
        loader.load(fileUrl, (gltf) => applyModelToScene(gltf.scene));
      }
    }
  });

  // Procedural Model Fallback
  function buildProceduralFallback() {
    const greenhouseGroup = new THREE.Group();
    
    // Foundation
    const baseGeo = new THREE.BoxGeometry(22, 0.8, 30);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.4;
    greenhouseGroup.add(baseMesh);

    // Frame Pillars
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x4edea3,
      transparent: true,
      opacity: 0.25,
      roughness: 0.1,
      transmission: 0.85,
      thickness: 0.4
    });

    const colGeo = new THREE.BoxGeometry(0.35, 7, 0.35);
    for (let x of [-10, 10]) {
      for (let z = -12; z <= 12; z += 6) {
        const col = new THREE.Mesh(colGeo, frameMat);
        col.position.set(x, 4.3, z);
        greenhouseGroup.add(col);
      }
    }

    // Glass Walls
    const wallLong = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7, 24), glassMat);
    wallLong.position.set(-10, 4.3, 0);
    greenhouseGroup.add(wallLong);
    const wallLongR = wallLong.clone();
    wallLongR.position.x = 10;
    greenhouseGroup.add(wallLongR);

    // Arched Roof
    const roofLeft = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.1, 24.2), glassMat);
    roofLeft.position.set(-5, 10, 0);
    roofLeft.rotation.z = Math.PI / 7;
    greenhouseGroup.add(roofLeft);

    const roofRight = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.1, 24.2), glassMat);
    roofRight.position.set(5, 10, 0);
    roofRight.rotation.z = -Math.PI / 7;
    greenhouseGroup.add(roofRight);

    // Hydroponic racks with crops
    const plantMat = new THREE.MeshLambertMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 0.5 });
    for (let z of [-8, -3, 2, 7]) {
      for (let x of [-6, 6]) {
        for (let y of [2, 4]) {
          const rack = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, 3.2), baseMat);
          rack.position.set(x, y, z);
          greenhouseGroup.add(rack);

          for (let px of [-0.9, 0.9]) {
            for (let pz of [-0.9, 0.9]) {
              const plant = new THREE.Mesh(new THREE.SphereGeometry(0.48, 8, 8), plantMat);
              plant.position.set(x + px, y + 0.55, z + pz);
              greenhouseGroup.add(plant);
            }
          }
        }
      }
    }

    loadedModel = greenhouseGroup;
    scene.add(greenhouseGroup);

    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => { loadingOverlay.style.display = 'none'; }, 400);
    }
  }

  // Preset Views Handler
  window.set3DView = function(viewName) {
    if (!controls) return;
    const duration = 900;
    let targetPos = new THREE.Vector3();
    let targetLook = defaultTarget.clone();

    switch(viewName) {
      case 'iso':
        targetPos.set(defaultCameraPos.x, defaultCameraPos.y, defaultCameraPos.z);
        break;
      case 'top':
        targetPos.set(0, defaultCameraPos.y * 2.2, 0.1);
        break;
      case 'front':
        targetPos.set(0, defaultCameraPos.y * 0.6, defaultCameraPos.z * 1.3);
        break;
      case 'inside':
        targetPos.set(0, 4, 10);
        targetLook.set(0, 4, -10);
        break;
      case 'reset':
      default:
        targetPos.copy(defaultCameraPos);
        targetLook.copy(defaultTarget);
        break;
    }

    animateCamera(targetPos, targetLook, duration);
  };

  function animateCamera(newPos, newTarget, duration) {
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const startTime = performance.now();

    function step() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2;

      camera.position.lerpVectors(startPos, newPos, ease);
      controls.target.lerpVectors(startTarget, newTarget, ease);
      controls.update();

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    step();
  }

  // Auto-rotate toggle
  if (autoRotateBtn) {
    autoRotateBtn.addEventListener('click', () => {
      isAutoRotate = !isAutoRotate;
      autoRotateBtn.classList.toggle('text-primary', isAutoRotate);
      autoRotateBtn.classList.toggle('border-primary/50', isAutoRotate);
    });
  }

  // Reset Camera Button
  if (resetCamBtn) {
    resetCamBtn.addEventListener('click', () => {
      window.set3DView('reset');
    });
  }

  // Wireframe Toggle
  if (wireframeBtn) {
    wireframeBtn.addEventListener('click', () => {
      isWireframe = !isWireframe;
      wireframeBtn.classList.toggle('text-primary', isWireframe);
      wireframeBtn.classList.toggle('border-primary/50', isWireframe);
      if (loadedModel) {
        loadedModel.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.wireframe = isWireframe;
          }
        });
      }
    });
  }

  // Grid Helper Toggle
  if (gridBtn) {
    gridBtn.addEventListener('click', () => {
      isGridVisible = !isGridVisible;
      gridHelper.visible = isGridVisible;
      gridBtn.classList.toggle('text-primary', isGridVisible);
      gridBtn.classList.toggle('border-primary/50', isGridVisible);
    });
  }

  // Lighting Mode Toggles
  function setLightingMode(mode) {
    [lightDayBtn, lightGrowBtn, lightNightBtn].forEach(btn => {
      if (btn) btn.classList.remove('bg-primary/20', 'text-primary', 'border-primary/50');
    });

    if (mode === 'day') {
      if (lightDayBtn) lightDayBtn.classList.add('bg-primary/20', 'text-primary', 'border-primary/50');
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 0.95;
      dirLight.color.setHex(0xffffff);
      dirLight.intensity = 1.5;
      growLight.intensity = 0;
    } else if (mode === 'grow') {
      if (lightGrowBtn) lightGrowBtn.classList.add('bg-primary/20', 'text-primary', 'border-primary/50');
      ambientLight.color.setHex(0xa855f7);
      ambientLight.intensity = 0.6;
      dirLight.color.setHex(0xec4899);
      dirLight.intensity = 1.2;
      growLight.intensity = 3.0;
    } else if (mode === 'night') {
      if (lightNightBtn) lightNightBtn.classList.add('bg-primary/20', 'text-primary', 'border-primary/50');
      ambientLight.color.setHex(0x1e293b);
      ambientLight.intensity = 0.3;
      dirLight.color.setHex(0x38bdf8);
      dirLight.intensity = 0.5;
      growLight.intensity = 0.9;
    }
  }

  if (lightDayBtn) lightDayBtn.addEventListener('click', () => setLightingMode('day'));
  if (lightGrowBtn) lightGrowBtn.addEventListener('click', () => setLightingMode('grow'));
  if (lightNightBtn) lightNightBtn.addEventListener('click', () => setLightingMode('night'));

  // Fullscreen 3D Viewport
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      const card = document.getElementById('model-3d-card');
      if (!card) return;
      if (!document.fullscreenElement) {
        card.requestFullscreen().catch(err => console.log(err));
      } else {
        document.exitFullscreen();
      }
    });
  }

  // Resize Listener
  window.addEventListener('resize', () => {
    const newW = container.clientWidth || window.innerWidth;
    const newH = container.clientHeight || 580;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  });

  // Render Loop
  function animate() {
    requestAnimationFrame(animate);

    if (controls) {
      controls.autoRotate = isAutoRotate;
      controls.autoRotateSpeed = 1.2;
      controls.update();
    } else if (loadedModel && isAutoRotate) {
      loadedModel.rotation.y += 0.004;
    }

    renderer.render(scene, camera);
  }
  animate();
}

/* ==========================================================================
   2. CUSTOM GLASSMORPHIC VIDEO PLAYER
   ========================================================================== */
function initVideoPlayer() {
  const video = document.getElementById('main-video');
  const playBtn = document.getElementById('video-play-btn');
  const playIcon = document.getElementById('video-play-icon');
  const centerPlayOverlay = document.getElementById('video-center-play');
  const progressBar = document.getElementById('video-progress');
  const progressFilled = document.getElementById('video-progress-filled');
  const timeDisplay = document.getElementById('video-time');
  const volumeBtn = document.getElementById('video-volume-btn');
  const volumeIcon = document.getElementById('video-volume-icon');
  const volumeSlider = document.getElementById('video-volume-slider');
  const speedBtn = document.getElementById('video-speed-btn');
  const pipBtn = document.getElementById('video-pip-btn');
  const fullscreenBtn = document.getElementById('video-fullscreen-btn');
  const playerContainer = document.getElementById('video-player-container');
  const chapterBtns = document.querySelectorAll('.video-chapter-btn');

  if (!video) return;

  function togglePlay() {
    if (video.paused || video.ended) {
      video.play();
    } else {
      video.pause();
    }
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (centerPlayOverlay) centerPlayOverlay.addEventListener('click', togglePlay);

  video.addEventListener('play', () => {
    if (playIcon) {
      playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    }
    if (centerPlayOverlay) centerPlayOverlay.classList.add('opacity-0', 'pointer-events-none');
  });

  video.addEventListener('pause', () => {
    if (playIcon) {
      playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
    if (centerPlayOverlay) centerPlayOverlay.classList.remove('opacity-0', 'pointer-events-none');
  });

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  video.addEventListener('timeupdate', () => {
    if (video.duration) {
      const percent = (video.currentTime / video.duration) * 100;
      if (progressFilled) progressFilled.style.width = `${percent}%`;
      if (timeDisplay) timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    }
  });

  video.addEventListener('loadedmetadata', () => {
    if (timeDisplay) timeDisplay.textContent = `00:00 / ${formatTime(video.duration)}`;
  });

  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * video.duration;
    });
  }

  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      updateVolumeIcon();
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      video.volume = e.target.value;
      video.muted = (video.volume === 0);
      updateVolumeIcon();
    });
  }

  function updateVolumeIcon() {
    if (!volumeIcon) return;
    if (video.muted || video.volume === 0) {
      volumeIcon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    } else {
      volumeIcon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    }
  }

  const speeds = [1, 1.25, 1.5, 2, 0.75];
  let currentSpeedIdx = 0;
  if (speedBtn) {
    speedBtn.addEventListener('click', () => {
      currentSpeedIdx = (currentSpeedIdx + 1) % speeds.length;
      const speed = speeds[currentSpeedIdx];
      video.playbackRate = speed;
      speedBtn.textContent = `${speed}x`;
    });
  }

  if (pipBtn && document.pictureInPictureEnabled) {
    pipBtn.addEventListener('click', async () => {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await video.requestPictureInPicture();
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  if (fullscreenBtn && playerContainer) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        playerContainer.requestFullscreen().catch(err => console.log(err));
      } else {
        document.exitFullscreen();
      }
    });
  }

  chapterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chapterBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
        b.classList.add('text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
      btn.classList.remove('text-on-surface-variant');

      const time = parseFloat(btn.getAttribute('data-time') || '0');
      video.currentTime = time;
      video.play();
    });
  });
}

/* ==========================================================================
   3. CAROUSELS & GALLERY GRIDS (CAD & Renders)
   ========================================================================== */
function initCarousels() {
  function setupCarousel(trackId, prevBtnId, nextBtnId, dotsSelector, activeBgClass, viewGridBtnId, viewCarouselBtnId, gridContainerId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dots = document.querySelectorAll(dotsSelector);
    const viewGridBtn = document.getElementById(viewGridBtnId);
    const viewCarouselBtn = document.getElementById(viewCarouselBtnId);
    const gridContainer = document.getElementById(gridContainerId);

    if (!track) return;

    const getCardWidth = () => {
      const firstCard = track.children[0];
      return firstCard ? firstCard.offsetWidth + 24 : 600;
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
      });
    }

    const updateDots = () => {
      const scrollPos = track.scrollLeft;
      const cardW = getCardWidth();
      const activeIdx = Math.min(
        dots.length - 1,
        Math.max(0, Math.round(scrollPos / cardW))
      );

      dots.forEach((dot, idx) => {
        if (idx === activeIdx) {
          dot.classList.remove('w-2', 'bg-surface-variant');
          dot.classList.add('w-8', activeBgClass);
        } else {
          dot.classList.remove('w-8', activeBgClass);
          dot.classList.add('w-2', 'bg-surface-variant');
        }
      });
    };

    track.addEventListener('scroll', updateDots, { passive: true });

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index') || '0', 10);
        track.scrollTo({ left: idx * getCardWidth(), behavior: 'smooth' });
      });
    });

    if (viewGridBtn && viewCarouselBtn && gridContainer) {
      viewGridBtn.addEventListener('click', () => {
        track.parentElement.classList.add('hidden');
        gridContainer.classList.remove('hidden');
        viewGridBtn.classList.add('bg-primary/20', 'text-primary');
        viewCarouselBtn.classList.remove('bg-primary/20', 'text-primary');
      });

      viewCarouselBtn.addEventListener('click', () => {
        gridContainer.classList.add('hidden');
        track.parentElement.classList.remove('hidden');
        viewCarouselBtn.classList.add('bg-primary/20', 'text-primary');
        viewGridBtn.classList.remove('bg-primary/20', 'text-primary');
      });
    }
  }

  setupCarousel('cad-track', 'cad-prev', 'cad-next', '.cad-dot', 'bg-cyan-400', 'cad-view-grid', 'cad-view-carousel', 'cad-grid');
  setupCarousel('render-track', 'render-prev', 'render-next', '.render-dot', 'bg-primary', 'render-view-grid', 'render-view-carousel', 'render-grid');
}

/* ==========================================================================
   4. BEFORE / AFTER COMPARISON SLIDER
   ========================================================================== */
function initComparisonSlider() {
  const container = document.getElementById('comparison-box');
  const overlay = document.getElementById('comparison-overlay');
  const handle = document.getElementById('comparison-handle');

  if (!container || !overlay || !handle) return;

  let isDragging = false;

  function setSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let posX = clientX - rect.left;
    posX = Math.max(0, Math.min(posX, rect.width));
    const percent = (posX / rect.width) * 100;

    overlay.style.width = `${percent}%`;
    handle.style.left = `${percent}%`;
  }

  handle.addEventListener('mousedown', () => { isDragging = true; });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      setSliderPosition(e.clientX);
    }
  });

  handle.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length > 0) {
      setSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });

  container.addEventListener('click', (e) => {
    setSliderPosition(e.clientX);
  });
}

/* ==========================================================================
   5. UNIVERSAL IMAGE LIGHTBOX MODAL
   ========================================================================== */
const galleryItems = [
  // Raw CAD Photos (7 items)
  {
    category: 'Сырые CAD-чертежи',
    src: 'Сырые фото/Мой первый 2d.jpg',
    title: 'Полигональный каркас остекления',
    desc: 'Вьюпорт Trimble SketchUp: несущие стальные колонны, фермы арочной кровли и автоматические фрамуги вентиляции.'
  },
  {
    category: 'Сырые CAD-чертежи',
    src: 'Сырые фото/мой первый 4d.jpg',
    title: 'Конструктивный разрез и арочный свод',
    desc: 'Высотный профиль купола 6.8 м, светопрозрачные поликарбонатные панели и подвесы фитосветильников.'
  },
  {
    category: 'Сырые CAD-чертежи',
    src: 'Сырые фото/Мой первый 3gd.jpg',
    title: 'Раскладка гидропонных стеллажей',
    desc: 'Зонирование кассетных лотков NFT, сервисные коридоры для патрульных роботов AGV и сливные трапы.'
  },
  {
    category: 'Сырые CAD-чертежи',
    src: 'Сырые фото/Мой первый 5d.jpg',
    title: 'Вентиляционные коньковые фрамуги',
    desc: 'Сервоприводы фрамуг с ходом до 45° для естественной аэрации и экстренного сброса теплового купола.'
  },
  {
    category: 'Сырые CAD-чертежи',
    src: 'Сырые фото/Мой первый 6d.jpg',
    title: 'Узлы сопряжения фундамента и стоек',
    desc: 'Железобетонный ростверк, анкерные группы М24 и термическое разделение опорных пят.'
  },
  {
    category: 'Сырые CAD-чертежи',
    src: 'Сырые фото/Мой первый 03d.jpg',
    title: 'Генеральный план и зонирование микроклимата',
    desc: 'Разделение на 4 независимые климатические секции с индивидуальным дозированием CO₂ и влажности.'
  },
  {
    category: 'Сырые CAD-чертежи',
    src: 'Сырые фото/Мой первый 05d.jpg',
    title: 'Трассировка систем капельного орошения',
    desc: 'Магистральные трубопроводы высокого давления, компенсационные капельницы и клапаны электромагнитного отсечения.'
  },

  // 3D Renders (7 items)
  {
    category: 'Финальные 3D-рендеры',
    src: 'Отрендеренные фото/image.png_20261005164542.jpg',
    title: 'Панорамный вид биокомплекса в вечернем режиме',
    desc: 'Арочная оранжерея с динамическим фитоосвещением 660nm + Far-Red и контролем фотопериода во время сумерек.'
  },
  {
    category: 'Финальные 3D-рендеры',
    src: 'Отрендеренные фото/Camera_panning_down_revealing_de…_20261005172805.jpg',
    title: 'Каскадное фитоосвещение и стеллажи',
    desc: 'Спектральный добор фотонов PPFD 850 µmol/m²·s, капельный полив и автоматизированные датчики влажности субстрата.'
  },
  {
    category: 'Финальные 3D-рендеры',
    src: 'Отрендеренные фото/Camera_panning_up_revealing_details_20261005172823.jpg',
    title: 'Светопрозрачный купол и климатический контур',
    desc: 'Антиконденсатное покрытие стекла, распределительные форсунки тумана и циркуляционные вентиляторы.'
  },
  {
    category: 'Финальные 3D-рендеры',
    src: 'Отрендеренные фото/Camera_zooming_in_on_subject_20261005173205.jpg',
    title: 'Субмикронный туман и микроклимат (VPD 1.14 кПа)',
    desc: 'Оптическая оценка тургора листа, ультразвуковое увлажнение и защита растений от теплового стресса.'
  },
  {
    category: 'Финальные 3D-рендеры',
    src: 'Отрендеренные фото/Side_profile_of_subject_20261005173213.jpg',
    title: 'Продольный профиль и рециркуляция воздуха',
    desc: 'Ламинарные воздушные потоки вдоль грядок, исключающие застойные зоны и образование плесени.'
  },
  {
    category: 'Финальные 3D-рендеры',
    src: 'Отрендеренные фото/Overhead_aerial_view_of_scene_20261005173232.jpg',
    title: 'Аэрофотосъемка: инсоляция и зонирование культур',
    desc: 'Оптимальное позиционирование по сторонам света (восток-запад) для максимального захвата естественного солнечного света.'
  },
  {
    category: 'Финальные 3D-рендеры',
    src: 'Отрендеренные фото/Camera_panning_down_to_reveal_20261005173300 — копия.jpg',
    title: 'Корневая зона и сенсорные узлы гидропоники',
    desc: 'Аэрация питательного раствора, датчики электропроводности EC и кислотности pH в замкнутом цикле.'
  }
];

let activeLightboxIndex = 0;
let lightboxZoom = 1;

function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalDesc = document.getElementById('lightbox-desc');
  const modalCategory = document.getElementById('lightbox-category');
  const modalCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const zoomInBtn = document.getElementById('lightbox-zoom-in');
  const zoomOutBtn = document.getElementById('lightbox-zoom-out');
  const zoomResetBtn = document.getElementById('lightbox-zoom-reset');
  const downloadBtn = document.getElementById('lightbox-download');
  const thumbStrip = document.getElementById('lightbox-thumbnails');

  if (!modal) return;

  if (thumbStrip) {
    thumbStrip.innerHTML = '';
    galleryItems.forEach((item, index) => {
      const thumb = document.createElement('button');
      thumb.className = `lightbox-thumb shrink-0 w-16 h-12 rounded-lg overflow-hidden border border-white/10 hover:border-primary transition-all opacity-60 hover:opacity-100 ${index === 0 ? 'border-primary opacity-100 scale-105' : ''}`;
      thumb.innerHTML = `<img src="${encodeURI(item.src)}" alt="${item.title}" class="w-full h-full object-cover"/>`;
      thumb.addEventListener('click', () => {
        openLightboxIndex(index);
      });
      thumbStrip.appendChild(thumb);
    });
  }

  function updateThumbnails() {
    const thumbs = document.querySelectorAll('.lightbox-thumb');
    thumbs.forEach((th, idx) => {
      if (idx === activeLightboxIndex) {
        th.classList.add('border-primary', 'opacity-100', 'scale-105', 'ring-2', 'ring-primary/40');
        th.classList.remove('opacity-60');
        th.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        th.classList.remove('border-primary', 'opacity-100', 'scale-105', 'ring-2', 'ring-primary/40');
        th.classList.add('opacity-60');
      }
    });
  }

  window.openLightboxIndex = function(index) {
    activeLightboxIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[activeLightboxIndex];

    lightboxZoom = 1;
    if (modalImg) {
      modalImg.style.transform = `scale(${lightboxZoom})`;
      modalImg.src = encodeURI(item.src);
    }
    if (modalTitle) modalTitle.textContent = item.title;
    if (modalDesc) modalDesc.textContent = item.desc;
    if (modalCategory) modalCategory.textContent = item.category;
    if (modalCounter) modalCounter.textContent = `${activeLightboxIndex + 1} / ${galleryItems.length}`;
    if (downloadBtn) downloadBtn.href = encodeURI(item.src);

    updateThumbnails();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  function closeLightbox() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => openLightboxIndex(activeLightboxIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => openLightboxIndex(activeLightboxIndex + 1));

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      lightboxZoom = Math.min(3, lightboxZoom + 0.3);
      if (modalImg) modalImg.style.transform = `scale(${lightboxZoom})`;
    });
  }
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      lightboxZoom = Math.max(0.5, lightboxZoom - 0.3);
      if (modalImg) modalImg.style.transform = `scale(${lightboxZoom})`;
    });
  }
  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
      lightboxZoom = 1;
      if (modalImg) modalImg.style.transform = `scale(1)`;
    });
  }

  window.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightboxIndex(activeLightboxIndex - 1);
    if (e.key === 'ArrowRight') openLightboxIndex(activeLightboxIndex + 1);
  });

  document.querySelectorAll('[data-lightbox-index]').forEach(el => {
    el.addEventListener('click', (e) => {
      const idx = parseInt(el.getAttribute('data-lightbox-index') || '0', 10);
      openLightboxIndex(idx);
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE TELEMETRY SIMULATOR & CALCULATOR
   ========================================================================== */
function initTelemetrySimulator() {
  const tempSlider = document.getElementById('sim-temp');
  const humSlider = document.getElementById('sim-humidity');
  const co2Slider = document.getElementById('sim-co2');
  const ppfdSlider = document.getElementById('sim-ppfd');

  const tempVal = document.getElementById('val-temp');
  const humVal = document.getElementById('val-humidity');
  const co2Val = document.getElementById('val-co2');
  const ppfdVal = document.getElementById('val-ppfd');
  const vpdVal = document.getElementById('val-vpd');
  const vpdStatus = document.getElementById('status-vpd');

  function calculateVPD(T, RH) {
    const svp = 0.61078 * Math.exp((17.27 * T) / (T + 237.3));
    const avp = svp * (RH / 100);
    const vpd = svp - avp;
    return Math.max(0, vpd);
  }

  function updateSim() {
    if (!tempSlider || !humSlider) return;
    const T = parseFloat(tempSlider.value);
    const RH = parseFloat(humSlider.value);
    const CO2 = parseInt(co2Slider ? co2Slider.value : '850', 10);
    const PPFD = parseInt(ppfdSlider ? ppfdSlider.value : '850', 10);

    if (tempVal) tempVal.textContent = `${T.toFixed(1)} °C`;
    if (humVal) humVal.textContent = `${RH.toFixed(0)} %`;
    if (co2Val) co2Val.textContent = `${CO2} ppm`;
    if (ppfdVal) ppfdVal.textContent = `${PPFD} µmol`;

    const vpd = calculateVPD(T, RH);
    if (vpdVal) vpdVal.textContent = `${vpd.toFixed(2)} кПа`;

    if (vpdStatus) {
      if (vpd >= 0.8 && vpd <= 1.2) {
        vpdStatus.textContent = 'Идеальный баланс (Вегетация)';
        vpdStatus.className = 'text-xs font-mono text-primary font-medium';
      } else if (vpd < 0.8) {
        vpdStatus.textContent = 'Низкий VPD (Риск грибка/плесени)';
        vpdStatus.className = 'text-xs font-mono text-cyan-400 font-medium';
      } else {
        vpdStatus.textContent = 'Высокий VPD (Водный стресс листьев)';
        vpdStatus.className = 'text-xs font-mono text-amber-400 font-medium';
      }
    }
  }

  [tempSlider, humSlider, co2Slider, ppfdSlider].forEach(slider => {
    if (slider) slider.addEventListener('input', updateSim);
  });
  updateSim();

  document.querySelectorAll('.subsystem-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const active = btn.getAttribute('data-active') === 'true';
      btn.setAttribute('data-active', !active);
      const dot = btn.querySelector('.status-dot');
      const text = btn.querySelector('.status-text');

      if (!active) {
        btn.classList.add('border-emerald-500/40', 'bg-emerald-500/10');
        if (dot) dot.className = 'status-dot w-2 h-2 rounded-full bg-primary animate-pulse';
        if (text) text.textContent = 'Активен';
      } else {
        btn.classList.remove('border-emerald-500/40', 'bg-emerald-500/10');
        if (dot) dot.className = 'status-dot w-2 h-2 rounded-full bg-slate-500';
        if (text) text.textContent = 'Остановлен';
      }
    });
  });
}

/* ==========================================================================
   7. DEMO ACCESS MODAL & FORM
   ========================================================================== */
function initDemoModal() {
  const modal = document.getElementById('demo-modal');
  const openBtns = document.querySelectorAll('.btn-open-demo');
  const closeBtn = document.getElementById('demo-modal-close');
  const form = document.getElementById('demo-form');
  const toast = document.getElementById('demo-toast');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Отправка...</span>';
      }

      setTimeout(() => {
        closeModal();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Отправить заявку</span>';
        }
        form.reset();

        if (toast) {
          toast.classList.remove('hidden');
          setTimeout(() => {
            toast.classList.add('hidden');
          }, 5000);
        }
      }, 800);
    });
  }
}

/* ==========================================================================
   8. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function toggleDrawer() {
    drawer.classList.toggle('hidden');
  }

  toggleBtn.addEventListener('click', toggleDrawer);
  if (closeBtn) closeBtn.addEventListener('click', () => drawer.classList.add('hidden'));

  links.forEach(l => {
    l.addEventListener('click', () => drawer.classList.add('hidden'));
  });
}

/* ==========================================================================
   9. SMOOTH SCROLLING HELPER
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
