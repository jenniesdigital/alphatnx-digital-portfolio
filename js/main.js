/**
 * Metacci Interactions, Theme Switcher, Draggable Carousel, Accordion & Growth Nebula
 * AlphaTNX Digital x Michael Ehiem
 */

(function () {
  "use strict";

  // 1. Theme Switcher (Light / Dark Mode)
  const themeSwitchBtn = document.getElementById("theme-switch");
  const lightOpt = document.querySelector(".theme-opt--light");
  const darkOpt = document.querySelector(".theme-opt--dark");

  const getPreferredTheme = () => {
    const saved = localStorage.getItem("alphaTnxTheme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("alphaTnxTheme", theme);
    if (lightOpt && darkOpt) {
      lightOpt.classList.toggle("is-active", theme === "light");
      darkOpt.classList.toggle("is-active", theme === "dark");
    }
  };

  const initialTheme = getPreferredTheme();
  setTheme(initialTheme);

  if (themeSwitchBtn) {
    themeSwitchBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const nextTheme = current === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  }

  // 2. Dynamic Tab Title Away Easter Egg
  const originalDocTitle = document.title;
  const awayDocTitle = document.body.dataset.awayTitle || "Have a wonderful day ♥";
  document.addEventListener("visibilitychange", () => {
    document.title = document.hidden ? awayDocTitle : originalDocTitle;
  });

  // 3. Preloader Animation (Branded Progress & Counter)
  const preloaderEl = document.getElementById("preloader");
  const countDisplay = document.getElementById("preloader-count");
  const barDisplay = document.getElementById("preloader-bar");

  if (preloaderEl && countDisplay) {
    const animDuration = 1250;
    let animStart = null;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (ts) => {
      if (!animStart) animStart = ts;
      const progress = Math.min((ts - animStart) / animDuration, 1);
      const easedPercent = Math.round(easeOutCubic(progress) * 100);
      
      countDisplay.textContent = easedPercent + "%";
      if (barDisplay) {
        barDisplay.style.width = easedPercent + "%";
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        countDisplay.textContent = "100%";
        if (barDisplay) barDisplay.style.width = "100%";
        
        setTimeout(() => {
          preloaderEl.classList.add("preloader--done");
          setTimeout(() => {
            preloaderEl.style.display = "none";
          }, 600);
        }, 120);
      }
    };
    requestAnimationFrame(tick);
  }

  // 4. Header Scroll & Docking (Floating Nav stays always accessible)
  const siteHeader = document.getElementById("site-header");
  const navHamburger = document.getElementById("nav-hamburger");
  const navModal = document.getElementById("nav-modal");

  function updateHeader() {
    if (navHamburger && navHamburger.classList.contains("is-open")) return;
    const scrollY = window.scrollY;

    if (!siteHeader) return;

    siteHeader.classList.toggle("scrolled", scrollY > 20);
    siteHeader.style.transform = "translateY(0)";
    siteHeader.style.opacity = "1";
    siteHeader.style.pointerEvents = "auto";
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("load", updateHeader);
  window.addEventListener("pageshow", updateHeader);

  // 5. Mobile Modal Navigation
  let scrollBeforeModal = 0;
  function openNavModal() {
    if (!navHamburger || !navModal) return;
    scrollBeforeModal = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollBeforeModal}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";

    navModal.style.display = "flex";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      navModal.classList.add("is-open");
    }));
    navModal.setAttribute("aria-hidden", "false");
    navHamburger.setAttribute("aria-label", "Close menu");
    navHamburger.setAttribute("aria-expanded", "true");
    navHamburger.classList.add("is-open");
  }

  function closeNavModal() {
    if (!navHamburger || !navModal) return;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    window.scrollTo(0, scrollBeforeModal);

    navModal.classList.remove("is-open");
    navModal.setAttribute("aria-hidden", "true");
    navHamburger.setAttribute("aria-label", "Open menu");
    navHamburger.setAttribute("aria-expanded", "false");
    navHamburger.classList.remove("is-open");

    navModal.addEventListener("transitionend", () => {
      navModal.style.display = "none";
    }, { once: true });
    updateHeader();
  }

  if (navHamburger) {
    navHamburger.addEventListener("click", () => {
      navHamburger.classList.contains("is-open") ? closeNavModal() : openNavModal();
    });
  }

  if (navModal) {
    navModal.querySelectorAll("a").forEach((anchor) => {
      anchor.addEventListener("click", closeNavModal);
    });
  }

  // 6. Growth Section Nebula Canvas Simulation (Light & Dark mode animation)
  const nebulaCanvas = document.querySelector(".growth-nebula");
  const growthSection = document.querySelector(".growth");
  if (nebulaCanvas && growthSection) {
    const nCtx = nebulaCanvas.getContext("2d");
    let nW = 0, nH = 0;

    const resizeNebula = () => {
      const rect = growthSection.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      nebulaCanvas.width = nW = Math.max(1, Math.round(rect.width * dpr));
      nebulaCanvas.height = nH = Math.max(1, Math.round(rect.height * dpr));
      nCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeNebula();
    window.addEventListener("resize", resizeNebula, { passive: true });

    const starCount = 75;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * 2.5 + 1.0,
        alpha: Math.random() * 0.65 + 0.35,
        speedX: (Math.random() - 0.5) * 0.0004,
        speedY: (Math.random() - 0.5) * 0.0004,
        pulse: Math.random() * Math.PI * 2
      });
    }

    let nRaf = 0;
    const renderNebula = (time) => {
      const w = nebulaCanvas.width / (window.devicePixelRatio || 1);
      const h = nebulaCanvas.height / (window.devicePixelRatio || 1);
      nCtx.clearRect(0, 0, w, h);

      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const gradient = nCtx.createRadialGradient(w / 2, h / 2, 30, w / 2, h / 2, Math.max(w, h) * 0.6);
      
      if (isLight) {
        gradient.addColorStop(0, "rgba(205, 215, 235, 0.65)");
        gradient.addColorStop(0.4, "rgba(225, 230, 245, 0.35)");
        gradient.addColorStop(0.8, "rgba(240, 242, 250, 0.15)");
        gradient.addColorStop(1, "rgba(247, 247, 250, 0)");
      } else {
        gradient.addColorStop(0, "rgba(35, 40, 60, 0.55)");
        gradient.addColorStop(0.4, "rgba(20, 24, 35, 0.3)");
        gradient.addColorStop(1, "rgba(7, 8, 8, 0)");
      }
      nCtx.fillStyle = gradient;
      nCtx.fillRect(0, 0, w, h);

      for (const s of stars) {
        s.x += s.speedX;
        s.y += s.speedY;
        if (s.x < 0) s.x = 1;
        if (s.x > 1) s.x = 0;
        if (s.y < 0) s.y = 1;
        if (s.y > 1) s.y = 0;
        s.pulse += 0.025;

        const currentAlpha = s.alpha * (0.65 + 0.35 * Math.sin(s.pulse));
        nCtx.beginPath();
        nCtx.arc(s.x * w, s.y * h, s.radius, 0, Math.PI * 2);
        
        if (isLight) {
          nCtx.fillStyle = `rgba(50, 65, 95, ${currentAlpha * 0.75})`;
          nCtx.shadowColor = "rgba(70, 90, 140, 0.45)";
          nCtx.shadowBlur = s.radius * 4;
        } else {
          nCtx.fillStyle = `rgba(225, 230, 250, ${currentAlpha})`;
          nCtx.shadowColor = "rgba(255, 255, 255, 0.9)";
          nCtx.shadowBlur = s.radius * 3;
        }
        nCtx.fill();
      }
      nCtx.shadowBlur = 0;

      if (isNebulaVisible) {
        nRaf = requestAnimationFrame(renderNebula);
      }
    };

    let isNebulaVisible = false;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isNebulaVisible = entry.isIntersecting;
          if (isNebulaVisible && !nRaf) {
            nRaf = requestAnimationFrame(renderNebula);
          } else if (!isNebulaVisible && nRaf) {
            cancelAnimationFrame(nRaf);
            nRaf = 0;
          }
        });
      }, { rootMargin: "20% 0px" }).observe(growthSection);
    }
  }

  // 7. Growth Stat Numbers Animation
  const statValueEls = document.querySelectorAll(".growth .stat-value");
  if (statValueEls.length && "IntersectionObserver" in window) {
    const easeOut = (n) => (n === 1 ? 1 : 1 - Math.pow(2, -10 * n));
    const animateStat = (el) => {
      const match = (el.textContent || "").trim().match(/^([\$\+]?)(\d+(?:\.\d+)?)([\+\%xM]*)$/);
      if (!match) return;

      const prefix = match[1] || "";
      const val = parseFloat(match[2]);
      const suffix = match[3] || "";
      const hasDecimal = match[2].includes(".");
      const duration = 1100;
      let start = null;

      const frame = (now) => {
        if (start === null) start = now;
        const p = Math.min((now - start) / duration, 1);
        const current = easeOut(p) * val;
        el.textContent = prefix + (hasDecimal ? current.toFixed(1) : Math.round(current)) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      };

      el.textContent = prefix + "0" + suffix;
      requestAnimationFrame(frame);
    };

    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    statValueEls.forEach((el) => statObserver.observe(el));
  }

  // 8. Selected Work Draggable / Wheel Carousel
  const cwTrack = document.getElementById("cw-track");
  const cwViewport = document.querySelector(".cw-viewport");
  const cwPrev = document.querySelector(".cw-prev");
  const cwNext = document.querySelector(".cw-next");
  const cwDots = document.querySelector(".cw-dots");

  if (cwTrack && cwPrev && cwNext) {
    const cards = () => Array.from(cwTrack.querySelectorAll(".cw-card"));
    const paddingLeft = () => parseFloat(getComputedStyle(cwTrack).paddingLeft || "0") || 0;
    const cardOffsets = () => cards().map((c) => c.offsetLeft - paddingLeft());
    const maxScroll = () => {
      const list = cards();
      if (!list.length) return 0;
      const last = list[list.length - 1];
      return Math.max(0, last.offsetLeft + last.offsetWidth - cwTrack.clientWidth + paddingLeft());
    };
    const clamp = (val) => Math.min(maxScroll(), Math.max(0, val));

    let scrollTarget = 0, currentPos = 0, rafLoop = 0;
    const applyTransform = () => {
      cwTrack.style.transform = `translate3d(${-currentPos}px, 0, 0)`;
    };

    let dotBtns = [];
    const createDots = () => {
      if (!cwDots) return;
      cwDots.innerHTML = "";
      dotBtns = cards().map((_, idx) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "cw-dot";
        dot.setAttribute("aria-label", `Go to case ${idx + 1}`);
        dot.addEventListener("click", () => snapToIndex(idx));
        cwDots.appendChild(dot);
        return dot;
      });
    };

    const findClosestIndex = (target = scrollTarget) => {
      const offsets = cardOffsets();
      let closestIdx = 0, minDistance = Infinity;
      offsets.forEach((off, i) => {
        const dist = Math.abs(off - target);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      });
      return closestIdx;
    };

    const updateUIState = () => {
      cwPrev.hidden = scrollTarget <= 1;
      cwNext.hidden = scrollTarget >= maxScroll() - 1;
      const activeIndex = findClosestIndex();
      dotBtns.forEach((dot, idx) => {
        dot.classList.toggle("is-active", idx === activeIndex);
      });
    };

    const stepAnimation = () => {
      currentPos += (scrollTarget - currentPos) * 0.14;
      if (Math.abs(scrollTarget - currentPos) < 0.5) currentPos = scrollTarget;
      applyTransform();
      if (currentPos !== scrollTarget) {
        rafLoop = requestAnimationFrame(stepAnimation);
      } else {
        rafLoop = 0;
      }
    };

    const requestStep = () => {
      if (!rafLoop) rafLoop = requestAnimationFrame(stepAnimation);
    };

    const snapToIndex = (index) => {
      const offsets = cardOffsets();
      const clamped = Math.max(0, Math.min(offsets.length - 1, index));
      scrollTarget = clamp(offsets[clamped]);
      updateUIState();
      requestStep();
    };

    cwPrev.addEventListener("click", () => snapToIndex(findClosestIndex() - 1));
    cwNext.addEventListener("click", () => snapToIndex(findClosestIndex() + 1));

    window.addEventListener("resize", () => {
      scrollTarget = clamp(scrollTarget);
      currentPos = scrollTarget;
      applyTransform();
      updateUIState();
    }, { passive: true });

    createDots();
    applyTransform();
    updateUIState();

    // Pointer Drag Physics
    let isMouseDown = false, isDragging = false;
    let initialX = 0, initialScroll = 0, prevPointerX = 0, deltaX = 0, downTimestamp = 0;

    cwTrack.addEventListener("pointerdown", (e) => {
      isMouseDown = true;
      isDragging = false;
      initialX = prevPointerX = e.clientX;
      initialScroll = scrollTarget;
      deltaX = 0;
      downTimestamp = performance.now();
    });

    window.addEventListener("pointermove", (e) => {
      if (!isMouseDown) return;
      const moved = e.clientX - initialX;
      if (!isDragging && Math.abs(moved) > 4) {
        isDragging = true;
        cwTrack.classList.add("cw-dragging");
      }
      if (isDragging) {
        deltaX = e.clientX - prevPointerX;
        prevPointerX = e.clientX;
        scrollTarget = currentPos = clamp(initialScroll - moved);
        applyTransform();
        updateUIState();
      }
    });

    const endDrag = () => {
      if (isMouseDown && isDragging) {
        cwTrack.classList.remove("cw-dragging");
        const momentum = performance.now() - downTimestamp > 120 ? 0 : deltaX;
        const targetWithMomentum = clamp(currentPos - momentum * 16);
        snapToIndex(findClosestIndex(targetWithMomentum));
      }
      isMouseDown = false;
      isDragging = false;
    };

    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    // Mouse wheel / Touchpad horizontal smooth scroll
    if (cwViewport) {
      cwViewport.addEventListener("wheel", (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || Math.abs(e.deltaX) > 10) {
          e.preventDefault();
          scrollTarget = clamp(scrollTarget + e.deltaX * 1.5);
          updateUIState();
          requestStep();
        }
      }, { passive: false });
    }

    cwTrack.addEventListener("click", (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  // 8B. Solutions Draggable / Wheel Carousel
  const solTrack = document.getElementById("sol-track");
  const solViewport = document.querySelector(".sol-viewport");
  const solPrev = document.getElementById("sol-prev");
  const solNext = document.getElementById("sol-next");
  const solDots = document.getElementById("sol-dots");

  if (solTrack && solPrev && solNext) {
    const solCards = () => Array.from(solTrack.querySelectorAll(".sol-card"));
    const getSolPaddingLeft = () => parseFloat(getComputedStyle(solTrack).paddingLeft || "0") || 0;
    const getSolCardOffsets = () => solCards().map((c) => c.offsetLeft - getSolPaddingLeft());
    const getSolMaxScroll = () => {
      const list = solCards();
      if (!list.length) return 0;
      const last = list[list.length - 1];
      return Math.max(0, last.offsetLeft + last.offsetWidth - solTrack.clientWidth + getSolPaddingLeft());
    };
    const clampSolScroll = (val) => Math.min(getSolMaxScroll(), Math.max(0, val));

    let solScrollTarget = 0, solCurrentPos = 0, solRafLoop = 0;
    const applySolTransform = () => {
      solTrack.style.transform = `translate3d(${-solCurrentPos}px, 0, 0)`;
    };

    let solDotBtns = [];
    const createSolDots = () => {
      if (!solDots) return;
      solDots.innerHTML = "";
      solDotBtns = solCards().map((_, idx) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "sol-dot";
        dot.setAttribute("aria-label", `Go to solution ${idx + 1}`);
        dot.addEventListener("click", () => snapSolToIndex(idx));
        solDots.appendChild(dot);
        return dot;
      });
    };

    const findClosestSolIndex = (target = solScrollTarget) => {
      const offsets = getSolCardOffsets();
      let closestIdx = 0, minDistance = Infinity;
      offsets.forEach((off, i) => {
        const dist = Math.abs(off - target);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      });
      return closestIdx;
    };

    const updateSolUIState = () => {
      solPrev.hidden = solScrollTarget <= 1;
      solNext.hidden = solScrollTarget >= getSolMaxScroll() - 1;
      const activeIndex = findClosestSolIndex();
      solDotBtns.forEach((dot, idx) => {
        dot.classList.toggle("is-active", idx === activeIndex);
      });
    };

    const stepSolAnimation = () => {
      solCurrentPos += (solScrollTarget - solCurrentPos) * 0.14;
      if (Math.abs(solScrollTarget - solCurrentPos) < 0.5) solCurrentPos = solScrollTarget;
      applySolTransform();
      if (solCurrentPos !== solScrollTarget) {
        solRafLoop = requestAnimationFrame(stepSolAnimation);
      } else {
        solRafLoop = 0;
      }
    };

    const requestSolStep = () => {
      if (!solRafLoop) solRafLoop = requestAnimationFrame(stepSolAnimation);
    };

    const snapSolToIndex = (index) => {
      const offsets = getSolCardOffsets();
      const clamped = Math.max(0, Math.min(offsets.length - 1, index));
      solScrollTarget = clampSolScroll(offsets[clamped]);
      updateSolUIState();
      requestSolStep();
    };

    solPrev.addEventListener("click", () => snapSolToIndex(findClosestSolIndex() - 1));
    solNext.addEventListener("click", () => snapSolToIndex(findClosestSolIndex() + 1));

    window.addEventListener("resize", () => {
      solScrollTarget = clampSolScroll(solScrollTarget);
      solCurrentPos = solScrollTarget;
      applySolTransform();
      updateSolUIState();
    }, { passive: true });

    createSolDots();
    applySolTransform();
    updateSolUIState();

    // Pointer Drag Physics
    let isSolMouseDown = false, isSolDragging = false;
    let initialSolX = 0, initialSolScroll = 0, prevSolPointerX = 0, solDeltaX = 0, solDownTimestamp = 0;

    solTrack.addEventListener("pointerdown", (e) => {
      isSolMouseDown = true;
      isSolDragging = false;
      initialSolX = prevSolPointerX = e.clientX;
      initialSolScroll = solScrollTarget;
      solDeltaX = 0;
      solDownTimestamp = performance.now();
    });

    window.addEventListener("pointermove", (e) => {
      if (!isSolMouseDown) return;
      const moved = e.clientX - initialSolX;
      if (!isSolDragging && Math.abs(moved) > 4) {
        isSolDragging = true;
        solTrack.classList.add("sol-dragging");
      }
      if (isSolDragging) {
        solDeltaX = e.clientX - prevSolPointerX;
        prevSolPointerX = e.clientX;
        solScrollTarget = solCurrentPos = clampSolScroll(initialSolScroll - moved);
        applySolTransform();
        updateSolUIState();
      }
    });

    const endSolDrag = () => {
      if (isSolMouseDown && isSolDragging) {
        solTrack.classList.remove("sol-dragging");
        const momentum = performance.now() - solDownTimestamp > 120 ? 0 : solDeltaX;
        const targetWithMomentum = clampSolScroll(solCurrentPos - momentum * 16);
        snapSolToIndex(findClosestSolIndex(targetWithMomentum));
      }
      isSolMouseDown = false;
      isSolDragging = false;
    };

    window.addEventListener("pointerup", endSolDrag);
    window.addEventListener("pointercancel", endSolDrag);

    if (solViewport) {
      solViewport.addEventListener("wheel", (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || Math.abs(e.deltaX) > 10) {
          e.preventDefault();
          solScrollTarget = clampSolScroll(solScrollTarget + e.deltaX * 1.5);
          updateSolUIState();
          requestSolStep();
        }
      }, { passive: false });
    }

    solTrack.addEventListener("click", (e) => {
      if (isSolDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }

  // 9. How We Work 6-Step Interactive Carousel
  const howTrack = document.getElementById("how-track");
  const howViewport = document.querySelector(".how-viewport");
  const howPrev = document.getElementById("how-prev");
  const howNext = document.getElementById("how-next");
  const howDots = document.getElementById("how-dots");

  if (howTrack && howPrev && howNext) {
    const howCards = () => Array.from(howTrack.querySelectorAll(".how-card"));
    const getPaddingLeft = () => parseFloat(getComputedStyle(howTrack).paddingLeft || "0") || 0;
    const getCardOffsets = () => howCards().map((c) => c.offsetLeft - getPaddingLeft());
    const getMaxScroll = () => {
      const list = howCards();
      if (!list.length) return 0;
      const last = list[list.length - 1];
      return Math.max(0, last.offsetLeft + last.offsetWidth - howTrack.clientWidth + getPaddingLeft());
    };
    const clampScroll = (val) => Math.min(getMaxScroll(), Math.max(0, val));

    let scrollTarget = 0, currentPos = 0, rafLoop = 0;
    const applyTransform = () => {
      howTrack.style.transform = `translate3d(${-currentPos}px, 0, 0)`;
    };

    let dotBtns = [];
    const createDots = () => {
      if (!howDots) return;
      howDots.innerHTML = "";
      dotBtns = howCards().map((_, idx) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "how-dot";
        dot.setAttribute("aria-label", `Go to step ${idx + 1}`);
        dot.addEventListener("click", () => snapToIndex(idx));
        howDots.appendChild(dot);
        return dot;
      });
    };

    const findClosestIndex = (target = scrollTarget) => {
      const offsets = getCardOffsets();
      let closestIdx = 0, minDistance = Infinity;
      offsets.forEach((off, i) => {
        const dist = Math.abs(off - target);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      });
      return closestIdx;
    };

    const updateUIState = () => {
      howPrev.hidden = scrollTarget <= 1;
      howNext.hidden = scrollTarget >= getMaxScroll() - 1;
      const activeIndex = findClosestIndex();
      dotBtns.forEach((dot, idx) => {
        dot.classList.toggle("is-active", idx === activeIndex);
      });
    };

    const stepAnimation = () => {
      currentPos += (scrollTarget - currentPos) * 0.14;
      if (Math.abs(scrollTarget - currentPos) < 0.5) currentPos = scrollTarget;
      applyTransform();
      if (currentPos !== scrollTarget) {
        rafLoop = requestAnimationFrame(stepAnimation);
      } else {
        rafLoop = 0;
      }
    };

    const requestStep = () => {
      if (!rafLoop) rafLoop = requestAnimationFrame(stepAnimation);
    };

    const snapToIndex = (index) => {
      const offsets = getCardOffsets();
      const clamped = Math.max(0, Math.min(offsets.length - 1, index));
      scrollTarget = clampScroll(offsets[clamped]);
      updateUIState();
      requestStep();
    };

    howPrev.addEventListener("click", () => snapToIndex(findClosestIndex() - 1));
    howNext.addEventListener("click", () => snapToIndex(findClosestIndex() + 1));

    window.addEventListener("resize", () => {
      scrollTarget = clampScroll(scrollTarget);
      currentPos = scrollTarget;
      applyTransform();
      updateUIState();
    }, { passive: true });

    createDots();
    applyTransform();
    updateUIState();

    // Pointer Drag Physics
    let isMouseDown = false, isDragging = false;
    let initialX = 0, initialScroll = 0, prevPointerX = 0, deltaX = 0, downTimestamp = 0;

    howTrack.addEventListener("pointerdown", (e) => {
      isMouseDown = true;
      isDragging = false;
      initialX = prevPointerX = e.clientX;
      initialScroll = scrollTarget;
      deltaX = 0;
      downTimestamp = performance.now();
    });

    window.addEventListener("pointermove", (e) => {
      if (!isMouseDown) return;
      const moved = e.clientX - initialX;
      if (!isDragging && Math.abs(moved) > 4) {
        isDragging = true;
        howTrack.classList.add("how-dragging");
      }
      if (isDragging) {
        deltaX = e.clientX - prevPointerX;
        prevPointerX = e.clientX;
        scrollTarget = currentPos = clampScroll(initialScroll - moved);
        applyTransform();
        updateUIState();
      }
    });

    const endDrag = () => {
      if (isMouseDown && isDragging) {
        howTrack.classList.remove("how-dragging");
        const momentum = performance.now() - downTimestamp > 120 ? 0 : deltaX;
        const targetWithMomentum = clampScroll(currentPos - momentum * 16);
        snapToIndex(findClosestIndex(targetWithMomentum));
      }
      isMouseDown = false;
      isDragging = false;
    };

    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    if (howViewport) {
      howViewport.addEventListener("wheel", (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || Math.abs(e.deltaX) > 10) {
          e.preventDefault();
          scrollTarget = clampScroll(scrollTarget + e.deltaX * 1.5);
          updateUIState();
          requestStep();
        }
      }, { passive: false });
    }
  }

  // 10. FAQ Accordion (Before You Book - Native details with optional single-open behavior)
  document.querySelectorAll(".faq-item").forEach((detail) => {
    detail.addEventListener("toggle", () => {
      if (detail.open) {
        document.querySelectorAll(".faq-item").forEach((other) => {
          if (other !== detail && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

  // 11. Reveal on Scroll
  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px 50px 0px" });

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add("is-visible");
      } else {
        revealObs.observe(el);
      }
    });
  }

  // 12. Live Lagos (GMT+1) Real-Time Clock with Precise Seconds Ticking
  const lagosTimeEl = document.getElementById("lagos-time");
  if (lagosTimeEl) {
    let lastSecond = -1;
    const updateLagosTime = () => {
      try {
        const now = new Date();
        const currentSec = now.getSeconds();
        if (currentSec !== lastSecond) {
          lastSecond = currentSec;
          const formatter = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Africa/Lagos",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
          });
          lagosTimeEl.textContent = `Lagos ${formatter.format(now)} GMT+1`;
        }
      } catch (e) {
        const now = new Date();
        const currentSec = now.getSeconds();
        if (currentSec !== lastSecond) {
          lastSecond = currentSec;
          const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
          const lagosDate = new Date(utc + (3600000 * 1));
          const pad = (n) => String(n).padStart(2, "0");
          const timeStr = `${pad(lagosDate.getHours())}:${pad(lagosDate.getMinutes())}:${pad(lagosDate.getSeconds())}`;
          lagosTimeEl.textContent = `Lagos ${timeStr} GMT+1`;
        }
      }
    };
    updateLagosTime();
    setInterval(updateLagosTime, 100);
  }

  // 13. Solution Explainer Slide-in Drawer Data & Controller
  const solutionsData = {
    "get-online": {
      tag: "01 · Get Online",
      title: "Get a Website",
      category: ["Digital Presence", "Fast Next.js / Static", "SEO Architecture", "Lead Capture"],
      problem: "Most businesses lose high-intent clients before they ever reach out because of slow, poorly structured websites, non-mobile-friendly layouts, or missing contact channels that fail to establish trust.",
      deliverables: "We design and deploy high-speed, mobile-optimized corporate websites and brand presence systems structured around trust, clear value propositions, and instant lead capture.",
      features: [
        { val: "< 1.0s", lbl: "Load Speed" },
        { val: "100%", lbl: "Mobile Optimized" },
        { val: "Instant", lbl: "WhatsApp / Form CRM" },
        { val: "Top Tier", lbl: "SEO Visibility" }
      ],
      outcome: "A credible digital home that ranks on search engines, builds instant authority with potential customers, and converts casual visitors into direct WhatsApp inquiries and form submissions.",
      workLinkText: "See Websites We've Built for Others →",
      workLinkHref: "/work",
      ctaPrompt: "Ready to launch a high-credibility digital presence?",
      whatsappMsg: "Hi AlphaTNX Digital, I'd like to get my business online with a high-converting website."
    },
    "sell-online": {
      tag: "02 · Sell Online",
      title: "Your Own E-Commerce Store",
      category: ["E-Commerce Stores", "Paystack & Flutterwave", "WhatsApp Ordering", "Automated Receipts"],
      problem: "High cart abandonment, failed card payments, and tedious manual bank transfer confirmations cause Nigerian businesses to lose over 50% of potential buyers at the moment of checkout.",
      deliverables: "We build custom online stores, single-product high-converting sales funnels, and direct-to-WhatsApp order channels integrated with reliable local and international payment gateways (Paystack, Flutterwave, Stripe).",
      features: [
        { val: "1-Click", lbl: "Paystack & Card Checkout" },
        { val: "Instant", lbl: "WhatsApp Order Routing" },
        { val: "Automated", lbl: "Stock & Invoice Sync" },
        { val: "Sub-Second", lbl: "Catalog Search" }
      ],
      outcome: "Frictionless checkout experience, zero manual payment verification headaches, and automated order notifications delivered directly to your fulfillment team.",
      workLinkText: "See E-Commerce Stores We've Built for Others →",
      workLinkHref: "/work",
      ctaPrompt: "Ready to start accepting online payments and scaling orders?",
      whatsappMsg: "Hi AlphaTNX Digital, I want to discuss setting up an e-commerce / online sales system for my business."
    },
    "operations": {
      tag: "03 · Run Your Business Better",
      title: "Systemize Your Business",
      category: ["Custom Dashboards", "Inventory Tracking", "Custom CRM", "Multi-Location Sync"],
      problem: "Managing orders, inventory, and customer records across messy WhatsApp chats and fragmented Excel spreadsheets leads to lost stock, missed follow-ups, and operational blindspots.",
      deliverables: "We develop dedicated internal tools, real-time inventory trackers, customer relationship managers (CRM), and executive dashboards tailored exactly to how your team operates.",
      features: [
        { val: "Zero", lbl: "Spreadsheet Chaos" },
        { val: "Real-Time", lbl: "Inventory & Sales Sync" },
        { val: "Role-Based", lbl: "Staff Access Control" },
        { val: "Live", lbl: "Revenue Analytics" }
      ],
      outcome: "Complete operational clarity across all branches or departments, automated stock deduction, and actionable daily revenue tracking from any device.",
      workLinkText: "See Internal Tools & Dashboards We've Built for Others →",
      workLinkHref: "/work",
      ctaPrompt: "Ready to streamline your business operations and eliminate manual spreadsheets?",
      whatsappMsg: "Hi AlphaTNX Digital, I need a custom operations dashboard and internal management tool for my business."
    },
    "automation": {
      tag: "04 · Work Smarter",
      title: "Work Smarter in Your Business",
      category: ["Zapier / Make / Webhooks", "WhatsApp API", "Automated Receipts", "CRM Pipeline"],
      problem: "Staff spending 15+ hours each week typing duplicate data, sending manual payment receipts, copy-pasting order details, and manually nudging unfulfilled leads.",
      deliverables: "We connect your website, payment processors, WhatsApp Business API, CRM, and accounting software to execute repetitive tasks automatically without human delay or error.",
      features: [
        { val: "15+ hrs", lbl: "Weekly Time Saved" },
        { val: "Instant", lbl: "SMS / WhatsApp Triggers" },
        { val: "Auto-Sync", lbl: "Payment to Fulfillment" },
        { val: "0%", lbl: "Human Data Entry Error" }
      ],
      outcome: "Instant order confirmations to customers, automated lead assignment to sales reps, and scheduled operational digest reports sent straight to your phone.",
      workLinkText: "See Automations We've Built for Others →",
      workLinkHref: "/work",
      ctaPrompt: "Ready to automate repetitive manual work in your business?",
      whatsappMsg: "Hi AlphaTNX Digital, I want to automate our sales and operational workflows."
    },
    "custom-software": {
      tag: "05 · Build Something New",
      title: "Custom Solutions for Your Business",
      category: ["Web Applications", "Client Portals", "Booking Systems", "API Architectures"],
      problem: "Off-the-shelf software doesn't fit unique business models, charges exorbitant recurring licensing fees, or locks your customer data into rigid walled gardens.",
      deliverables: "Full-cycle engineering of bespoke web applications, customer self-serve portals, multi-tenant SaaS MVPs, and automated booking/reservation platforms built for scale.",
      features: [
        { val: "Bespoke", lbl: "Tailored Architecture" },
        { val: "100%", lbl: "IP & Data Ownership" },
        { val: "Scalable", lbl: "Cloud-Native Backend" },
        { val: "Secure", lbl: "Encrypted Auth & Roles" }
      ],
      outcome: "A proprietary software asset built around your exact commercial logic that serves thousands of concurrent users with rock-solid stability.",
      workLinkText: "See Custom Solutions We've Built for Others →",
      workLinkHref: "/work",
      ctaPrompt: "Have a digital platform or software application in mind?",
      whatsappMsg: "Hi AlphaTNX Digital, I'd like to discuss engineering a custom web application or software platform."
    },
    "maintenance": {
      tag: "06 · Keep It Running",
      title: "Tech Maintenance",
      category: ["24/7 Monitoring", "Speed Optimization", "Security & Backups", "Continuous Upgrades"],
      problem: "Unmonitored websites break after plugin updates, suffer sluggish load times, run vulnerable outdated dependencies, or go offline during critical sales spikes.",
      deliverables: "Continuous infrastructure monitoring, sub-second speed tuning, daily automated backups, security patching, and on-demand technical support whenever you need changes.",
      features: [
        { val: "99.9%", lbl: "Uptime SLA" },
        { val: "Daily", lbl: "Encrypted Offsite Backups" },
        { val: "< 2 hr", lbl: "Support Response Time" },
        { val: "Weekly", lbl: "Speed & Security Audits" }
      ],
      outcome: "Peace of mind knowing your digital infrastructure is monitored by senior engineers, always blazing fast, and protected against data loss or downtime.",
      workLinkText: "See Platforms We Maintain for Others →",
      workLinkHref: "/work",
      ctaPrompt: "Want dependable technical support and hosting management for your systems?",
      whatsappMsg: "Hi AlphaTNX Digital, I want to discuss managed maintenance and support for our digital infrastructure."
    }
  };

  const solDrawer = document.getElementById("solution-drawer");
  const solBackdrop = document.getElementById("solution-drawer-backdrop");
  const solCloseBtn = document.getElementById("solution-drawer-close");

  const solDrawerTag = document.getElementById("solution-drawer-tag");
  const solDrawerCategory = document.getElementById("solution-drawer-category");
  const solDrawerTitle = document.getElementById("solution-drawer-title");
  const solDrawerProblem = document.getElementById("solution-drawer-problem");
  const solDrawerDeliverables = document.getElementById("solution-drawer-deliverables");
  const solDrawerFeaturesGrid = document.getElementById("solution-drawer-features-grid");
  const solDrawerOutcome = document.getElementById("solution-drawer-outcome");
  const solDrawerWorkLink = document.getElementById("solution-drawer-work-link");
  const solDrawerCtaPrompt = document.getElementById("solution-drawer-cta-prompt");
  const solDrawerWhatsApp = document.getElementById("solution-drawer-whatsapp");

  const openSolutionDrawer = (solKey) => {
    const data = solutionsData[solKey];
    if (!data || !solDrawer) return;

    if (solDrawerTag) solDrawerTag.textContent = data.tag;
    if (solDrawerTitle) solDrawerTitle.textContent = data.title;
    if (solDrawerProblem) solDrawerProblem.textContent = data.problem;
    if (solDrawerDeliverables) solDrawerDeliverables.textContent = data.deliverables;
    if (solDrawerOutcome) solDrawerOutcome.textContent = data.outcome;

    if (solDrawerCategory) { solDrawerCategory.innerHTML = ""; }

    if (solDrawerFeaturesGrid) {
      solDrawerFeaturesGrid.innerHTML = data.features.map((m) => `
        <div class="case-metric-box">
          <span class="case-metric-val">${m.val}</span>
          <span class="case-metric-lbl">${m.lbl}</span>
        </div>
      `).join("");
    }

    if (solDrawerWorkLink) {
      solDrawerWorkLink.textContent = data.workLinkText || "See Work We've Built for Others →";
      solDrawerWorkLink.href = data.workLinkHref || "/work";
    }

    if (solDrawerCtaPrompt) solDrawerCtaPrompt.textContent = data.ctaPrompt;
    if (solDrawerWhatsApp) {
      const msg = encodeURIComponent(data.whatsappMsg);
      solDrawerWhatsApp.href = `https://wa.me/2349064316439?text=${msg}`;
    }

    solDrawer.classList.add("is-open");
    solDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (solCloseBtn) solCloseBtn.focus();
  };

  const closeSolutionDrawer = () => {
    if (!solDrawer || !solDrawer.classList.contains("is-open")) return;
    solDrawer.classList.remove("is-open");
    solDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  if (solBackdrop) solBackdrop.addEventListener("click", closeSolutionDrawer);
  if (solCloseBtn) solCloseBtn.addEventListener("click", closeSolutionDrawer);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && solDrawer && solDrawer.classList.contains("is-open")) {
      closeSolutionDrawer();
    }
  });

  // Attach click listeners to all elements with [data-solution]
  document.querySelectorAll("[data-solution]").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (el.parentElement && el.parentElement.classList.contains("sol-dragging")) return;
      const solKey = el.dataset.solution;
      if (solKey && solutionsData[solKey]) {
        e.preventDefault();
        openSolutionDrawer(solKey);
      }
    });
  });

  // 14. Case Study Quick-View Drawer (3-Part Problem / Architecture / Outcome Framework)
  const caseStudiesData = {
    apex: {
      brand: "Apex Commerce",
      title: "A 960% usage lift on Apex Commerce's digital storefront",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      tags: ["E-Commerce", "Next.js", "Sub-Second Checkout", "Dynamic AI Bundles"],
      problem: "Cart abandonment escalated to 68% due to bloated multi-page checkout flows, slow 4.2-second mobile load times, and poor product bundle discovery.",
      architecture: "Engineered a headless Next.js frontend with sub-second edge caching, 1-click Stripe Elements integration, and dynamic AI-powered smart bundles.",
      outcome: "Generated over $185,000 in incremental revenue in Q1 alone, slashed mobile load times to 0.7s, and decreased cart abandonment by 44%.",
      metrics: [
        { val: "+960%", lbl: "Usage Lift" },
        { val: "0.7s", lbl: "Load Time" },
        { val: "-44%", lbl: "Cart Dropoff" },
        { val: "$185k+", lbl: "Q1 Revenue" }
      ],
      ctaText: "Discuss an e-commerce build like Apex Commerce"
    },
    vortex: {
      brand: "Vortex AI",
      title: "How design strategy took Vortex from NPS -4 to +19",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      tags: ["SaaS Growth", "Onboarding Funnel", "Automated Billing", "Figma Design System"],
      problem: "High early churn during trial signups, confusing tier feature comparisons, and a tedious 9-step account setup process dragged user satisfaction down to NPS -4.",
      architecture: "Streamlined the self-serve onboarding engine into a 3-step interactive setup with live workspace previews and automated Stripe tier billing.",
      outcome: "NPS skyrocketed from -4 to +19, trial-to-paid subscriber conversion jumped 3.1x, and churn dropped by 38% in the first 60 days post-launch.",
      metrics: [
        { val: "+23 pts", lbl: "NPS Lift" },
        { val: "3.1x", lbl: "Paid Conversion" },
        { val: "-38%", lbl: "Trial Churn" }
      ],
      ctaText: "Discuss a SaaS onboarding funnel like Vortex AI"
    },
    novak: {
      brand: "Novak Logistics",
      title: "Automated instant quotation engine & high-ticket intake system",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      tags: ["Enterprise Intake", "Real-Time Pricing", "Automation", "Custom Forms"],
      problem: "Manual email quoting took 24–48 hours per inquiry, causing 52% of high-value freight leads to book with faster-responding competitors.",
      architecture: "Built an instant quotation web calculator with dynamic weight/distance algorithms, automated CRM lead capture, and instantaneous contract generation.",
      outcome: "Lead response time collapsed from 24 hours to instant (<2s), booking conversions rose 180%, saving 35+ operational staff hours each week.",
      metrics: [
        { val: "< 2s", lbl: "Quote Speed" },
        { val: "+180%", lbl: "Booking Rate" },
        { val: "35 hrs", lbl: "Weekly Saved" }
      ],
      ctaText: "Discuss an automated intake engine like Novak"
    },
    aura: {
      brand: "Aura Pay",
      title: "230% conversion lift on Aura Pay checkout in three weeks",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
      tags: ["Fintech", "Frictionless Payments", "Apple Pay", "Conversion Rate Opt."],
      problem: "Checkout drop-off was abnormally high on mobile due to tedious manual card input and lack of localized split-payment alternatives.",
      architecture: "Engineered a custom Stripe Elements integration with 1-tap Apple Pay / Google Pay, biometric payment confirmation, and automated currency routing.",
      outcome: "230% checkout conversion lift in three weeks; average transaction completion time decreased from 92 seconds to 14 seconds.",
      metrics: [
        { val: "+230%", lbl: "Checkout Lift" },
        { val: "14s", lbl: "Checkout Time" },
        { val: "99.9%", lbl: "Payment Success" }
      ],
      ctaText: "Discuss a payment checkout build like Aura Pay"
    },
    luminary: {
      brand: "Luminary Studio",
      title: "Complete brand architecture and high-velocity digital agency portal",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
      tags: ["Agency Portal", "Editorial Design", "High-Ticket Intake", "Performance"],
      problem: "Creative agency struggling to close 6-figure enterprise contracts due to an outdated generic portfolio that failed to convey authority.",
      architecture: "Crafted an ultra-minimalist editorial design language, high-speed case media rendering, and an automated client qualification questionnaire.",
      outcome: "Average closed deal size grew by 2.8x (from $15k to $42k+), and inbound client inquiry volume doubled within 45 days of launch.",
      metrics: [
        { val: "2.8x", lbl: "Deal Size Growth" },
        { val: "+100%", lbl: "Inbound Pipeline" },
        { val: "100/100", lbl: "Lighthouse Score" }
      ],
      ctaText: "Discuss a high-ticket agency portal like Luminary"
    },
    orbit: {
      brand: "Orbit Cloud",
      title: "Multi-step self-serve onboarding funnel and automated billing engine",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      tags: ["Cloud Infra", "Developer UX", "Onboarding", "Stripe Billing"],
      problem: "Complex cloud configuration steps caused 48% of developers to abandon signups before deploying their first container instance.",
      architecture: "Constructed an interactive 1-click template deployer, streamlined OAuth authentication, and clear real-time usage cost estimation calculator.",
      outcome: "Developer signup drop-off collapsed from 48% down to 11%, successfully deploying over 4,200 new cloud clusters in the first month.",
      metrics: [
        { val: "11%", lbl: "Drop-off (from 48%)" },
        { val: "4,200+", lbl: "Clusters Active" },
        { val: "3.8x", lbl: "Activation Rate" }
      ],
      ctaText: "Discuss a developer funnel like Orbit Cloud"
    }
  };

  const caseDrawer = document.getElementById("case-drawer");
  const caseBackdrop = document.getElementById("case-drawer-backdrop");
  const caseCloseBtn = document.getElementById("case-drawer-close");

  const drawerBrand = document.getElementById("case-drawer-brand");
  const drawerImg = document.getElementById("case-drawer-img");
  const drawerTags = document.getElementById("case-drawer-tags");
  const drawerTitle = document.getElementById("case-drawer-title");
  const drawerProblem = document.getElementById("case-drawer-problem");
  const drawerArchitecture = document.getElementById("case-drawer-architecture");
  const drawerOutcome = document.getElementById("case-drawer-outcome");
  const drawerMetrics = document.getElementById("case-drawer-metrics");
  const drawerCtaText = document.getElementById("case-drawer-cta-text");
  const drawerWhatsApp = document.getElementById("case-drawer-whatsapp");

  let lastFocusedEl = null;

  const openCaseDrawer = (caseKey) => {
    const data = caseStudiesData[caseKey];
    if (!data || !caseDrawer) return;

    lastFocusedEl = document.activeElement;

    if (drawerBrand) drawerBrand.textContent = data.brand;
    if (drawerImg) {
      drawerImg.src = data.image;
      drawerImg.alt = data.brand;
    }
    if (drawerTitle) drawerTitle.textContent = data.title;
    if (drawerProblem) drawerProblem.textContent = data.problem;
    if (drawerArchitecture) drawerArchitecture.textContent = data.architecture;
    if (drawerOutcome) drawerOutcome.textContent = data.outcome;

    if (drawerTags) { drawerTags.innerHTML = ""; }

    if (drawerMetrics) {
      drawerMetrics.innerHTML = data.metrics.map((m) => `
        <div class="case-metric-box">
          <span class="case-metric-val">${m.val}</span>
          <span class="case-metric-lbl">${m.lbl}</span>
        </div>
      `).join("");
    }

    if (drawerCtaText) drawerCtaText.textContent = `Want a digital system engineered like ${data.brand}?`;
    if (drawerWhatsApp) {
      const msg = encodeURIComponent(`Hi Michael, I saw the ${data.brand} case study on AlphaTNX Digital and want to discuss a similar project.`);
      drawerWhatsApp.href = `https://wa.me/2349064316439?text=${msg}`;
    }

    caseDrawer.classList.add("is-open");
    caseDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (caseCloseBtn) caseCloseBtn.focus();
  };

  const closeCaseDrawer = () => {
    if (!caseDrawer || !caseDrawer.classList.contains("is-open")) return;
    caseDrawer.classList.remove("is-open");
    caseDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  };

  if (caseBackdrop) caseBackdrop.addEventListener("click", closeCaseDrawer);
  if (caseCloseBtn) caseCloseBtn.addEventListener("click", closeCaseDrawer);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && caseDrawer && caseDrawer.classList.contains("is-open")) {
      closeCaseDrawer();
    }
  });

  // Attach click listeners to all .cw-card elements
  document.querySelectorAll(".cw-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      // If user is actively dragging the carousel, don't trigger modal
      if (card.parentElement && card.parentElement.classList.contains("cw-dragging")) return;

      const caseKey = card.dataset.case || card.id || (card.getAttribute("href") || "").split("#")[1];
      if (caseKey && caseStudiesData[caseKey]) {
        e.preventDefault();
        openCaseDrawer(caseKey);
      }
    });
  });

  // Check URL hash on page load (e.g. /work#apex opens apex drawer)
  window.addEventListener("DOMContentLoaded", () => {
    const hash = (window.location.hash || "").replace("#", "");
    if (hash && caseStudiesData[hash]) {
      setTimeout(() => openCaseDrawer(hash), 400);
    }
    if (hash && solutionsData[hash]) {
      setTimeout(() => openSolutionDrawer(hash), 400);
    }
  });

  // ==========================================================================
  // BUSINESS TOOLS CALCULATORS & INTERACTIVITY & MODAL OVERLAYS
  // ==========================================================================
  const formatNaira = (num) => "₦" + Math.round(num).toLocaleString();

  // Tool Overlay Modal Controller (for tools.html on-site interactive overlays)
  const openToolModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const closeBtn = modal.querySelector(".tool-overlay-close");
    if (closeBtn) closeBtn.focus();
  };

  const closeToolModal = (modal) => {
    if (!modal) {
      document.querySelectorAll(".tool-overlay-modal.is-open").forEach(m => closeToolModal(m));
      return;
    }
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.querySelectorAll("[data-tool-target], [data-lib-target]").forEach((card) => {
    const targetId = card.dataset.toolTarget || card.dataset.libTarget;
    card.addEventListener("click", () => openToolModal(targetId));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openToolModal(targetId);
      }
    });
  });

  document.querySelectorAll(".tool-overlay-modal").forEach((modal) => {
    const backdrop = modal.querySelector(".tool-overlay-backdrop");
    const closeBtn = modal.querySelector(".tool-overlay-close");

    if (backdrop) backdrop.addEventListener("click", () => closeToolModal(modal));
    if (closeBtn) closeBtn.addEventListener("click", () => closeToolModal(modal));
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openModal = document.querySelector(".tool-overlay-modal.is-open");
      if (openModal) closeToolModal(openModal);
    }
  });

  // Resources Nav Dropdown Click Toggle for accessibility and touch devices
  document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
    const btn = dropdown.querySelector(".nav-dropdown-btn");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("is-open");
      dropdown.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", !isOpen ? "true" : "false");
    });
  });

  document.addEventListener("click", (e) => {
    document.querySelectorAll(".nav-dropdown.is-open").forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("is-open");
        const btn = dropdown.querySelector(".nav-dropdown-btn");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Business Library Download Button Feedback
  document.querySelectorAll(".lib-download-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const docName = btn.dataset.doc || "Template";
      const origText = btn.innerHTML;
      btn.innerHTML = "Preparing download...";
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = "Downloaded ✓";
        setTimeout(() => {
          btn.innerHTML = origText;
          btn.disabled = false;
        }, 2200);
      }, 700);
    });
  });

  // 1. Speed & Revenue Lost Calculator
  const calcRev = document.getElementById("calc-rev");
  const calcSpeed = document.getElementById("calc-speed");
  const speedVal = document.getElementById("speed-val");
  const lostRevVal = document.getElementById("lost-rev-val");
  const annualRevVal = document.getElementById("annual-rev-val");

  const updateSpeedCalc = () => {
    if (!calcRev || !calcSpeed) return;
    const rev = parseFloat(calcRev.value) || 0;
    const speed = parseFloat(calcSpeed.value) || 1;
    if (speedVal) speedVal.textContent = speed.toFixed(1);

    // Baseline is 1.0s. Each second above 1.0s costs ~6% in bounce & abandonment
    const delay = Math.max(0, speed - 1.0);
    const lostPct = Math.min(0.65, delay * 0.055);
    const lostMonthly = rev * lostPct;
    const lostAnnual = lostMonthly * 12;

    if (lostRevVal) lostRevVal.textContent = formatNaira(lostMonthly);
    if (annualRevVal) annualRevVal.textContent = formatNaira(lostAnnual);
  };

  if (calcRev) calcRev.addEventListener("input", updateSpeedCalc);
  if (calcSpeed) calcSpeed.addEventListener("input", updateSpeedCalc);

  // 2. Operations & Automation Savings Calculator
  const calcOrders = document.getElementById("calc-orders");
  const calcStaff = document.getElementById("calc-staff");
  const hoursLostVal = document.getElementById("hours-lost-val");
  const annualHoursVal = document.getElementById("annual-hours-val");

  const updateAutomationCalc = () => {
    if (!calcOrders || !calcStaff) return;
    const orders = parseFloat(calcOrders.value) || 0;
    const staff = parseFloat(calcStaff.value) || 1;

    // ~8 minutes of manual messaging/reconciliation per order
    const weeklyHours = (orders * 8) / 60 + (staff * 2.5);
    const annualHours = weeklyHours * 52;

    if (hoursLostVal) hoursLostVal.textContent = weeklyHours.toFixed(1) + " hrs / week";
    if (annualHoursVal) annualHoursVal.textContent = Math.round(annualHours).toLocaleString() + " hrs / year";
  };

  if (calcOrders) calcOrders.addEventListener("input", updateAutomationCalc);
  if (calcStaff) calcStaff.addEventListener("input", updateAutomationCalc);

  // 3. Payment Gateway Fee Calculator
  const calcTicket = document.getElementById("calc-ticket");
  const calcVolume = document.getElementById("calc-volume");
  const gatewayFeesVal = document.getElementById("gateway-fees-val");
  const marginVal = document.getElementById("margin-val");

  const updateGatewayCalc = () => {
    if (!calcTicket || !calcVolume) return;
    const ticket = parseFloat(calcTicket.value) || 1;
    const volume = parseFloat(calcVolume.value) || 0;

    const numOrders = volume / ticket;
    // Paystack/Flutterwave standard: 1.5% capped at 2000 Naira per transaction + ₦100 on >2500
    const feePerOrder = Math.min(2000, ticket * 0.015 + (ticket >= 2500 ? 100 : 0));
    const totalFees = numOrders * feePerOrder;
    const effectivePct = volume > 0 ? ((volume - totalFees) / volume) * 100 : 100;

    if (gatewayFeesVal) gatewayFeesVal.textContent = formatNaira(totalFees) + " / mo";
    if (marginVal) marginVal.textContent = effectivePct.toFixed(1) + "% Net Payout";
  };

  if (calcTicket) calcTicket.addEventListener("input", updateGatewayCalc);
  if (calcVolume) calcVolume.addEventListener("input", updateGatewayCalc);

  // ==========================================================================
  // NEWSLETTER FORM SUBMISSION
  // ==========================================================================
  const nlForm = document.getElementById("newsletter-form");
  const nlSuccess = document.getElementById("newsletter-success");
  if (nlForm) {
    nlForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("nl-name");
      const emailInput = document.getElementById("nl-email");

      if (!emailInput || !emailInput.value.includes("@")) {
        emailInput.focus();
        return;
      }

      // Show immediate success state with smooth transition
      nlForm.style.display = "none";
      if (nlSuccess) {
        nlSuccess.style.display = "block";
        nlSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

})();
