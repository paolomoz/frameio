/**
 * CSS scroll-snap carousel block.
 * Each authored row = one slide.
 * Navigation dots, prev/next arrows, auto-play with pause on hover,
 * keyboard navigation (left/right arrows).
 *
 * @param {Element} block The carousel block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  /* ---- build slide track ---- */
  const track = document.createElement('div');
  track.classList.add('carousel-track');
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', 'Carousel');
  track.tabIndex = 0;

  rows.forEach((row, i) => {
    const slide = document.createElement('div');
    slide.classList.add('carousel-slide');
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Slide ${i + 1} of ${rows.length}`);
    while (row.firstElementChild) slide.append(row.firstElementChild);
    track.append(slide);
  });

  /* ---- navigation arrows ---- */
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('carousel-btn', 'carousel-btn-prev');
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('carousel-btn', 'carousel-btn-next');
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';

  /* ---- dots ---- */
  const dots = document.createElement('div');
  dots.classList.add('carousel-dots');
  dots.setAttribute('role', 'tablist');
  rows.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    if (i === 0) dot.classList.add('active');
    dots.append(dot);
  });

  /* ---- assemble ---- */
  block.textContent = '';
  const viewport = document.createElement('div');
  viewport.classList.add('carousel-viewport');
  viewport.append(track);
  viewport.append(prevBtn);
  viewport.append(nextBtn);
  block.append(viewport);
  block.append(dots);

  /* ---- state ---- */
  let current = 0;
  const total = rows.length;
  let autoPlayTimer = null;
  const AUTO_PLAY_INTERVAL = 5000;

  function goTo(index) {
    current = ((index % total) + total) % total;
    const slides = track.querySelectorAll('.carousel-slide');
    slides[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  /* ---- sync dots on scroll ---- */
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const slideWidth = track.firstElementChild?.offsetWidth || 1;
      const idx = Math.round(track.scrollLeft / slideWidth);
      if (idx !== current) {
        current = idx;
        dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
          d.setAttribute('aria-selected', i === current ? 'true' : 'false');
        });
      }
    }, 50);
  }, { passive: true });

  /* ---- events ---- */
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  dots.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  /* keyboard navigation */
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prev(); e.preventDefault(); }
    if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
  });

  /* ---- auto-play ---- */
  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(next, AUTO_PLAY_INTERVAL);
  }

  viewport.addEventListener('mouseenter', stopAutoPlay);
  viewport.addEventListener('mouseleave', startAutoPlay);
  viewport.addEventListener('focusin', stopAutoPlay);
  viewport.addEventListener('focusout', startAutoPlay);

  startAutoPlay();
}
