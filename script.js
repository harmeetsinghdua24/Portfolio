/* ===================================================================
   HARMEET SINGH DUA — PORTFOLIO
   script.js — interactions, animations, particle field, RAG graph
   =================================================================== */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     1. LOADER
  --------------------------------------------------------------- */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    const finish = () => loader.classList.add('loaded');
    // Minimum show time for the loader sequence to feel intentional, not jarring.
    const minDelay = prefersReducedMotion ? 200 : 1400;
    window.addEventListener('load', () => setTimeout(finish, minDelay));
    // Safety net in case 'load' fires very late
    setTimeout(finish, 4000);
  }

  /* ---------------------------------------------------------------
     2. CUSTOM CURSOR
  --------------------------------------------------------------- */
  function initCursor() {
    if (window.matchMedia('(hover: none)').matches) return;
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function loop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    const interactiveSelectors = 'a, button, input, textarea, .project-card, .skill-chip, .cert-card, .achieve-card';
    document.querySelectorAll(interactiveSelectors).forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  }

  /* ---------------------------------------------------------------
     3. NAVIGATION — scroll state, mobile toggle, active link
  --------------------------------------------------------------- */
  function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const mobile = document.getElementById('navMobile');

    function onScroll() {
      if (window.scrollY > 24) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (toggle && mobile) {
      toggle.addEventListener('click', () => {
        const isOpen = mobile.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
      mobile.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          mobile.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ---------------------------------------------------------------
     4. SCROLL PROGRESS BAR
  --------------------------------------------------------------- */
  function initScrollProgress() {
    const bar = document.getElementById('scrollProgressBar');
    if (!bar) return;
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---------------------------------------------------------------
     5. BACK TO TOP
  --------------------------------------------------------------- */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    function onScroll() {
      if (window.scrollY > 600) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------------------------------------------------------
     6. TYPED ROLE LINE (Typed.js)
  --------------------------------------------------------------- */
  function initTyped() {
    const el = document.getElementById('typed-role');
    if (!el) return;

    const roles = [
      'AI/ML Engineer',
      'Python Developer',
      'RAG Systems Builder',
      'Prompt Engineer',
      'Multi-Agent AI Developer',
    ];

    if (prefersReducedMotion || typeof Typed === 'undefined') {
      el.textContent = roles[0];
      return;
    }

    new Typed('#typed-role', {
      strings: roles,
      typeSpeed: 42,
      backSpeed: 26,
      backDelay: 1600,
      startDelay: 400,
      loop: true,
      showCursor: false,
    });
  }

  /* ---------------------------------------------------------------
     7. ANIMATED STAT COUNTERS
  --------------------------------------------------------------- */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-num[data-count]');
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      if (prefersReducedMotion) {
        el.textContent = target + suffix;
        return;
      }
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach((c) => observer.observe(c));
  }

  /* ---------------------------------------------------------------
     8. ANIMATED SKILL BARS
  --------------------------------------------------------------- */
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar[data-level]');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target.querySelector('.skill-bar-fill');
          const level = entry.target.getAttribute('data-level');
          if (fill) {
            requestAnimationFrame(() => { fill.style.width = level + '%'; });
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    bars.forEach((b) => observer.observe(b));
  }

  /* ---------------------------------------------------------------
     9. HERO RAG GRAPH — signature SVG animation
     A query node lights up paths to "retrieved" document nodes —
     a literal depiction of the candidate's actual specialty (RAG).
  --------------------------------------------------------------- */
  function initRagGraph() {
    const svg = document.getElementById('ragGraph');
    if (!svg) return;

    const W = 420, H = 420;
    const cx = W / 2, cy = H / 2;

    // Query node at center; document/result nodes ringed around it.
    const nodeCount = 7;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
      const radius = 150 + (i % 2 === 0 ? 0 : 18);
      nodes.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        hit: i % 2 === 0, // alternate "retrieved" vs "candidate" nodes
      });
    }

    const ns = 'http://www.w3.org/2000/svg';
    const frag = document.createDocumentFragment();

    // Edges first (so nodes render above them)
    nodes.forEach((n, i) => {
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', n.x.toFixed(1));
      line.setAttribute('y2', n.y.toFixed(1));
      line.setAttribute('class', n.hit ? 'rag-edge rag-edge--active' : 'rag-edge');
      if (n.hit && !prefersReducedMotion) {
        line.style.animationDelay = `${i * 0.3}s`;
      }
      frag.appendChild(line);
    });

    // Query (center) node
    const center = document.createElementNS(ns, 'circle');
    center.setAttribute('cx', cx);
    center.setAttribute('cy', cy);
    center.setAttribute('r', 7);
    center.setAttribute('class', 'rag-node rag-node--query');
    frag.appendChild(center);

    // Outer nodes
    nodes.forEach((n) => {
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', n.x.toFixed(1));
      c.setAttribute('cy', n.y.toFixed(1));
      c.setAttribute('r', n.hit ? 5.5 : 4);
      c.setAttribute('class', n.hit ? 'rag-node rag-node--hit' : 'rag-node');
      frag.appendChild(c);
    });

    svg.appendChild(frag);

    if (!prefersReducedMotion) {
      svg.style.animation = 'spin 90s linear infinite';
      const styleTag = document.createElement('style');
      styleTag.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
      document.head.appendChild(styleTag);
    }
  }

  /* ---------------------------------------------------------------
     10. PARTICLE BACKGROUND (Three.js) — ambient, dim, slow drift
  --------------------------------------------------------------- */
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas || prefersReducedMotion || typeof THREE === 'undefined') return;

    let renderer, scene, camera, points;
    let width = window.innerWidth, height = window.innerHeight;
    const PARTICLE_COUNT = width < 768 ? 110 : 220;

    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
      camera.position.z = 480;

      const positions = new Float32Array(PARTICLE_COUNT * 3);
      const speeds = new Float32Array(PARTICLE_COUNT);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 1400;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 900;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 700;
        speeds[i] = 0.04 + Math.random() * 0.08;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color: 0x5b8cff,
        size: 2.2,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);

      let mouseX = 0, mouseY = 0;
      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / width - 0.5) * 2;
        mouseY = (e.clientY / height - 0.5) * 2;
      });

      function animate() {
        const pos = geometry.attributes.position.array;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          pos[i * 3 + 1] += speeds[i] * 0.4;
          if (pos[i * 3 + 1] > 450) pos[i * 3 + 1] = -450;
        }
        geometry.attributes.position.needsUpdate = true;

        camera.position.x += (mouseX * 40 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 40 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();

      window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      });
    } catch (err) {
      // WebGL unsupported or blocked — silently degrade; grid/gradient backdrop remains.
      console.warn('Particle background disabled:', err);
    }
  }

  /* ---------------------------------------------------------------
     11. AOS (scroll reveal) + GSAP ScrollTrigger niceties
  --------------------------------------------------------------- */
  function initScrollReveal() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
        disable: prefersReducedMotion,
      });
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      gsap.registerPlugin(ScrollTrigger);

      // Subtle parallax drift on hero visual
      gsap.to('.hero-visual', {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Section title micro-emphasis on enter
      document.querySelectorAll('.section-title').forEach((title) => {
        gsap.fromTo(title, { letterSpacing: '0em' }, {
          letterSpacing: '-0.01em',
          duration: 1,
          scrollTrigger: { trigger: title, start: 'top 85%' },
        });
      });
    }
  }

  /* ---------------------------------------------------------------
     12. CONTACT FORM — client-side validation + graceful feedback
     (No backend wired up: this is a static front-end deliverable.
     Replace the submit handler with a real endpoint / formspree /
     EmailJS call when ready to receive live submissions.)
  --------------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (!form || !status) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim();
      const message = form.message.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !subject || !message) {
        status.textContent = 'Please fill in every field before sending.';
        status.classList.add('is-error');
        return;
      }
      if (!emailPattern.test(email)) {
        status.textContent = 'That email address doesn\u2019t look right — please check it.';
        status.classList.add('is-error');
        return;
      }

      status.classList.remove('is-error');
      const submitBtn = document.getElementById('contactSubmit');
      const label = submitBtn.querySelector('.btn-label');
      const originalLabel = label.textContent;
      label.textContent = 'Sending…';
      submitBtn.disabled = true;

      // Simulated send — wire to a real backend (Formspree/EmailJS/API route) for production.
      setTimeout(() => {
        status.textContent = `Thanks, ${name.split(' ')[0]} — your message is queued. I\u2019ll reply by email shortly.`;
        label.textContent = originalLabel;
        submitBtn.disabled = false;
        form.reset();
      }, 900);
    });
  }

  /* ---------------------------------------------------------------
     13. SMOOTH ANCHOR SCROLL (fallback for older browsers)
  --------------------------------------------------------------- */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  /* ---------------------------------------------------------------
     14. FOOTER YEAR
  --------------------------------------------------------------- */
  function initFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------
     INIT
  --------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initNav();
    initScrollProgress();
    initBackToTop();
    initTyped();
    initCounters();
    initSkillBars();
    initRagGraph();
    initParticles();
    initScrollReveal();
    initContactForm();
    initSmoothAnchors();
    initFooterYear();
  });
})();
