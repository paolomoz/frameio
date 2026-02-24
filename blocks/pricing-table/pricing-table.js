/**
 * Pricing table block.
 * Each authored row = one pricing tier.
 * Expected cell order per row: name, price, period, description, features (ul), CTA link.
 * Supports monthly/annual toggle. "Most Popular" badge via .popular class on the row
 * or "popular" text in an extra cell.
 *
 * @param {Element} block The pricing-table block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  /* ---- detect if pricing has dual values for toggle (monthly|annual format) ---- */
  let hasToggle = false;
  const tierData = rows.map((row) => {
    const cells = [...row.children];
    const name = cells[0]?.textContent.trim() || '';
    const priceRaw = cells[1]?.textContent.trim() || '';
    const period = cells[2]?.textContent.trim() || '';
    const description = cells[3]?.innerHTML || '';
    const featureCell = cells[4];
    const ctaCell = cells[5];
    const metaCell = cells[6];

    /* support "monthly|annual" in price cell */
    let priceMonthly = priceRaw;
    let priceAnnual = priceRaw;
    if (priceRaw.includes('|')) {
      hasToggle = true;
      const [m, a] = priceRaw.split('|').map((s) => s.trim());
      priceMonthly = m;
      priceAnnual = a;
    }

    /* extract features list */
    const featureList = featureCell?.querySelector('ul');
    const features = featureList
      ? [...featureList.querySelectorAll('li')].map((li) => li.textContent.trim())
      : [];

    /* extract CTA */
    const ctaLink = ctaCell?.querySelector('a');

    /* popular flag */
    const isPopular = row.classList.contains('popular')
      || (metaCell && metaCell.textContent.toLowerCase().includes('popular'));

    return {
      name, priceMonthly, priceAnnual, period, description, features, ctaLink, isPopular,
    };
  });

  /* ---- build toggle ---- */
  block.textContent = '';

  if (hasToggle) {
    const toggle = document.createElement('div');
    toggle.classList.add('pricing-toggle');
    toggle.innerHTML = `
      <span class="pricing-toggle-label active" data-plan="monthly">Monthly</span>
      <button class="pricing-toggle-switch" aria-label="Toggle billing period" role="switch" aria-checked="false">
        <span class="pricing-toggle-thumb"></span>
      </button>
      <span class="pricing-toggle-label" data-plan="annual">Annual</span>
    `;
    block.append(toggle);

    const switchBtn = toggle.querySelector('.pricing-toggle-switch');
    const labels = toggle.querySelectorAll('.pricing-toggle-label');

    switchBtn.addEventListener('click', () => {
      const isAnnual = switchBtn.getAttribute('aria-checked') === 'true';
      const newState = !isAnnual;
      switchBtn.setAttribute('aria-checked', String(newState));

      labels.forEach((l) => {
        l.classList.toggle('active', (newState && l.dataset.plan === 'annual')
          || (!newState && l.dataset.plan === 'monthly'));
      });

      block.querySelectorAll('.pricing-card').forEach((card, i) => {
        const priceEl = card.querySelector('.pricing-price-value');
        if (priceEl) {
          priceEl.textContent = newState
            ? tierData[i].priceAnnual
            : tierData[i].priceMonthly;
        }
      });
    });
  }

  /* ---- build cards ---- */
  const grid = document.createElement('div');
  grid.classList.add('pricing-grid');

  tierData.forEach((tier) => {
    const card = document.createElement('div');
    card.classList.add('pricing-card');
    if (tier.isPopular) card.classList.add('popular');

    let badgeHTML = '';
    if (tier.isPopular) {
      badgeHTML = '<div class="pricing-badge">Most Popular</div>';
    }

    const featuresHTML = tier.features.map((f) => `<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-electric)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${f}</span></li>`).join('');

    let ctaHTML = '';
    if (tier.ctaLink) {
      const classes = tier.isPopular ? 'button accent' : 'button primary';
      const ctaText = tier.ctaLink.textContent.trim();
      const ariaLabel = tier.name ? `${ctaText} — ${tier.name} plan` : ctaText;
      ctaHTML = `<a href="${tier.ctaLink.href}" class="${classes}" title="${ctaText}" aria-label="${ariaLabel}">${ctaText}</a>`;
    }

    card.innerHTML = `
      ${badgeHTML}
      <h3 class="pricing-name">${tier.name}</h3>
      <div class="pricing-price">
        <span class="pricing-price-value">${tier.priceMonthly}</span>
        ${tier.period ? `<span class="pricing-price-period">/${tier.period}</span>` : ''}
      </div>
      <div class="pricing-description">${tier.description}</div>
      ${featuresHTML ? `<ul class="pricing-features">${featuresHTML}</ul>` : ''}
      ${ctaHTML ? `<div class="pricing-cta">${ctaHTML}</div>` : ''}
    `;

    grid.append(card);
  });

  block.append(grid);
}
