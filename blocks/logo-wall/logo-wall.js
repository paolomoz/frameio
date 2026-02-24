/**
 * Logo wall block -- flex-wrap container of partner/client logos.
 * Each authored row = one logo (picture element).
 * Logos display in grayscale, hover to full color.
 *
 * @param {Element} block The logo-wall block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wall = document.createElement('div');
  wall.classList.add('logo-wall-grid');

  rows.forEach((row) => {
    const cells = [...row.children];
    const cell = cells[0];
    if (!cell) return;

    const item = document.createElement('div');
    item.classList.add('logo-wall-item');

    const picture = cell.querySelector('picture');
    const img = cell.querySelector('img');

    if (picture) {
      item.append(picture);
    } else if (img) {
      item.append(img);
    } else {
      /* fallback: treat cell content as text logo */
      item.textContent = cell.textContent.trim();
    }

    wall.append(item);
  });

  block.textContent = '';
  block.append(wall);
}
