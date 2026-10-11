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
      tag: "03 · Systemize & Automate",
      title: "Systemize and Automate Your Business",
      category: ["Custom Dashboards", "Inventory Tracking", "Workflow Automations", "CRM & Reports"],
      problem: "Managing orders, inventory, and customer follow-ups across messy WhatsApp chats, manual screenshots, and fragmented spreadsheets drains hours and causes costly errors.",
      deliverables: "We develop dedicated internal tools, real-time inventory trackers, customer relationship managers (CRM), automated WhatsApp receipts, and live executive dashboards.",
      features: [
        { val: "Zero", lbl: "Spreadsheet Chaos" },
        { val: "Real-Time", lbl: "Inventory & Sales Sync" },
        { val: "15+ hrs", lbl: "Weekly Time Saved" },
        { val: "Live", lbl: "Revenue Analytics" }
      ],
      outcome: "Complete operational clarity across all branches, automated order and payment routing, and real-time revenue tracking without repetitive manual busywork.",
      workLinkText: "See Internal Tools & Dashboards We've Built for Others →",
      workLinkHref: "/work",
      ctaPrompt: "Ready to systemize and automate your business operations?",
      whatsappMsg: "Hi AlphaTNX Digital, I'd like to systemize and automate our business operations and workflows."
    },
    "custom-software": {
      tag: "04 · Build Something New",
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
      tag: "05 · Keep It Running",
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

  // Route all elements with [data-solution] directly to their dedicated landing pages
  document.querySelectorAll("[data-solution]").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (el.parentElement && el.parentElement.classList.contains("sol-dragging")) return;
      const solKey = el.dataset.solution;
      if (solKey) {
        e.preventDefault();
        if (solKey === "sell-online") {
          window.location.href = "/sell-online";
        } else if (solKey === "get-online") {
          window.location.href = "/get-online";
        } else {
          window.location.href = `/solution-${solKey}`;
        }
      }
    });
  });

  // 14. Case Study Quick-View Drawer (3-Part Problem / Architecture / Outcome Framework)
  const caseStudiesData = {
    industry: {
      name: "ThE iNdusTry",
      brand: "ThE iNdusTry · Cavanindustry.com",
      title: "Building an E-Commerce Store for ThE iNdusTry — Taking a Gadget Brand Online",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      tags: ["E-Commerce", "WhatsApp Orders", "Admin Product Upload", "Gadgets & Accessories"],
      problem: "<p>This client is a gadget and accessories vendor who previously managed sales entirely through direct messaging and social media chats. Without a structured catalog, potential buyers faced endless back-and-forth asking for available models, prices, and specifications, while the vendor suffered from manual order logging, lost conversations, and delayed response times.</p>",
      architecture: `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">1. Intuitive, Mobile-First User Interface</strong>
            <p style="margin: 0;">We designed a clean, high-speed product catalog tailored for mobile shoppers. Customers can seamlessly browse categories, filter tech accessories, inspect item specs, and view high-resolution product imagery with zero friction or clutter.</p>
          </div>
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">2. Frictionless Cart & Instant WhatsApp Order Routing</strong>
            <p style="margin: 0;">Shoppers add items to a persistent shopping bag. When they checkout, the system automatically compiles an itemized summary—including product names, selected variants, quantities, and calculated totals—and sends it straight to the vendor’s WhatsApp in one click, eliminating manual data entry.</p>
          </div>
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">3. Dedicated Merchant Admin Upload Portal</strong>
            <p style="margin: 0;">Equipped the client with an autonomous, password-protected admin dashboard to easily upload new gadget inventory, update prices, adjust stock availability, and manage categories directly from any smartphone or PC without writing code.</p>
          </div>
        </div>
      `,
      outcome: "<p>A high-converting digital storefront that cuts order confirmation time to zero, eliminates product discovery friction, and gives the vendor complete independence to manage stock effortlessly.</p>",
      metrics: [
        { val: "1-Click", lbl: "WhatsApp Order" },
        { val: "100%", lbl: "Mobile Friendly" },
        { val: "Instant", lbl: "Admin Product Upload" }
      ],
      liveUrl: "https://cavanindustry.com",
      ctaText: "Discuss an e-commerce build like ThE iNdusTry"
    },
    demomart: {
      name: "Demo Mart",
      brand: "Demo Mart · Demomart-nine.vercel.app",
      title: "Taking Demo Mart from a Physical Supermarket to an Automated Online Store",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      tags: ["Supermarket E-Commerce", "Paystack Payments", "WhatsApp Orders", "Inventory Management", "Staff Access"],
      problem: "<p>A physical supermarket business looking to expand into digital sales while avoiding operational bottlenecks, manual bank transfer reconciliations, and inventory mismatches across hundreds of grocery items.</p>",
      architecture: `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">1. Hands-Off Paystack Payment Gateway</strong>
            <p style="margin: 0;">Integrated secure online checkout with Paystack supporting cards, bank transfers, and USSD. Payments are verified instantly and automatically, removing the risk of fake alerts and eliminating manual account confirmations.</p>
          </div>
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">2. Real-Time Centralized Inventory Tracking</strong>
            <p style="margin: 0;">Automated stock deduction as orders are placed, ensuring items that run out are instantly marked out-of-stock across the store to prevent overselling and customer disappointment.</p>
          </div>
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">3. Role-Based Admin & Staff Access</strong>
            <p style="margin: 0;">Tiered permission architecture where store staff have dedicated views to view, pick, pack, and mark customer orders as dispatched, while management retains exclusive access to revenue analytics, pricing controls, and catalog edits.</p>
          </div>
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">4. Multi-Category Customer Shopping & Cart Management</strong>
            <p style="margin: 0;">A lightning-fast customer interface with aisle-based category filtering, quick search across all grocery departments, and flexible checkout options via online payment or direct WhatsApp assistance.</p>
          </div>
        </div>
      `,
      outcome: "<p>A fully automated digital supermarket operating 24/7, processing hands-off payments, and giving store management total operational visibility across all inventory and orders.</p>",
      metrics: [
        { val: "Hands-Off", lbl: "Paystack Payments" },
        { val: "Live", lbl: "Inventory Tracking" },
        { val: "Role-Based", lbl: "Admin & Staff Access" }
      ],
      liveUrl: "https://demomart-nine.vercel.app/",
      ctaText: "Discuss a supermarket e-commerce system like Demo Mart"
    },
    debbys: {
      name: "Debby's Fragrance",
      brand: "Debby's Fragrance · Debbys-fragrance.vercel.app",
      title: "Building an On-Brand E-Commerce Store for Debby's Fragrance — Bringing a Luxury Perfume Boutique Online",
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80",
      tags: ["Fragrance & Beauty", "On-Brand Storefront", "WhatsApp Orders", "Cart Management"],
      problem: "<p>A boutique feminine fragrance brand relying on social media posts where potential buyers frequently dropped off due to lack of detailed scent notes, structured bottle sizing options, and an official branded checkout experience.</p>",
      architecture: `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">1. Clean, Luxury On-Brand Visual Interface</strong>
            <p style="margin: 0;">Engineered a bespoke feminine aesthetic with delicate typography, high-resolution imagery, and structured product profiles detailing top/heart/base fragrance notes and bottle sizes to build immediate luxury appeal and trust.</p>
          </div>
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">2. Smooth Cart Management & Transparent Totals</strong>
            <p style="margin: 0;">Shoppers can browse perfume collections, add multiple bottles or gift sets to their shopping bag, adjust quantities on the fly, and view transparent itemized totals in one tap.</p>
          </div>
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">3. 1-Click WhatsApp Concierge Order Closing</strong>
            <p style="margin: 0;">Pre-formats customer orders with exact perfume names, sizes, delivery locations, and calculated amounts into a structured WhatsApp message, making closing sales personalized and completely frictionless.</p>
          </div>
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">4. Mobile Speed & Conversion Optimization</strong>
            <p style="margin: 0;">Optimized for rapid loading on mobile networks so traffic coming directly from Instagram, TikTok, and WhatsApp statuses experiences instant page loads with zero drop-off.</p>
          </div>
        </div>
      `,
      outcome: "<p>An elevated, credible online boutique that converts social media engagement into confirmed orders and establishes the brand as a premier perfume destination.</p>",
      metrics: [
        { val: "Bespoke", lbl: "On-Brand Design" },
        { val: "Direct", lbl: "WhatsApp Orders" },
        { val: "Smooth", lbl: "Cart Management" }
      ],
      liveUrl: "https://debbys-fragrance.vercel.app/",
      ctaText: "Discuss an e-commerce store like Debby's Fragrance"
    },
    // Aliases for backwards compatibility
    apex: {
      name: "ThE iNdusTry",
      brand: "ThE iNdusTry · Cavanindustry.com",
      title: "Building an E-Commerce Store for ThE iNdusTry — Taking a Gadget Brand Online",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      tags: ["E-Commerce", "WhatsApp Orders", "Admin Product Upload"],
      problem: "<p>This client is a gadget and accessories vendor who previously managed sales entirely through direct messaging and social media chats.</p>",
      architecture: `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">1. Intuitive, Mobile-First User Interface</strong>
            <p style="margin: 0;">Clean, high-speed product catalog tailored for mobile shoppers to browse gadget accessories and specs easily.</p>
          </div>
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">2. Frictionless Cart & WhatsApp Routing</strong>
            <p style="margin: 0;">Shoppers add items to bag and order via structured WhatsApp messages instantly.</p>
          </div>
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">3. Dedicated Admin Portal</strong>
            <p style="margin: 0;">Password-protected dashboard for client product uploads and price management without writing code.</p>
          </div>
        </div>
      `,
      outcome: "<p>A high-converting online storefront with frictionless direct-to-WhatsApp checkout.</p>",
      metrics: [{ val: "1-Click", lbl: "WhatsApp Order" }, { val: "100%", lbl: "Mobile Friendly" }],
      liveUrl: "https://cavanindustry.com",
      ctaText: "Discuss an e-commerce build like ThE iNdusTry"
    },
    vortex: {
      name: "Demo Mart",
      brand: "Demo Mart · Demomart-nine.vercel.app",
      title: "Taking Demo Mart from a Physical Supermarket to an Automated Online Store",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      tags: ["Supermarket E-Commerce", "Paystack Payments", "WhatsApp Orders", "Inventory Management"],
      problem: "<p>A supermarket retail business needing automated hands-off payment collection and inventory control.</p>",
      architecture: `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">1. Paystack Payment Gateway</strong>
            <p style="margin: 0;">Automated card and transfer payment processing with instant verification.</p>
          </div>
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">2. Real-Time Inventory Control</strong>
            <p style="margin: 0;">Live inventory tracking preventing overselling of grocery stock.</p>
          </div>
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">3. Role-Based Permissions</strong>
            <p style="margin: 0;">Staff packing access vs administrator catalog and financial access.</p>
          </div>
        </div>
      `,
      outcome: "<p>Hands-off payment processing and real-time inventory management.</p>",
      metrics: [{ val: "Hands-Off", lbl: "Paystack Payments" }, { val: "Live", lbl: "Inventory Tracking" }],
      liveUrl: "https://demomart-nine.vercel.app/",
      ctaText: "Discuss a supermarket store like Demo Mart"
    },
    novak: {
      name: "Debby's Fragrance",
      brand: "Debby's Fragrance · Debbys-fragrance.vercel.app",
      title: "Building an On-Brand E-Commerce Store for Debby's Fragrance — Bringing a Luxury Perfume Boutique Online",
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80",
      tags: ["Fragrance & Beauty", "On-Brand Storefront", "WhatsApp Orders"],
      problem: "<p>A boutique feminine perfume brand needed an elegant on-brand digital presence to convert social traffic.</p>",
      architecture: `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">1. Luxury Visual Interface</strong>
            <p style="margin: 0;">Custom-crafted aesthetics with perfume notes, bottle sizes, and elegance.</p>
          </div>
          <div>
            <strong style="color: var(--foreground-strong); display: block; margin-bottom: 0.25rem;">2. WhatsApp Order Dispatch</strong>
            <p style="margin: 0;">Structured WhatsApp ordering for seamless personalized concierge closing.</p>
          </div>
        </div>
      `,
      outcome: "<p>An elevated luxury brand presence driving direct sales.</p>",
      metrics: [{ val: "Bespoke", lbl: "On-Brand Design" }, { val: "Direct", lbl: "WhatsApp Orders" }],
      liveUrl: "https://debbys-fragrance.vercel.app/",
      ctaText: "Discuss an e-commerce store like Debby's Fragrance"
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
  const drawerLiveLink = document.getElementById("case-drawer-livelink");

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
    if (drawerProblem) drawerProblem.innerHTML = data.problem;
    if (drawerArchitecture) drawerArchitecture.innerHTML = data.architecture;
    if (drawerOutcome) drawerOutcome.innerHTML = data.outcome;

    if (drawerTags) { drawerTags.innerHTML = ""; }

    if (drawerMetrics) {
      drawerMetrics.innerHTML = data.metrics.map((m) => `
        <div class="case-metric-box">
          <span class="case-metric-val">${m.val}</span>
          <span class="case-metric-lbl">${m.lbl}</span>
        </div>
      `).join("");
    }

    if (drawerLiveLink) {
      if (data.liveUrl) {
        drawerLiveLink.href = data.liveUrl;
        drawerLiveLink.style.display = "inline-flex";
      } else {
        drawerLiveLink.style.display = "none";
      }
    }

    const cleanBrandName = data.name || data.brand.split(" · ")[0];
    if (drawerCtaText) drawerCtaText.textContent = `Want a digital system engineered like ${cleanBrandName}?`;
    if (drawerWhatsApp) {
      const msg = encodeURIComponent(`Hi AlphaTNX Digital, I saw the ${cleanBrandName} case study and want to discuss a similar project for my business.`);
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
  // 4. PROFIT MARGIN CALCULATOR (IMMEDIATE, ZERO-EMAIL, SHAREABLE & 30-MIN WIPE)
  // ==========================================================================
  const profitMarginWrappers = document.querySelectorAll(".profit-margin-calc-module");

  profitMarginWrappers.forEach((wrapper) => {
    const currSelect = wrapper.querySelector(".calc-currency");
    const nameInput = wrapper.querySelector(".calc-product-name");
    const priceInput = wrapper.querySelector(".calc-price");
    const cogsInput = wrapper.querySelector(".calc-cogs");
    const shipInput = wrapper.querySelector(".calc-shipping");
    const feeInput = wrapper.querySelector(".calc-fee");
    const mktInput = wrapper.querySelector(".calc-marketing");
    const volInput = wrapper.querySelector(".calc-volume-units");
    const volDisplay = wrapper.querySelector(".calc-volume-display");

    // Output elements
    const profitVal = wrapper.querySelector(".res-profit-val");
    const marginVal = wrapper.querySelector(".res-margin-val");
    const markupVal = wrapper.querySelector(".res-markup-val");
    const healthBadge = wrapper.querySelector(".res-health-badge");
    const healthDesc = wrapper.querySelector(".res-health-desc");

    // Visual bar
    const barCogs = wrapper.querySelector(".margin-bar-seg-cogs");
    const barExtras = wrapper.querySelector(".margin-bar-seg-extras");
    const barProfit = wrapper.querySelector(".margin-bar-seg-profit");

    // Table elements
    const tblPrice = wrapper.querySelector(".res-tbl-price");
    const tblCogs = wrapper.querySelector(".res-tbl-cogs");
    const tblExtras = wrapper.querySelector(".res-tbl-extras");
    const tblTotalCost = wrapper.querySelector(".res-tbl-total-cost");
    const tblGrossProfit = wrapper.querySelector(".res-tbl-gross-profit");

    // Monthly volume projection
    const projRev = wrapper.querySelector(".res-proj-rev");
    const projProfit = wrapper.querySelector(".res-proj-profit");

    // Action buttons
    const copyBtn = wrapper.querySelector(".btn-copy-calc");
    const shareBtn = wrapper.querySelector(".btn-share-calc");
    const downloadBtn = wrapper.querySelector(".btn-download-calc");
    const wipeBtn = wrapper.querySelector(".btn-wipe-data");
    const toast = document.querySelector(".margin-toast") || wrapper.querySelector(".margin-toast");
    const timerDisplay = wrapper.querySelector(".session-timer-display");

    const STORAGE_KEY = "alphatnx_margin_session";
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in ms

    const showToast = (msg) => {
      const targetToast = document.querySelector(".margin-toast") || toast;
      if (!targetToast) return;
      targetToast.textContent = msg;
      targetToast.classList.add("is-active");
      setTimeout(() => {
        targetToast.classList.remove("is-active");
      }, 3000);
    };

    const getCurrencySymbol = () => {
      return currSelect ? currSelect.value : "₦";
    };

    const formatCurrency = (val, symbol) => {
      const sym = symbol !== undefined ? symbol : getCurrencySymbol();
      const num = Math.round(val);
      const isNegative = num < 0;
      const formatted = Math.abs(num).toLocaleString();
      return isNegative ? `-${sym}${formatted}` : `${sym}${formatted}`;
    };

    // Calculate in real-time
    const runCalculation = (saveToStorage = true) => {
      if (!priceInput || !cogsInput) return;

      const sym = getCurrencySymbol();
      const price = parseFloat(priceInput.value) || 0;
      const cogs = parseFloat(cogsInput.value) || 0;
      const shipping = shipInput ? parseFloat(shipInput.value) || 0 : 0;
      const fee = feeInput ? parseFloat(feeInput.value) || 0 : 0;
      const marketing = mktInput ? parseFloat(mktInput.value) || 0 : 0;
      const volume = volInput ? parseInt(volInput.value, 10) || 1 : 1;

      if (volDisplay) volDisplay.textContent = volume.toLocaleString() + " units";

      const extras = shipping + fee + marketing;
      const totalCost = cogs + extras;
      const grossProfit = price - totalCost;

      const grossMarginPct = price > 0 ? (grossProfit / price) * 100 : 0;
      const markupPct = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0;

      // Update primary metric pills
      if (profitVal) {
        profitVal.textContent = formatCurrency(grossProfit, sym);
        profitVal.className = "margin-stat-val " + (grossProfit < 0 ? "text-danger" : (grossProfit === 0 ? "" : "text-accent"));
      }
      if (marginVal) {
        marginVal.textContent = (grossMarginPct).toFixed(1) + "%";
        marginVal.className = "margin-stat-val " + (grossMarginPct < 15 ? "text-danger" : (grossMarginPct < 30 ? "text-warning" : "text-accent"));
      }
      if (markupVal) {
        markupVal.textContent = (markupPct).toFixed(1) + "%";
      }

      // Update Health Assessment
      if (healthBadge) {
        if (price === 0) {
          healthBadge.className = "margin-health-badge is-warning";
          healthBadge.innerHTML = "<span>Enter your selling price to calculate margin</span>";
        } else if (grossProfit < 0) {
          healthBadge.className = "margin-health-badge is-low";
          healthBadge.innerHTML = "<span>⚠️ Operating at a Loss (" + grossMarginPct.toFixed(1) + "%)</span>";
        } else if (grossMarginPct < 15) {
          healthBadge.className = "margin-health-badge is-low";
          healthBadge.innerHTML = "<span>⚠️ Thin Margin (" + grossMarginPct.toFixed(1) + "%) — High risk to supply or delivery shocks</span>";
        } else if (grossMarginPct < 35) {
          healthBadge.className = "margin-health-badge is-healthy";
          healthBadge.innerHTML = "<span>✓ Healthy Retail Margin (" + grossMarginPct.toFixed(1) + "%) — Sustainable for e-commerce</span>";
        } else if (grossMarginPct < 60) {
          healthBadge.className = "margin-health-badge is-strong";
          healthBadge.innerHTML = "<span>⚡ Strong Margin (" + grossMarginPct.toFixed(1) + "%) — Excellent headroom for marketing</span>";
        } else {
          healthBadge.className = "margin-health-badge is-strong";
          healthBadge.innerHTML = "<span>💎 Premium Margin (" + grossMarginPct.toFixed(1) + "%) — Exceptional brand pricing power</span>";
        }
      }

      if (healthDesc) {
        if (grossProfit < 0) {
          healthDesc.textContent = "Your direct cost of goods and delivery exceeds your selling price. Every unit sold loses money. Review supplier prices, renegotiate terms, or raise base prices immediately.";
        } else if (grossMarginPct < 15) {
          healthDesc.textContent = "A margin under 15% leaves little buffer for exchange rate volatility, delivery failures, or return costs. Consider product bundles, raising order minimums, or improving supplier deals.";
        } else if (grossMarginPct < 35) {
          healthDesc.textContent = "A 15%–35% margin is a proven, healthy benchmark for high-velocity physical retail, groceries, and fast-moving consumer goods. Focus on repeat sales and streamlined operations.";
        } else if (grossMarginPct < 60) {
          healthDesc.textContent = "Margins between 35%–60% give your business substantial profit margins to invest aggressively into paid ads, customer acquisition, and professional systems.";
        } else {
          healthDesc.textContent = "Margins above 60% indicate superior product differentiation or premium luxury positioning. Maintain brand value and automate fulfillment workflows.";
        }
      }

      // Update Visual Bar
      if (barCogs && barExtras && barProfit) {
        if (price > 0 && totalCost <= price) {
          const cogsPct = Math.max(0, (cogs / price) * 100);
          const extrasPct = Math.max(0, (extras / price) * 100);
          const profitPct = Math.max(0, grossMarginPct);
          barCogs.style.width = cogsPct + "%";
          barExtras.style.width = extrasPct + "%";
          barProfit.style.width = profitPct + "%";
        } else if (price > 0) {
          barCogs.style.width = "75%";
          barExtras.style.width = "25%";
          barProfit.style.width = "0%";
        } else {
          barCogs.style.width = "50%";
          barExtras.style.width = "20%";
          barProfit.style.width = "30%";
        }
      }

      // Update Financial Table
      if (tblPrice) tblPrice.textContent = formatCurrency(price, sym);
      if (tblCogs) tblCogs.textContent = formatCurrency(cogs, sym);
      if (tblExtras) tblExtras.textContent = formatCurrency(extras, sym);
      if (tblTotalCost) tblTotalCost.textContent = formatCurrency(totalCost, sym);
      if (tblGrossProfit) {
        tblGrossProfit.textContent = formatCurrency(grossProfit, sym);
        tblGrossProfit.className = grossProfit < 0 ? "text-danger" : "text-accent";
      }

      // Update Monthly Projections
      if (projRev) projRev.textContent = formatCurrency(price * volume, sym);
      if (projProfit) {
        projProfit.textContent = formatCurrency(grossProfit * volume, sym);
        projProfit.className = "result-val " + (grossProfit < 0 ? "text-danger" : "text-accent");
      }

      // Save to localStorage with 30-minute expiry
      if (saveToStorage) {
        const sessionPayload = {
          expiresAt: Date.now() + SESSION_DURATION,
          data: {
            curr: sym,
            name: nameInput ? nameInput.value : "",
            price: price,
            cogs: cogs,
            ship: shipping,
            fee: fee,
            mkt: marketing,
            vol: volume
          }
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionPayload));
        } catch (e) {}
      }
    };

    // Auto-wipe session countdown & cleaner
    const updateCountdown = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
          if (timerDisplay) timerDisplay.textContent = "30:00";
          return;
        }
        const session = JSON.parse(stored);
        const remaining = session.expiresAt - Date.now();
        if (remaining <= 0) {
          wipeData(false);
          if (timerDisplay) timerDisplay.textContent = "Wiped";
          return;
        }
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        if (timerDisplay) {
          timerDisplay.textContent = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }
      } catch (e) {}
    };

    const wipeData = (triggerToast = true) => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      if (priceInput) priceInput.value = "";
      if (cogsInput) cogsInput.value = "";
      if (shipInput) shipInput.value = "";
      if (feeInput) feeInput.value = "";
      if (mktInput) mktInput.value = "";
      if (nameInput) nameInput.value = "";
      if (volInput) volInput.value = "50";
      runCalculation(false);
      if (timerDisplay) timerDisplay.textContent = "30:00";
      if (triggerToast) showToast("✓ Session data wiped from system");
    };

    // Load from URL query parameters OR storage
    const loadInitialData = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("price") || urlParams.has("cogs")) {
        if (currSelect && urlParams.has("curr")) currSelect.value = urlParams.get("curr");
        if (nameInput && urlParams.has("name")) nameInput.value = urlParams.get("name");
        if (priceInput && urlParams.has("price")) priceInput.value = urlParams.get("price");
        if (cogsInput && urlParams.has("cogs")) cogsInput.value = urlParams.get("cogs");
        if (shipInput && urlParams.has("ship")) shipInput.value = urlParams.get("ship");
        if (feeInput && urlParams.has("fee")) feeInput.value = urlParams.get("fee");
        if (mktInput && urlParams.has("mkt")) mktInput.value = urlParams.get("mkt");
        if (volInput && urlParams.has("vol")) volInput.value = urlParams.get("vol");
        runCalculation(true);
        return;
      }

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const session = JSON.parse(stored);
          if (Date.now() < session.expiresAt && session.data) {
            const d = session.data;
            if (currSelect && d.curr) currSelect.value = d.curr;
            if (nameInput && d.name) nameInput.value = d.name;
            if (priceInput && d.price !== undefined) priceInput.value = d.price;
            if (cogsInput && d.cogs !== undefined) cogsInput.value = d.cogs;
            if (shipInput && d.ship !== undefined) shipInput.value = d.ship;
            if (feeInput && d.fee !== undefined) feeInput.value = d.fee;
            if (mktInput && d.mkt !== undefined) mktInput.value = d.mkt;
            if (volInput && d.vol !== undefined) volInput.value = d.vol;
            runCalculation(false);
            return;
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (e) {}

      // Default calculation if blank
      runCalculation(false);
    };

    // Listeners for live typing
    [priceInput, cogsInput, shipInput, feeInput, mktInput, nameInput].forEach((inp) => {
      if (inp) {
        inp.addEventListener("input", () => runCalculation(true));
      }
    });

    if (currSelect) {
      currSelect.addEventListener("change", () => runCalculation(true));
    }

    if (volInput) {
      volInput.addEventListener("input", () => runCalculation(true));
    }

    // Copy Summary Action
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const sym = getCurrencySymbol();
        const pName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Product / SKU";
        const price = parseFloat(priceInput ? priceInput.value : 0) || 0;
        const cogs = parseFloat(cogsInput ? cogsInput.value : 0) || 0;
        const shipping = shipInput ? parseFloat(shipInput.value) || 0 : 0;
        const fee = feeInput ? parseFloat(feeInput.value) || 0 : 0;
        const marketing = mktInput ? parseFloat(mktInput.value) || 0 : 0;
        const volume = volInput ? parseInt(volInput.value, 10) || 1 : 1;

        const totalCost = cogs + shipping + fee + marketing;
        const profit = price - totalCost;
        const marginPct = price > 0 ? ((profit / price) * 100).toFixed(1) : "0.0";
        const markupPct = totalCost > 0 ? ((profit / totalCost) * 100).toFixed(1) : "0.0";

        const text = `===========================================
AlphaTNX Digital · Profit Margin Calculation
===========================================
Product: ${pName}
Selling Price: ${formatCurrency(price, sym)}

DIRECT COSTS:
- Product / COGS: ${formatCurrency(cogs, sym)}
- Shipping & Packaging: ${formatCurrency(shipping, sym)}
- Gateway & Transaction Fee: ${formatCurrency(fee, sym)}
- Marketing & Ad CAC: ${formatCurrency(marketing, sym)}
Total Direct Cost: ${formatCurrency(totalCost, sym)}

RESULTS:
Gross Profit Per Unit: ${formatCurrency(profit, sym)}
Gross Margin: ${marginPct}%
Markup: ${markupPct}%

MONTHLY PROJECTION (${volume} units):
- Revenue: ${formatCurrency(price * volume, sym)}
- Gross Profit: ${formatCurrency(profit * volume, sym)}

Calculated with AlphaTNX Free Business Tools:
https://digital.alphatnx.com/tool/profit-margin-calculator
===========================================`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            showToast("✓ Results copied to clipboard!");
          }).catch(() => {
            showToast("✓ Results copied!");
          });
        } else {
          showToast("✓ Results copied!");
        }
      });
    }

    // Share Link Action
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        const params = new URLSearchParams();
        if (currSelect) params.set("curr", currSelect.value);
        if (nameInput && nameInput.value) params.set("name", nameInput.value);
        if (priceInput && priceInput.value) params.set("price", priceInput.value);
        if (cogsInput && cogsInput.value) params.set("cogs", cogsInput.value);
        if (shipInput && shipInput.value) params.set("ship", shipInput.value);
        if (feeInput && feeInput.value) params.set("fee", feeInput.value);
        if (mktInput && mktInput.value) params.set("mkt", mktInput.value);
        if (volInput && volInput.value) params.set("vol", volInput.value);

        const shareUrl = `${window.location.origin}/tool/profit-margin-calculator?${params.toString()}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareUrl).then(() => {
            showToast("✓ Shareable calculation link copied!");
          });
        } else {
          showToast("✓ Link copied!");
        }
      });
    }

    // Download Report / Print
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        window.print();
      });
    }

    // Wipe Data Action
    if (wipeBtn) {
      wipeBtn.addEventListener("click", () => {
        wipeData(true);
      });
    }

    // Checkbox checklist persistence
    const checklistItems = wrapper.querySelectorAll(".margin-checklist-item input[type='checkbox']");
    checklistItems.forEach((chk, idx) => {
      const chkKey = `alphatnx_chk_${idx}`;
      try {
        if (sessionStorage.getItem(chkKey) === "1") {
          chk.checked = true;
          chk.closest(".margin-checklist-item")?.classList.add("is-checked");
        }
      } catch (e) {}

      chk.addEventListener("change", () => {
        const parent = chk.closest(".margin-checklist-item");
        if (parent) parent.classList.toggle("is-checked", chk.checked);
        try {
          sessionStorage.setItem(chkKey, chk.checked ? "1" : "0");
        } catch (e) {}
      });
    });

    // Save Checklist / Export button
    const saveChecklistBtn = wrapper.querySelector(".btn-save-checklist");
    if (saveChecklistBtn) {
      saveChecklistBtn.addEventListener("click", () => {
        let listText = "AlphaTNX Digital · Pricing & Margin Protection Checklist\n\n";
        checklistItems.forEach((chk) => {
          const label = chk.closest(".margin-checklist-item")?.querySelector("span")?.textContent || "";
          listText += `${chk.checked ? "[x]" : "[ ]"} ${label}\n`;
        });
        listText += "\nSaved from: https://digital.alphatnx.com/tool-profit-margin";

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(listText).then(() => {
            showToast("✓ Checklist copied to clipboard!");
          });
        } else {
          showToast("✓ Checklist saved!");
        }
      });
    }

    // Initialize
    loadInitialData();
    setInterval(updateCountdown, 1000);
  });

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


  // Mobile Nav Modal Dropdown Trigger (Retractable Resources dropdown)
  document.querySelectorAll(".nav-modal-dropdown-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const parent = btn.closest(".nav-modal-dropdown");
      if (!parent) return;
      const isOpen = parent.classList.contains("is-open");
      parent.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", !isOpen ? "true" : "false");
      const submenu = parent.querySelector(".nav-modal-submenu");
      if (submenu) submenu.setAttribute("aria-hidden", !isOpen ? "false" : "true");
    });
  });

})();
