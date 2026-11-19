/* ==========================================================================
   CYNÉ — site scripts
   No libraries. Project content comes from js/projects-data.js
   ========================================================================== */

(function () {
  "use strict";

  const PROJECTS = window.CYNE_PROJECTS || [];
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const esc = (str = "") =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const pad = (n) => String(n).padStart(2, "0");

  /* ---------- header: transparent over hero, solid after scrolling ---------- */
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // mobile menu
    const toggle = $(".menu-toggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const open = document.body.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      $$(".nav a").forEach((a) =>
        a.addEventListener("click", () => {
          document.body.classList.remove("menu-open");
          toggle.setAttribute("aria-expanded", "false");
        })
      );
    }
  }

  /* ---------- fade sections in as they scroll into view ---------- */
  let revealObserver;
  function observeReveals(root = document) {
    const items = $$(".reveal:not(.in)", root);
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              revealObserver.unobserve(e.target);
            }
          }),
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
    }
    items.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- project card ---------- */
  function cardHTML(p) {
    return `
      <a class="card reveal" href="project.html?p=${encodeURIComponent(p.slug)}" data-discipline="${esc(p.discipline)}">
        <div class="card-media">
          <img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy">
          <span class="view">view</span>
        </div>
        <div class="card-meta">
          <h3 class="card-title">${esc(p.title)}</h3>
          <span class="card-sub">${esc(p.discipline)}${p.year ? " · " + esc(p.year) : ""}</span>
        </div>
      </a>`;
  }

  /* ---------- home: hero slideshow + featured projects ---------- */
  function initHome() {
    const hero = $("#hero");
    if (!hero) return;

    const featured = PROJECTS.filter((p) => p.featured);
    const pool = featured.length ? featured : PROJECTS;

    const grid = $("#featured-projects");
    if (grid) {
      grid.innerHTML = pool.slice(0, 3).map(cardHTML).join("");
      observeReveals(grid);
    }

    // slideshow: the renders of the featured projects, taking turns per project
    const lists = pool.map((p) => (p.renders && p.renders.length ? p.renders : [{ src: p.cover }]).map((r) => ({ ...p, cover: r.src })));
    const slides = [];
    for (let k = 0; slides.length < 8 && lists.some((l) => l[k]); k++) lists.forEach((l) => l[k] && slides.length < 8 && slides.push(l[k]));

    if (!slides.length) return;

    const slideTime = 6000;
    hero.style.setProperty("--slide-time", slideTime / 1000 + "s");
    const stage = $(".hero-slides", hero);
    if (!stage) return; // home page without slideshow
    stage.innerHTML = slides
      .map(
        (p, i) =>
          `<div class="hero-slide${i === 0 ? " active" : ""}"><img src="${esc(p.cover)}" alt="${esc(p.title)}"${i ? ' loading="lazy"' : ""}></div>`
      )
      .join("");

    const caption = $(".hero-caption", hero);
    const current = $(".hero-current", hero);
    const total = $(".hero-total", hero);
    const bar = $(".hero-counter .bar i", hero);
    const els = $$(".hero-slide", hero);
    if (total) total.textContent = pad(slides.length);

    let index = 0;
    const show = (i) => {
      els[index].classList.remove("active");
      index = (i + slides.length) % slides.length;
      els[index].classList.add("active");
      const p = slides[index];
      if (caption) {
        caption.style.opacity = 0;
        setTimeout(() => {
          caption.innerHTML = `<a href="project.html?p=${encodeURIComponent(p.slug)}">${esc(p.title)}</a> &nbsp;— &nbsp;${esc(p.discipline)}`;
          caption.style.opacity = "";
        }, 350);
      }
      if (current) current.textContent = pad(index + 1);
      if (bar) {
        bar.classList.remove("run");
        void bar.offsetWidth; // restart the animation
        bar.classList.add("run");
      }
    };

    // first caption without fade
    index = 0;
    if (caption)
      caption.innerHTML = `<a href="project.html?p=${encodeURIComponent(slides[0].slug)}">${esc(slides[0].title)}</a> &nbsp;— &nbsp;${esc(slides[0].discipline)}`;
    if (current) current.textContent = pad(1);
    if (bar) bar.classList.add("run");

    if (slides.length > 1) {
      let timer = setInterval(() => show(index + 1), slideTime);
      document.addEventListener("visibilitychange", () => {
        clearInterval(timer);
        if (!document.hidden) timer = setInterval(() => show(index + 1), slideTime);
      });
    }
  }

  /* ---------- projects overview with discipline filter ---------- */
  function initProjects() {
    const grid = $("#project-grid");
    if (!grid) return;

    grid.innerHTML = PROJECTS.map(cardHTML).join("");
    observeReveals(grid);

    const filterBar = $("#filters");
    if (!filterBar) return;
    const disciplines = [...new Set(PROJECTS.map((p) => p.discipline))];
    filterBar.innerHTML =
      `<button type="button" data-filter="all" aria-pressed="true">all</button>` +
      disciplines.map((d) => `<button type="button" data-filter="${esc(d)}" aria-pressed="false">${esc(d)}</button>`).join("");

    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const f = btn.dataset.filter;
      $$("button", filterBar).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      $$(".card", grid).forEach((card) => {
        const show = f === "all" || card.dataset.discipline === f;
        card.classList.toggle("is-hidden", !show);
        if (show) card.classList.add("in");
      });
    });
  }

  /* ---------- single project page ---------- */
  function initProject() {
    const root = $("#project");
    if (!root) return;

    const slug = new URLSearchParams(location.search).get("p");
    const i = PROJECTS.findIndex((p) => p.slug === slug);
    const p = PROJECTS[i >= 0 ? i : 0];
    if (!p) {
      root.innerHTML = `<div class="container page-intro"><h1 class="display">No projects yet.</h1></div>`;
      return;
    }
    const next = PROJECTS[((i >= 0 ? i : 0) + 1) % PROJECTS.length];
    document.title = `${p.title} — CYNÉ`;

    const sections = [
      {
        id: "moodboard",
        title: "Moodboard",
        text: "Materials and colours, to give a first feel for the atmosphere of the space.",
        items: p.moodboard || [],
        cls: ""
      },
      {
        id: "plans",
        title: "Plans",
        text: "How the spaces connect and flow into one another.",
        items: p.plans || [],
        cls: "plans"
      },
      {
        id: "renders",
        title: "3D renders",
        text: "How the design comes together: light, material and proportion.",
        items: p.renders || [],
        cls: "renders"
      }
    ].filter((s) => s.items.length);

    // one flat list for the lightbox, in page order
    const all = [];
    const galleryHTML = (s, n) => {
      const shots = s.items
        .map((img) => {
          const idx = all.push({ ...img, group: s.title }) - 1;
          return `
            <figure class="shot reveal" data-index="${idx}">
              <div class="frame"><img src="${esc(img.src)}" alt="${esc(img.caption || s.title)}" loading="lazy"></div>
              ${img.caption ? `<figcaption>${esc(img.caption)}</figcaption>` : ""}
            </figure>`;
        })
        .join("");
      return `
        <section class="gallery-section" id="${s.id}">
          <div class="container">
            <div class="gallery-head reveal">
              <h2><span>${pad(n + 1)}</span>${esc(s.title)}</h2>
              <p>${esc(s.text)}</p>
            </div>
            <div class="gallery ${s.cls}${s.items.length === 1 ? " single" : ""}">${shots}</div>
          </div>
        </section>`;
    };

    root.innerHTML = `
      <header class="project-hero">
        <div class="project-hero-media"><img src="${esc(p.cover)}" alt="${esc(p.title)}"></div>
        <div class="container">
          <p class="eyebrow">${esc(p.discipline)}</p>
          <h1 class="display">${esc(p.title)}</h1>
        </div>
      </header>

      <section class="section" style="padding-top:clamp(3rem,6vw,5rem)">
        <div class="container project-info">
          <dl class="facts reveal">
            <div><dt>Discipline</dt><dd>${esc(p.discipline)}</dd></div>
            ${p.location ? `<div><dt>Location</dt><dd>${esc(p.location)}</dd></div>` : ""}
            ${p.year ? `<div><dt>Year</dt><dd>${esc(p.year)}</dd></div>` : ""}
          </dl>
          <p class="lead reveal">${esc(p.intro || "")}</p>
        </div>
      </section>

      ${sections.length < 2 ? "" : `<nav class="subnav" aria-label="Project sections">
        <div class="container">
          <ul>
            ${sections.map((s) => `<li><a href="#${s.id}">${esc(s.title)}<sup>${s.items.length}</sup></a></li>`).join("")}
          </ul>
        </div>
      </nav>`}

      ${sections.map(galleryHTML).join("")}

      ${
        next && next !== p
          ? `<a class="next-project" href="project.html?p=${encodeURIComponent(next.slug)}">
               <p class="eyebrow">next project</p>
               <p class="display">${esc(next.title)}</p>
             </a>`
          : `<div style="height:6rem"></div>`
      }`;

    observeReveals(root);
    initLightbox(all);
    initSubnav(sections.map((s) => s.id));
  }

  /* highlight the current section in the project sub-menu */
  function initSubnav(ids) {
    const links = ids.map((id) => $(`.subnav a[href="#${id}"]`));
    const targets = ids.map((id) => document.getElementById(id));
    const update = () => {
      let active = 0;
      targets.forEach((t, i) => {
        if (t && t.getBoundingClientRect().top < window.innerHeight * 0.4) active = i;
      });
      links.forEach((l, i) => l && l.classList.toggle("active", i === active && window.scrollY > 200));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------- lightbox ---------- */
  function initLightbox(images) {
    if (!images.length) return;

    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Image viewer");
    lb.innerHTML = `
      <div class="lb-top"><span class="lb-group"></span><button class="lb-close" type="button">close ✕</button></div>
      <div class="lb-stage">
        <button class="lb-btn lb-prev" type="button" aria-label="Previous image">←</button>
        <img alt="">
        <button class="lb-btn lb-next" type="button" aria-label="Next image">→</button>
      </div>
      <div class="lb-bottom"><span class="lb-caption"></span><span class="lb-count"></span></div>`;
    document.body.appendChild(lb);

    const img = $("img", lb);
    let idx = 0;
    let lastFocus = null;

    const render = () => {
      const it = images[idx];
      img.style.opacity = 0;
      const pre = new Image();
      pre.onload = pre.onerror = () => {
        img.src = it.src;
        img.alt = it.caption || it.group;
        img.style.opacity = 1;
      };
      pre.src = it.src;
      $(".lb-group", lb).textContent = it.group;
      $(".lb-caption", lb).textContent = it.caption || "";
      $(".lb-count", lb).textContent = `${pad(idx + 1)} / ${pad(images.length)}`;
    };
    const open = (i) => {
      idx = i;
      lastFocus = document.activeElement;
      render();
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
      $(".lb-close", lb).focus();
    };
    const close = () => {
      lb.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };
    const go = (d) => {
      idx = (idx + d + images.length) % images.length;
      render();
    };

    document.addEventListener("click", (e) => {
      const shot = e.target.closest(".shot");
      if (shot) open(Number(shot.dataset.index));
    });
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-prev", lb).addEventListener("click", () => go(-1));
    $(".lb-next", lb).addEventListener("click", () => go(1));
    $(".lb-stage", lb).addEventListener("click", (e) => {
      if (e.target === e.currentTarget) close();
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });

    // swipe on touch screens
    let x0 = null;
    lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    lb.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      x0 = null;
    });
  }

  /* ---------- contact form ----------
     There is no server yet, so the form opens the visitor's e-mail app
     with everything filled in. To receive messages directly instead,
     use a service such as Formspree: set the form's action to your
     Formspree URL, method="POST", and delete this function. */
  function initContactForm() {
    const form = $("#contact-form");
    if (!form) return;
    const note = $(".form-note", form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const to = form.dataset.email;
      const subject = `Project enquiry — ${d.get("type") || "general"} — ${d.get("name")}`;
      const body = [
        `Name: ${d.get("name")}`,
        `E-mail: ${d.get("email")}`,
        d.get("type") ? `Project type: ${d.get("type")}` : "",
        "",
        d.get("message")
      ]
        .filter((l) => l !== null)
        .join("\n");
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (note) note.textContent = "Your e-mail app should open now with your message ready to send.";
    });
  }

  /* ---------- footer year ---------- */
  function initYear() {
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initHome();
    initProjects();
    initProject();
    initContactForm();
    initYear();
    observeReveals();
  });
})();
