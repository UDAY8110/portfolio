const sections = document.querySelectorAll('section[data-section]');
const navLinks = document.querySelectorAll('.nav-link');
const tracePanel = document.querySelector('.trace-panel');
const tracePath = document.querySelector('#pcb-trace');

function setActiveNav() {
  const scrollPosition = window.scrollY + window.innerHeight * 0.25;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.id;
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (scrollPosition >= top && scrollPosition < bottom) {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

function observeFadeIn() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('[data-animate]').forEach((node) => observer.observe(node));
}

function updateTraceLayout() {
  const isMobile = window.innerWidth <= 760;
  if (!tracePath) return;

  if (isMobile) {
    tracePath.setAttribute('d', 'M 120 40 V 140 H 240 V 240 H 340 V 320 H 420');
  } else {
    tracePath.setAttribute('d', 'M 80 280 H 260 V 120 H 420 V 240 H 620 V 100 H 860');
  }

  document.querySelectorAll('.via-point').forEach((node) => {
    const x = isMobile ? node.dataset.xMobile || node.dataset.x : node.dataset.x;
    const y = isMobile ? node.dataset.yMobile || node.dataset.y : node.dataset.y;
    node.style.setProperty('--x', x);
    node.style.setProperty('--y', y);
  });
}

function animateTrace() {
  const rect = tracePanel.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.75) {
    tracePanel.classList.add('drawn');
  }
}

function init() {
  setActiveNav();
  observeFadeIn();
  updateTraceLayout();
  animateTrace();

  window.addEventListener('scroll', () => {
    setActiveNav();
    animateTrace();
  });

  window.addEventListener('resize', updateTraceLayout);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navLinks.forEach((item) => item.classList.remove('active'));
        if (link.classList.contains('nav-link')) {
          link.classList.add('active');
        }
      }
    });
  });

  document.querySelectorAll('.link-button').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      window.open(button.href, '_blank');
    });
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

window.addEventListener('DOMContentLoaded', init);
