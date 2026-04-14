  const CONFIG = {
      loaderDelay:    1800,  // ms before loader hides
      typingSpeed:    90,    // ms per character
      typingPause:    1600,  // ms before deleting
      deleteSpeed:    50,    // ms per delete
      counterDuration: 1800, // ms for number count-up
      parallaxStrength: 0.12 // 0 = none, 0.2 = strong
    };

    const TYPING_WORDS = [
      'WE BUILD',
      'WE CREATE',
      'WE ENGINEER',
      'WE DELIVER'
    ];

    /* ================================================
       CUSTOM CURSOR
       ================================================ */
    const cursorDot  = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    });

    // Smooth ring follow
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover state on interactive elements
    document.querySelectorAll('a, button, .service-card, .project-card, .filter-btn').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    /* ================================================
       PAGE LOADER
       ================================================ */
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        document.body.classList.remove('loading');
        // Trigger hero animations after loader
        setTimeout(startTyping, 300);
      }, CONFIG.loaderDelay);
    });

    /* ================================================
       TYPING EFFECT (Hero headline)
       ================================================ */
    const typingLine   = document.getElementById('typing-line');
    const typingCursor = document.getElementById('typing-cursor');
    let wordIdx = 0, charIdx = 0, isDeleting = false;

    function startTyping() {
      typeWord();
    }

    function typeWord() {
      const word = TYPING_WORDS[wordIdx];
      if (!isDeleting) {
        // Typing
        typingLine.textContent = word.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === word.length) {
          isDeleting = true;
          setTimeout(typeWord, CONFIG.typingPause);
          return;
        }
        setTimeout(typeWord, CONFIG.typingSpeed);
      } else {
        // Deleting
        typingLine.textContent = word.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          wordIdx = (wordIdx + 1) % TYPING_WORDS.length;
          setTimeout(typeWord, 300);
          return;
        }
        setTimeout(typeWord, CONFIG.deleteSpeed);
      }
    }

    /* ================================================
       STICKY HEADER
       ================================================ */
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ================================================
       MOBILE NAV
       ================================================ */
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      if (mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        setTimeout(() => { mobileNav.style.display = 'none'; }, 300);
      } else {
        mobileNav.style.display = 'flex';
        requestAnimationFrame(() => mobileNav.classList.add('open'));
      }
    });

    function closeMobileNav() {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      setTimeout(() => { mobileNav.style.display = 'none'; }, 300);
    }

    /* ================================================
       RIPPLE EFFECT ON BUTTONS
       ================================================ */
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect   = this.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        ripple.style.left   = x + 'px';
        ripple.style.top    = y + 'px';
        ripple.style.width  = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
        ripple.style.marginLeft = ripple.style.marginTop = `-${Math.max(rect.width, rect.height) / 2}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
      });
    });

    /* ================================================
       SCROLL REVEAL (IntersectionObserver)
       ================================================ */
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // Trigger counters inside revealed elements
          e.target.querySelectorAll('.counter').forEach(startCounter);
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ================================================
       ANIMATED NUMBER COUNTERS
       ================================================ */
    const countedEls = new Set();

    function startCounter(el) {
      if (countedEls.has(el)) return;
      countedEls.add(el);

      const target   = parseInt(el.dataset.target, 10);
      const suffix   = el.dataset.suffix || '';
      const duration = CONFIG.counterDuration;
      const start    = performance.now();

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    /* ================================================
       3D TILT CARDS
       ================================================ */
    document.querySelectorAll('.tilt-card').forEach(card => {
      const shine = card.querySelector('.service-card-shine');
      const MAX_TILT = 12; // degrees

      card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / (rect.width  / 2);
        const dy     = (e.clientY - cy) / (rect.height / 2);
        const rotX   = -dy * MAX_TILT;
        const rotY   =  dx * MAX_TILT;

        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;

        // Move shine to match cursor
        if (shine) {
          const sx = (e.clientX - rect.left) / rect.width  * 100;
          const sy = (e.clientY - rect.top)  / rect.height * 100;
          shine.style.background = `radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.1), transparent 55%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
        if (shine) shine.style.background = 'none';
      });
    });

    /* ================================================
       PARALLAX SCROLLING
       ================================================ */
    const parallaxEls = document.querySelectorAll('[data-parallax]');

    function applyParallax() {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const speed  = parseFloat(el.dataset.parallax) || CONFIG.parallaxStrength;
        const offset = scrollY * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }

    window.addEventListener('scroll', applyParallax, { passive: true });

    /* ================================================
       PROJECT FILTER (visual only — no backend)
       ================================================ */
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // Animate cards out/in
        document.querySelectorAll('.project-card').forEach((card, i) => {
          card.style.opacity    = '0';
          card.style.transform  = 'scale(0.92)';
          card.style.transition = `opacity 0.3s ${i * 0.05}s, transform 0.3s ${i * 0.05}s`;
          setTimeout(() => {
            card.style.opacity    = '1';
            card.style.transform  = 'scale(1)';
          }, 350);
        });
      });
    });

    /* ================================================
       CONTACT FORM SUBMISSION
       ================================================ */
    function handleFormSubmit(e) {
      e.preventDefault();
      const toast = document.getElementById('form-toast');
      toast.classList.add('show');
      e.target.reset();
      setTimeout(() => toast.classList.remove('show'), 4000);
    }

    /* ================================================
       BACK TO TOP BUTTON
       ================================================ */
    const backTop = document.getElementById('back-top');
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    /* ================================================
       SMOOTH SCROLL HELPER
       ================================================ */
    function scrollToSection(id) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }

    /* ================================================
       MOBILE: DISABLE CUSTOM CURSOR
       ================================================ */
    if (window.matchMedia('(pointer: coarse)').matches) {
      cursorDot.style.display  = 'none';
      cursorRing.style.display = 'none';
      document.body.style.cursor = 'auto';
    }

    /* ================================================
       SERVICES: Scroll parallax background shift
       ================================================ */
    const servicesSection = document.getElementById('services');
    window.addEventListener('scroll', () => {
      const rect    = servicesSection.getBoundingClientRect();
      const pct     = 1 - (rect.bottom / (window.innerHeight + rect.height));
      const offset  = pct * 40;
      servicesSection.style.backgroundPositionY = `${offset}%`;
    }, { passive: true });