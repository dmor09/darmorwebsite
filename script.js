(() => {
  const pixelIntro = document.querySelector('[data-pixel-intro]');
  if (pixelIntro) {
    let introSeen = false;
    const forceIntro = new URLSearchParams(window.location.search).get('intro') === '1';
    try {
      introSeen = !forceIntro && sessionStorage.getItem('darmor-intro-seen') === 'true';
    } catch (_) {
      introSeen = false;
    }

    if (introSeen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pixelIntro.remove();
    } else {
      const introCanvas = pixelIntro.querySelector('canvas');
      const introContext = introCanvas.getContext('2d');
      const pixelSize = 22;
      const introDuration = 1050;
      let introWidth = 0;
      let introHeight = 0;
      let introCells = [];

      const sizeIntro = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        introWidth = window.innerWidth;
        introHeight = window.innerHeight;
        introCanvas.width = Math.round(introWidth * dpr);
        introCanvas.height = Math.round(introHeight * dpr);
        introContext.setTransform(dpr, 0, 0, dpr, 0, 0);
        const columns = Math.ceil(introWidth / pixelSize);
        const rows = Math.ceil(introHeight / pixelSize);
        const centerX = columns / 2;
        const centerY = rows / 2;
        const maxDistance = Math.hypot(centerX, centerY);
        introCells = [];
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < columns; x++) {
            introCells.push({ x, y, delay: Math.hypot(x - centerX, y - centerY) / maxDistance * .72 + Math.random() * .12, blue: Math.random() > .82 });
          }
        }
      };

      sizeIntro();
      window.addEventListener('resize', sizeIntro, { passive: true, once: true });
      const introStart = performance.now();
      const drawIntro = now => {
        const progress = Math.min((now - introStart) / introDuration, 1);
        introContext.clearRect(0, 0, introWidth, introHeight);
        introCells.forEach(cell => {
          const local = Math.max(0, Math.min(1, (progress - cell.delay) / .28));
          if (!local) return;
          const shimmer = Math.sin(local * Math.PI);
          introContext.fillStyle = cell.blue ? `rgba(20,108,255,${shimmer * .9})` : `rgba(121,232,255,${shimmer * .34})`;
          const inset = (1 - shimmer) * pixelSize * .44;
          introContext.fillRect(cell.x * pixelSize + inset, cell.y * pixelSize + inset, pixelSize - inset * 2 - 1, pixelSize - inset * 2 - 1);
        });
        if (progress < 1) requestAnimationFrame(drawIntro);
      };
      requestAnimationFrame(drawIntro);
      window.setTimeout(() => pixelIntro.classList.add('is-leaving'), 1000);
      window.setTimeout(() => {
        try { sessionStorage.setItem('darmor-intro-seen', 'true'); } catch (_) { /* Session storage can be unavailable. */ }
        pixelIntro.remove();
      }, 1700);
    }
  }

  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu]');
  const menuToggle = document.querySelector('[data-menu-toggle]');

  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 28);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class ParticleNetwork {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.mode = canvas.dataset.particleMode || 'network';
      this.points = [];
      this.pointer = { x: -1000, y: -1000 };
      this.frame = null;
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(canvas);
      this.canvas.parentElement?.addEventListener('pointermove', event => {
        const rect = canvas.getBoundingClientRect();
        this.pointer.x = event.clientX - rect.left;
        this.pointer.y = event.clientY - rect.top;
      }, { passive: true });
      this.canvas.parentElement?.addEventListener('pointerleave', () => {
        this.pointer.x = -1000;
        this.pointer.y = -1000;
      });
      this.resize();
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(rect.width * dpr);
      this.canvas.height = Math.round(rect.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.width = rect.width;
      this.height = rect.height;
      const count = this.mode === 'field'
        ? Math.min(320, Math.max(150, Math.floor(rect.width / 6)))
        : Math.min(72, Math.max(28, Math.floor(rect.width / 22)));
      this.points = Array.from({ length: count }, () => ({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        depth: Math.random() * .75 + .25,
        vx: (Math.random() - .5) * (this.mode === 'field' ? .28 : .18),
        vy: (Math.random() - .5) * (this.mode === 'field' ? .28 : .18),
        r: Math.random() * (this.mode === 'field' ? 1.25 : 1.4) + .4
      }));
      if (!this.frame) this.draw();
    }

    draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);
      this.points.forEach((point, index) => {
        if (!reducedMotion) {
          point.x += point.vx * point.depth;
          point.y += point.vy * point.depth;
          if (point.x < -10) point.x = this.width + 10;
          if (point.x > this.width + 10) point.x = -10;
          if (point.y < -10) point.y = this.height + 10;
          if (point.y > this.height + 10) point.y = -10;
        }

        const pointerDistance = Math.hypot(point.x - this.pointer.x, point.y - this.pointer.y);
        if (pointerDistance < 150 && !reducedMotion) {
          const force = this.mode === 'field' ? .008 * point.depth : .003;
          point.x += (point.x - this.pointer.x) * force;
          point.y += (point.y - this.pointer.y) * force;
        }

        ctx.beginPath();
        const fieldScale = this.mode === 'field' ? .65 + point.depth * 1.35 : 1;
        ctx.arc(point.x, point.y, (pointerDistance < 110 ? point.r * 1.8 : point.r) * fieldScale, 0, Math.PI * 2);
        const baseAlpha = this.mode === 'field' ? .16 + point.depth * .42 : .45;
        ctx.fillStyle = pointerDistance < 110 ? 'rgba(121,232,255,.94)' : `rgba(115,179,255,${baseAlpha})`;
        ctx.fill();

        for (let i = index + 1; this.mode !== 'field' && i < this.points.length; i++) {
          const other = this.points[i];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 125) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(94,171,255,${(1 - distance / 125) * .18})`;
            ctx.lineWidth = .7;
            ctx.stroke();
          }
        }
      });
      this.frame = requestAnimationFrame(() => this.draw());
    }
  }

  document.querySelectorAll('[data-particles]').forEach(canvas => new ParticleNetwork(canvas));

  class DotField {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.theme = canvas.dataset.dotTheme || 'aqua';
      this.pointer = { x: -1000, y: -1000 };
      this.points = [];
      this.frame = null;
      canvas.parentElement?.addEventListener('pointermove', event => {
        const rect = canvas.getBoundingClientRect();
        this.pointer.x = event.clientX - rect.left;
        this.pointer.y = event.clientY - rect.top;
      }, { passive: true });
      canvas.parentElement?.addEventListener('pointerleave', () => {
        this.pointer.x = -1000;
        this.pointer.y = -1000;
      });
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(canvas);
      this.resize();
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = this.width < 700 ? 25 : 29;
      this.points = [];
      for (let y = gap / 2; y < this.height; y += gap) {
        for (let x = gap / 2; x < this.width; x += gap) {
          this.points.push({ baseX: x, baseY: y, x, y });
        }
      }
      if (!this.frame) this.draw(performance.now());
    }

    draw(now) {
      const ctx = this.ctx;
      const ambientX = this.width * (.7 + Math.sin(now * .00022) * .12);
      const ambientY = this.height * (.48 + Math.cos(now * .0003) * .22);
      ctx.clearRect(0, 0, this.width, this.height);

      this.points.forEach(point => {
        const dx = point.baseX - this.pointer.x;
        const dy = point.baseY - this.pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - distance / 155);
        const length = distance || 1;
        const targetX = point.baseX + dx / length * influence * 16;
        const targetY = point.baseY + dy / length * influence * 16;
        const ambient = Math.max(0, 1 - Math.hypot(point.baseX - ambientX, point.baseY - ambientY) / 260);
        point.x += (targetX - point.x) * (reducedMotion ? 1 : .12);
        point.y += (targetY - point.y) * (reducedMotion ? 1 : .12);

        ctx.beginPath();
        const baseRadius = this.theme === 'blue' ? 1.45 : .8;
        ctx.arc(point.x, point.y, baseRadius + influence * 2.15 + ambient * .65, 0, Math.PI * 2);
        const alpha = .075 + influence * .72 + ambient * .15;
        ctx.fillStyle = this.theme === 'blue'
          ? `rgba(20,108,255,${Math.min(1, .34 + alpha)})`
          : `rgba(121,232,255,${alpha})`;
        ctx.fill();
      });

      this.frame = reducedMotion ? null : requestAnimationFrame(time => this.draw(time));
    }
  }

  document.querySelectorAll('[data-dot-field]').forEach(canvas => new DotField(canvas));

  class GlobeWireframe {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.cities = [
        { name: 'New York', lat: 40.7128, lon: -74.006 },
        { name: 'London', lat: 51.5074, lon: -.1278 },
        { name: 'Paris', lat: 48.8566, lon: 2.3522 },
        { name: 'Amsterdam', lat: 52.3676, lon: 4.9041 },
        { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
        { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
        { name: 'Seattle', lat: 47.6062, lon: -122.3321 },
        { name: 'Austin', lat: 30.2672, lon: -97.7431 },
        { name: 'Miami', lat: 25.7617, lon: -80.1918 },
        { name: 'Mexico City', lat: 19.4326, lon: -99.1332 }
      ];
      this.landPaths = [];
      this.cityIndex = 0;
      this.rotation = this.cities[0].lon;
      this.targetRotation = this.rotation;
      this.dragging = false;
      this.lastX = 0;
      this.arrow = new Image();
      this.arrow.src = 'images/darmor-arrow-white.svg';
      this.status = canvas.parentElement?.querySelector('[data-globe-city]');
      canvas.addEventListener('pointerdown', event => {
        this.dragging = true;
        this.lastX = event.clientX;
        canvas.setPointerCapture?.(event.pointerId);
      });
      canvas.addEventListener('pointermove', event => {
        if (!this.dragging) return;
        this.rotation -= (event.clientX - this.lastX) * .35;
        this.targetRotation = this.rotation;
        this.lastX = event.clientX;
      });
      const endDrag = () => { this.dragging = false; };
      canvas.addEventListener('pointerup', endDrag);
      canvas.addEventListener('pointercancel', endDrag);
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(canvas);
      if (!reducedMotion) {
        this.cityTimer = window.setInterval(() => {
          if (this.dragging) return;
          this.cityIndex = (this.cityIndex + 1) % this.cities.length;
          this.targetRotation = this.cities[this.cityIndex].lon;
          if (this.status) this.status.textContent = this.cities[this.cityIndex].name;
        }, 3400);
      }
      this.loadLand();
      this.resize();
    }

    async loadLand() {
      try {
        const response = await fetch('land-110m.json');
        if (!response.ok) throw new Error(`Map data returned ${response.status}`);
        this.landPaths = this.decodeTopology(await response.json());
      } catch (_) {
        this.landPaths = [];
      }
    }

    decodeTopology(topology) {
      const scale = topology.transform?.scale || [1, 1];
      const translate = topology.transform?.translate || [0, 0];
      const decodedArcs = topology.arcs.map(arc => {
        let x = 0;
        let y = 0;
        return arc.map(([dx, dy]) => {
          x += dx;
          y += dy;
          return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
        });
      });
      const arc = index => {
        const points = decodedArcs[index < 0 ? ~index : index] || [];
        return index < 0 ? [...points].reverse() : points;
      };
      const stitch = indexes => indexes.reduce((ring, index) => {
        const points = arc(index);
        ring.push(...(ring.length ? points.slice(1) : points));
        return ring;
      }, []);
      const paths = [];
      const addGeometry = geometry => {
        if (geometry.type === 'Polygon') geometry.arcs.forEach(ring => paths.push(stitch(ring)));
        if (geometry.type === 'MultiPolygon') geometry.arcs.forEach(polygon => polygon.forEach(ring => paths.push(stitch(ring))));
      };
      const land = topology.objects?.land;
      if (land?.type === 'GeometryCollection') land.geometries.forEach(addGeometry);
      else if (land) addGeometry(land);
      return paths;
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.radius = Math.min(this.width, this.height) * .42;
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
      if (!this.frame) this.draw();
    }

    normalizedDelta(target, current) {
      return ((target - current + 540) % 360) - 180;
    }

    project(lat, lon) {
      const phi = lat * Math.PI / 180;
      const lambda = (lon - this.rotation) * Math.PI / 180;
      const cosPhi = Math.cos(phi);
      return {
        x: this.centerX + this.radius * cosPhi * Math.sin(lambda),
        y: this.centerY - this.radius * Math.sin(phi),
        z: cosPhi * Math.cos(lambda)
      };
    }

    drawProjected(points, color, width = 1) {
      const ctx = this.ctx;
      let drawing = false;
      let previous = null;
      ctx.beginPath();
      points.forEach(([lon, lat]) => {
        const point = this.project(lat, lon);
        if (point.z > 0) {
          const jump = previous && Math.hypot(point.x - previous.x, point.y - previous.y) > this.radius * .34;
          if (!drawing || jump) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
          drawing = true;
          previous = point;
        } else {
          drawing = false;
          previous = null;
        }
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    }

    drawGraticule() {
      for (let lat = -60; lat <= 60; lat += 30) {
        const points = [];
        for (let lon = -180; lon <= 180; lon += 3) points.push([lon, lat]);
        this.drawProjected(points, 'rgba(121,232,255,.13)', .7);
      }
      for (let lon = -180; lon < 180; lon += 30) {
        const points = [];
        for (let lat = -90; lat <= 90; lat += 3) points.push([lon, lat]);
        this.drawProjected(points, 'rgba(121,232,255,.11)', .7);
      }
    }

    drawMarker(city, active) {
      const point = this.project(city.lat, city.lon);
      if (point.z < .05) return;
      const ctx = this.ctx;
      const alpha = Math.min(1, .28 + point.z);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = 'rgba(121,232,255,.9)';
      ctx.shadowBlur = active ? 18 : 10;
      ctx.beginPath();
      ctx.arc(point.x, point.y, active ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = active ? '#79e8ff' : 'rgba(121,232,255,.7)';
      ctx.fill();
      ctx.shadowBlur = 0;
      if (this.arrow.complete) ctx.drawImage(this.arrow, point.x - 5, point.y - 20, 10, 17);
      if (active) {
        ctx.font = '600 9px Inter, sans-serif';
        ctx.letterSpacing = '1px';
        ctx.fillStyle = 'rgba(255,255,255,.92)';
        ctx.fillText(city.name.toUpperCase(), point.x + 12, point.y + 3);
      }
      ctx.restore();
    }

    draw() {
      const ctx = this.ctx;
      if (!this.dragging && !reducedMotion) this.rotation += this.normalizedDelta(this.targetRotation, this.rotation) * .025;
      ctx.clearRect(0, 0, this.width, this.height);

      const glow = ctx.createRadialGradient(this.centerX, this.centerY, this.radius * .12, this.centerX, this.centerY, this.radius);
      glow.addColorStop(0, 'rgba(20,108,255,.2)');
      glow.addColorStop(1, 'rgba(20,108,255,.015)');
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.strokeStyle = 'rgba(121,232,255,.38)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      this.drawGraticule();
      this.landPaths.forEach(path => this.drawProjected(path, 'rgba(121,232,255,.5)', 1.05));
      this.cities.forEach((city, index) => this.drawMarker(city, index === this.cityIndex));
      this.frame = reducedMotion ? null : requestAnimationFrame(() => this.draw());
    }
  }

  document.querySelectorAll('[data-globe-wireframe]').forEach(canvas => new GlobeWireframe(canvas));

  class DotWave {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.start = performance.now();
      this.frame = null;
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(canvas);
      this.resize();
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!this.frame) this.draw(performance.now());
    }

    draw(now) {
      const ctx = this.ctx;
      const gap = this.width < 700 ? 20 : 24;
      const centerX = this.width * .78;
      const centerY = this.height * .48;
      const maxRadius = Math.hypot(Math.max(centerX, this.width - centerX), Math.max(centerY, this.height - centerY)) + 90;
      const radius = this.reduced ? maxRadius * .42 : ((now - this.start) * .13) % maxRadius;
      ctx.clearRect(0, 0, this.width, this.height);

      for (let y = gap / 2; y < this.height; y += gap) {
        for (let x = gap / 2; x < this.width; x += gap) {
          const distance = Math.hypot(x - centerX, y - centerY);
          const wave = Math.exp(-Math.pow((distance - radius) / 52, 2));
          const innerGlow = Math.max(0, 1 - distance / (maxRadius * .62)) * .08;
          const alpha = .055 + innerGlow + wave * .58;
          const size = .75 + wave * 2.15;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(121,232,255,${alpha})`;
          ctx.fill();
        }
      }
      this.frame = this.reduced ? null : requestAnimationFrame(time => this.draw(time));
    }
  }

  document.querySelectorAll('[data-dot-wave]').forEach(canvas => new DotWave(canvas));

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.counted) return;
      entry.target.dataset.counted = 'true';
      const target = Number(entry.target.dataset.count);
      const suffix = entry.target.dataset.suffix || '';
      if (reducedMotion) {
        entry.target.textContent = target + suffix;
        return;
      }
      const start = performance.now();
      const duration = 1300;
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        entry.target.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  const servicesCarousel = document.querySelector('[data-services-carousel]');
  if (servicesCarousel) {
    const serviceSlides = [...servicesCarousel.querySelectorAll('[data-service-slide]')];
    const serviceDots = [...servicesCarousel.querySelectorAll('[data-service-dot]')];
    let activeService = 0;

    const showService = index => {
      activeService = (index + serviceSlides.length) % serviceSlides.length;
      serviceSlides.forEach((slide, position) => {
        const forward = (position - activeService + serviceSlides.length) % serviceSlides.length;
        const stackPosition = forward === serviceSlides.length - 1 ? -1 : forward;
        const active = position === activeService;
        slide.dataset.position = String(stackPosition);
        slide.classList.toggle('active', active);
        slide.setAttribute('aria-current', active ? 'true' : 'false');
      });
      serviceDots.forEach((dot, position) => dot.classList.toggle('active', position === activeService));
    };

    serviceSlides.forEach((slide, index) => {
      slide.addEventListener('click', event => {
        if (event.target.closest('a') && index === activeService) return;
        showService(index);
      });
      slide.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        showService(index);
      });
    });
    serviceDots.forEach((dot, index) => dot.addEventListener('click', () => showService(index)));
    servicesCarousel.querySelector('[data-service-prev]').addEventListener('click', () => showService(activeService - 1));
    servicesCarousel.querySelector('[data-service-next]').addEventListener('click', () => showService(activeService + 1));
    showService(0);
  }

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    const heading = contactForm.querySelector('[data-form-heading]');
    const inquiryType = contactForm.querySelector('[data-inquiry-type]');
    const pathButtons = contactForm.querySelectorAll('[data-path-button]');
    const setPath = path => {
      const safePath = path === 'talent' ? 'talent' : 'employer';
      contactForm.dataset.path = safePath;
      pathButtons.forEach(button => button.classList.toggle('active', button.dataset.pathButton === safePath));
      if (safePath === 'talent') {
        inquiryType.value = 'Talent network inquiry';
        heading.innerHTML = '<h3>Tell us where you want to go.</h3><p>Share your background and the kind of challenge you want next.</p>';
      } else {
        inquiryType.value = 'Employer inquiry';
        heading.innerHTML = '<h3>Tell us what you’re building.</h3><p>We’ll respond within one business day.</p>';
      }
    };
    const path = new URLSearchParams(window.location.search).get('path');
    setPath(path);
    pathButtons.forEach(button => button.addEventListener('click', () => setPath(button.dataset.pathButton)));
  }

  const processCarousel = document.querySelector('[data-process-carousel]');
  if (processCarousel) {
    const steps = [...processCarousel.querySelectorAll('[data-process-step]')];
    const panels = [...processCarousel.querySelectorAll('[data-process-panel]')];
    const currentLabel = processCarousel.querySelector('[data-process-current]');
    let currentStep = 0;

    const showStep = index => {
      currentStep = (index + steps.length) % steps.length;
      steps.forEach((step, position) => {
        const active = position === currentStep;
        step.classList.toggle('active', active);
        step.setAttribute('aria-selected', String(active));
        step.tabIndex = active ? 0 : -1;
      });
      panels.forEach((panel, position) => {
        const active = position === currentStep;
        panel.hidden = !active;
        panel.classList.toggle('active', active);
      });
      currentLabel.textContent = String(currentStep + 1).padStart(2, '0');
    };

    steps.forEach((step, index) => {
      step.addEventListener('click', () => showStep(index));
      step.addEventListener('keydown', event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        showStep(currentStep + (event.key === 'ArrowRight' ? 1 : -1));
        steps[currentStep].focus();
      });
    });
    processCarousel.querySelector('[data-process-prev]').addEventListener('click', () => showStep(currentStep - 1));
    processCarousel.querySelector('[data-process-next]').addEventListener('click', () => showStep(currentStep + 1));
    showStep(0);
  }
})();
