/**
 * Feature grid block – 3x2 grid of clickable feature cards.
 * Each authored row = one feature card.
 * First cell: icon (span.icon or picture) + title text.
 * Second cell (optional): link href for the card.
 * Highlights current page card matching window.location.pathname.
 *
 * @param {Element} block The feature-grid block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const grid = document.createElement('div');
  grid.classList.add('feature-grid-cards');

  rows.forEach((row) => {
    const cells = [...row.children];
    const contentCell = cells[0];
    if (!contentCell) return;

    const card = document.createElement('div');
    card.classList.add('feature-grid-card');

    /* extract icon */
    const icon = contentCell.querySelector('.icon');
    const picture = contentCell.querySelector('picture');
    if (icon) {
      const iconWrap = document.createElement('div');
      iconWrap.classList.add('feature-grid-icon');
      iconWrap.append(icon.cloneNode(true));
      card.append(iconWrap);
    } else if (picture) {
      const iconWrap = document.createElement('div');
      iconWrap.classList.add('feature-grid-icon');
      iconWrap.append(picture.cloneNode(true));
      card.append(iconWrap);
    }

    /* extract title and description */
    const titleEl = contentCell.querySelector('h2, h3, h4, h5, h6');
    const title = document.createElement('h3');
    title.classList.add('feature-grid-title');
    title.textContent = titleEl ? titleEl.textContent.trim() : contentCell.textContent.trim();
    card.append(title);

    /* extract description paragraphs (not the title) */
    const paras = [...contentCell.querySelectorAll('p')].filter((p) => !p.querySelector('.icon') && !p.classList.contains('button-wrapper'));
    if (paras.length) {
      const desc = document.createElement('p');
      desc.classList.add('feature-grid-desc');
      desc.textContent = paras.map((p) => p.textContent.trim()).join(' ');
      card.append(desc);
    }

    /* extract link – from second cell or from an anchor in first cell */
    let link = cells[1]?.querySelector('a');
    if (!link) link = contentCell.querySelector('a');

    if (link) {
      const cardLink = document.createElement('a');
      cardLink.classList.add('feature-grid-link');
      cardLink.href = link.href;
      cardLink.title = link.title || title.textContent;
      cardLink.setAttribute('aria-label', title.textContent);
      /* wrap card content inside the link */
      while (card.firstChild) cardLink.append(card.firstChild);
      card.append(cardLink);

      /* highlight current page */
      try {
        const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '');
        const currentPath = window.location.pathname.replace(/\/$/, '');
        if (linkPath && linkPath === currentPath) {
          card.classList.add('active');
        }
      } catch {
        /* ignore invalid URLs */
      }
    }

    grid.append(card);
  });

  block.textContent = '';
  block.append(grid);
}
