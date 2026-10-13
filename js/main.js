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
    const mktInput = wrapper.querySelector(".calc-marketing");
    const volInput = wrapper.querySelector(".calc-volume-units");
    const volCountInput = wrapper.querySelector(".calc-volume-counter");
    const volMinusBtn = wrapper.querySelector(".btn-vol-minus");
    const volPlusBtn = wrapper.querySelector(".btn-vol-plus");

    // Output elements
    const profitVal = wrapper.querySelector(".res-profit-val");
    const marginVal = wrapper.querySelector(".res-margin-val");
    const markupVal = wrapper.querySelector(".res-markup-val");

    // Visual bar
    const barCogs = wrapper.querySelector(".margin-bar-seg-cogs");
    const barExtras = wrapper.querySelector(".margin-bar-seg-extras");
    const barProfit = wrapper.querySelector(".margin-bar-seg-profit");

    // Table elements
    const tblPrice = wrapper.querySelector(".res-tbl-price");
    const tblCogs = wrapper.querySelector(".res-tbl-cogs");
    const tblShipping = wrapper.querySelector(".res-tbl-shipping");
    const tblMarketing = wrapper.querySelector(".res-tbl-marketing");
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
      const totalMarketing = mktInput ? parseFloat(mktInput.value) || 0 : 0;
      const volume = volCountInput ? (parseInt(volCountInput.value, 10) || 1) : (volInput ? parseInt(volInput.value, 10) || 1 : 1);

      // Marketing CAC per unit derived from total spend divided by volume
      const marketingPerUnit = volume > 0 ? (totalMarketing / volume) : 0;
      const extras = shipping + marketingPerUnit;
      const totalCost = cogs + extras;
      const grossProfit = price - totalCost;

      // Handle zero state cleanly
      if (price === 0 && totalCost === 0) {
        if (profitVal) {
          profitVal.textContent = formatCurrency(0, sym);
          profitVal.className = "margin-stat-val text-accent";
        }
        if (marginVal) {
          marginVal.textContent = "0.0%";
          marginVal.className = "margin-stat-val text-accent";
        }
        if (markupVal) markupVal.textContent = "0.0%";
        if (barCogs && barExtras && barProfit) {
          barCogs.style.width = "0%";
          barExtras.style.width = "0%";
          barProfit.style.width = "0%";
        }
        if (tblPrice) tblPrice.textContent = formatCurrency(0, sym);
        if (tblCogs) tblCogs.textContent = formatCurrency(0, sym);
        if (tblShipping) tblShipping.textContent = formatCurrency(0, sym);
        if (tblMarketing) tblMarketing.textContent = formatCurrency(0, sym);
        if (tblTotalCost) tblTotalCost.textContent = formatCurrency(0, sym);
        if (tblGrossProfit) {
          tblGrossProfit.textContent = formatCurrency(0, sym);
          tblGrossProfit.className = "text-accent";
        }
        if (projRev) projRev.textContent = formatCurrency(0, sym);
        if (projProfit) {
          projProfit.textContent = formatCurrency(0, sym);
          projProfit.className = "result-val text-accent";
        }
        return;
      }

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
          barCogs.style.width = "0%";
          barExtras.style.width = "0%";
          barProfit.style.width = "0%";
        }
      }

      // Update Financial Table
      if (tblPrice) tblPrice.textContent = formatCurrency(price, sym);
      if (tblCogs) tblCogs.textContent = (cogs > 0 ? "-" : "") + formatCurrency(cogs, sym);
      if (tblShipping) tblShipping.textContent = (shipping > 0 ? "-" : "") + formatCurrency(shipping, sym);
      if (tblMarketing) tblMarketing.textContent = (marketingPerUnit > 0 ? "-" : "") + formatCurrency(marketingPerUnit, sym);
      if (tblTotalCost) tblTotalCost.textContent = (totalCost > 0 ? "-" : "") + formatCurrency(totalCost, sym);
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
      if (saveToStorage && (price > 0 || cogs > 0)) {
        const sessionPayload = {
          expiresAt: Date.now() + SESSION_DURATION,
          data: {
            curr: sym,
            name: nameInput ? nameInput.value : "",
            price: price,
            cogs: cogs,
            ship: shipping,
            mkt: totalMarketing,
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
      if (mktInput) mktInput.value = "";
      if (nameInput) nameInput.value = "";
      if (volInput) volInput.value = "1";
      if (volCountInput) volCountInput.value = "1";
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
        if (mktInput && urlParams.has("mkt")) mktInput.value = urlParams.get("mkt");
        if (urlParams.has("vol")) {
          const v = urlParams.get("vol");
          if (volInput) volInput.value = Math.min(parseInt(v, 10) || 1, 500);
          if (volCountInput) volCountInput.value = v;
        }
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
            if (priceInput && d.price !== undefined) priceInput.value = d.price ? d.price : "";
            if (cogsInput && d.cogs !== undefined) cogsInput.value = d.cogs ? d.cogs : "";
            if (shipInput && d.ship !== undefined) shipInput.value = d.ship ? d.ship : "";
            if (mktInput && d.mkt !== undefined) mktInput.value = d.mkt ? d.mkt : "";
            if (d.vol !== undefined) {
              const v = d.vol ? d.vol : "1";
              if (volInput) volInput.value = Math.min(parseInt(v, 10) || 1, 500);
              if (volCountInput) volCountInput.value = v;
            }
            runCalculation(false);
            return;
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (e) {}

      // Default calculation: start at zero!
      runCalculation(false);
    };

    // Listeners for live typing
    [priceInput, cogsInput, shipInput, mktInput, nameInput].forEach((inp) => {
      if (inp) {
        inp.addEventListener("input", () => runCalculation(true));
      }
    });

    if (currSelect) {
      currSelect.addEventListener("change", () => runCalculation(true));
    }

    // Synchronize Volume Slider & Counter
    const syncVolume = (newVal) => {
      let val = parseInt(newVal, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (volCountInput) volCountInput.value = val;
      if (volInput) volInput.value = Math.min(val, 500);
      runCalculation(true);
    };

    if (volInput) {
      volInput.addEventListener("input", () => {
        const v = parseInt(volInput.value, 10) || 1;
        if (volCountInput) volCountInput.value = v;
        runCalculation(true);
      });
    }

    if (volCountInput) {
      volCountInput.addEventListener("input", () => {
        const v = parseInt(volCountInput.value, 10) || 1;
        if (volInput) volInput.value = Math.min(v, 500);
        runCalculation(true);
      });
    }

    if (volMinusBtn) {
      volMinusBtn.addEventListener("click", () => {
        const current = parseInt(volCountInput ? volCountInput.value : (volInput ? volInput.value : 1), 10) || 1;
        syncVolume(Math.max(1, current - 1));
      });
    }

    if (volPlusBtn) {
      volPlusBtn.addEventListener("click", () => {
        const current = parseInt(volCountInput ? volCountInput.value : (volInput ? volInput.value : 1), 10) || 1;
        syncVolume(current + 1);
      });
    }

    // Copy Summary Action
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const sym = getCurrencySymbol();
        const pName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Product / SKU";
        const price = parseFloat(priceInput ? priceInput.value : 0) || 0;
        const cogs = parseFloat(cogsInput ? cogsInput.value : 0) || 0;
        const shipping = shipInput ? parseFloat(shipInput.value) || 0 : 0;
        const totalMarketing = mktInput ? parseFloat(mktInput.value) || 0 : 0;
        const volume = volCountInput ? (parseInt(volCountInput.value, 10) || 1) : (volInput ? parseInt(volInput.value, 10) || 1 : 1);

        const marketingPerUnit = volume > 0 ? (totalMarketing / volume) : 0;
        const totalCost = cogs + shipping + marketingPerUnit;
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
- Packaging & Shipping: ${formatCurrency(shipping, sym)}
- Marketing Spend Per Unit: ${formatCurrency(marketingPerUnit, sym)}${totalMarketing > 0 ? ` (Total Budget: ${formatCurrency(totalMarketing, sym)} ÷ ${volume} units)` : ""}
Total Direct Cost Per Unit: ${formatCurrency(totalCost, sym)}

RESULTS:
Gross Profit Per Unit: ${formatCurrency(profit, sym)}
Gross Margin: ${marginPct}%
Markup: ${markupPct}%

MONTHLY PROJECTION (${volume} units):
- Projected Revenue: ${formatCurrency(price * volume, sym)}
- Projected Gross Profit: ${formatCurrency(profit * volume, sym)}

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
        if (mktInput && mktInput.value) params.set("mkt", mktInput.value);
        const v = volCountInput ? volCountInput.value : (volInput ? volInput.value : "1");
        params.set("vol", v);

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

    // Download / Print Strictly Results
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        const sym = getCurrencySymbol();
        const pName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Custom Product";
        const price = parseFloat(priceInput ? priceInput.value : 0) || 0;
        const cogs = parseFloat(cogsInput ? cogsInput.value : 0) || 0;
        const shipping = shipInput ? parseFloat(shipInput.value) || 0 : 0;
        const totalMarketing = mktInput ? parseFloat(mktInput.value) || 0 : 0;
        const volume = volCountInput ? (parseInt(volCountInput.value, 10) || 1) : (volInput ? parseInt(volInput.value, 10) || 1 : 1);
        const marketingPerUnit = volume > 0 ? (totalMarketing / volume) : 0;
        const totalCost = cogs + shipping + marketingPerUnit;
        const grossProfit = price - totalCost;
        const grossMarginPct = price > 0 ? (grossProfit / price) * 100 : 0;
        const markupPct = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0;

        // Populate dedicated print sheet elements
        const printSheet = document.getElementById("print-results-sheet");
        if (printSheet) {
          const elProd = document.getElementById("print-product-name");
          const elDate = document.getElementById("print-date");
          const elProfit = document.getElementById("print-profit-val");
          const elMargin = document.getElementById("print-margin-val");
          const elMarkup = document.getElementById("print-markup-val");
          const elHealth = document.getElementById("print-health-status");
          const elPrice = document.getElementById("print-tbl-price");
          const elCogs = document.getElementById("print-tbl-cogs");
          const elShipping = document.getElementById("print-tbl-shipping");
          const elMarketing = document.getElementById("print-tbl-marketing");
          const elTotalCost = document.getElementById("print-tbl-total-cost");
          const elGrossProfit = document.getElementById("print-tbl-gross-profit");
          const elProjRev = document.getElementById("print-proj-rev");
          const elProjProfit = document.getElementById("print-proj-profit");

          if (elProd) elProd.textContent = "Product: " + pName;
          if (elDate) {
            const now = new Date();
            elDate.textContent = "Date: " + now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
          }
          if (elProfit) elProfit.textContent = formatCurrency(grossProfit, sym);
          if (elMargin) elMargin.textContent = grossMarginPct.toFixed(1) + "%";
          if (elMarkup) elMarkup.textContent = markupPct.toFixed(1) + "%";
          if (elHealth) {
            if (price === 0) elHealth.textContent = "Not calculated (Values at 0)";
            else if (grossProfit < 0) elHealth.textContent = "Operating at a Loss (" + grossMarginPct.toFixed(1) + "%)";
            else if (grossMarginPct < 15) elHealth.textContent = "Thin Margin (" + grossMarginPct.toFixed(1) + "%)";
            else if (grossMarginPct < 35) elHealth.textContent = "Healthy Retail Margin (" + grossMarginPct.toFixed(1) + "%)";
            else elHealth.textContent = "Strong Margin (" + grossMarginPct.toFixed(1) + "%)";
          }
          if (elPrice) elPrice.textContent = formatCurrency(price, sym);
          if (elCogs) elCogs.textContent = (cogs > 0 ? "-" : "") + formatCurrency(cogs, sym);
          if (elShipping) elShipping.textContent = (shipping > 0 ? "-" : "") + formatCurrency(shipping, sym);
          if (elMarketing) elMarketing.textContent = (marketingPerUnit > 0 ? "-" : "") + formatCurrency(marketingPerUnit, sym);
          if (elTotalCost) elTotalCost.textContent = (totalCost > 0 ? "-" : "") + formatCurrency(totalCost, sym);
          if (elGrossProfit) elGrossProfit.textContent = formatCurrency(grossProfit, sym);
          if (elProjRev) elProjRev.textContent = formatCurrency(price * volume, sym);
          if (elProjProfit) elProjProfit.textContent = formatCurrency(grossProfit * volume, sym);
        }

        const originalDocTitle = document.title;
        const rawInputName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "";
        const safeDocTitle = rawInputName.replace(/[/\\?%*:|"<>]/g, "").trim() || "Unit Profit Margin Report";
        document.title = safeDocTitle;

        window.print();

        const restoreTitle = () => {
          document.title = originalDocTitle;
          window.removeEventListener("afterprint", restoreTitle);
        };
        window.addEventListener("afterprint", restoreTitle);
        setTimeout(() => { document.title = originalDocTitle; }, 3000);
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
  // 5. INVOICE GENERATOR (LINE ITEMS, LOGO, DISCOUNTS, TAX, PRINT/PDF & 30-MIN WIPE)
  // ==========================================================================
  const invoiceWrappers = document.querySelectorAll(".invoice-gen-module");

  invoiceWrappers.forEach((wrapper) => {
    const currSelect = wrapper.querySelector("#inv-curr-select");
    const docTitleInput = wrapper.querySelector("#inv-doc-title");
    const invNumInput = wrapper.querySelector("#inv-number");
    const invDateInput = wrapper.querySelector("#inv-date");
    const invDueDateInput = wrapper.querySelector("#inv-due-date");

    const logoInput = wrapper.querySelector("#inv-logo-input");
    const logoImg = wrapper.querySelector("#inv-logo-img");
    const logoPlaceholder = wrapper.querySelector("#inv-logo-placeholder");
    const logoPreviewWrap = wrapper.querySelector("#inv-logo-preview-wrap");
    const logoRemoveBtn = wrapper.querySelector("#inv-logo-remove-btn");

    const bizNameInput = wrapper.querySelector("#inv-biz-name");
    const bizEmailInput = wrapper.querySelector("#inv-biz-email");
    const bizPhoneInput = wrapper.querySelector("#inv-biz-phone");
    const bizAddrInput = wrapper.querySelector("#inv-biz-address");

    const clientNameInput = wrapper.querySelector("#inv-client-name");
    const clientEmailInput = wrapper.querySelector("#inv-client-email");
    const clientPhoneInput = wrapper.querySelector("#inv-client-phone");
    const clientAddrInput = wrapper.querySelector("#inv-client-address");

    const itemsBody = wrapper.querySelector("#inv-items-body");
    const addItemBtn = wrapper.querySelector("#inv-add-item-btn");

    const discountInput = wrapper.querySelector("#inv-discount-input");
    const discountTypeSelect = wrapper.querySelector("#inv-discount-type");
    const taxInput = wrapper.querySelector("#inv-tax-input");

    const bankNameInput = wrapper.querySelector("#inv-bank-name");
    const accountNumInput = wrapper.querySelector("#inv-account-num");
    const accountNameInput = wrapper.querySelector("#inv-account-name");
    const notesInput = wrapper.querySelector("#inv-notes");

    const subtotalDisplay = wrapper.querySelector("#inv-subtotal-val");
    const discountDisplay = wrapper.querySelector("#inv-discount-val");
    const taxDisplay = wrapper.querySelector("#inv-tax-val");
    const totalDueDisplay = wrapper.querySelector("#inv-total-due-val");

    const downloadPdfBtn = wrapper.querySelector("#inv-download-pdf-btn");
    const copySummaryBtn = wrapper.querySelector("#inv-copy-summary-btn");
    const resetBtn = wrapper.querySelector("#inv-reset-btn");
    const wipeBtn = wrapper.querySelector("#inv-wipe-data-btn");
    const timerDisplay = wrapper.querySelector(".session-timer-display");

    const STORAGE_KEY = "alphatnx_invoice_session";
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

    let activeLogoDataUrl = "";

    const getSymbol = () => (currSelect ? currSelect.value : "₦");

    const formatMoney = (val, sym = getSymbol()) => {
      const num = Math.round(val);
      const isNegative = num < 0;
      return `${isNegative ? "-" : ""}${sym}${Math.abs(num).toLocaleString()}`;
    };

    const showToast = (msg) => {
      const targetToast = document.querySelector(".margin-toast");
      if (!targetToast) return;
      targetToast.textContent = msg;
      targetToast.classList.add("is-active");
      setTimeout(() => {
        targetToast.classList.remove("is-active");
      }, 3000);
    };

    // Date defaults
    const today = new Date();
    const dueDate = new Date(Date.now() + 7 * 86400000);
    if (invDateInput && !invDateInput.value) {
      invDateInput.value = today.toISOString().split("T")[0];
    }
    if (invDueDateInput && !invDueDateInput.value) {
      invDueDateInput.value = dueDate.toISOString().split("T")[0];
    }

    // Logo Upload Handling
    if (logoInput) {
      logoInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          showToast("Please upload a valid image file");
          return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => {
          activeLogoDataUrl = evt.target.result;
          if (logoImg) logoImg.src = activeLogoDataUrl;
          if (logoPlaceholder) logoPlaceholder.style.display = "none";
          if (logoPreviewWrap) logoPreviewWrap.style.display = "flex";
          saveSession();
        };
        reader.readAsDataURL(file);
      });
    }

    if (logoRemoveBtn) {
      logoRemoveBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        activeLogoDataUrl = "";
        if (logoInput) logoInput.value = "";
        if (logoImg) logoImg.src = "";
        if (logoPlaceholder) logoPlaceholder.style.display = "flex";
        if (logoPreviewWrap) logoPreviewWrap.style.display = "none";
        saveSession();
      });
    }

    // Add Line Item Row
    const addLineItemRow = (desc = "", qty = 1, rate = 0) => {
      if (!itemsBody) return;
      const tr = document.createElement("tr");
      tr.className = "inv-item-row";
      tr.innerHTML = `
        <td>
          <input type="text" class="inv-cell-input inv-item-desc" placeholder="e.g. Website Design & Development" value="${desc}">
        </td>
        <td style="text-align: center;">
          <input type="number" class="inv-cell-input inv-item-qty" value="${qty}" min="1" step="1" style="text-align: center;">
        </td>
        <td style="text-align: right;">
          <input type="number" class="inv-cell-input inv-item-rate" placeholder="0" value="${rate > 0 ? rate : ''}" min="0" step="100" style="text-align: right;">
        </td>
        <td style="text-align: right;">
          <span class="inv-item-total">${formatMoney(qty * rate)}</span>
        </td>
        <td style="text-align: center;">
          <button type="button" class="inv-btn-del-row" title="Delete row" aria-label="Delete line item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      `;

      // Event listeners on row inputs
      const descInp = tr.querySelector(".inv-item-desc");
      const qtyInp = tr.querySelector(".inv-item-qty");
      const rateInp = tr.querySelector(".inv-item-rate");
      const delBtn = tr.querySelector(".inv-btn-del-row");

      [descInp, qtyInp, rateInp].forEach((inp) => {
        if (inp) inp.addEventListener("input", () => calculateInvoice(true));
      });

      if (delBtn) {
        delBtn.addEventListener("click", () => {
          if (itemsBody.querySelectorAll("tr").length <= 1) {
            showToast("Invoice must contain at least 1 line item");
            return;
          }
          tr.remove();
          calculateInvoice(true);
        });
      }

      itemsBody.appendChild(tr);
    };

    // Calculate Totals
    const calculateInvoice = (shouldSave = true) => {
      const sym = getSymbol();
      let subtotal = 0;

      const rows = itemsBody ? itemsBody.querySelectorAll("tr.inv-item-row") : [];
      rows.forEach((row) => {
        const qty = parseFloat(row.querySelector(".inv-item-qty")?.value) || 0;
        const rate = parseFloat(row.querySelector(".inv-item-rate")?.value) || 0;
        const lineTotal = qty * rate;
        subtotal += lineTotal;
        const totalSpan = row.querySelector(".inv-item-total");
        if (totalSpan) totalSpan.textContent = formatMoney(lineTotal, sym);
      });

      // Discount calculation
      const discRaw = parseFloat(discountInput ? discountInput.value : 0) || 0;
      const isPct = discountTypeSelect && discountTypeSelect.value === "pct";
      const discountAmount = isPct ? (subtotal * (discRaw / 100)) : discRaw;
      const discountedSubtotal = Math.max(0, subtotal - discountAmount);

      // Tax / VAT
      const taxRate = parseFloat(taxInput ? taxInput.value : 0) || 0;
      const taxAmount = discountedSubtotal * (taxRate / 100);

      const totalDue = discountedSubtotal + taxAmount;

      if (subtotalDisplay) subtotalDisplay.textContent = formatMoney(subtotal, sym);
      if (discountDisplay) discountDisplay.textContent = discountAmount > 0 ? `-${formatMoney(discountAmount, sym)}` : formatMoney(0, sym);
      if (taxDisplay) taxDisplay.textContent = taxAmount > 0 ? `+${formatMoney(taxAmount, sym)}` : formatMoney(0, sym);
      if (totalDueDisplay) totalDueDisplay.textContent = formatMoney(totalDue, sym);

      if (shouldSave) saveSession();
    };

    // Save session to localStorage
    const saveSession = () => {
      const rows = [];
      if (itemsBody) {
        itemsBody.querySelectorAll("tr.inv-item-row").forEach((r) => {
          rows.push({
            desc: r.querySelector(".inv-item-desc")?.value || "",
            qty: r.querySelector(".inv-item-qty")?.value || 1,
            rate: r.querySelector(".inv-item-rate")?.value || ""
          });
        });
      }

      const payload = {
        expiresAt: Date.now() + SESSION_DURATION,
        data: {
          title: docTitleInput ? docTitleInput.value : "INVOICE",
          curr: getSymbol(),
          invNum: invNumInput ? invNumInput.value : "",
          invDate: invDateInput ? invDateInput.value : "",
          invDueDate: invDueDateInput ? invDueDateInput.value : "",
          logo: activeLogoDataUrl,
          bizName: bizNameInput ? bizNameInput.value : "",
          bizEmail: bizEmailInput ? bizEmailInput.value : "",
          bizPhone: bizPhoneInput ? bizPhoneInput.value : "",
          bizAddr: bizAddrInput ? bizAddrInput.value : "",
          clientName: clientNameInput ? clientNameInput.value : "",
          clientEmail: clientEmailInput ? clientEmailInput.value : "",
          clientPhone: clientPhoneInput ? clientPhoneInput.value : "",
          clientAddr: clientAddrInput ? clientAddrInput.value : "",
          bankName: bankNameInput ? bankNameInput.value : "",
          accountNum: accountNumInput ? accountNumInput.value : "",
          accountName: accountNameInput ? accountNameInput.value : "",
          notes: notesInput ? notesInput.value : "",
          discount: discountInput ? discountInput.value : "",
          discountType: discountTypeSelect ? discountTypeSelect.value : "flat",
          tax: taxInput ? taxInput.value : "",
          items: rows
        }
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {}
    };

    // Load session
    const loadSession = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const session = JSON.parse(stored);
          if (Date.now() < session.expiresAt && session.data) {
            const d = session.data;
            if (docTitleInput && d.title) docTitleInput.value = d.title;
            if (currSelect && d.curr) currSelect.value = d.curr;
            if (invNumInput && d.invNum) invNumInput.value = d.invNum;
            if (invDateInput && d.invDate) invDateInput.value = d.invDate;
            if (invDueDateInput && d.invDueDate) invDueDateInput.value = d.invDueDate;

            if (d.logo) {
              activeLogoDataUrl = d.logo;
              if (logoImg) logoImg.src = d.logo;
              if (logoPlaceholder) logoPlaceholder.style.display = "none";
              if (logoPreviewWrap) logoPreviewWrap.style.display = "flex";
            }

            if (bizNameInput && d.bizName) bizNameInput.value = d.bizName;
            if (bizEmailInput && d.bizEmail) bizEmailInput.value = d.bizEmail;
            if (bizPhoneInput && d.bizPhone) bizPhoneInput.value = d.bizPhone;
            if (bizAddrInput && d.bizAddr) bizAddrInput.value = d.bizAddr;

            if (clientNameInput && d.clientName) clientNameInput.value = d.clientName;
            if (clientEmailInput && d.clientEmail) clientEmailInput.value = d.clientEmail;
            if (clientPhoneInput && d.clientPhone) clientPhoneInput.value = d.clientPhone;
            if (clientAddrInput && d.clientAddr) clientAddrInput.value = d.clientAddr;

            if (bankNameInput && d.bankName) bankNameInput.value = d.bankName;
            if (accountNumInput && d.accountNum) accountNumInput.value = d.accountNum;
            if (accountNameInput && d.accountName) accountNameInput.value = d.accountName;
            if (notesInput && d.notes) notesInput.value = d.notes;

            if (discountInput && d.discount) discountInput.value = d.discount;
            if (discountTypeSelect && d.discountType) discountTypeSelect.value = d.discountType;
            if (taxInput && d.tax) taxInput.value = d.tax;

            if (itemsBody) itemsBody.innerHTML = "";
            if (d.items && d.items.length > 0) {
              d.items.forEach((it) => addLineItemRow(it.desc, it.qty, it.rate));
            } else {
              addLineItemRow();
            }

            calculateInvoice(false);
            return;
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (e) {}

      // Default fresh state: 1 blank item row
      if (itemsBody && itemsBody.children.length === 0) {
        addLineItemRow();
      }
      calculateInvoice(false);
    };

    // Reset Form
    const resetForm = () => {
      activeLogoDataUrl = "";
      if (logoInput) logoInput.value = "";
      if (logoImg) logoImg.src = "";
      if (logoPlaceholder) logoPlaceholder.style.display = "flex";
      if (logoPreviewWrap) logoPreviewWrap.style.display = "none";

      if (bizNameInput) bizNameInput.value = "";
      if (bizEmailInput) bizEmailInput.value = "";
      if (bizPhoneInput) bizPhoneInput.value = "";
      if (bizAddrInput) bizAddrInput.value = "";

      if (clientNameInput) clientNameInput.value = "";
      if (clientEmailInput) clientEmailInput.value = "";
      if (clientPhoneInput) clientPhoneInput.value = "";
      if (clientAddrInput) clientAddrInput.value = "";

      if (bankNameInput) bankNameInput.value = "";
      if (accountNumInput) accountNumInput.value = "";
      if (accountNameInput) accountNameInput.value = "";
      if (notesInput) notesInput.value = "";

      if (discountInput) discountInput.value = "";
      if (taxInput) taxInput.value = "";

      if (itemsBody) itemsBody.innerHTML = "";
      addLineItemRow();
      calculateInvoice(false);
    };

    const wipeData = () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      resetForm();
      if (timerDisplay) timerDisplay.textContent = "30:00";
      showToast("✓ Invoice session purged from memory");
    };

    // Countdown updater
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
          wipeData();
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

    // Listeners for static inputs
    [docTitleInput, invNumInput, invDateInput, invDueDateInput, bizNameInput, bizEmailInput, bizPhoneInput, bizAddrInput, clientNameInput, clientEmailInput, clientPhoneInput, clientAddrInput, bankNameInput, accountNumInput, accountNameInput, notesInput, discountInput, taxInput].forEach((inp) => {
      if (inp) inp.addEventListener("input", () => calculateInvoice(true));
    });

    if (currSelect) currSelect.addEventListener("change", () => calculateInvoice(true));
    if (discountTypeSelect) discountTypeSelect.addEventListener("change", () => calculateInvoice(true));

    if (addItemBtn) {
      addItemBtn.addEventListener("click", () => {
        addLineItemRow();
        calculateInvoice(true);
      });
    }

    if (resetBtn) resetBtn.addEventListener("click", () => {
      resetForm();
      showToast("✓ Form cleared");
    });

    if (wipeBtn) wipeBtn.addEventListener("click", wipeData);

    // Download PDF / Print Handler
    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener("click", () => {
        const sym = getSymbol();
        const docTitle = docTitleInput && docTitleInput.value.trim() ? docTitleInput.value.trim() : "INVOICE";
        const invNum = invNumInput && invNumInput.value.trim() ? invNumInput.value.trim() : "INV-0001";
        const invDate = invDateInput && invDateInput.value ? invDateInput.value : "—";
        const invDueDate = invDueDateInput && invDueDateInput.value ? invDueDateInput.value : "—";

        const bizName = bizNameInput && bizNameInput.value.trim() ? bizNameInput.value.trim() : "Business / Company Name";
        const bizEmail = bizEmailInput ? bizEmailInput.value.trim() : "";
        const bizPhone = bizPhoneInput ? bizPhoneInput.value.trim() : "";
        const bizAddr = bizAddrInput ? bizAddrInput.value.trim() : "";

        const clientName = clientNameInput && clientNameInput.value.trim() ? clientNameInput.value.trim() : "Client Name";
        const clientEmail = clientEmailInput ? clientEmailInput.value.trim() : "";
        const clientPhone = clientPhoneInput ? clientPhoneInput.value.trim() : "";
        const clientAddr = clientAddrInput ? clientAddrInput.value.trim() : "";

        const bankName = bankNameInput ? bankNameInput.value.trim() : "";
        const accountNum = accountNumInput ? accountNumInput.value.trim() : "";
        const accountName = accountNameInput ? accountNameInput.value.trim() : "";
        const notes = notesInput ? notesInput.value.trim() : "";

        // Populate #print-invoice-sheet
        const printSheet = document.getElementById("print-invoice-sheet");
        if (!printSheet) return;

        // Logo
        const printLogoContainer = document.getElementById("print-logo-container");
        const printLogoImg = document.getElementById("print-inv-logo-img");
        if (activeLogoDataUrl && printLogoImg && printLogoContainer) {
          printLogoImg.src = activeLogoDataUrl;
          printLogoContainer.style.display = "block";
        } else if (printLogoContainer) {
          printLogoContainer.style.display = "none";
        }

        // Header & Meta
        const elPrintDocTitle = document.getElementById("print-doc-title");
        const elPrintBizName = document.getElementById("print-biz-name");
        const elPrintBizMeta = document.getElementById("print-biz-meta");
        const elPrintInvNum = document.getElementById("print-inv-num");
        const elPrintInvDate = document.getElementById("print-inv-date");
        const elPrintInvDueDate = document.getElementById("print-inv-due-date");

        if (elPrintDocTitle) elPrintDocTitle.textContent = docTitle;
        if (elPrintBizName) elPrintBizName.textContent = bizName;
        if (elPrintBizMeta) {
          const parts = [bizAddr, bizPhone, bizEmail].filter(Boolean);
          elPrintBizMeta.innerHTML = parts.join("<br>");
        }
        if (elPrintInvNum) elPrintInvNum.textContent = invNum;
        if (elPrintInvDate) elPrintInvDate.textContent = invDate;
        if (elPrintInvDueDate) elPrintInvDueDate.textContent = invDueDate;

        // Client
        const elPrintClientName = document.getElementById("print-client-name");
        const elPrintClientMeta = document.getElementById("print-client-meta");
        if (elPrintClientName) elPrintClientName.textContent = clientName;
        if (elPrintClientMeta) {
          const cParts = [clientAddr, clientPhone, clientEmail].filter(Boolean);
          elPrintClientMeta.innerHTML = cParts.join("<br>");
        }

        // Table Rows
        const printItemsBody = document.getElementById("print-items-body");
        let subtotal = 0;
        if (printItemsBody) {
          printItemsBody.innerHTML = "";
          const rows = itemsBody ? itemsBody.querySelectorAll("tr.inv-item-row") : [];
          rows.forEach((row) => {
            const desc = row.querySelector(".inv-item-desc")?.value.trim() || "Item / Service";
            const qty = parseFloat(row.querySelector(".inv-item-qty")?.value) || 0;
            const rate = parseFloat(row.querySelector(".inv-item-rate")?.value) || 0;
            const lineTotal = qty * rate;
            subtotal += lineTotal;

            const printTr = document.createElement("tr");
            printTr.innerHTML = `
              <td>${desc}</td>
              <td style="text-align: center;">${qty}</td>
              <td style="text-align: right;">${formatMoney(rate, sym)}</td>
              <td style="text-align: right; font-weight: 600;">${formatMoney(lineTotal, sym)}</td>
            `;
            printItemsBody.appendChild(printTr);
          });
        }

        // Calculations
        const discRaw = parseFloat(discountInput ? discountInput.value : 0) || 0;
        const isPct = discountTypeSelect && discountTypeSelect.value === "pct";
        const discountAmount = isPct ? (subtotal * (discRaw / 100)) : discRaw;
        const discountedSubtotal = Math.max(0, subtotal - discountAmount);
        const taxRate = parseFloat(taxInput ? taxInput.value : 0) || 0;
        const taxAmount = discountedSubtotal * (taxRate / 100);
        const totalDue = discountedSubtotal + taxAmount;

        const elSub = document.getElementById("print-subtotal-val");
        const elDiscRow = document.getElementById("print-discount-row");
        const elDiscVal = document.getElementById("print-discount-val");
        const elTaxRow = document.getElementById("print-tax-row");
        const elTaxVal = document.getElementById("print-tax-val");
        const elTaxLabel = document.getElementById("print-tax-label");
        const elTotalDue = document.getElementById("print-total-due-val");

        if (elSub) elSub.textContent = formatMoney(subtotal, sym);
        if (elDiscRow) {
          elDiscRow.style.display = discountAmount > 0 ? "flex" : "none";
          if (elDiscVal) elDiscVal.textContent = `-${formatMoney(discountAmount, sym)}`;
        }
        if (elTaxRow) {
          elTaxRow.style.display = taxAmount > 0 ? "flex" : "none";
          if (elTaxLabel) elTaxLabel.textContent = `Tax / VAT (${taxRate}%):`;
          if (elTaxVal) elTaxVal.textContent = `+${formatMoney(taxAmount, sym)}`;
        }
        if (elTotalDue) elTotalDue.textContent = formatMoney(totalDue, sym);

        // Bank Details
        const elBankName = document.getElementById("print-bank-name");
        const elAccountNum = document.getElementById("print-account-num");
        const elAccountName = document.getElementById("print-account-name");
        const elNotesWrap = document.getElementById("print-notes-wrap");
        const elNotesText = document.getElementById("print-notes-text");

        if (elBankName) elBankName.textContent = bankName || "—";
        if (elAccountNum) elAccountNum.textContent = accountNum || "—";
        if (elAccountName) elAccountName.textContent = accountName || "—";

        if (elNotesWrap && elNotesText) {
          if (notes) {
            elNotesWrap.style.display = "block";
            elNotesText.textContent = notes;
          } else {
            elNotesWrap.style.display = "none";
          }
        }

        // Set dynamic PDF filename via document.title
        const originalDocTitle = document.title;
        const safeDocTitle = docTitle.replace(/[/\\?%*:|"<>]/g, "").trim() || "Invoice";
        document.title = safeDocTitle;

        window.print();

        const restoreTitle = () => {
          document.title = originalDocTitle;
          window.removeEventListener("afterprint", restoreTitle);
        };
        window.addEventListener("afterprint", restoreTitle);
        setTimeout(() => { document.title = originalDocTitle; }, 3000);
      });
    }

    // Copy Plain Text Invoice
    if (copySummaryBtn) {
      copySummaryBtn.addEventListener("click", () => {
        const sym = getSymbol();
        const docTitle = docTitleInput && docTitleInput.value.trim() ? docTitleInput.value.trim() : "INVOICE";
        const invNum = invNumInput ? invNumInput.value.trim() : "INV-0001";
        const bizName = bizNameInput ? bizNameInput.value.trim() : "Business";
        const clientName = clientNameInput ? clientNameInput.value.trim() : "Client";

        let lines = `===========================================
${docTitle.toUpperCase()} #${invNum}
===========================================
FROM: ${bizName}
TO: ${clientName}
DATE: ${invDateInput ? invDateInput.value : "—"}
DUE DATE: ${invDueDateInput ? invDueDateInput.value : "—"}
-------------------------------------------
ITEMS:\n`;

        let subtotal = 0;
        const rows = itemsBody ? itemsBody.querySelectorAll("tr.inv-item-row") : [];
        rows.forEach((row, idx) => {
          const desc = row.querySelector(".inv-item-desc")?.value.trim() || `Item ${idx + 1}`;
          const qty = parseFloat(row.querySelector(".inv-item-qty")?.value) || 0;
          const rate = parseFloat(row.querySelector(".inv-item-rate")?.value) || 0;
          const total = qty * rate;
          subtotal += total;
          lines += `${idx + 1}. ${desc} (${qty} x ${formatMoney(rate, sym)}) = ${formatMoney(total, sym)}\n`;
        });

        const discRaw = parseFloat(discountInput ? discountInput.value : 0) || 0;
        const isPct = discountTypeSelect && discountTypeSelect.value === "pct";
        const discountAmount = isPct ? (subtotal * (discRaw / 100)) : discRaw;
        const discountedSubtotal = Math.max(0, subtotal - discountAmount);
        const taxRate = parseFloat(taxInput ? taxInput.value : 0) || 0;
        const taxAmount = discountedSubtotal * (taxRate / 100);
        const totalDue = discountedSubtotal + taxAmount;

        lines += `-------------------------------------------
Subtotal: ${formatMoney(subtotal, sym)}
`;
        if (discountAmount > 0) lines += `Discount: -${formatMoney(discountAmount, sym)}\n`;
        if (taxAmount > 0) lines += `Tax/VAT (${taxRate}%): +${formatMoney(taxAmount, sym)}\n`;
        lines += `TOTAL DUE: ${formatMoney(totalDue, sym)}
-------------------------------------------
PAYMENT DETAILS:
Bank: ${bankNameInput ? bankNameInput.value.trim() : "—"}
Account Number: ${accountNumInput ? accountNumInput.value.trim() : "—"}
Account Name: ${accountNameInput ? accountNameInput.value.trim() : "—"}
`;
        if (notesInput && notesInput.value.trim()) {
          lines += `\nTerms & Notes: ${notesInput.value.trim()}\n`;
        }
        lines += `===========================================
Generated via AlphaTNX Digital: https://digital.alphatnx.com/tool/invoice-generator`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(lines).then(() => {
            showToast("✓ Invoice summary copied to clipboard!");
          });
        } else {
          showToast("✓ Invoice summary copied!");
        }
      });
    }

    // Initialize
    loadSession();
    setInterval(updateCountdown, 1000);
  });

  // ==========================================================================
  // 6. QUOTATION GENERATOR (SERVICES, RATES, LOGO, VALIDITY, PRINT/PDF & 30-MIN WIPE)
  // ==========================================================================
  const quotationWrappers = document.querySelectorAll(".quotation-gen-module");

  quotationWrappers.forEach((wrapper) => {
    const currSelect = wrapper.querySelector("#quote-curr-select");
    const docTitleInput = wrapper.querySelector("#quote-doc-title");
    const quoteNumInput = wrapper.querySelector("#quote-number");
    const quoteDateInput = wrapper.querySelector("#quote-date");
    const quoteValidityInput = wrapper.querySelector("#quote-validity");

    const logoInput = wrapper.querySelector("#quote-logo-input");
    const logoImg = wrapper.querySelector("#quote-logo-img");
    const logoPlaceholder = wrapper.querySelector("#quote-logo-placeholder");
    const logoPreviewWrap = wrapper.querySelector("#quote-logo-preview-wrap");
    const logoRemoveBtn = wrapper.querySelector("#quote-logo-remove-btn");

    const bizNameInput = wrapper.querySelector("#quote-biz-name");
    const bizEmailInput = wrapper.querySelector("#quote-biz-email");
    const bizPhoneInput = wrapper.querySelector("#quote-biz-phone");
    const bizAddrInput = wrapper.querySelector("#quote-biz-address");

    const clientNameInput = wrapper.querySelector("#quote-client-name");
    const clientPersonInput = wrapper.querySelector("#quote-client-person");
    const clientPhoneInput = wrapper.querySelector("#quote-client-phone");
    const clientEmailInput = wrapper.querySelector("#quote-client-email");
    const clientAddrInput = wrapper.querySelector("#quote-client-address");

    const itemsBody = wrapper.querySelector("#quote-items-body");
    const addItemBtn = wrapper.querySelector("#quote-add-item-btn");

    const timelineInput = wrapper.querySelector("#quote-timeline");
    const milestonesInput = wrapper.querySelector("#quote-milestones");
    const termsInput = wrapper.querySelector("#quote-terms");

    const discountInput = wrapper.querySelector("#quote-discount-input");
    const discountTypeSelect = wrapper.querySelector("#quote-discount-type");
    const taxInput = wrapper.querySelector("#quote-tax-input");

    const subtotalDisplay = wrapper.querySelector("#quote-subtotal-val");
    const discountDisplay = wrapper.querySelector("#quote-discount-val");
    const taxDisplay = wrapper.querySelector("#quote-tax-val");
    const totalDueDisplay = wrapper.querySelector("#quote-total-due-val");

    const downloadPdfBtn = wrapper.querySelector("#quote-download-pdf-btn");
    const copySummaryBtn = wrapper.querySelector("#quote-copy-summary-btn");
    const resetBtn = wrapper.querySelector("#quote-reset-btn");
    const wipeBtn = wrapper.querySelector("#quote-wipe-data-btn");
    const timerDisplay = wrapper.querySelector(".session-timer-display");

    const STORAGE_KEY = "alphatnx_quotation_session";
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

    let activeLogoDataUrl = "";

    const getSymbol = () => (currSelect ? currSelect.value : "₦");

    const formatMoney = (val, sym = getSymbol()) => {
      const num = Math.round(val);
      const isNegative = num < 0;
      return `${isNegative ? "-" : ""}${sym}${Math.abs(num).toLocaleString()}`;
    };

    const showToast = (msg) => {
      const targetToast = document.querySelector(".margin-toast");
      if (!targetToast) return;
      targetToast.textContent = msg;
      targetToast.classList.add("is-active");
      setTimeout(() => {
        targetToast.classList.remove("is-active");
      }, 3000);
    };

    // Date defaults
    const today = new Date();
    if (quoteDateInput && !quoteDateInput.value) {
      quoteDateInput.value = today.toISOString().split("T")[0];
    }

    // Logo Upload Handling
    if (logoInput) {
      logoInput.addEventListener("change", (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          showToast("Please upload a valid image file");
          return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => {
          activeLogoDataUrl = evt.target.result;
          if (logoImg) logoImg.src = activeLogoDataUrl;
          if (logoPlaceholder) logoPlaceholder.style.display = "none";
          if (logoPreviewWrap) logoPreviewWrap.style.display = "flex";
          saveSession();
        };
        reader.readAsDataURL(file);
      });
    }

    if (logoRemoveBtn) {
      logoRemoveBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        activeLogoDataUrl = "";
        if (logoInput) logoInput.value = "";
        if (logoImg) logoImg.src = "";
        if (logoPlaceholder) logoPlaceholder.style.display = "flex";
        if (logoPreviewWrap) logoPreviewWrap.style.display = "none";
        saveSession();
      });
    }

    // Add Line Item Row
    const addLineItemRow = (desc = "", qty = 1, rate = 0) => {
      if (!itemsBody) return;
      const tr = document.createElement("tr");
      tr.className = "inv-item-row";
      tr.innerHTML = `
        <td>
          <input type="text" class="inv-cell-input inv-item-desc" placeholder="e.g. Frontend UI & Dashboard Design" value="${desc}">
        </td>
        <td style="text-align: center;">
          <input type="number" class="inv-cell-input inv-item-qty" value="${qty}" min="1" step="1" style="text-align: center;">
        </td>
        <td style="text-align: right;">
          <input type="number" class="inv-cell-input inv-item-rate" placeholder="0" value="${rate > 0 ? rate : ''}" min="0" step="100" style="text-align: right;">
        </td>
        <td style="text-align: right;">
          <span class="inv-item-total">${formatMoney(qty * rate)}</span>
        </td>
        <td style="text-align: center;">
          <button type="button" class="inv-btn-del-row" title="Delete row" aria-label="Delete line item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      `;

      // Row inputs
      const descInp = tr.querySelector(".inv-item-desc");
      const qtyInp = tr.querySelector(".inv-item-qty");
      const rateInp = tr.querySelector(".inv-item-rate");
      const delBtn = tr.querySelector(".inv-btn-del-row");

      [descInp, qtyInp, rateInp].forEach((inp) => {
        if (inp) inp.addEventListener("input", () => calculateQuotation(true));
      });

      if (delBtn) {
        delBtn.addEventListener("click", () => {
          const allRows = itemsBody.querySelectorAll("tr.inv-item-row");
          if (allRows.length <= 1) {
            showToast("Quotation must have at least one line item");
            return;
          }
          tr.remove();
          calculateQuotation(true);
        });
      }

      itemsBody.appendChild(tr);
    };

    if (addItemBtn) {
      addItemBtn.addEventListener("click", () => {
        addLineItemRow("", 1, 0);
        calculateQuotation(true);
      });
    }

    // Calculation Function
    const calculateQuotation = (save = true) => {
      const sym = getSymbol();
      let subtotal = 0;

      const rows = itemsBody ? itemsBody.querySelectorAll("tr.inv-item-row") : [];
      rows.forEach((row) => {
        const qty = parseFloat(row.querySelector(".inv-item-qty")?.value) || 0;
        const rate = parseFloat(row.querySelector(".inv-item-rate")?.value) || 0;
        const lineTotal = qty * rate;
        subtotal += lineTotal;
        const totalSpan = row.querySelector(".inv-item-total");
        if (totalSpan) totalSpan.textContent = formatMoney(lineTotal, sym);
      });

      // Discount
      const discRaw = parseFloat(discountInput ? discountInput.value : 0) || 0;
      const isPct = discountTypeSelect && discountTypeSelect.value === "pct";
      const discountAmount = isPct ? (subtotal * (discRaw / 100)) : discRaw;
      const discountedSubtotal = Math.max(0, subtotal - discountAmount);

      // Tax / VAT
      const taxRate = parseFloat(taxInput ? taxInput.value : 0) || 0;
      const taxAmount = discountedSubtotal * (taxRate / 100);

      // Total
      const totalDue = discountedSubtotal + taxAmount;

      if (subtotalDisplay) subtotalDisplay.textContent = formatMoney(subtotal, sym);
      if (discountDisplay) discountDisplay.textContent = `-${formatMoney(discountAmount, sym)}`;
      if (taxDisplay) taxDisplay.textContent = `+${formatMoney(taxAmount, sym)}`;
      if (totalDueDisplay) totalDueDisplay.textContent = formatMoney(totalDue, sym);

      if (save) saveSession();
    };

    // Save Session to LocalStorage
    const saveSession = () => {
      const rows = [];
      if (itemsBody) {
        itemsBody.querySelectorAll("tr.inv-item-row").forEach((r) => {
          rows.push({
            desc: r.querySelector(".inv-item-desc")?.value || "",
            qty: r.querySelector(".inv-item-qty")?.value || 1,
            rate: r.querySelector(".inv-item-rate")?.value || ""
          });
        });
      }

      const payload = {
        timestamp: Date.now(),
        curr: currSelect ? currSelect.value : "₦",
        docTitle: docTitleInput ? docTitleInput.value : "PRICE QUOTATION",
        quoteNum: quoteNumInput ? quoteNumInput.value : "QT-0001",
        quoteDate: quoteDateInput ? quoteDateInput.value : "",
        validity: quoteValidityInput ? quoteValidityInput.value : "Valid for 14 Days",
        logo: activeLogoDataUrl,
        bizName: bizNameInput ? bizNameInput.value : "",
        bizEmail: bizEmailInput ? bizEmailInput.value : "",
        bizPhone: bizPhoneInput ? bizPhoneInput.value : "",
        bizAddr: bizAddrInput ? bizAddrInput.value : "",
        clientName: clientNameInput ? clientNameInput.value : "",
        clientPerson: clientPersonInput ? clientPersonInput.value : "",
        clientPhone: clientPhoneInput ? clientPhoneInput.value : "",
        clientEmail: clientEmailInput ? clientEmailInput.value : "",
        clientAddr: clientAddrInput ? clientAddrInput.value : "",
        timeline: timelineInput ? timelineInput.value : "",
        milestones: milestonesInput ? milestonesInput.value : "",
        terms: termsInput ? termsInput.value : "",
        discount: discountInput ? discountInput.value : "",
        discountType: discountTypeSelect ? discountTypeSelect.value : "flat",
        tax: taxInput ? taxInput.value : "",
        items: rows
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.warn("Storage quota exceeded or disabled", e);
      }
    };

    // Load Session
    const loadSession = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          addLineItemRow("", 1, 0);
          calculateQuotation(false);
          return;
        }

        const data = JSON.parse(raw);
        const age = Date.now() - (data.timestamp || 0);

        if (age > SESSION_DURATION) {
          wipeSession();
          return;
        }

        if (currSelect && data.curr) currSelect.value = data.curr;
        if (docTitleInput && data.docTitle) docTitleInput.value = data.docTitle;
        if (quoteNumInput && data.quoteNum) quoteNumInput.value = data.quoteNum;
        if (quoteDateInput && data.quoteDate) quoteDateInput.value = data.quoteDate;
        if (quoteValidityInput && data.validity) quoteValidityInput.value = data.validity;

        if (data.logo) {
          activeLogoDataUrl = data.logo;
          if (logoImg) logoImg.src = activeLogoDataUrl;
          if (logoPlaceholder) logoPlaceholder.style.display = "none";
          if (logoPreviewWrap) logoPreviewWrap.style.display = "flex";
        }

        if (bizNameInput && data.bizName) bizNameInput.value = data.bizName;
        if (bizEmailInput && data.bizEmail) bizEmailInput.value = data.bizEmail;
        if (bizPhoneInput && data.bizPhone) bizPhoneInput.value = data.bizPhone;
        if (bizAddrInput && data.bizAddr) bizAddrInput.value = data.bizAddr;

        if (clientNameInput && data.clientName) clientNameInput.value = data.clientName;
        if (clientPersonInput && data.clientPerson) clientPersonInput.value = data.clientPerson;
        if (clientPhoneInput && data.clientPhone) clientPhoneInput.value = data.clientPhone;
        if (clientEmailInput && data.clientEmail) clientEmailInput.value = data.clientEmail;
        if (clientAddrInput && data.clientAddr) clientAddrInput.value = data.clientAddr;

        if (timelineInput && data.timeline) timelineInput.value = data.timeline;
        if (milestonesInput && data.milestones) milestonesInput.value = data.milestones;
        if (termsInput && data.terms) termsInput.value = data.terms;

        if (discountInput && data.discount) discountInput.value = data.discount;
        if (discountTypeSelect && data.discountType) discountTypeSelect.value = data.discountType;
        if (taxInput && data.tax) taxInput.value = data.tax;

        if (itemsBody) {
          itemsBody.innerHTML = "";
          if (data.items && data.items.length) {
            data.items.forEach((item) => {
              addLineItemRow(item.desc || "", parseFloat(item.qty) || 1, parseFloat(item.rate) || 0);
            });
          } else {
            addLineItemRow("", 1, 0);
          }
        }

        calculateQuotation(false);
      } catch (e) {
        console.error("Failed loading quotation session:", e);
        addLineItemRow("", 1, 0);
        calculateQuotation(false);
      }
    };

    // Wipe Session
    const wipeSession = () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}

      activeLogoDataUrl = "";
      if (logoInput) logoInput.value = "";
      if (logoImg) logoImg.src = "";
      if (logoPlaceholder) logoPlaceholder.style.display = "flex";
      if (logoPreviewWrap) logoPreviewWrap.style.display = "none";

      if (bizNameInput) bizNameInput.value = "";
      if (bizEmailInput) bizEmailInput.value = "";
      if (bizPhoneInput) bizPhoneInput.value = "";
      if (bizAddrInput) bizAddrInput.value = "";

      if (clientNameInput) clientNameInput.value = "";
      if (clientPersonInput) clientPersonInput.value = "";
      if (clientPhoneInput) clientPhoneInput.value = "";
      if (clientEmailInput) clientEmailInput.value = "";
      if (clientAddrInput) clientAddrInput.value = "";

      if (timelineInput) timelineInput.value = "";
      if (milestonesInput) milestonesInput.value = "";
      if (termsInput) termsInput.value = "";

      if (discountInput) discountInput.value = "";
      if (taxInput) taxInput.value = "";

      if (itemsBody) {
        itemsBody.innerHTML = "";
        addLineItemRow("", 1, 0);
      }

      calculateQuotation(false);
      showToast("✓ All quotation data wiped clean!");
    };

    // Countdown Timer Update
    const updateCountdown = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          if (timerDisplay) timerDisplay.textContent = "30:00";
          return;
        }
        const data = JSON.parse(raw);
        const age = Date.now() - (data.timestamp || 0);
        const remaining = Math.max(0, SESSION_DURATION - age);

        if (remaining <= 0) {
          wipeSession();
          if (timerDisplay) timerDisplay.textContent = "00:00";
          return;
        }

        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        if (timerDisplay) {
          timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        }
      } catch (e) {
        if (timerDisplay) timerDisplay.textContent = "30:00";
      }
    };

    // Inputs event listeners for live recalculation
    [
      docTitleInput, quoteNumInput, quoteDateInput, quoteValidityInput,
      bizNameInput, bizEmailInput, bizPhoneInput, bizAddrInput,
      clientNameInput, clientPersonInput, clientPhoneInput, clientEmailInput, clientAddrInput,
      timelineInput, milestonesInput, termsInput,
      discountInput, discountTypeSelect, taxInput, currSelect
    ].forEach((el) => {
      if (el) {
        el.addEventListener("input", () => calculateQuotation(true));
        el.addEventListener("change", () => calculateQuotation(true));
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset all fields on this quotation?")) {
          wipeSession();
        }
      });
    }

    if (wipeBtn) {
      wipeBtn.addEventListener("click", () => {
        wipeSession();
      });
    }

    // Download PDF / Print Handler
    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener("click", () => {
        const sym = getSymbol();
        const docTitle = docTitleInput && docTitleInput.value.trim() ? docTitleInput.value.trim() : "PRICE QUOTATION";
        const quoteNum = quoteNumInput && quoteNumInput.value.trim() ? quoteNumInput.value.trim() : "QT-0001";
        const quoteDate = quoteDateInput && quoteDateInput.value ? quoteDateInput.value : "—";
        const validity = quoteValidityInput && quoteValidityInput.value.trim() ? quoteValidityInput.value.trim() : "Valid for 14 Days";

        const bizName = bizNameInput && bizNameInput.value.trim() ? bizNameInput.value.trim() : "Business / Company Name";
        const bizEmail = bizEmailInput ? bizEmailInput.value.trim() : "";
        const bizPhone = bizPhoneInput ? bizPhoneInput.value.trim() : "";
        const bizAddr = bizAddrInput ? bizAddrInput.value.trim() : "";

        const clientName = clientNameInput && clientNameInput.value.trim() ? clientNameInput.value.trim() : "Client Organization";
        const clientPerson = clientPersonInput ? clientPersonInput.value.trim() : "";
        const clientPhone = clientPhoneInput ? clientPhoneInput.value.trim() : "";
        const clientEmail = clientEmailInput ? clientEmailInput.value.trim() : "";
        const clientAddr = clientAddrInput ? clientAddrInput.value.trim() : "";

        const timeline = timelineInput ? timelineInput.value.trim() : "—";
        const milestones = milestonesInput ? milestonesInput.value.trim() : "—";
        const terms = termsInput ? termsInput.value.trim() : "";

        // Populate #print-quotation-sheet
        const printSheet = document.getElementById("print-quotation-sheet");
        if (!printSheet) return;

        // Logo
        const printLogoContainer = document.getElementById("print-quote-logo-container");
        const printLogoImg = document.getElementById("print-quote-logo-img");
        if (activeLogoDataUrl && printLogoImg && printLogoContainer) {
          printLogoImg.src = activeLogoDataUrl;
          printLogoContainer.style.display = "block";
        } else if (printLogoContainer) {
          printLogoContainer.style.display = "none";
        }

        // Header & Meta
        const elPrintDocTitle = document.getElementById("print-quote-doc-title");
        const elPrintBizName = document.getElementById("print-quote-biz-name");
        const elPrintBizMeta = document.getElementById("print-quote-biz-meta");
        const elPrintQuoteNum = document.getElementById("print-quote-num");
        const elPrintQuoteDate = document.getElementById("print-quote-date");
        const elPrintQuoteValidity = document.getElementById("print-quote-validity");

        if (elPrintDocTitle) elPrintDocTitle.textContent = docTitle;
        if (elPrintBizName) elPrintBizName.textContent = bizName;
        if (elPrintBizMeta) {
          const parts = [bizAddr, bizPhone, bizEmail].filter(Boolean);
          elPrintBizMeta.innerHTML = parts.join("<br>");
        }
        if (elPrintQuoteNum) elPrintQuoteNum.textContent = quoteNum;
        if (elPrintQuoteDate) elPrintQuoteDate.textContent = quoteDate;
        if (elPrintQuoteValidity) elPrintQuoteValidity.textContent = validity;

        // Client
        const elPrintClientName = document.getElementById("print-quote-client-name");
        const elPrintClientMeta = document.getElementById("print-quote-client-meta");
        if (elPrintClientName) elPrintClientName.textContent = clientName;
        if (elPrintClientMeta) {
          const cParts = [
            clientPerson ? `Attn: ${clientPerson}` : "",
            clientAddr,
            clientPhone,
            clientEmail
          ].filter(Boolean);
          elPrintClientMeta.innerHTML = cParts.join("<br>");
        }

        // Table Rows
        const printItemsBody = document.getElementById("print-quote-items-body");
        let subtotal = 0;
        if (printItemsBody) {
          printItemsBody.innerHTML = "";
          const rows = itemsBody ? itemsBody.querySelectorAll("tr.inv-item-row") : [];
          rows.forEach((row) => {
            const desc = row.querySelector(".inv-item-desc")?.value.trim() || "Service / Scope Item";
            const qty = parseFloat(row.querySelector(".inv-item-qty")?.value) || 0;
            const rate = parseFloat(row.querySelector(".inv-item-rate")?.value) || 0;
            const lineTotal = qty * rate;
            subtotal += lineTotal;

            const printTr = document.createElement("tr");
            printTr.innerHTML = `
              <td>${desc}</td>
              <td style="text-align: center;">${qty}</td>
              <td style="text-align: right;">${formatMoney(rate, sym)}</td>
              <td style="text-align: right; font-weight: 600;">${formatMoney(lineTotal, sym)}</td>
            `;
            printItemsBody.appendChild(printTr);
          });
        }

        // Calculations
        const discRaw = parseFloat(discountInput ? discountInput.value : 0) || 0;
        const isPct = discountTypeSelect && discountTypeSelect.value === "pct";
        const discountAmount = isPct ? (subtotal * (discRaw / 100)) : discRaw;
        const discountedSubtotal = Math.max(0, subtotal - discountAmount);
        const taxRate = parseFloat(taxInput ? taxInput.value : 0) || 0;
        const taxAmount = discountedSubtotal * (taxRate / 100);
        const totalDue = discountedSubtotal + taxAmount;

        const elSub = document.getElementById("print-quote-subtotal-val");
        const elDiscRow = document.getElementById("print-quote-discount-row");
        const elDiscVal = document.getElementById("print-quote-discount-val");
        const elTaxRow = document.getElementById("print-quote-tax-row");
        const elTaxVal = document.getElementById("print-quote-tax-val");
        const elTaxLabel = document.getElementById("print-quote-tax-label");
        const elTotalDue = document.getElementById("print-quote-total-due-val");

        if (elSub) elSub.textContent = formatMoney(subtotal, sym);
        if (elDiscRow) {
          elDiscRow.style.display = discountAmount > 0 ? "flex" : "none";
          if (elDiscVal) elDiscVal.textContent = `-${formatMoney(discountAmount, sym)}`;
        }
        if (elTaxRow) {
          elTaxRow.style.display = taxAmount > 0 ? "flex" : "none";
          if (elTaxLabel) elTaxLabel.textContent = `Tax / VAT (${taxRate}%):`;
          if (elTaxVal) elTaxVal.textContent = `+${formatMoney(taxAmount, sym)}`;
        }
        if (elTotalDue) elTotalDue.textContent = formatMoney(totalDue, sym);

        // Timeline & Terms
        const elTimeline = document.getElementById("print-quote-timeline");
        const elMilestones = document.getElementById("print-quote-milestones");
        const elTermsWrap = document.getElementById("print-quote-terms-wrap");
        const elTermsText = document.getElementById("print-quote-terms-text");

        if (elTimeline) elTimeline.textContent = timeline;
        if (elMilestones) elMilestones.textContent = milestones;

        if (elTermsWrap && elTermsText) {
          if (terms) {
            elTermsWrap.style.display = "block";
            elTermsText.textContent = terms;
          } else {
            elTermsWrap.style.display = "none";
          }
        }

        // Set dynamic PDF filename via document.title
        const originalDocTitle = document.title;
        const safeDocTitle = docTitle.replace(/[/\\?%*:|"<>]/g, "").trim() || "Quotation";
        document.title = safeDocTitle;

        window.print();

        const restoreTitle = () => {
          document.title = originalDocTitle;
          window.removeEventListener("afterprint", restoreTitle);
        };
        window.addEventListener("afterprint", restoreTitle);
        setTimeout(() => { document.title = originalDocTitle; }, 3000);
      });
    }

    // Copy Plain Text Quotation
    if (copySummaryBtn) {
      copySummaryBtn.addEventListener("click", () => {
        const sym = getSymbol();
        const docTitle = docTitleInput && docTitleInput.value.trim() ? docTitleInput.value.trim() : "PRICE QUOTATION";
        const quoteNum = quoteNumInput ? quoteNumInput.value.trim() : "QT-0001";
        const bizName = bizNameInput ? bizNameInput.value.trim() : "Business";
        const clientName = clientNameInput ? clientNameInput.value.trim() : "Client";

        let lines = `===========================================
${docTitle.toUpperCase()} #${quoteNum}
===========================================
PREPARED BY: ${bizName}
PREPARED FOR: ${clientName}
${clientPersonInput && clientPersonInput.value.trim() ? `ATTENTION: ${clientPersonInput.value.trim()}\n` : ""}DATE: ${quoteDateInput ? quoteDateInput.value : "—"}
VALIDITY: ${quoteValidityInput ? quoteValidityInput.value : "Valid for 14 Days"}
-------------------------------------------
SERVICES & SCOPE OF WORK:\n`;

        let subtotal = 0;
        const rows = itemsBody ? itemsBody.querySelectorAll("tr.inv-item-row") : [];
        rows.forEach((row, idx) => {
          const desc = row.querySelector(".inv-item-desc")?.value.trim() || `Service ${idx + 1}`;
          const qty = parseFloat(row.querySelector(".inv-item-qty")?.value) || 0;
          const rate = parseFloat(row.querySelector(".inv-item-rate")?.value) || 0;
          const total = qty * rate;
          subtotal += total;
          lines += `${idx + 1}. ${desc} (${qty} x ${formatMoney(rate, sym)}) = ${formatMoney(total, sym)}\n`;
        });

        const discRaw = parseFloat(discountInput ? discountInput.value : 0) || 0;
        const isPct = discountTypeSelect && discountTypeSelect.value === "pct";
        const discountAmount = isPct ? (subtotal * (discRaw / 100)) : discRaw;
        const discountedSubtotal = Math.max(0, subtotal - discountAmount);
        const taxRate = parseFloat(taxInput ? taxInput.value : 0) || 0;
        const taxAmount = discountedSubtotal * (taxRate / 100);
        const totalDue = discountedSubtotal + taxAmount;

        lines += `-------------------------------------------
Subtotal: ${formatMoney(subtotal, sym)}
`;
        if (discountAmount > 0) lines += `Discount: -${formatMoney(discountAmount, sym)}\n`;
        if (taxAmount > 0) lines += `Tax/VAT (${taxRate}%): +${formatMoney(taxAmount, sym)}\n`;
        lines += `TOTAL ESTIMATE: ${formatMoney(totalDue, sym)}
-------------------------------------------
TIMELINE: ${timelineInput ? timelineInput.value.trim() : "—"}
PAYMENT SCHEDULE: ${milestonesInput ? milestonesInput.value.trim() : "—"}
`;
        if (termsInput && termsInput.value.trim()) {
          lines += `\nTerms & Conditions: ${termsInput.value.trim()}\n`;
        }
        lines += `===========================================
Generated via AlphaTNX Digital: https://digital.alphatnx.com/tool/quotation-generator`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(lines).then(() => {
            showToast("✓ Quotation summary copied to clipboard!");
          });
        } else {
          showToast("✓ Quotation summary copied!");
        }
      });
    }

    // Initialize
    loadSession();
    setInterval(updateCountdown, 1000);
  });

  // ==========================================================================
  // 7. BUSINESS NAME & SLOGAN BRAINSTORMER (KEYWORDS, SLOGANS, SHORTLIST, PDF & WIPE)
  // ==========================================================================
  const bnsWrappers = document.querySelectorAll(".bns-brainstormer-module");

  bnsWrappers.forEach((wrapper) => {
    const keywordsInput = wrapper.querySelector("#bns-keywords");
    const industrySelect = wrapper.querySelector("#bns-industry");
    const styleSelect = wrapper.querySelector("#bns-style");
    const audienceInput = wrapper.querySelector("#bns-audience");

    const generateBtn = wrapper.querySelector("#bns-generate-btn");
    const regenerateBtn = wrapper.querySelector("#bns-regenerate-btn");

    const tabAllBtn = wrapper.querySelector("#bns-tab-all");
    const tabSavedBtn = wrapper.querySelector("#bns-tab-saved");
    const allCountSpan = wrapper.querySelector("#bns-all-count");
    const savedCountSpan = wrapper.querySelector("#bns-saved-count");

    const emptyState = wrapper.querySelector("#bns-empty-state");
    const cardsGrid = wrapper.querySelector("#bns-cards-grid");

    const downloadPdfBtn = wrapper.querySelector("#bns-download-pdf-btn");
    const copyAllBtn = wrapper.querySelector("#bns-copy-all-btn");
    const resetBtn = wrapper.querySelector("#bns-reset-btn");
    const wipeBtn = wrapper.querySelector("#bns-wipe-data-btn");
    const timerDisplay = wrapper.querySelector(".session-timer-display");

    const STORAGE_KEY = "alphatnx_bns_session_v2";
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
    try { localStorage.removeItem("alphatnx_bns_session"); } catch (e) {}

    let generatedList = [];
    let savedList = [];
    let activeTab = "all"; // "all" | "saved"
    let generationSeed = 0;

    const showToast = (msg) => {
      const targetToast = document.querySelector(".margin-toast");
      if (!targetToast) return;
      targetToast.textContent = msg;
      targetToast.classList.add("is-active");
      setTimeout(() => {
        targetToast.classList.remove("is-active");
      }, 3000);
    };

    const industryVocab = {
      fashion: {
        seeds: ["Silhouette", "Thread", "Loom", "Verve", "Drape", "Muse"],
        evocativeAdjs: ["Velvet", "Sovereign", "Aurea", "Opaline", "Sartoria", "Lumière", "Ivory", "Noir", "Solstice", "Élan", "Vellura", "Serene"],
        evocativeNouns: ["Thread", "Loom", "Silhouette", "Drape", "Form", "Stitch", "Weave", "Canvas", "Line", "Verve", "Silk", "Muse"],
        formats: ["Atelier", "Maison", "Design House", "Studio", "Couture", "Collective", "House", "Edit"],
        slogans: [
          "Where timeless design meets uncompromising craftsmanship.",
          "Tailored luxury, defined by every detail.",
          "From sketch to silhouette — modern luxury, made personal.",
          "Distinctive fashion and bespoke design for the modern wardrobe.",
          "Curated pieces shaped by craft, fabric, and form.",
          "Quiet luxury. Unmistakable presence.",
          "Crafted for presence. Designed to outlast every season.",
          "Artistry in every stitch. Confidence in every piece.",
          "Elevated design for those who dress with intention.",
          "Bespoke craftsmanship. Contemporary silhouette.",
          "Redefining modern style through thoughtful design.",
          "Timeless aesthetics. Effortless sophistication.",
          "Designed to be remembered, tailored to endure.",
          "Modern couture crafted without compromise.",
          "Fine fabrics, sculptural lines, and enduring elegance.",
          "Signature pieces for moments that matter."
        ]
      },
      general: {
        seeds: ["Vertex", "Meridian", "Crest", "Vanguard", "Axis", "Solis"],
        evocativeAdjs: ["Sterling", "Prime", "Sovereign", "Vanguard", "Aurea", "Nexa", "Lumina", "Summit", "Crest", "Vero", "Apex", "Caliber"],
        evocativeNouns: ["Works", "Ventures", "Collective", "Standard", "Point", "Craft", "Bridge", "Axis", "Forge", "Horizon", "Core", "Foundry"],
        formats: ["Studio", "Collective", "Group", "Works", "Ventures", "House", "Partners", "Co."],
        slogans: [
          "Built on precision, driven by lasting value.",
          "Thoughtful execution for businesses that refuse to settle.",
          "Setting a higher standard in quality, craft, and reliability.",
          "Where clear vision meets dependable execution.",
          "Designed for durability, trusted for results.",
          "Modern craft backed by unwavering integrity.",
          "Elevating everyday standards through purposeful work.",
          "Simplicity, excellence, and consistency in every detail.",
          "Crafted to perform. Built to endure.",
          "Trusted expertise tailored for modern ambition.",
          "Precision-built solutions for discerning clients.",
          "Distinctive quality, delivered without friction.",
          "Turning bold ideas into enduring reality.",
          "Refined execution for forward-thinking brands.",
          "Dependable craft, measurable impact.",
          "Built with intention. Delivered with excellence."
        ]
      },
      ecommerce: {
        seeds: ["Curate", "Vault", "Cove", "Bazaar", "Loom", "Edit"],
        evocativeAdjs: ["Velvet", "Verve", "Aurea", "Prime", "Lumina", "Kora", "Sovereign", "Vero", "Opal", "Solis", "Pure", "Nove"],
        evocativeNouns: ["Vault", "Cove", "Edit", "Parcel", "Trove", "Loom", "Market", "Avenue", "Cart", "Bazaar", "Gallery", "Haven"],
        formats: ["Boutique", "Store", "Atelier", "Collective", "Edit", "House", "Vault", "Market"],
        slogans: [
          "Curated quality, delivered straight to your doorstep.",
          "Thoughtfully selected pieces for everyday living.",
          "Seamless discovery, authentic products, effortless checkout.",
          "Where discerning taste meets effortless shopping.",
          "Crafted for quality seekers. Delivered with care.",
          "Your curated destination for pieces worth keeping.",
          "Elevated essentials, designed for how you live today.",
          "Authentic craft and modern style, one tap away.",
          "Handpicked excellence, zero compromise.",
          "Bringing refined taste and reliable delivery together.",
          "Designed for desire, built for convenience.",
          "Every order packed with intention and care.",
          "Modern retail built around trust and timeless style.",
          "Discover better. Shop effortlessly.",
          "Quality you can feel from unboxing to everyday use.",
          "Distinctive finds for the modern lifestyle."
        ]
      },
      tech: {
        seeds: ["Nexa", "Velo", "Kora", "Flux", "Aether", "Stack"],
        evocativeAdjs: ["Nexa", "Vero", "Zeno", "Opti", "Lumina", "Prio", "Hyper", "Strata", "Aether", "Velo", "Vector", "Quant"],
        evocativeNouns: ["Stack", "Pulse", "Logic", "Grid", "Flow", "Core", "Sphere", "Sync", "Layer", "Node", "Arc", "Forge"],
        formats: ["Labs", "Systems", "Digital", "Tech", "Cloud", "Protocol", "Studio", "AI"],
        slogans: [
          "Intelligent infrastructure built for speed and scale.",
          "Engineering simpler, faster ways to run modern business.",
          "Zero friction. High velocity. Built for scale.",
          "Turning complex workflows into effortless software.",
          "Precision-engineered systems that grow with your ambition.",
          "Where clean architecture meets real-world reliability.",
          "Powering the next generation of digital commerce.",
          "Smart automation designed for teams that move fast.",
          "Built for uptime, engineered for clarity.",
          "Modern digital tools without the enterprise bloat.",
          "Seamless payments, smarter data, faster growth.",
          "Technology that works quietly and reliably in the background.",
          "From complexity to clarity in a single platform.",
          "Future-ready infrastructure for ambitious operators.",
          "Fast by default. Secure by design.",
          "Connecting data, payments, and people effortlessly."
        ]
      },
      food: {
        seeds: ["Crumb", "Hearth", "Saffron", "Zest", "Harvest", "Ember"],
        evocativeAdjs: ["Golden", "Warm", "Fresh", "Artisan", "Savory", "Velvet", "Crisp", "Rustic", "Pure", "Sweet", "Amber", "Rich"],
        evocativeNouns: ["Hearth", "Crumb", "Table", "Pantry", "Ember", "Grain", "Spice", "Platter", "Oven", "Leaf", "Spoon", "Harvest"],
        formats: ["Bakehouse", "Kitchen", "Bistro", "Table", "Pantry", "Atelier", "Roastery", "Co."],
        slogans: [
          "Handcrafted from scratch with honest, fresh ingredients.",
          "Bold flavours and warm hospitality at every table.",
          "Made fresh daily — because real taste never takes shortcuts.",
          "Where culinary craft meets unforgettable flavour.",
          "Wholesome ingredients, slow-crafted perfection.",
          "From our kitchen to your table, made with intention.",
          "Artisanal recipes crafted for moments worth sharing.",
          "Pure ingredients. Honest cooking. Unforgettable taste.",
          "Every bite crafted with warmth, spice, and soul.",
          "Freshly baked, thoughtfully prepared, always comforting.",
          "Elevating everyday dining into a celebration of flavour.",
          "Small-batch craft, big-hearted flavour.",
          "Rooted in tradition, plated for today.",
          "Crafted for cravings that deserve the real thing.",
          "Honest food made by people who care.",
          "Savour the craft in every single bite."
        ]
      },
      logistics: {
        seeds: ["Swift", "Route", "Transit", "Fleet", "Vector", "Mile"],
        evocativeAdjs: ["Swift", "Rapid", "Prime", "Vanguard", "Direct", "Aero", "Velocity", "Apex", "True", "Iron", "Clear", "Meridian"],
        evocativeNouns: ["Route", "Mile", "Transit", "Cargo", "Fleet", "Relay", "Bridge", "Corridor", "Haul", "Link", "Axis", "Track"],
        formats: ["Logistics", "Express", "Dispatch", "Transit", "Haulage", "Freight", "Links", "Direct"],
        slogans: [
          "On-time delivery across every mile, with real-time clarity.",
          "Moving cargo safely, swiftly, and without excuses.",
          "Dependable dispatch and haulage built for growing businesses.",
          "Precision routing. Predictable arrival. Complete peace of mind.",
          "Your supply chain in motion — tracked, insured, and on schedule.",
          "Bridging distances with speed and operational discipline.",
          "Every parcel handled with urgency and accountability.",
          "Built to keep commerce moving without interruption.",
          "Fast dispatch, transparent tracking, zero guesswork.",
          "From warehouse to doorstep, engineered for reliability.",
          "Reliable fleet infrastructure for high-volume fulfilment.",
          "When timing matters, we deliver.",
          "Seamless last-mile and interstate transit you can count on.",
          "Speed meets certainty on every route.",
          "Connecting merchants to customers, one on-time delivery at a time.",
          "Engineered for velocity. Trusted for safety."
        ]
      },
      realestate: {
        seeds: ["Haven", "Crest", "Manor", "Vantage", "Arch", "Terra"],
        evocativeAdjs: ["Sovereign", "Sterling", "Crest", "Meridian", "Aurea", "Vantage", "Prime", "Grand", "Serene", "Oak", "Crown", "Ivory"],
        evocativeNouns: ["Haven", "Court", "Arch", "Manor", "Vista", "Stone", "Pillar", "Square", "Ridge", "Grove", "Terrace", "Domus"],
        formats: ["Estates", "Properties", "Realty", "Homes", "Developments", "Spaces", "Living", "Group"],
        slogans: [
          "Spaces designed for modern living and generational value.",
          "Architectural integrity meets timeless comfort.",
          "Building enduring homes and high-conviction property assets.",
          "Where thoughtful architecture becomes home.",
          "Curated residences and developments built to appreciate.",
          "Crafted spaces for how modern families live and grow.",
          "Trusted property advisory and landmark developments.",
          "Designing sanctuaries of calm, craft, and permanence.",
          "Solid foundations. Timeless design. Lasting equity.",
          "Redefining urban living through superior build quality.",
          "Every square metre planned with purpose and elegance.",
          "Distinguished properties for discerning homeowners.",
          "Investing in spaces that stand the test of time.",
          "Modern architecture rooted in security and serenity.",
          "From blueprint to handover, built without compromise.",
          "Creating addresses people are proud to call home."
        ]
      },
      agro: {
        seeds: ["Harvest", "Terra", "Green", "Grain", "Root", "Field"],
        evocativeAdjs: ["Green", "Pure", "Verdant", "Golden", "Prime", "Terra", "Fresh", "Sun", "Fertile", "Vital", "True", "Earth"],
        evocativeNouns: ["Harvest", "Field", "Grain", "Root", "Seed", "Grove", "Meadow", "Crop", "Acre", "Yield", "Orchard", "Soil"],
        formats: ["Agro", "Farms", "Produce", "Commodities", "Organics", "Foods", "Allied", "Ventures"],
        slogans: [
          "From fertile soil to market — pure, traceable, and sustainable.",
          "Cultivating quality harvests that nourish communities.",
          "Modern agribusiness built on consistency and clean supply.",
          "Sustainably grown, carefully processed, reliably supplied.",
          "Bridging farm-fresh harvests with everyday kitchens.",
          "Rooted in the land. Driven by quality.",
          "Wholesome agricultural produce at commercial scale.",
          "Nourishing families and industries with dependable supply.",
          "Pure harvests cultivated with care and modern agronomy.",
          "Feeding growth from seed to shelf.",
          "Clean, grade-A farm produce you can trust year-round.",
          "Where sustainable farming meets reliable food supply.",
          "Grown with integrity, harvested at peak freshness.",
          "Strengthening the food chain from farm gate to table.",
          "Nature's best, cultivated with precision.",
          "Honest farming for a healthier tomorrow."
        ]
      },
      beauty: {
        seeds: ["Glow", "Aura", "Silk", "Bloom", "Dew", "Petal"],
        evocativeAdjs: ["Velvet", "Radiant", "Pure", "Aurea", "Serene", "Lumina", "Opal", "Dew", "Silk", "Rose", "Soft", "Golden"],
        evocativeNouns: ["Glow", "Aura", "Bloom", "Dew", "Elixir", "Botanica", "Skin", "Muse", "Ritual", "Essence", "Veil", "Luxe"],
        formats: ["Atelier", "Botanics", "Skincare", "Beauty", "Studio", "Aesthetics", "Rituals", "House"],
        slogans: [
          "Clean, intentional rituals for radiant, healthy skin.",
          "Where botanical purity meets visible skin transformation.",
          "Crafted to honour your natural glow, every single day.",
          "Luxury self-care formulated without compromise.",
          "Gentle science. Pure botanicals. Unmistakable radiance.",
          "Skincare and beauty rituals designed for real confidence.",
          "Timeless beauty, thoughtfully formulated.",
          "Nourishing formulas that let your skin breathe and shine.",
          "Elevated beauty essentials for your daily ritual.",
          "Pure ingredients, sensorial textures, lasting luminosity.",
          "Because radiant skin is always in season.",
          "Artisanal beauty crafted with care and clinical precision.",
          "Whisper-soft luxury for skin that glows from within.",
          "Redefining modern beauty through purity and grace.",
          "Your daily ritual of calm, care, and confidence.",
          "Formulated for results. Designed for indulgence."
        ]
      },
      consulting: {
        seeds: ["Sterling", "Vanguard", "Meridian", "Bridge", "Axis", "Crest"],
        evocativeAdjs: ["Sterling", "Vanguard", "Meridian", "Sovereign", "Apex", "Crest", "Caliber", "First", "Prime", "Summit", "North", "Keystone"],
        evocativeNouns: ["Bridge", "Axis", "Capital", "Point", "Standard", "Counsel", "Compass", "Ledger", "Vector", "Horizon", "Pillar", "Aegis"],
        formats: ["Advisory", "Partners", "Consulting", "Capital", "Associates", "Strategy", "Group", "Co."],
        slogans: [
          "Clarity, strategy, and execution for complex business decisions.",
          "Trusted advisory for leaders building enduring enterprises.",
          "Turning strategic insight into measurable commercial growth.",
          "Rigorous analysis. Candid counsel. Lasting results.",
          "Partnering with ambitious founders to scale with discipline.",
          "Where financial precision meets strategic foresight.",
          "Guiding institutions through growth, transformation, and scale.",
          "Independent thinking backed by deep market execution.",
          "Structured clarity for high-stakes decisions.",
          "Building resilient organisations through smart strategy.",
          "Insight that moves the needle. Integrity that builds trust.",
          "Decisive counsel for businesses navigating growth.",
          "Precision strategy tailored to your competitive edge.",
          "Measured advice. Proven outcomes.",
          "Architecting sustainable growth for modern enterprises.",
          "Principled advisory built on trust and performance."
        ]
      },
      education: {
        seeds: ["Scholar", "Lumina", "Forge", "Spark", "Beacon", "Path"],
        evocativeAdjs: ["Bright", "Lumina", "Prime", "Vanguard", "Nova", "Apex", "Clear", "Noble", "True", "Forward", "Elevate", "First"],
        evocativeNouns: ["Beacon", "Forge", "Path", "Spark", "Horizon", "Compass", "Mind", "Bridge", "Arc", "Guild", "Craft", "Chapter"],
        formats: ["Academy", "Institute", "Learning", "School", "Lab", "Collective", "Campus", "Guild"],
        slogans: [
          "Practical skills and mentorship for the real world.",
          "Where curiosity turns into career-defining mastery.",
          "Empowering ambitious minds to learn faster and lead further.",
          "Rigorous training designed for tomorrow's builders and leaders.",
          "Bridging the gap between classroom theory and industry excellence.",
          "Unlocking human potential through structured, hands-on learning.",
          "Built for learners who want mastery, not just certificates.",
          "Clear pathways to high-value skills and lifelong growth.",
          "Teaching the craft, discipline, and thinking that matter.",
          "Shaping capable leaders through transformative education.",
          "Learn with intention. Build with confidence.",
          "World-class curriculum tailored for ambitious talent.",
          "Igniting capability, curiosity, and excellence.",
          "Where dedicated mentorship meets practical mastery.",
          "Elevating standards in modern skill development.",
          "Knowledge that compounds for a lifetime."
        ]
      },
      health: {
        seeds: ["Vita", "Pulse", "Serene", "Aegis", "haven", "Clarity"],
        evocativeAdjs: ["Vita", "Pure", "Serene", "Prime", "True", "Clear", "Gentle", "Aegis", "Calm", "First", "Veritas", "Solis"],
        evocativeNouns: ["Pulse", "Care", "Life", "Haven", "Cross", "Well", "Spring", "Shield", "Path", "Balance", "Heart", "Aura"],
        formats: ["Health", "Diagnostics", "Clinic", "Wellness", "Medics", "Care", "Pharmacy", "Centre"],
        slogans: [
          "Compassionate, evidence-based care centred around you.",
          "Modern diagnostics and healthcare you can trust completely.",
          "Where clinical excellence meets genuine human empathy.",
          "Accessible, dignified healthcare for every stage of life.",
          "Precision diagnostics. Proactive wellness. Trusted care.",
          "Putting patient clarity, comfort, and outcomes first.",
          "Restoring health and peace of mind through attentive medicine.",
          "Dependable medical care built onclinical integrity.",
          "Thoughtful wellness and preventative care for modern families.",
          "Clear answers, gentle care, and trusted medical expertise.",
          "Dedicated to healthier lives and stronger communities.",
          "Clinical accuracy delivered with warmth and respect.",
          "Your partner in lifelong vitality and preventative health.",
          "Modern medicine practised with patience and precision.",
          "Safe, responsive healthcare when it matters most.",
          "Care that listens. Expertise that heals."
        ]
      }
    };

    const KNOWN_FORMATS = new Set([
      "atelier", "studio", "maison", "house", "boutique", "couture", "collective", "gallery",
      "vault", "lounge", "hub", "store", "mart", "market", "exchange", "works", "forge",
      "lab", "labs", "kitchen", "bistro", "bakehouse", "cafe", "clinic", "pharmacy",
      "academy", "institute", "ventures", "partners", "advisory", "group", "estates",
      "homes", "realty", "farms", "express", "logistics", "transit", "salon", "spa",
      "parlour", "club", "room", "edit", "agency", "company", "bureau", "guild"
    ]);

    const KNOWN_DESCRIPTORS = new Set([
      "luxury", "luxe", "bespoke", "fine", "haute", "modern", "minimal", "pure", "organic",
      "natural", "glow", "radiant", "velvet", "silk", "golden", "royal", "sovereign",
      "prime", "elite", "artisan", "artisanal", "crafted", "timeless", "classic", "urban",
      "street", "vintage", "bold", "swift", "rapid", "instant", "smart", "clean", "green",
      "fresh", "wholesome", "executive", "signature", "exclusive", "opulent", "prive",
      "noir", "ivory", "vera", "aurea", "supreme", "global", "premier", "heritage",
      "authentic", "chic", "sleek", "custom", "elevated", "curated", "rare", "vivid"
    ]);

    const KNOWN_DOMAINS = new Set([
      "fashion", "design", "designs", "apparel", "clothing", "style", "wear", "tailoring",
      "textiles", "fabric", "bridal", "bridals", "jewelry", "jewels", "accessories",
      "footwear", "shoes", "bags", "dress", "dresses", "garments", "wardrobe",
      "beauty", "skincare", "skin", "fragrance", "perfume", "scent", "hair", "cosmetics",
      "makeup", "wellness", "aesthetics",
      "tech", "technology", "pay", "payments", "fintech", "software", "data", "cloud",
      "cyber", "ai", "digital", "web", "code", "saas", "systems", "automation",
      "food", "foods", "bakery", "catering", "grill", "spice", "coffee", "tea", "dining",
      "pastry", "confectionery", "cuisine", "snacks",
      "logistics", "cargo", "freight", "dispatch", "delivery", "haulage", "shipping",
      "courier", "fleet", "supply",
      "property", "properties", "realestate", "estate", "architecture", "interiors",
      "decor", "construction", "build", "housing",
      "solar", "energy", "power",
      "agro", "agriculture", "farm", "farming", "harvest", "produce", "grains",
      "health", "healthcare", "medical", "care", "fitness", "diagnostics", "med",
      "consulting", "finance", "capital", "legal", "strategy", "media", "creative",
      "photography", "print", "events", "education", "learning", "training", "coaching",
      "retail", "commerce", "shop", "shopping", "trade"
    ]);

    const capitalize = (str) => {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const makeDomain = (name) => {
      const clean = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      return `${clean.slice(0, 22)}.com`;
    };

    const makeCoinedWord = (base, seedIdx) => {
      const clean = base
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z]/g, "");
      if (!clean) return "Vellura";
      const lower = clean.toLowerCase();
      // Strip trailing vowel or 'ie'/'y' for smooth blending
      const stem = lower.length > 4
        ? lower.replace(/(ie|y|a|e|o|u)$/i, "")
        : lower;
      const capStem = capitalize(stem);
      const endings = ["éa", "ora", "via", "era", "ia", "ova", "elle", "is", "a", "lux"];
      const suffix = endings[seedIdx % endings.length];
      if (capStem.toLowerCase().endsWith(suffix.replace("é", "e"))) {
        return `${capStem}ra`;
      }
      return `${capStem}${suffix}`;
    };

    const generateIdeas = () => {
      generationSeed++;
      const rawKw = keywordsInput ? keywordsInput.value.trim() : "";
      let industryKey = industrySelect ? industrySelect.value : "general";
      const styleKey = styleSelect ? styleSelect.value : "all";
      const audienceRaw = audienceInput ? audienceInput.value.trim() : "";

      // Parse all user keywords cleanly (up to 10 words)
      const parsedWords = rawKw
        .split(/[\s,;/-]+/)
        .map((w) => w.replace(/[^a-zA-Z0-9éèêàù]/g, ""))
        .filter((w) => w.length >= 2)
        .map(capitalize);

      // Classify user keywords into semantic roles
      const anchors = [];
      const domains = [];
      const descriptors = [];
      const formats = [];

      parsedWords.forEach((word) => {
        const lw = word.toLowerCase();
        if (KNOWN_FORMATS.has(lw)) {
          formats.push(word);
        } else if (KNOWN_DESCRIPTORS.has(lw)) {
          descriptors.push(word);
        } else if (KNOWN_DOMAINS.has(lw)) {
          domains.push(word);
        } else {
          anchors.push(word);
        }
      });

      // Smart Sub-Niche Auto-Detection from Keywords
      const allLower = parsedWords.map((w) => w.toLowerCase());
      const hasFashionSignal = allLower.some((w) =>
        ["fashion", "atelier", "couture", "bespoke", "apparel", "wear", "tailoring", "bridal", "dress", "style", "garment", "silhouette", "design", "designs"].includes(w)
      );
      const hasBeautySignal = allLower.some((w) =>
        ["beauty", "skincare", "skin", "fragrance", "perfume", "glow", "cosmetics", "makeup", "salon", "spa", "hair"].includes(w)
      );
      const hasLuxurySignal = styleKey === "luxury" || allLower.some((w) =>
        ["luxury", "luxe", "atelier", "maison", "couture", "bespoke", "sovereign", "opulent", "velvet", "silk", "fine", "haute", "prive"].includes(w)
      );

      let activeLexiconKey = industryKey;
      if (hasFashionSignal && (industryKey === "general" || industryKey === "ecommerce")) {
        activeLexiconKey = "fashion";
      } else if (hasBeautySignal && (industryKey === "general" || industryKey === "ecommerce")) {
        activeLexiconKey = "beauty";
      }

      const lex = industryVocab[activeLexiconKey] || industryVocab.general;
      const pick = (arr, offset = 0) => arr[(generationSeed + offset) % arr.length];

      // Determine semantic slots with intelligent fallbacks
      const primaryAnchor = anchors[0] || "";
      const secondaryAnchor = anchors[1] || "";
      const primaryDomain = domains[0] || pick(lex.seeds, 0);
      const secondaryDomain = domains[1] || (domains[0] ? pick(lex.evocativeNouns, 1) : pick(lex.seeds, 2));
      const primaryDesc = descriptors[0] || pick(lex.evocativeAdjs, 0);
      const secondaryDesc = descriptors[1] || pick(lex.evocativeAdjs, 3);
      const primaryFormat = formats[0] || pick(lex.formats, 0);
      const secondaryFormat = formats[1] || pick(lex.formats, 2);

      // Craft a rich candidate pool across diverse naming archetypes
      const candidatePool = [];

      if (primaryAnchor) {
        // When user includes a founder/brand name (e.g. "Jennie"), use it like a true brand house/signature
        // AND balance it with evocative concepts from their other keywords so not all 12 repeat the same word.
        candidatePool.push(
          {
            style: "luxury",
            tag: "Signature House",
            name: `${primaryAnchor} ${primaryFormat}`,
            sloganIdx: 0
          },
          {
            style: "luxury",
            tag: "Maison & Label",
            name: `Maison ${primaryAnchor}`,
            sloganIdx: 1
          },
          {
            style: "modern",
            tag: "Eponymous Brand",
            name: `House of ${primaryAnchor}`,
            sloganIdx: 2
          },
          {
            style: "corporate",
            tag: "Studio Identity",
            name: `${primaryAnchor} ${primaryDomain} ${secondaryFormat === primaryFormat ? "Studio" : secondaryFormat}`,
            sloganIdx: 3
          },
          {
            style: "modern",
            tag: "Editorial Label",
            name: `The ${primaryAnchor} ${formats.includes("Edit") ? "Collective" : "Edit"}`,
            sloganIdx: 4
          },
          {
            style: "luxury",
            tag: "Designer Label",
            name: `By ${primaryAnchor} ${descriptors[0] || ""}`.trim(),
            sloganIdx: 5
          },
          {
            style: "modern",
            tag: "Coined Brandable",
            name: `${makeCoinedWord(primaryAnchor, generationSeed)} ${primaryFormat}`,
            sloganIdx: 9
          },
          {
            style: "corporate",
            tag: "CAC Corporate",
            name: `${primaryAnchor} & Co. ${primaryDomain}`,
            sloganIdx: 11
          }
        );
      }

      // Multi-keyword synthesis & evocative brand names (works whether or not a founder name was entered)
      candidatePool.push(
        {
          style: "luxury",
          tag: "Evocative Boutique",
          name: `${pick(lex.evocativeAdjs, 1)} & ${pick(lex.evocativeNouns, 2)} ${primaryFormat}`,
          sloganIdx: 6
        },
        {
          style: "modern",
          tag: "Modern Concept",
          name: `${pick(lex.evocativeNouns, 4)} & ${pick(lex.evocativeNouns, 7)}`,
          sloganIdx: 8
        },
        {
          style: "luxury",
          tag: "Upscale Identity",
          name: `${pick(lex.evocativeAdjs, 5)} ${primaryDomain} ${secondaryFormat}`,
          sloganIdx: 7
        },
        {
          style: "modern",
          tag: "Brand Compound",
          name: `${primaryDesc} & ${pick(lex.evocativeNouns, 0)}`,
          sloganIdx: 10
        },
        {
          style: "corporate",
          tag: "CAC Corporate",
          name: `${pick(lex.evocativeAdjs, 2)} ${primaryDomain} ${pick(lex.formats, 4)}`,
          sloganIdx: 12
        },
        {
          style: "modern",
          tag: "Coined Brandable",
          name: `${makeCoinedWord(primaryDesc || primaryDomain, generationSeed + 2)} ${primaryDomain}`,
          sloganIdx: 13
        },
        {
          style: "corporate",
          tag: "Enterprise Brand",
          name: `${secondaryAnchor || pick(lex.evocativeAdjs, 8)} ${secondaryDomain} Collective`,
          sloganIdx: 14
        },
        {
          style: "action",
          tag: "Direct Identity",
          name: `Studio ${primaryAnchor || pick(lex.evocativeAdjs, 6)}`,
          sloganIdx: 15
        },
        {
          style: "nigerian",
          tag: "Cultural Fusion",
          name: `${pick(["Aso", "Kora", "Eko", "Zobo", "Arewa", "Odua", "Ife", "Zaria"], 0)} & ${pick(lex.evocativeNouns, 3)} ${primaryFormat}`,
          sloganIdx: 4
        },
        {
          style: "nigerian",
          tag: "Heritage Brand",
          name: `House of ${pick(["Kora", "Aso", "Adire", "Eko", "Oriki", "Amaka"], 2)} ${primaryDomain}`,
          sloganIdx: 6
        },
        {
          style: "action",
          tag: "Dynamic Brand",
          name: `${pick(["Verve", "Pulse", "Apex", "Nova", "Stride", "Momentum"], 1)} ${primaryDomain} ${primaryFormat}`,
          sloganIdx: 10
        },
        {
          style: "action",
          tag: "Bold Concept",
          name: `The ${primaryDesc} ${primaryDomain} Room`,
          sloganIdx: 11
        }
      );

      // Filter by style if a specific tone was selected, otherwise curate a smart balanced mix
      let selectedPool = styleKey === "all"
        ? candidatePool
        : candidatePool.filter((c) => c.style === styleKey || (hasLuxurySignal && c.style === "luxury"));

      // If user selected a specific style that has < 12 items in candidatePool, top up from remaining candidates seamlessly
      if (selectedPool.length < 12) {
        candidatePool.forEach((c) => {
          if (selectedPool.length < 16 && !selectedPool.includes(c)) {
            selectedPool.push(c);
          }
        });
      }

      // Deduplicate names and pair each with a unique, context-aware copywriter slogan
      const usedNames = new Set();
      const usedSlogans = new Set();
      const finalItems = [];

      for (let i = 0; i < selectedPool.length && finalItems.length < 12; i++) {
        const item = selectedPool[(i + (generationSeed > 1 ? generationSeed : 0)) % selectedPool.length];
        const cleanName = item.name.replace(/\s+/g, " ").trim();
        const nameKey = cleanName.toLowerCase();
        if (usedNames.has(nameKey)) continue;
        usedNames.add(nameKey);

        // Pick a unique slogan from the lexicon's copywriter bank
        let sloganText = "";
        for (let s = 0; s < lex.slogans.length; s++) {
          const candidateSlogan = lex.slogans[(item.sloganIdx + generationSeed + s) % lex.slogans.length];
          if (!usedSlogans.has(candidateSlogan)) {
            sloganText = candidateSlogan;
            usedSlogans.add(candidateSlogan);
            break;
          }
        }
        if (!sloganText) {
          sloganText = lex.slogans[(i + generationSeed) % lex.slogans.length];
        }

        // If user specified a target audience/location, subtly tailor 3 of the slogans without breaking grammar
        if (audienceRaw && finalItems.length % 4 === 3 && sloganText.endsWith(".")) {
          sloganText = `${sloganText.slice(0, -1)} — crafted for ${audienceRaw}.`;
        }

        finalItems.push({
          id: `${Date.now()}_${finalItems.length}`,
          name: cleanName,
          slogan: sloganText,
          tag: item.tag,
          domain: makeDomain(cleanName)
        });
      }

      generatedList = finalItems;

      activeTab = "all";
      updateTabUI();
      renderCards();
      saveSession();
    };

    const isSaved = (item) => {
      return savedList.some((s) => s.name === item.name && s.slogan === item.slogan);
    };

    const toggleSave = (item) => {
      const idx = savedList.findIndex((s) => s.name === item.name && s.slogan === item.slogan);
      if (idx >= 0) {
        savedList.splice(idx, 1);
        showToast("Removed from Saved Shortlist");
      } else {
        savedList.push(item);
        showToast("★ Added to Saved Shortlist!");
      }
      renderCards();
      saveSession();
    };

    const updateTabUI = () => {
      if (tabAllBtn) {
        tabAllBtn.classList.toggle("is-active", activeTab === "all");
        tabAllBtn.setAttribute("aria-selected", activeTab === "all" ? "true" : "false");
      }
      if (tabSavedBtn) {
        tabSavedBtn.classList.toggle("is-active", activeTab === "saved");
        tabSavedBtn.setAttribute("aria-selected", activeTab === "saved" ? "true" : "false");
      }
      if (allCountSpan) allCountSpan.textContent = generatedList.length;
      if (savedCountSpan) savedCountSpan.textContent = savedList.length;
    };

    const renderCards = () => {
      updateTabUI();
      const source = activeTab === "saved" ? savedList : generatedList;

      if (!source || source.length === 0) {
        if (emptyState) {
          emptyState.style.display = "flex";
          const titleEl = emptyState.querySelector(".bns-empty-title");
          const subEl = emptyState.querySelector(".bns-empty-sub");
          if (activeTab === "saved") {
            if (titleEl) titleEl.innerHTML = "Your <strong>Saved Shortlist</strong> is currently empty";
            if (subEl) subEl.textContent = "Click the '★ Save' button on any generated business name to bookmark your top contenders here.";
          } else {
            if (titleEl) titleEl.innerHTML = "Enter your business keywords above and click <strong>Generate Names & Slogans</strong>";
            if (subEl) subEl.textContent = "We will generate 12 brandable business names paired with tailored slogans and domain previews.";
          }
        }
        if (cardsGrid) cardsGrid.style.display = "none";
        return;
      }

      if (emptyState) emptyState.style.display = "none";
      if (!cardsGrid) return;
      cardsGrid.style.display = "grid";
      cardsGrid.innerHTML = "";

      source.forEach((item) => {
        const saved = isSaved(item);
        const card = document.createElement("div");
        card.className = "bns-idea-card";
        card.innerHTML = `
          <div>
            <div class="bns-idea-top">
              <span class="bns-idea-tag">${item.tag}</span>
              <span class="bns-domain-pill">${item.domain}</span>
            </div>
            <h3 class="bns-idea-name">${item.name}</h3>
            <p class="bns-idea-slogan">“${item.slogan}”</p>
          </div>
          <div class="bns-idea-actions">
            <button type="button" class="bns-card-btn bns-save-btn ${saved ? "is-saved" : ""}">
              <span>${saved ? "★ Saved" : "☆ Save"}</span>
            </button>
            <button type="button" class="bns-card-btn bns-copy-btn">
              <span>Copy</span>
            </button>
          </div>
        `;

        const saveBtn = card.querySelector(".bns-save-btn");
        const copyBtn = card.querySelector(".bns-copy-btn");

        if (saveBtn) {
          saveBtn.addEventListener("click", () => toggleSave(item));
        }

        if (copyBtn) {
          copyBtn.addEventListener("click", () => {
            const text = `${item.name} — "${item.slogan}" (${item.domain})`;
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(text).then(() => {
                showToast(`✓ Copied "${item.name}"!`);
              });
            } else {
              showToast(`✓ Copied "${item.name}"!`);
            }
          });
        }

        cardsGrid.appendChild(card);
      });
    };

    const saveSession = () => {
      const payload = {
        timestamp: Date.now(),
        keywords: keywordsInput ? keywordsInput.value : "",
        industry: industrySelect ? industrySelect.value : "general",
        style: styleSelect ? styleSelect.value : "all",
        audience: audienceInput ? audienceInput.value : "",
        generated: generatedList,
        saved: savedList
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {}
    };

    const loadSession = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          renderCards();
          return;
        }
        const data = JSON.parse(raw);
        if (Date.now() - (data.timestamp || 0) > SESSION_DURATION) {
          wipeSession(false);
          return;
        }
        if (keywordsInput && data.keywords) keywordsInput.value = data.keywords;
        if (industrySelect && data.industry) industrySelect.value = data.industry;
        if (styleSelect && data.style) styleSelect.value = data.style;
        if (audienceInput && data.audience) audienceInput.value = data.audience;
        generatedList = Array.isArray(data.generated) ? data.generated : [];
        savedList = Array.isArray(data.saved) ? data.saved : [];
        renderCards();
      } catch (e) {
        renderCards();
      }
    };

    const wipeSession = (notify = true) => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      if (keywordsInput) keywordsInput.value = "";
      if (industrySelect) industrySelect.value = "general";
      if (styleSelect) styleSelect.value = "all";
      if (audienceInput) audienceInput.value = "";
      generatedList = [];
      savedList = [];
      activeTab = "all";
      renderCards();
      if (notify) showToast("✓ All brainstormer data wiped clean!");
    };

    const updateCountdown = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          if (timerDisplay) timerDisplay.textContent = "30:00";
          return;
        }
        const data = JSON.parse(raw);
        const remaining = Math.max(0, SESSION_DURATION - (Date.now() - (data.timestamp || 0)));
        if (remaining <= 0) {
          wipeSession(false);
          if (timerDisplay) timerDisplay.textContent = "00:00";
          return;
        }
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        if (timerDisplay) {
          timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        }
      } catch (e) {
        if (timerDisplay) timerDisplay.textContent = "30:00";
      }
    };

    if (generateBtn) {
      generateBtn.addEventListener("click", () => {
        generateIdeas();
      });
    }

    if (regenerateBtn) {
      regenerateBtn.addEventListener("click", () => {
        generateIdeas();
        showToast("✓ Generated 12 fresh name & slogan ideas!");
      });
    }

    if (keywordsInput) {
      keywordsInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          generateIdeas();
        }
      });
    }

    if (tabAllBtn) {
      tabAllBtn.addEventListener("click", () => {
        activeTab = "all";
        renderCards();
      });
    }

    if (tabSavedBtn) {
      tabSavedBtn.addEventListener("click", () => {
        activeTab = "saved";
        renderCards();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        wipeSession(true);
      });
    }

    if (wipeBtn) {
      wipeBtn.addEventListener("click", () => {
        wipeSession(true);
      });
    }

    if (copyAllBtn) {
      copyAllBtn.addEventListener("click", () => {
        const listToCopy = savedList.length > 0 ? savedList : generatedList;
        if (!listToCopy.length) {
          showToast("Generate names first before copying!");
          return;
        }
        let text = `===========================================\nBUSINESS NAME & SLOGAN SHORTLIST\n===========================================\n`;
        listToCopy.forEach((item, idx) => {
          text += `${idx + 1}. ${item.name}\n   Slogan: "${item.slogan}"\n   Domain: ${item.domain} [${item.tag}]\n\n`;
        });
        text += `Generated via AlphaTNX Digital: https://digital.alphatnx.com/tool/business-name-and-slogan-brainstormer`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            showToast("✓ Brand shortlist copied to clipboard!");
          });
        } else {
          showToast("✓ Brand shortlist copied!");
        }
      });
    }

    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener("click", () => {
        if (generatedList.length === 0 && savedList.length === 0) {
          generateIdeas();
        }
        const listToPrint = savedList.length > 0 ? savedList : generatedList;
        const printBody = document.getElementById("print-bns-items-body");
        const printMeta = document.getElementById("print-bns-meta");
        const printKw = document.getElementById("print-bns-keywords");
        const printAud = document.getElementById("print-bns-audience");

        const indText = industrySelect && industrySelect.options[industrySelect.selectedIndex]
          ? industrySelect.options[industrySelect.selectedIndex].text
          : "General Business";
        const styleText = styleSelect && styleSelect.options[styleSelect.selectedIndex]
          ? styleSelect.options[styleSelect.selectedIndex].text
          : "Balanced Mix";

        if (printMeta) {
          printMeta.textContent = `Industry: ${indText} · Tone: ${styleText}`;
        }
        if (printKw) {
          printKw.textContent = (keywordsInput && keywordsInput.value.trim()) ? keywordsInput.value.trim() : "Brand Seed";
        }
        if (printAud) {
          printAud.textContent = (audienceInput && audienceInput.value.trim()) ? audienceInput.value.trim() : "Nigeria / General";
        }

        if (printBody) {
          printBody.innerHTML = "";
          listToPrint.forEach((item, idx) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${idx + 1}</td>
              <td><strong>${item.name}</strong><br><span style="font-size: 10.5px; color: #64748B;">${item.tag}</span></td>
              <td style="font-style: italic;">“${item.slogan}”</td>
              <td style="font-family: monospace; font-size: 12px;">${item.domain}</td>
            `;
            printBody.appendChild(tr);
          });
        }

        const originalDocTitle = document.title;
        const kwTitle = (keywordsInput && keywordsInput.value.trim())
          ? `${keywordsInput.value.trim().replace(/[/\\?%*:|"<>]/g, "")} - Brand Name Shortlist`
          : "Brand Name and Slogan Shortlist";
        document.title = kwTitle;

        window.print();

        const restoreTitle = () => {
          document.title = originalDocTitle;
          window.removeEventListener("afterprint", restoreTitle);
        };
        window.addEventListener("afterprint", restoreTitle);
        setTimeout(() => { document.title = originalDocTitle; }, 3000);
      });
    }

    loadSession();
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
