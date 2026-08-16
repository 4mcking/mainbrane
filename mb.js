document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Keep the hero's viewport math honest if the masthead ever changes height
  const masthead = document.getElementById("masthead");
  if (masthead) {
    const syncHeight = () => {
      document.documentElement.style.setProperty(
        "--masthead-h",
        `${masthead.offsetHeight}px`,
      );
    };
    syncHeight();
    window.addEventListener("resize", syncHeight);
  }

  // Mobile navigation
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("primaryNav");

  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };

    toggle.addEventListener("click", () => {
      setOpen(!nav.classList.contains("is-open"));
    });

    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // Scroll reveals
  const revealables = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-in"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    revealables.forEach((el) => observer.observe(el));
  }

  // Typewriter — carried over from v1, with its rough edges filed off: it types
  // once instead of looping five times, fires when the line actually scrolls into
  // view rather than on load, reads its text from the DOM so the copy lives in one
  // place, and reserves the measured height so nothing shifts while it types.
  const typeTargets = document.querySelectorAll("[data-typewriter]");

  if (typeTargets.length) {
    // Capture the authored content as ordered segments. Retyping a line as plain
    // text would discard any inline wrapper inside it — the gloss carries a span
    // that drives its mobile line break — so wrappers are rebuilt as we go.
    const capture = (el) =>
      Array.from(el.childNodes).reduce((segs, node) => {
        const text = node.textContent.replace(/\s+/g, " ").trim();
        if (!text) return segs;
        segs.push({
          tag:
            node.nodeType === Node.ELEMENT_NODE
              ? node.tagName.toLowerCase()
              : null,
          cls:
            node.nodeType === Node.ELEMENT_NODE
              ? node.getAttribute("class") || ""
              : "",
          text,
        });
        return segs;
      }, []);

    const plans = new Map();
    typeTargets.forEach((el) => plans.set(el, capture(el)));

    // Reduced motion (or no observer support) leaves the copy exactly as authored.
    if (!reduceMotion && "IntersectionObserver" in window) {
      const type = (el, segs, speed) => {
        el.classList.add("is-typing");
        let s = 0;
        let i = 0;
        let target = null;

        const openSegment = () => {
          const seg = segs[s];
          if (seg.tag) {
            target = document.createElement(seg.tag);
            if (seg.cls) target.setAttribute("class", seg.cls);
          } else {
            target = document.createTextNode("");
          }
          el.appendChild(target);
        };

        const tick = () => {
          const seg = segs[s];
          target.textContent = seg.text.slice(0, ++i);

          if (i < seg.text.length) return setTimeout(tick, speed);

          s += 1;
          i = 0;
          if (s < segs.length) {
            openSegment();
            return setTimeout(tick, speed);
          }
          el.classList.remove("is-typing");
          el.style.minHeight = "";
        };

        openSegment();
        tick();
      };

      const typeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const segs = plans.get(el);
            if (!segs || !segs.length) return;
            typeObserver.unobserve(el);
            el.style.minHeight = `${el.offsetHeight}px`; // measure before emptying
            el.textContent = "";
            type(el, segs, 42);
          });
        },
        { threshold: 0.6 },
      );

      typeTargets.forEach((el) => typeObserver.observe(el));
    }
  }

  // Jump to either end of the page. Each button disables itself at its own
  // extreme so the control never lies about what it will do.
  const jump = document.getElementById("scrollJump");

  if (jump) {
    const up = jump.querySelector('[data-jump="top"]');
    const down = jump.querySelector('[data-jump="bottom"]');
    const behavior = reduceMotion ? "auto" : "smooth";

    up.addEventListener("click", () => window.scrollTo({ top: 0, behavior }));
    down.addEventListener("click", () =>
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior }),
    );

    const IDLE_MS = 1000;
    let hideTimer = null;
    let pinned = false; // pointer over it, or a button inside has focus

    const armHide = () => {
      clearTimeout(hideTimer);
      if (pinned) return;
      hideTimer = setTimeout(
        () => jump.classList.remove("is-visible"),
        IDLE_MS,
      );
    };

    const syncJump = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      up.disabled = y <= 8;
      down.disabled = y >= max - 8;
      if (max <= 0) return; // nothing to jump to on a short page
      jump.classList.add("is-visible");
      armHide();
    };

    // Don't let it fade out from under the cursor while it's being reached for.
    jump.addEventListener("pointerenter", () => {
      pinned = true;
      clearTimeout(hideTimer);
    });
    jump.addEventListener("pointerleave", () => {
      pinned = false;
      armHide();
    });
    jump.addEventListener("focusin", () => {
      pinned = true;
      clearTimeout(hideTimer);
      jump.classList.add("is-visible");
    });
    jump.addEventListener("focusout", () => {
      pinned = false;
      armHide();
    });

    window.addEventListener("scroll", syncJump, { passive: true });
    window.addEventListener("resize", syncJump);
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
