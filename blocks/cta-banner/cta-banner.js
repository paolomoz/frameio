/**
 * CTA banner block -- full-width call-to-action with centered content.
 * Extracts heading, description paragraphs, and buttons from authored content.
 * All content is centered with a max-width constraint.
 *
 * @param {Element} block The cta-banner block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const content = document.createElement('div');
  content.classList.add('cta-banner-content');

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      /* move all child elements into the centered content wrapper */
      while (cell.firstElementChild) {
        content.append(cell.firstElementChild);
      }

      /* handle text-only cells */
      const text = cell.textContent.trim();
      if (text && !content.lastElementChild) {
        const p = document.createElement('p');
        p.textContent = text;
        content.append(p);
      }
    });
  });

  /* tag description paragraphs (non-heading, non-button text) */
  content.querySelectorAll('p').forEach((p) => {
    if (!p.classList.contains('button-wrapper') && !p.querySelector('.button')) {
      p.classList.add('cta-banner-description');
    }
  });

  block.textContent = '';
  block.append(content);
}
