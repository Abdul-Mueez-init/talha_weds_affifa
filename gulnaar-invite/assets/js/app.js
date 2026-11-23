/**
 * INVITATION INTERACTIONS
 * -----------------------
 * Opening, music, scratch card and petal shower are carried over unchanged
 * from the original template. Everything below the hero (letter, calendar,
 * countdown, timeline, festivities, gallery, venue, dress code, blessings)
 * is new. Client content lives in config.js.
 */

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

document.addEventListener("dragstart", (event) => {
  if (event.target instanceof HTMLImageElement) {
    event.preventDefault();
  }
});

(function () {
  "use strict";

  const config = window.INVITATION_CONFIG;

  if (!config) {
    throw new Error("Invitation config was not loaded. Check assets/js/config.js.");
  }

  const select = (selector, root = document) => root.querySelector(selector);
  const selectAll = (selector, root = document) => [...root.querySelectorAll(selector)];
  const pad = (value) => String(value).padStart(2, "0");
  const reduceMotion = () =>
    config.motion === "reduce" ||
    (config.motion !== "full" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ---- carried over unchanged from the original: initializeViewportHeight, resetInitialScrollPosition, getValue, createElement, setName, setCoupleNames, updateMusicControl, initializeOpening, initializeMusic, initializeScratchCard, createPetalShower ---- */

  function initializeViewportHeight() {
      let viewportWidth = 0;
  
      const syncViewportHeight = (force = false) => {
        const viewport = window.visualViewport;
        const width = Math.round(viewport?.width || window.innerWidth);
  
        // Ignore toolbar-only height changes so the hero does not jump while scrolling.
        if (!force && Math.abs(width - viewportWidth) < 2) return;
  
        viewportWidth = width;
        const height = Math.round(viewport?.height || window.innerHeight);
  
        document.documentElement.style.setProperty(
          "--mehr-visible-height",
          `${height}px`,
        );
      };
  
      syncViewportHeight(true);
      window.addEventListener("resize", () => syncViewportHeight());
      window.addEventListener("orientationchange", () => {
        window.setTimeout(() => syncViewportHeight(true), 120);
      });
    }

  function resetInitialScrollPosition() {
      const forceTop = () => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo(0, 0);
      };
  
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
  
      if (window.location.hash) {
        history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
      }
  
      forceTop();
  
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(forceTop);
      });
  
      window.addEventListener(
        "load",
        () => window.setTimeout(forceTop, 0),
        { once: true },
      );
  
      window.addEventListener(
        "pageshow",
        () => window.setTimeout(forceTop, 0),
        { once: true },
      );
    }

  function getValue(path) {
      return path.split(".").reduce((value, key) => value?.[key], config);
    }

  function createElement(tagName, className, text) {
      const element = document.createElement(tagName);
  
      if (className) element.className = className;
      if (text !== undefined) element.textContent = text;
  
      return element;
    }

  // A leading title ("Dr", "Md", "Syed"...) is not a first name.
  const TITLES = /^(dr|dr\.|mr|mr\.|mrs|mrs\.|ms|ms\.|miss|prof|prof\.|er|er\.|engr|engr\.|capt|capt\.|col|col\.|major|hafiz|hafiza|maulana|moulana|mohd|mohd\.|md|md\.|mohammad|muhammad|mohammed|syed|sayyed|sk|late|shri|smt|sri)$/i;

  function splitName(fullName) {
      const words = String(fullName || "").trim().split(/\s+/).filter(Boolean);
      let n = 0;
      while (n < words.length - 1 && TITLES.test(words[n])) n++;
      return [words.slice(0, n + 1).join(" "), words.slice(n + 1).join(" ")];
    }

  // The couple's own short name wins; otherwise the first real name word.
  function shortName(person) {
      const own = String((person && person.shortName) || "").trim();
      return own || splitName(person && person.name)[0];
    }

  function setName(element, fullName) {
      const [firstName, rest] = splitName(fullName);
      const firstNameElement = createElement("span", "", firstName);

      element.replaceChildren(firstNameElement, ` ${rest}`);
    }

  function setCoupleNames(element) {
      element.replaceChildren(
        document.createTextNode(shortName(config.couple.groom)),
        document.createTextNode(" "),
        createElement("span", "", "&"),
        document.createTextNode(" "),
        document.createTextNode(shortName(config.couple.bride)),
      );
    }

  // Long names ("Dr Syed Md Nuruz Zaman") shrink the hero lettering so they
  // stay inside the frame; both names share one scale so they match.
  function scaleHeroNames() {
      const longest = Math.max(
        String(config.couple.bride.name || "").length,
        String(config.couple.groom.name || "").length,
      );
      const scale = longest <= 12 ? 1 : longest <= 18 ? 0.84 : longest <= 26 ? 0.7 : 0.58;
      select(".couple-names")?.style.setProperty("--name-scale", String(scale));
    }

  function updateMusicControl() {
    const audio = select("#backgroundMusic");
    const button = select("#musicToggle");
    const label = select("#musicLabel");
    const playing = !audio.paused;
  
    button.classList.toggle("is-playing", playing);
    button.setAttribute(
      "aria-label",
      playing ? "Pause background music" : "Play background music",
    );
    label.textContent = playing ? "Music" : "Music";
  }

  function initializeOpening() {
      const hero = select("#hero");
      const video = select("#introVideo");
      let opened = false;
  
      function openInvitation() {
        if (opened) return;
  
        opened = true;
        hero.classList.remove("is-closed");
        hero.classList.add("is-open");
        hero.removeAttribute("role");
        hero.removeAttribute("aria-label");
        hero.tabIndex = -1;
        select("#openingMark").setAttribute("aria-hidden", "true");
        document.body.classList.remove("intro-locked");
        video.play().catch(() => undefined);
  
        window.setTimeout(() => {
          createPetalShower({ mode: "hero" });
        }, 3500);
  
        const audio = select("#backgroundMusic");
  
  audio.play()
    .then(updateMusicControl)
    .catch(updateMusicControl);
      }
  
      hero.addEventListener("click", openInvitation);
      hero.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") openInvitation();
      });
  
      select(".scroll-cue").addEventListener("click", (event) => {
        event.stopPropagation();
      });
    }

  function initializeMusic() {
    const audio = select("#backgroundMusic");
    const button = select("#musicToggle");
  
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
  
      if (audio.paused) {
        try {
          await audio.play();
        } catch {
          // Playback can fail if the music file is missing.
        }
      } else {
        audio.pause();
      }
  
      updateMusicControl();
    });
  
    audio.addEventListener("play", updateMusicControl);
    audio.addEventListener("pause", updateMusicControl);
  
    updateMusicControl();
  }

  function initializeScratchCard() {
      const canvas = select("#scratchCanvas");
      const card = select("#scratchCard");
      const heading = select("#scratchHeading");
      const note = select("#scratchNote");
      let drawing = false;
      let revealed = false;
      let lastCheck = 0;
  
      function prepareCanvas() {
    if (revealed || !canvas.isConnected) return;
  
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const context = canvas.getContext("2d", {
      willReadFrequently: true,
    });
  
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
  
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  
    const width = rect.width;
    const height = rect.height;
  
    /* =========================
       BURGUNDY BASE
       ========================= */
  
    const gradient = context.createLinearGradient(
      0,
      0,
      width,
      height,
    );
  
    /* one even colour across the whole card: the soft teal the card used to fade to on the right */
    const mixHex = (a, b, t) => {
      const n = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
      const [ar, ag, ab] = n(a);
      const [br, bg, bb] = n(b);
      const c = (x, y) => Math.round(x + (y - x) * t);
      return "rgb(" + c(ar, br) + "," + c(ag, bg) + "," + c(ab, bb) + ")";
    };
    const scratchColor = mixHex(config.theme.lavender, config.theme.mauve, 0.4);
    gradient.addColorStop(0, scratchColor);
    gradient.addColorStop(1, scratchColor);
  
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 1;
  
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  
  
    /* =========================
       SOFT METALLIC SHIMMER
       ========================= */
  
    const shimmer = context.createLinearGradient(
      0,
      0,
      width,
      height,
    );
  
    shimmer.addColorStop(0, "rgba(255,255,255,0)");
    shimmer.addColorStop(0.35, "rgba(228,218,205,0.08)");
    shimmer.addColorStop(0.5, "rgba(255,255,255,0.13)");
    shimmer.addColorStop(0.65, "rgba(216,199,181,0.07)");
    shimmer.addColorStop(1, "rgba(255,255,255,0)");
  
    context.fillStyle = shimmer;
    context.fillRect(0, 0, width, height);
  
  
    /* =========================
       FINE GOLD GLITTER
       ========================= */
  
    const glitterCount = Math.min(
      1100,
      Math.round((width * height) / 120),
    );
  
    for (let i = 0; i < glitterCount; i += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
  
      const size = 0.25 + Math.random() * 1.15;
      const brightness = 0.15 + Math.random() * 0.55;
  
      context.globalAlpha = brightness;
  
      /*
        Mostly champagne,
        with occasional ivory sparkles.
      */
      context.fillStyle =
        Math.random() > 0.18
          ? config.theme.champagne
          : config.theme.ivory;
  
      context.beginPath();
      context.arc(
        x,
        y,
        size,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  
  
    /* =========================
       SMALL BRIGHT SPARKLES
       ========================= */
  
    const sparkleCount = Math.max(
      20,
      Math.round(width / 12),
    );
  
    for (let i = 0; i < sparkleCount; i += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
  
      const size = 1 + Math.random() * 2.1;
  
      context.globalAlpha =
        0.3 + Math.random() * 0.5;
  
      context.strokeStyle =
        Math.random() > 0.25
          ? config.theme.champagne
          : config.theme.ivory;
  
      context.lineWidth = 0.55;
  
      context.beginPath();
  
      /* horizontal glint */
      context.moveTo(x - size, y);
      context.lineTo(x + size, y);
  
      /* vertical glint */
      context.moveTo(x, y - size);
      context.lineTo(x, y + size);
  
      context.stroke();
    }
  
  
    /* =========================
       VERY FINE TEXTURE
       ========================= */
  
    for (let i = 0; i < 350; i += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
  
      context.globalAlpha =
        0.06 + Math.random() * 0.1;
  
      context.fillStyle = config.theme.ivory;
  
      context.fillRect(
        x,
        y,
        Math.random() * 0.7 + 0.15,
        Math.random() * 0.7 + 0.15,
      );
    }
  
  
    /* reset */
    context.globalAlpha = 1;
  
  
    /* =========================
       SCRATCHING MODE
       ========================= */
  
    context.globalCompositeOperation = "destination-out";
  
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 42;
  }
  
      function pointerPosition(event) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      }
  
      function beginScratch(event) {
        if (revealed) return;
  
        drawing = true;
        canvas.setPointerCapture(event.pointerId);
  
        const position = pointerPosition(event);
        const context = canvas.getContext("2d", { willReadFrequently: true });
  
        context.beginPath();
        context.moveTo(position.x, position.y);
      }
  
      function continueScratch(event) {
        if (!drawing || revealed) return;
  
        const position = pointerPosition(event);
        const context = canvas.getContext("2d", { willReadFrequently: true });
  
        context.lineTo(position.x, position.y);
        context.stroke();
  
        const now = performance.now();
        if (now - lastCheck > 90) {
          lastCheck = now;
          if (scratchCompletion(context) > 0.42) finishReveal();
        }
      }
  
      function scratchCompletion(context) {
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparentSamples = 0;
        let totalSamples = 0;
  
        for (let alphaIndex = 3; alphaIndex < pixels.length; alphaIndex += 64) {
          totalSamples += 1;
          if (pixels[alphaIndex] < 30) transparentSamples += 1;
        }
  
        return transparentSamples / totalSamples;
      }
  
      function finishReveal() {
        if (revealed) return;
  
        revealed = true;
        drawing = false;
  
        // Keep both classes: is-revealed handles celebration styling, while
        // is-visible prevents the scroll-reveal animation from hiding the card.
        card.classList.add("is-revealed", "is-visible");
        heading.textContent = "Our promise begins";
        note.textContent =
          "Save the date — we would be honoured to have you with us.";
        canvas.remove();
        createPetalShower();
      }
  
      canvas.addEventListener("pointerdown", beginScratch);
      canvas.addEventListener("pointermove", continueScratch);
      canvas.addEventListener("pointerup", () => {
        drawing = false;
      });
      canvas.addEventListener("pointercancel", () => {
        drawing = false;
      });
      canvas.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") finishReveal();
      });
  
      prepareCanvas();
      window.addEventListener("resize", prepareCanvas);
    }

  function createPetalShower({ mode = "celebration" } = {}) {
    if (reduceMotion()) {
      return;
    }
  
    document.querySelector(".petal-shower")?.remove();
  
    const isHeroShower = mode === "hero";
    const shower = createElement(
      "div",
      `petal-shower${isHeroShower ? " petal-shower--hero" : ""}`,
    );
    shower.setAttribute("aria-hidden", "true");
  
    const rootStyles = getComputedStyle(document.documentElement);
  
    const mauve =
      rootStyles.getPropertyValue("--mauve").trim() || "#8C6254";
  
    const lavender =
      rootStyles.getPropertyValue("--lavender").trim() || "#D8C7B5";
  
    const champagne =
      rootStyles.getPropertyValue("--champagne").trim() || "#AE845E";
  
    const colors = [
      mauve,
      lavender,
      mauve,
      lavender,
      mauve,
      champagne,
    ];
  
    const shapes = [
      "80% 20% 70% 30% / 65% 35% 65% 35%",
      "70% 30% 85% 15% / 55% 45% 70% 30%",
      "90% 10% 60% 40% / 70% 30% 80% 20%",
      "60% 40% 75% 25% / 80% 20% 60% 40%",
    ];
  
    const random = (min, max) =>
      Math.random() * (max - min) + min;
  
    const randomItem = (items) =>
      items[Math.floor(Math.random() * items.length)];
  
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
  
    const petalCount = isHeroShower
      ? Math.min(72, Math.max(50, Math.round(viewportWidth / 8)))
      : Math.min(60, Math.max(38, Math.round(viewportWidth / 9)));
  
    const petals = [];
  
    for (let index = 0; index < petalCount; index += 1) {
      const element = createElement("i");
  
      const size = isHeroShower ? random(7, 15) : random(7, 14);
  
      const x = random(-25, viewportWidth + 25);
      const y = random(-100, -25);
  
      const rotation = random(0, 360);
      const rotationX = random(0, 360);
      const rotationY = random(0, 360);
  
      const scale = random(0.65, 1.2);
  
      element.style.width = `${size}px`;
      element.style.height = `${size * random(1.2, 1.7)}px`;
  
      element.style.background = randomItem(colors);
      element.style.borderRadius = randomItem(shapes);
  
      /*
        Important:
        Put the petal in its real starting position BEFORE
        it gets inserted into the document.
      */
      element.style.opacity = "0";
  
      element.style.transform = `
        translate3d(${x}px, ${y}px, 0)
        rotate(${rotation}deg)
        rotateX(${rotationX}deg)
        rotateY(${rotationY}deg)
        scale(${scale})
      `;
  
      shower.append(element);
  
      petals.push({
        element,
  
        x,
        y,
  
        vx: random(-30, 30),
        vy: random(65, 120),
  
        gravity: random(12, 26),
  
        wind: random(-8, 8),
  
        sway: random(15, 55),
        swaySpeed: random(1.4, 3.5),
        swayPhase: random(0, Math.PI * 2),
  
        rotation,
        rotationX,
        rotationY,
  
        spin: random(-220, 220),
        spinX: random(-190, 190),
        spinY: random(-260, 260),
  
        scale,
        baseOpacity: isHeroShower
          ? random(0.72, 0.98)
          : random(0.55, 0.9),
  
        delay: random(0, isHeroShower ? 500 : 700),
  
        lifetime: isHeroShower
          ? random(4300, 6200)
          : random(5800, 8600),
      });
    }
  
    /*
      Append only after every petal already has
      its initial position and opacity.
    */
    (isHeroShower ? select("#hero") : document.body).append(shower);
  
    let startTime = null;
    let previousTime = null;
  
    function animate(currentTime) {
      if (startTime === null) {
        startTime = currentTime;
        previousTime = currentTime;
      }
  
      const elapsed = currentTime - startTime;
  
      const delta = Math.min(
        (currentTime - previousTime) / 1000,
        0.032,
      );
  
      previousTime = currentTime;
  
      petals.forEach((petal) => {
        /*
          Keep delayed petals completely invisible.
        */
        if (elapsed < petal.delay) {
          petal.element.style.opacity = "0";
          return;
        }
  
        const age = elapsed - petal.delay;
  
        if (age >= petal.lifetime) {
          petal.element.style.display = "none";
          return;
        }
  
        const time = age / 1000;
  
        petal.vy += petal.gravity * delta;
  
        petal.vx +=
          Math.sin(
            time * 0.75 + petal.swayPhase,
          ) *
          petal.wind *
          delta;
  
        petal.x += petal.vx * delta;
        petal.y += petal.vy * delta;
  
        petal.rotation += petal.spin * delta;
        petal.rotationX += petal.spinX * delta;
        petal.rotationY += petal.spinY * delta;
  
        const sway =
          Math.sin(
            time * petal.swaySpeed + petal.swayPhase,
          ) * petal.sway;
  
        const flutterY =
          Math.sin(
            time * petal.swaySpeed * 2.2 +
            petal.swayPhase,
          ) * 5;
  
        const flip =
          0.35 +
          Math.abs(
            Math.cos(
              time * petal.swaySpeed * 1.8 +
              petal.swayPhase,
            ),
          ) *
            0.65;
  
        /*
          Soft fade-in.
          Prevents petals popping into existence.
        */
        const fadeInDuration = 250;
  
        let opacity =
          petal.baseOpacity *
          Math.min(1, age / fadeInDuration);
  
        const fadeStart = viewportHeight * 0.82;
  
        if (petal.y > fadeStart) {
          const bottomFade =
            1 -
            (petal.y - fadeStart) /
              (viewportHeight + 100 - fadeStart);
  
          opacity *= Math.max(0, bottomFade);
        }
  
        if (age > petal.lifetime * 0.82) {
          const lifeFade =
            1 -
            (age - petal.lifetime * 0.82) /
              (petal.lifetime * 0.18);
  
          opacity *= Math.max(0, lifeFade);
        }
  
        petal.element.style.opacity =
          Math.max(0, opacity);
  
        petal.element.style.transform = `
          translate3d(
            ${petal.x + sway}px,
            ${petal.y + flutterY}px,
            0
          )
          rotate(${petal.rotation}deg)
          rotateX(${petal.rotationX}deg)
          rotateY(${petal.rotationY}deg)
          scale(${petal.scale})
          scaleX(${flip})
        `;
  
        if (petal.y > viewportHeight + 120) {
          petal.element.style.display = "none";
        }
      });
  
      if (elapsed < (isHeroShower ? 7600 : 10000)) {
        requestAnimationFrame(animate);
      } else {
        shower.remove();
      }
    }
  
    requestAnimationFrame(animate);
  }

  /* ================================================================
     NEW — everything below the hero
     ================================================================ */

  function applyConfig() {
    document.documentElement.dataset.motion = config.motion || "respect";
    document.title = config.site.title;

    select('meta[name="description"]')?.setAttribute("content", config.site.description);
    select('meta[property="og:title"]')?.setAttribute("content", config.site.title);
    select('meta[property="og:description"]')?.setAttribute("content", config.site.description);

    const root = document.documentElement;

    Object.entries(config.theme).forEach(([name, value]) => {
      root.style.setProperty(`--${name}`, value);
    });

    selectAll("[data-bind]").forEach((element) => {
      const value = getValue(element.dataset.bind);
      element.textContent = value ?? "";
    });

    setName(select("#brideName"), config.couple.bride.name);
    setName(select("#groomName"), config.couple.groom.name);
    scaleHeroNames();
    setCoupleNames(select("#welcomeSignature"));
    setCoupleNames(select("#closingNames"));

    select("#closingDetails").innerHTML =
      "© 2026 All Rights Reserved<br>Developed by Abdul Moiz (Honourable Mention)";

    selectAll("[data-map-link]").forEach((link) => {
      link.href = config.venue.mapUrl;
    });

    const audio = select("#backgroundMusic");
    const video = select("#introVideo");
    const videoSource = select("#introVideoSource");

    audio.src = config.media.music;
    video.poster = config.media.introPoster;
    videoSource.src = config.media.introVideo;
    video.load();

    renderHosts();
    renderProgram();
    renderFestivities();
    renderGallery();
    renderCalendar();
    renderRsvpNote();
    renderDua();
  }

  /* ---------- letter: the two families ---------- */
  function renderHosts() {
    const mount = select("#hosts");
    if (!mount) return;

    [
      [config.couple.groom, "The groom"],
      [config.couple.bride, "The bride"],
    ].forEach(([person, fallbackRole], index) => {
      if (!person.parents) return;
      // The editor's "groom's name first" swaps the slots, so the label
      // travels with the person instead of the slot position.
      const role = person.role || fallbackRole;

      if (index === 1 && mount.children.length) {
        mount.append(createElement("span", "x-hosts__amp", "✦ &"));
      }

      const host = createElement("div", "x-host");
      host.append(
        createElement("small", "x-host__role", role),
        createElement("em", "", shortName(person)),
        createElement("small", "", person.relation || ""),
        createElement("strong", "", person.parents),
      );
      mount.append(host);
    });

    if (!mount.children.length) mount.remove();
  }

  /* ---------- timeline ---------- */
  function renderProgram() {
    const timeline = select("#programTimeline");
    if (!timeline) return;

    (config.program || []).forEach((item, index) => {
      const step = createElement("li", "x-step rv");
      const dot = createElement("span", "x-step__dot");
      dot.append(createElement("span", "", pad(index + 1)));
      dot.setAttribute("aria-hidden", "true");

      step.append(
        dot,
        createElement("time", "", item.time),
        createElement("h3", "", item.title),
        createElement("p", "", item.note || ""),
      );
      timeline.append(step);
    });

    const section = timeline.closest("section");
    if (!timeline.children.length && section) section.hidden = true;
  }

  function initializeTimeline() {
    const timeline = select("#programTimeline");
    if (!timeline || !timeline.children.length) return;

    const steps = selectAll(".x-step", timeline);
    let queued = false;

    function update() {
      queued = false;

      const rect = timeline.getBoundingClientRect();
      const mid = window.innerHeight * 0.62;
      const progress = Math.min(1, Math.max(0, (mid - rect.top) / rect.height));

      timeline.style.setProperty("--p", progress.toFixed(3));

      steps.forEach((step) => {
        const dot = select(".x-step__dot", step).getBoundingClientRect();
        step.classList.toggle("is-lit", dot.top + dot.height / 2 < mid);
      });
    }

    function queue() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();
  }

  /* ---------- festivities (pre-wedding events) ---------- */
  function parseDay(text) {
    const day = /\b(\d{1,2})\b/.exec(text || "");
    const month = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*/i.exec(text || "");
    return day && month ? { day: day[1], month: month[1] } : null;
  }

  function renderFestivities() {
    const list = select("#preWeddingEvents");
    if (!list) return;

    const section = list.closest("section");
    const events = config.preWeddingEvents || [];

    if (!events.length) {
      if (section) section.hidden = true;
      return;
    }

    events.forEach((event, index) => {
      const card = createElement("article", "x-fest-card rv");
      card.style.setProperty("--i", index);

      const parsed = parseDay(event.date);

      if (parsed) {
        const badge = createElement("div", "x-date-badge");
        badge.setAttribute("aria-hidden", "true");
        badge.append(createElement("b", "", parsed.day), createElement("i", "", parsed.month));
        card.append(badge);
      }

      card.append(
        createElement("h3", "", event.name),
        createElement("span", "when", [event.date, event.time].filter(Boolean).join("  ·  ")),
        createElement("span", "where", event.location || ""),
      );

      if (event.address) {
        card.append(createElement("span", "where", event.address));
      }

      if (event.mapLink) {
        const link = createElement("a", "x-link", "View on Google Maps");
        link.href = event.mapLink;
        link.target = "_blank";
        link.rel = "noreferrer";
        card.append(link);
      }

      list.append(card);
    });
  }

  /* ---------- gallery ---------- */
  function renderGallery() {
    const mount = select("#gallery");
    if (!mount) return;

    const section = mount.closest("section");
    const images = config.media.gallery || [];

    if (!images.length) {
      if (section) section.hidden = true;
      return;
    }

    const framed = mount.dataset.mode === "frame";
    const slides = framed ? select(".x-gal__slides", mount) : mount;
    const figures = images.map((image, index) => {
      const figure = createElement("figure", framed && index === 0 ? "is-active" : "");
      const photo = createElement("img");

      photo.src = image.src;
      photo.alt = image.alt || "";
      photo.loading = images.length <= 6 || index < 2 ? "eager" : "lazy";
      photo.decoding = "async";

      figure.append(photo, createElement("figcaption", "", image.caption || ""));
      slides.append(figure);
      return figure;
    });

    /* tap a photo -> full-screen viewer */
    let current = 0;
    const box = createElement("div", "x-lightbox");
    const big = createElement("img");
    const close = createElement("button", "lb-close", "×");
    const prev = createElement("button", "lb-prev", "‹");
    const next = createElement("button", "lb-next", "›");

    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    [close, prev, next].forEach((button) => (button.type = "button"));
    close.setAttribute("aria-label", "Close photo");
    prev.setAttribute("aria-label", "Previous photo");
    next.setAttribute("aria-label", "Next photo");
    box.append(big, close, prev, next);
    document.body.append(box);

    function show(index) {
      current = (index + images.length) % images.length;
      big.src = images[current].src;
      big.alt = images[current].alt || "";
    }

    function open(index) {
      show(index);
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function closeBox() {
      box.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    close.addEventListener("click", closeBox);
    prev.addEventListener("click", () => show(current - 1));
    next.addEventListener("click", () => show(current + 1));
    box.addEventListener("click", (event) => {
      if (event.target === box) closeBox();
    });
    document.addEventListener("keydown", (event) => {
      if (!box.classList.contains("is-open")) return;
      if (event.key === "Escape") closeBox();
      if (event.key === "ArrowLeft") show(current - 1);
      if (event.key === "ArrowRight") show(current + 1);
    });

    let active = 0;
    const dots = select("#galleryDots");
    let timer;

    function go(index) {
      active = (index + figures.length) % figures.length;
      figures.forEach((figure, i) => figure.classList.toggle("is-active", i === active));
      selectAll("button", dots || document.createElement("div")).forEach((dot, i) =>
        dot.classList.toggle("is-active", i === active),
      );
    }

    if (framed) {
      if (dots) {
        figures.forEach((_, index) => {
          const dot = createElement("button", index === 0 ? "is-active" : "");
          dot.type = "button";
          dot.setAttribute("aria-label", `Show photo ${index + 1}`);
          dot.addEventListener("click", () => {
            go(index);
            restart();
          });
          dots.append(dot);
        });
      }

      let startX = 0;
      mount.addEventListener("pointerdown", (event) => (startX = event.clientX));
      mount.addEventListener("pointerup", (event) => {
        const distance = startX - event.clientX;
        if (Math.abs(distance) > 40) {
          go(active + (distance > 0 ? 1 : -1));
          restart();
        } else {
          open(active);
        }
      });

      const restart = () => {
        window.clearInterval(timer);
        if (!reduceMotion()) timer = window.setInterval(() => go(active + 1), 5200);
      };
      restart();
    } else {
      figures.forEach((figure, index) => {
        figure.classList.add("rv");
        figure.style.setProperty("--i", index);
        figure.addEventListener("click", () => open(index));
      });
    }
  }

  /* ---------- date: mini calendar + add-to-calendar ---------- */
  function dateParts() {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(
      config.wedding.displayIsoDate || config.wedding.isoDate || "",
    );
    return match ? { year: +match[1], month: +match[2], day: +match[3] } : null;
  }

  function renderCalendar() {
    const mount = select("#miniCal");
    const parts = dateParts();

    if (!mount || !parts) {
      mount?.remove();
      return;
    }

    const first = new Date(Date.UTC(parts.year, parts.month - 1, 1));
    const total = new Date(Date.UTC(parts.year, parts.month, 0)).getUTCDate();
    const monthName = first.toLocaleString("en-US", { month: "long", timeZone: "UTC" });

    const offset = first.getUTCDay();
    const when = config.wedding || {};
    const weekday =
      when.displayDay ||
      when.day ||
      new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).toLocaleString("en-US", {
        weekday: "long",
        timeZone: "UTC",
      });

    /* side stub (used by ticket-style themes) */
    const side = createElement("div", "x-cal__side");
    side.append(
      createElement("span", "x-cal__wd", weekday),
      createElement("b", "x-cal__num", String(parts.day)),
      createElement("span", "x-cal__mo", monthName.slice(0, 3)),
    );

    const main = createElement("div", "x-cal__main");
    const top = createElement("div", "x-cal__top");
    top.append(
      createElement("span", "x-cal__month", monthName),
      createElement("span", "x-cal__year", String(parts.year)),
    );
    main.append(top);

    const grid = createElement("div", "x-cal__grid");
    ["S", "M", "T", "W", "T", "F", "S"].forEach((letter) =>
      grid.append(createElement("span", "dow", letter)),
    );
    for (let i = 0; i < offset; i += 1) grid.append(createElement("span", "pad"));
    for (let day = 1; day <= total; day += 1) {
      const cls = [];
      if ((offset + day - 1) % 7 === 0) cls.push("sun");
      if (day === parts.day) cls.push("is-day");
      grid.append(createElement("span", cls.join(" "), String(day)));
    }
    main.append(grid);

    const foot = createElement("div", "x-cal__foot");
    foot.append(
      createElement("span", "", weekday),
      createElement("i", ""),
      createElement("span", "", when.displayTime || when.time || ""),
    );
    main.append(foot);

    mount.append(side, main);
  }

  function initializeCalendarLinks() {
    const start = new Date(config.wedding.displayIsoDate || config.wedding.isoDate);
    if (Number.isNaN(start.getTime())) return;

    const end = new Date(start.getTime() + 4 * 3600000);
    const stamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const title = `${shortName(config.couple.groom)} & ${shortName(config.couple.bride)} — ${config.site.title.split("—").pop().trim()}`;
    const place = [config.venue.name, config.venue.address].filter(Boolean).join(", ");

    const google = select("#googleCal");
    if (google) {
      google.href =
        "https://calendar.google.com/calendar/render?action=TEMPLATE" +
        `&text=${encodeURIComponent(title)}` +
        `&dates=${stamp(start)}/${stamp(end)}` +
        `&location=${encodeURIComponent(place)}` +
        `&details=${encodeURIComponent(config.site.description)}`;
    }

    const ics = select("#icsCal");
    if (ics) {
      ics.addEventListener("click", () => {
        const body = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "PRODID:-//Invitation//EN",
          "BEGIN:VEVENT",
          `UID:${stamp(start)}@invitation`,
          `DTSTAMP:${stamp(new Date())}`,
          `DTSTART:${stamp(start)}`,
          `DTEND:${stamp(end)}`,
          `SUMMARY:${title.replace(/[,;]/g, " ")}`,
          `LOCATION:${place.replace(/[,;]/g, " ")}`,
          "END:VEVENT",
          "END:VCALENDAR",
        ].join("\r\n");

        const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
        const link = createElement("a");
        link.href = url;
        link.download = "invitation.ics";
        document.body.append(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1500);
      });
    }
  }

  /* ---------- celebration after the scratch card is revealed ----------
     One canvas particle engine, five different shows. The style is picked per
     template (rangrez: poppers, malligai: jasmine, mehr: pearls, barakah: gold
     burst, velvet: fireworks). */
  const CELEBRATION_STYLE = "pearls";

  function celebrate(card) {
    if (reduceMotion()) return;

    const css = getComputedStyle(document.documentElement);
    const color = (name, fallback) => css.getPropertyValue(`--${name}`).trim() || fallback;
    const gold = color("champagne", "#d4b06a");
    const rose = color("mauve", "#b9546a");
    const deep = color("lavender", "#8a1f2f");
    const cream = color("ivory", "#f6ead6");

    const canvas = createElement("canvas", "x-celebrate");
    canvas.setAttribute("aria-hidden", "true");
    document.body.append(canvas);

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rect = card.getBoundingClientRect();
    const cx = Math.min(Math.max(rect.left + rect.width / 2, 24), W - 24);
    const cy = Math.min(Math.max(rect.top + rect.height / 2, 24), H - 24);
    const rnd = (a, b) => a + Math.random() * (b - a);
    const pick = (list) => list[(Math.random() * list.length) | 0];

    const parts = [];
    const rings = [];
    let frame = 0;
    const spawnQueue = []; // [atFrame, fn]

    const add = (p) => parts.push({ life: 0, max: 200, gravity: 0.15, drag: 0.99, rot: 0, spin: 0, size: 6, alpha: 1, kind: "rect", ...p });

    /* shape painters */
    const painters = {
      rect(p) { ctx.scale(1, Math.cos(p.life * 0.18 + p.phase)); ctx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size); },
      circle(p) { ctx.beginPath(); ctx.arc(0, 0, p.size * 0.6, 0, 7); ctx.fill(); },
      petal(p) { ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, 7); ctx.fill(); },
      flower(p) {
        for (let i = 0; i < 5; i += 1) {
          ctx.rotate((Math.PI * 2) / 5);
          ctx.beginPath(); ctx.ellipse(0, -p.size * 0.55, p.size * 0.32, p.size * 0.6, 0, 0, 7); ctx.fill();
        }
        ctx.fillStyle = "#e7c35a"; ctx.beginPath(); ctx.arc(0, 0, p.size * 0.22, 0, 7); ctx.fill();
      },
      leaf(p) { ctx.beginPath(); ctx.ellipse(0, 0, p.size * 0.9, p.size * 0.35, 0, 0, 7); ctx.fill(); },
      sparkle(p) {
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -s); ctx.quadraticCurveTo(0, 0, s, 0); ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s, 0); ctx.quadraticCurveTo(0, 0, 0, -s); ctx.fill();
      },
      star(p) {
        const n = 5; const R = p.size; const r = p.size * 0.45;
        ctx.beginPath();
        for (let i = 0; i < n * 2; i += 1) {
          const a = (Math.PI * i) / n - Math.PI / 2; const rad = i % 2 ? r : R;
          ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
        }
        ctx.closePath(); ctx.fill();
      },
      pearl(p) {
        const g = ctx.createRadialGradient(-p.size * 0.25, -p.size * 0.25, 0, 0, 0, p.size);
        g.addColorStop(0, "#ffffff"); g.addColorStop(0.55, p.color); g.addColorStop(1, "rgba(255,255,255,0.1)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, p.size, 0, 7); ctx.fill();
      },
      spark(p) {
        ctx.strokeStyle = p.color; ctx.lineWidth = 1.6; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-p.vx * 3, -p.vy * 3); ctx.stroke();
      },
    };

    /* ---------- the five shows ---------- */
    const shows = {
      // rangrez: two confetti poppers from the sides + a petal fountain from the card
      poppers() {
        const colors = [rose, gold, deep, cream, "#e0692f"];
        [[0, H * 0.78, -62], [W, H * 0.78, -118]].forEach(([x, y, deg]) => {
          for (let i = 0; i < 62; i += 1) {
            const a = ((deg + rnd(-18, 18)) * Math.PI) / 180; const s = rnd(9, 19);
            add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, kind: pick(["rect", "rect", "petal", "circle"]), color: pick(colors), size: rnd(3.5, 6.5), spin: rnd(-0.3, 0.3), phase: rnd(0, 6), gravity: 0.24, drag: 0.985, max: 230 });
          }
        });
        for (let i = 0; i < 46; i += 1) {
          const a = -Math.PI / 2 + rnd(-0.6, 0.6); const s = rnd(5, 11);
          add({ x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s, kind: "petal", color: pick([rose, deep, gold]), size: rnd(5, 9), spin: rnd(-0.2, 0.2), gravity: 0.17, max: 200 });
        }
      },

      // malligai: a slow shower of jasmine flowers and leaves
      jasmine() {
        for (let i = 0; i < 70; i += 1) {
          spawnQueue.push([Math.floor(rnd(0, 140)), () => add({
            x: rnd(-10, W + 10), y: rnd(-40, -8), vx: rnd(-0.4, 0.4), vy: rnd(1.1, 2.3),
            kind: Math.random() > 0.22 ? "flower" : "leaf", color: Math.random() > 0.22 ? pick(["#fffdf3", "#fff6dc", "#ffffff"]) : "#6f8450",
            size: rnd(6, 11), spin: rnd(-0.04, 0.04), gravity: 0.004, drag: 1, sway: rnd(0.4, 1.2), phase: rnd(0, 6), max: 420,
          })]);
        }
        for (let i = 0; i < 26; i += 1) {
          const a = rnd(0, Math.PI * 2); const s = rnd(2, 6);
          add({ x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, kind: "flower", color: "#fffdf3", size: rnd(5, 8), spin: rnd(-0.1, 0.1), gravity: 0.03, drag: 0.955, sway: 0.6, phase: rnd(0, 6), max: 300 });
        }
        rings.push({ x: cx, y: cy, r: 10, grow: 6, color: gold, life: 0, max: 46 });
      },

      // mehr: pearls and sparkles rising like champagne bubbles + a soft glow
      pearls() {
        const tints = ["#fff6f2", "#f6d9d4", "#f1e4d3", "#ffffff"];
        for (let i = 0; i < 80; i += 1) {
          spawnQueue.push([Math.floor(rnd(0, 70)), () => add({
            x: cx + rnd(-W * 0.4, W * 0.4), y: cy + rnd(-30, rect.height * 0.5),
            vx: rnd(-0.3, 0.3), vy: rnd(-2.0, -0.5), kind: Math.random() > 0.45 ? "pearl" : "sparkle",
            color: pick(tints), size: rnd(3, 8), spin: rnd(-0.03, 0.03), gravity: -0.002, drag: 1, twinkle: rnd(0.08, 0.2), phase: rnd(0, 6), max: rnd(180, 320),
          })]);
        }
        rings.push({ x: cx, y: cy, r: 20, grow: 3, color: gold, life: 0, max: 70, glow: true });
      },

      // barakah: a golden star burst with a ring of light
      goldburst() {
        const colors = [gold, "#f3d98c", "#ffe9b0", cream, rose];
        for (let i = 0; i < 100; i += 1) {
          const a = rnd(0, Math.PI * 2); const s = rnd(2.5, 10);
          add({ x: cx, y: cy, vx: Math.cos(a) * s, vy: Math.sin(a) * s, kind: pick(["star", "star", "sparkle", "circle"]), color: pick(colors), size: rnd(3, 8), spin: rnd(-0.12, 0.12), gravity: 0.07, drag: 0.968, twinkle: rnd(0.1, 0.3), phase: rnd(0, 6), max: rnd(130, 230) });
        }
        rings.push({ x: cx, y: cy, r: 8, grow: 7, color: gold, life: 0, max: 50 });
        rings.push({ x: cx, y: cy, r: 8, grow: 4.5, color: "#ffe9b0", life: -10, max: 56 });
      },

      // velvet: a run of fireworks above the card, then embers
      fireworks() {
        const colors = [gold, "#ffe3a0", rose, cream, "#ff8a5c"];
        const bursts = 5;
        for (let b = 0; b < bursts; b += 1) {
          spawnQueue.push([b * 22, () => {
            const bx = Math.min(Math.max(cx + rnd(-W * 0.3, W * 0.3), 40), W - 40);
            const by = Math.max(80, cy - rnd(H * 0.12, H * 0.34));
            const tint = pick(colors);
            for (let i = 0; i < 58; i += 1) {
              const a = (Math.PI * 2 * i) / 58 + rnd(-0.05, 0.05); const s = rnd(2.2, 6.2);
              add({ x: bx, y: by, vx: Math.cos(a) * s, vy: Math.sin(a) * s, kind: "spark", color: Math.random() > 0.2 ? tint : pick(colors), size: 2, gravity: 0.045, drag: 0.982, max: rnd(70, 110), glow: true });
            }
            rings.push({ x: bx, y: by, r: 4, grow: 3.2, color: tint, life: 0, max: 20 });
          }]);
        }
        for (let i = 0; i < 40; i += 1) {
          spawnQueue.push([Math.floor(rnd(20, 110)), () => add({
            x: cx + rnd(-W * 0.35, W * 0.35), y: H + 10, vx: rnd(-0.4, 0.4), vy: rnd(-3, -1.2),
            kind: "circle", color: pick([gold, "#ffd27a", rose]), size: rnd(2, 4), gravity: -0.01, drag: 0.995, twinkle: 0.2, phase: rnd(0, 6), max: 240,
          })]);
        }
      },
    };

    (shows[{ poppers: "poppers", jasmine: "jasmine", pearls: "pearls", goldburst: "goldburst", fireworks: "fireworks" }[CELEBRATION_STYLE] || "goldburst"])();

    /* ---------- loop ---------- */
    function tick() {
      ctx.clearRect(0, 0, W, H);

      for (let i = spawnQueue.length - 1; i >= 0; i -= 1) {
        if (spawnQueue[i][0] <= frame) { spawnQueue[i][1](); spawnQueue.splice(i, 1); }
      }

      let alive = spawnQueue.length > 0;

      rings.forEach((ring) => {
        ring.life += 1;
        if (ring.life < 0 || ring.life > ring.max) return;
        alive = true;
        ring.r += ring.grow;
        const t = 1 - ring.life / ring.max;
        ctx.save();
        ctx.globalAlpha = Math.max(0, t) * 0.8;
        if (ring.glow) {
          const g = ctx.createRadialGradient(ring.x, ring.y, 0, ring.x, ring.y, ring.r * 3);
          g.addColorStop(0, ring.color); g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.globalAlpha = Math.max(0, t) * 0.35; ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(ring.x, ring.y, ring.r * 3, 0, 7); ctx.fill();
        } else {
          ctx.strokeStyle = ring.color; ctx.lineWidth = 2.2 * t + 0.5;
          ctx.beginPath(); ctx.arc(ring.x, ring.y, ring.r, 0, 7); ctx.stroke();
        }
        ctx.restore();
      });

      parts.forEach((p) => {
        p.life += 1;
        if (p.life > p.max) return;
        alive = true;

        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        if (p.sway) p.x += Math.sin(p.life * 0.04 + p.phase) * p.sway;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.spin;
        if (p.y > H + 60 && p.vy > 0) { p.life = p.max + 1; return; }

        let a = Math.min(1, (p.max - p.life) / (p.max * 0.35));
        if (p.twinkle) a *= 0.55 + 0.45 * Math.sin(p.life * p.twinkle + p.phase);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, a);
        ctx.fillStyle = p.color;
        if (p.glow) { ctx.shadowColor = p.color; ctx.shadowBlur = 8; }
        painters[p.kind](p);
        ctx.restore();
      });

      frame += 1;
      if (alive && frame < 600) window.requestAnimationFrame(tick);
      else canvas.remove();
    }

    window.requestAnimationFrame(tick);
  }

  function initializeDateSection() {
    const section = select("#date");
    const card = select("#scratchCard");
    if (!section || !card) return;

    let celebrated = false;

    const sync = () => {
      if (!card.classList.contains("is-revealed")) return;

      section.classList.add("is-open");

      if (!celebrated) {
        celebrated = true;
        celebrate(card);
      }
    };

    new MutationObserver(sync).observe(card, { attributes: true, attributeFilter: ["class"] });
    sync();
  }

  /* ---------- countdown ---------- */
  function initializeCountdown() {
    const target = new Date(config.countdownIsoDate || config.wedding.isoDate).getTime();
    if (Number.isNaN(target) || !select("#countdownDays")) return;

    const tiles = select("#countdown");

    function tick() {
      const difference = Math.max(0, target - Date.now());
      const values = {
        countdownDays: Math.floor(difference / 86400000),
        countdownHours: Math.floor((difference / 3600000) % 24),
        countdownMinutes: Math.floor((difference / 60000) % 60),
        countdownSeconds: Math.floor((difference / 1000) % 60),
      };

      Object.entries(values).forEach(([id, value]) => {
        select(`#${id}`).textContent = pad(value);
      });

      const fractions = [Math.min(values.countdownDays, 100) / 100, values.countdownHours / 24, values.countdownMinutes / 60, values.countdownSeconds / 60];
      selectAll("#countdown-tiles > div").forEach((tile, i) => tile.style.setProperty("--v", fractions[i].toFixed(3)));

      tiles?.classList.toggle("is-done", difference === 0);
    }

    tick();
    window.setInterval(tick, 1000);
  }

  /* ---------- venue ---------- */
  function initializeVenueActions() {
    const button = select("#copyAddress");
    if (!button) return;

    const label = button.textContent;

    button.addEventListener("click", async () => {
      const text = [config.venue.name, config.venue.address].filter(Boolean).join(", ");

      try {
        await navigator.clipboard.writeText(text);
        button.textContent = "Address copied";
      } catch {
        button.textContent = text;
      }

      window.setTimeout(() => (button.textContent = label), 2200);
    });
  }

  /* ---------- blessings, dua, RSVP note ---------- */
  function renderDua() {
    const dua = select("#dua");
    if (!dua) return;

    if (!config.copy.dua) {
      dua.hidden = true;
      return;
    }

    select("[data-dua]", dua).textContent = config.copy.dua;
    select("[data-dua-en]", dua).textContent = config.copy.duaTranslation || "";
  }

  function renderRsvpNote() {
    const mount = select("#rsvpNote");
    if (!mount) return;

    const { deadline, contact, message } = config.rsvp || {};
    if (!deadline && !contact && !message) {
      mount.remove();
      return;
    }

    if (message) mount.append(createElement("p", "", message));

    if (deadline) mount.append(createElement("p", "", deadline));
    if (contact) mount.append(createElement("p", "", contact));

    const phone = /\+?\d[\d\s().-]{8,}\d/.exec(contact || "");
    if (phone) {
      const digits = phone[0].replace(/[^\d+]/g, "");
      const actions = createElement("div", "x-actions");
      const call = createElement("a", "x-btn", "Call");
      const chat = createElement("a", "x-btn x-btn--ghost", "WhatsApp");

      call.href = `tel:${digits}`;
      chat.href = `https://wa.me/${digits.replace(/\D/g, "")}`;
      chat.target = "_blank";
      chat.rel = "noreferrer";
      actions.append(call, chat);
      mount.append(actions);
    }
  }

  /* ---------- scroll reveal ---------- */
  function initializeReveal() {
    const items = selectAll(".rv");

    if (reduceMotion() || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -6% 0px" },
    );

    items.forEach((item) => observer.observe(item));
  }

  function initialize() {
    document.documentElement.classList.remove("no-js");

    if (typeof initializeViewportHeight === "function") initializeViewportHeight();
    if (typeof resetInitialScrollPosition === "function") resetInitialScrollPosition();

    applyConfig();
    initializeOpening();
    initializeMusic();
    initializeScratchCard();
    initializeDateSection();
    initializeCalendarLinks();
    initializeCountdown();
    initializeTimeline();
    initializeVenueActions();
    initializeReveal();

  }

  // Shared celebration effects for other modules (e.g. the RSVP success state).
  window.__invitationFx = { createPetalShower, celebrate };

  document.addEventListener("DOMContentLoaded", initialize);
})();
