// scroll-reveal: animate sections into view
const main = document.querySelector('main');
if (main) {
  const sections = main.querySelectorAll('.section');
  const viewH = window.innerHeight;

  // pre-mark sections already in view so they don't flash
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < viewH) {
      section.classList.add('visible');
    }
  });

  // activate reveal system
  main.classList.add('reveal-ready');

  // observe below-fold sections
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach((section) => {
    if (!section.classList.contains('visible')) {
      observer.observe(section);
    }
  });
}
