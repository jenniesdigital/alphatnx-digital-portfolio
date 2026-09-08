/**
 * Large Interactive 3D Keyword & Particle Sphere Canvas
 * High-Contrast Light & Dark Rendering · AlphaTNX Digital x Michael Ehiem
 */

(function () {
  const canvas = document.getElementById("hero-globe");
  const heroSection = document.getElementById("intro");
  if (!canvas || !heroSection) return;

  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tokens = [
    "--ai-architecture",
    "--conversion-rate",
    "--revenue-engine",
    "--e-commerce",
    "--order-pages",
    "--custom-forms",
    "--speed-to-market",
    "--scalable-systems",
    "--checkout-funnel",
    "--lead-generation",
    "--stripe-connect",
    "--color-text-primary",
    "--color-text-secondary",
    "--color-text-muted",
    "--color-surface-default",
    "--color-surface-raised",
    "--color-background-canvas",
    "--color-border-default",
    "--color-border-subtle",
    "--color-accent-emphasis",
    "--font-size-body-sm",
    "--font-size-body-md",
    "--font-size-heading-md",
    "--font-size-heading-lg",
    "--font-size-display-xl",
    "--font-weight-regular",
    "--font-weight-medium",
    "--font-weight-semibold",
    "--line-height-tight",
    "--line-height-default",
    "--letter-spacing-tight",
    "--space-xs",
    "--space-sm",
    "--space-md",
    "--space-lg",
    "--space-xl",
    "--space-2xl",
    "--radius-sm",
    "--radius-md",
    "--radius-full"
  ];

  const sphereSlices = {
    2: [[8, 16], [30, 32], [48, 57]],
    3: [[6, 20], [22, 25], [29, 33], [40, 58]],
    4: [[3, 25], [27, 58]],
    5: [[3, 25], [27, 58]],
    6: [[3, 22], [28, 58]],
    7: [[4, 22], [28, 58]],
    8: [[5, 21], [28, 57]],
    9: [[6, 20], [27, 56]],
    10: [[8, 18], [27, 53]],
    11: [[10, 16], [27, 52]],
    12: [[13, 18], [27, 51]],
    13: [[15, 24], [27, 39], [46, 52]],
    14: [[17, 24], [28, 38], [47, 53]],
    15: [[17, 24], [29, 37], [48, 53]],
    16: [[17, 24], [29, 37], [48, 53]],
    17: [[17, 24], [30, 37], [49, 52]],
    18: [[18, 24], [30, 37], [49, 55]],
    19: [[18, 23], [31, 36], [48, 56]],
    20: [[18, 23], [32, 36], [49, 55]],
    21: [[19, 22], [33, 35], [50, 54]],
    22: [[19, 22]],
    23: [[19, 21]],
    24: [[19, 20]]
  };

  const DEG_TO_RAD = Math.PI / 180;
  const rawPoints = [];

  for (const latKey of Object.keys(sphereSlices)) {
    const latIndex = +latKey;
    const phi = (90 - latIndex * 6) * DEG_TO_RAD;
    for (const [startLng, endLng] of sphereSlices[latIndex]) {
      for (let lonIndex = startLng; lonIndex <= endLng; lonIndex++) {
        const theta = (lonIndex * 6 - 180) * DEG_TO_RAD;
        rawPoints.push({
          x: Math.cos(phi) * Math.cos(theta),
          y: Math.sin(phi),
          z: Math.cos(phi) * Math.sin(theta)
        });
      }
    }
  }

  const stepRatio = Math.max(1, Math.round(rawPoints.length / 155));
  const particleList = [];
  for (let i = 0, tokenIndex = 0; i < rawPoints.length; i += stepRatio, tokenIndex++) {
    particleList.push({
      ...rawPoints[i],
      token: tokens[tokenIndex % tokens.length],
      disp: 0,
      vel: 0,
      rx: 0,
      ry: 0,
      front: false,
      _z: 0
    });
  }

  let canvasW = 0, canvasH = 0, originX = 0, originY = 0, globeRadius = 0;

  const handleResize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvasW = rect.width;
    canvasH = rect.height;
    originX = canvasW / 2;
    originY = canvasH / 2;
    globeRadius = Math.min(canvasW, canvasH) * 0.36;
  };

  handleResize();
  window.addEventListener("resize", handleResize, { passive: true });

  let pointerTargetX = 0, pointerTargetY = 0;
  let pointerCurrentX = 0, pointerCurrentY = 0;

  if (!prefersReducedMotion) {
    window.addEventListener("pointermove", (e) => {
      pointerTargetX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTargetY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  const focalDistance = 2.5;
  const sortedParticleIndices = particleList.map((_, idx) => idx);

  const renderFrame = (timestamp) => {
    ctx.clearRect(0, 0, canvasW, canvasH);
    pointerCurrentX += (pointerTargetX - pointerCurrentX) * 0.045;
    pointerCurrentY += (pointerTargetY - pointerCurrentY) * 0.045;

    const isLightMode = document.documentElement.getAttribute("data-theme") === "light";

    const time = prefersReducedMotion ? 8000 : timestamp;
    const rotY = time * 0.00007 + 0.5 * Math.sin(time * 0.00005) + pointerCurrentX * 0.38;
    const rotX = 0.22 * Math.sin(time * 0.00007 + 0.5) + 0.12 * Math.sin(time * 0.00017) + pointerCurrentY * 0.26;
    const rotZ = 0.14 * Math.sin(time * 0.00004 + 2.1) + pointerCurrentX * 0.05;

    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);

    for (const particle of particleList) {
      const { x: px, y: py, z: pz } = particle;
      const rotZ_X = px * cosY + pz * sinY;
      const rotZ_Z = -px * sinY + pz * cosY;
      const rotX_Y = py * cosX - rotZ_Z * sinX;
      const rotX_Z = py * sinX + rotZ_Z * cosX;
      const finalX = rotZ_X * cosZ - rotX_Y * sinZ;
      const finalY = rotZ_X * sinZ + rotX_Y * cosZ;
      const scaleFactor = focalDistance / (focalDistance - rotX_Z);

      particle.rx = finalX * globeRadius * scaleFactor;
      particle.ry = finalY * globeRadius * scaleFactor;
      particle.front = rotX_Z > 0;
      particle._z = rotX_Z;
    }

    sortedParticleIndices.sort((a, b) => particleList[a]._z - particleList[b]._z);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < sortedParticleIndices.length; i++) {
      const idx = sortedParticleIndices[i];
      const p = particleList[idx];
      const normZ = (p._z + 1) / 2; // 0 (back) to 1 (front)
      const scale = focalDistance / (focalDistance - p._z);

      if (isLightMode) {
        // High-contrast dark slate text with occasional royal blue and bronze accents
        ctx.globalAlpha = 0.14 + Math.pow(normZ, 1.4) * 0.86;
        if (normZ > 0.85 && idx % 4 === 0) {
          ctx.fillStyle = "#2563EB"; // Royal Blue highlight
        } else if (normZ > 0.85 && idx % 4 === 2) {
          ctx.fillStyle = "#B8860B"; // Warm Gold highlight
        } else {
          ctx.fillStyle = normZ > 0.65 ? "#0A0D18" : "#555A70";
        }
      } else {
        // Crisp off-white text with occasional luxury gold and electric blue accents
        ctx.globalAlpha = 0.08 + Math.pow(normZ, 1.5) * 0.88;
        if (normZ > 0.82 && idx % 4 === 0) {
          ctx.fillStyle = "#D4AF37"; // Luxury Gold highlight
        } else if (normZ > 0.82 && idx % 4 === 2) {
          ctx.fillStyle = "#60A5FA"; // Electric Blue highlight
        } else {
          ctx.fillStyle = normZ > 0.75 ? "#EDEDF2" : "#7C8092";
        }
      }

      ctx.font = `500 ${globeRadius * 0.014 * (1 + normZ) * scale}px Silka, 'Plus Jakarta Sans', sans-serif`;
      ctx.fillText(p.token, originX + p.rx, originY + p.ry);
    }

    ctx.globalAlpha = 1;
    if (isAnimationActive) {
      animationFrameId = requestAnimationFrame(renderFrame);
    }
  };

  let animationFrameId = 0;
  let isAnimationActive = false;
  let isIntersectingViewport = true;

  const startAnimation = () => {
    if (!isAnimationActive && isIntersectingViewport && !document.hidden && !prefersReducedMotion) {
      isAnimationActive = true;
      animationFrameId = requestAnimationFrame(renderFrame);
    }
  };

  const stopAnimation = () => {
    isAnimationActive = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  };

  if (prefersReducedMotion) {
    renderFrame(0);
  } else {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAnimation();
      else startAnimation();
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isIntersectingViewport = entry.isIntersecting;
          if (isIntersectingViewport) startAnimation();
          else stopAnimation();
        });
      }, { rootMargin: "0px" }).observe(canvas);
    }

    startAnimation();
  }
})();
