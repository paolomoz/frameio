/**
 * Stats block – animated count-up numbers.
 * Each authored row = one stat. First cell = big number, second cell = label.
 * Uses IntersectionObserver for count-up animation.
 *
 * @param {Element} block The stats block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const grid = document.createElement('div');
  grid.classList.add('stats-grid');

  rows.forEach((row) => {
    const cells = [...row.children];
    const numberCell = cells[0];
    const labelCell = cells[1];
    if (!numberCell) return;

    const stat = document.createElement('div');
    stat.classList.add('stats-item');

    const numberEl = document.createElement('div');
    numberEl.classList.add('stats-number');
    const rawText = numberCell.textContent.trim();
    numberEl.textContent = rawText;
    numberEl.dataset.value = rawText;

    const labelEl = document.createElement('div');
    labelEl.classList.add('stats-label');
    if (labelCell) {
      labelEl.innerHTML = labelCell.innerHTML;
    }

    stat.append(numberEl);
    stat.append(labelEl);
    grid.append(stat);
  });

  block.textContent = '';
  block.append(grid);

  /* ---- count-up animation ---- */
  function parseNumber(str) {
    /* extract numeric value, prefix, suffix e.g. "$1.5M" */
    const match = str.match(/^([^0-9]*?)([\d,.]+)(.*)$/);
    if (!match) return null;
    return {
      prefix: match[1],
      num: parseFloat(match[2].replace(/,/g, '')),
      suffix: match[3],
      hasComma: match[2].includes(','),
      decimals: match[2].includes('.') ? match[2].split('.')[1].length : 0,
    };
  }

  function formatNumber(value, hasComma, decimals) {
    let str = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
    if (hasComma) {
      const parts = str.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      str = parts.join('.');
    }
    return str;
  }

  function animateNumber(el) {
    const parsed = parseNumber(el.dataset.value);
    if (!parsed) return;

    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      /* ease-out cubic */
      const eased = 1 - (1 - progress) ** 3;
      const current = eased * parsed.num;
      el.textContent = `${parsed.prefix}${formatNumber(current, parsed.hasComma, parsed.decimals)}${parsed.suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /* observe for viewport entry */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const numberEls = entry.target.querySelectorAll('.stats-number');
        numberEls.forEach((el) => animateNumber(el));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(grid);
}
