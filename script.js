/* ==================================================
   PORTFOLIO SCRIPT
   Vanilla JavaScript only
   ================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------
     1. NAVBAR: scroll style + mobile menu
  ------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateNavbarOnScroll() {
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  updateNavbarOnScroll();
  window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu after choosing a link
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------------
     2. ACTIVE NAV LINK WHILE SCROLLING
  ------------------------------------------------ */
  const sections = Array.from(document.querySelectorAll('main section[id], #home'));

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((section) => navObserver.observe(section));

  /* ------------------------------------------------
     3. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  ------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal, .timeline-item');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------
     4. SKILL BAR ANIMATION (fills when in view)
  ------------------------------------------------ */
  const skillBars = document.querySelectorAll('.skill-bar');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const level = bar.dataset.level || '0';
          const fill = bar.querySelector('.skill-bar__fill');
          if (fill) fill.style.width = level + '%';
          skillObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillBars.forEach((bar) => skillObserver.observe(bar));

  /* ------------------------------------------------
     5. BACK TO TOP BUTTON
     (guarded — current markup has no #backToTop button)
  ------------------------------------------------ */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener(
      'scroll',
      () => {
        backToTop.classList.toggle('is-visible', window.scrollY > 500);
      },
      { passive: true }
    );

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------
     6. HERO TYPING ANIMATION
  ------------------------------------------------ */
  const typedRole = document.getElementById('typedRole');
  const roles = ['Web Development', 'Machine Learning', 'Cloud Computing'];
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let isDeleting = false;

  function typeLoop() {
    const current = roles[roleIndex];

    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typedRole.textContent = current.slice(0, charIndex);

    let delay = isDeleting ? 45 : 85;

    if (!isDeleting && charIndex === current.length) {
      delay = 1600;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 300;
    }

    window.setTimeout(typeLoop, delay);
  }

  if (typedRole && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.setTimeout(typeLoop, 1600);
  }

  /* ------------------------------------------------
     7. CONTACT FORM VALIDATION
     (guarded — current markup has no #contactForm)
  ------------------------------------------------ */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  function setFieldError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    const wrapper = field.closest('.form-field');

    if (message) {
      wrapper.classList.add('has-error');
      errorEl.textContent = message;
    } else {
      wrapper.classList.remove('has-error');
      errorEl.textContent = '';
    }
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const message = document.getElementById('cf-message').value.trim();

      let valid = true;

      if (name.length < 2) {
        setFieldError('cf-name', 'err-name', 'Please enter your name.');
        valid = false;
      } else {
        setFieldError('cf-name', 'err-name', '');
      }

      if (!isValidEmail(email)) {
        setFieldError('cf-email', 'err-email', 'Please enter a valid email address.');
        valid = false;
      } else {
        setFieldError('cf-email', 'err-email', '');
      }

      if (message.length < 10) {
        setFieldError('cf-message', 'err-message', 'Message should be at least 10 characters.');
        valid = false;
      } else {
        setFieldError('cf-message', 'err-message', '');
      }

      if (!valid) {
        formStatus.textContent = 'Please fix the highlighted fields.';
        formStatus.className = 'form-status is-error';
        return;
      }

      // No backend is connected — show a professional confirmation instead
      // of pretending the message was actually delivered.
      formStatus.textContent =
        "Thanks, " + name.split(' ')[0] + "! Your message has been noted. " +
        "Since this form isn't connected to a backend yet, please also feel free to email me directly.";
      formStatus.className = 'form-status is-success';
      form.reset();
    });
  }

});