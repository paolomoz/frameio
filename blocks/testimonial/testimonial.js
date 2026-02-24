/**
 * Testimonial block -- blockquote with author attribution.
 * First row: quote text.
 * Second row: author info -- name, title, optional headshot picture.
 *
 * @param {Element} block The testimonial block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const quoteRow = rows[0];
  const authorRow = rows[1];

  /* build blockquote */
  const blockquote = document.createElement('blockquote');
  blockquote.classList.add('testimonial-quote');

  /* extract quote text */
  const quoteCell = quoteRow?.children[0];
  if (quoteCell) {
    const quoteText = document.createElement('p');
    quoteText.classList.add('testimonial-text');
    quoteText.textContent = quoteCell.textContent.trim();
    blockquote.append(quoteText);
  }

  /* build author cite */
  if (authorRow) {
    const cite = document.createElement('cite');
    cite.classList.add('testimonial-author');

    const cells = [...authorRow.children];

    /* look for headshot picture in any cell */
    let headshot = null;
    cells.forEach((cell) => {
      const pic = cell.querySelector('picture');
      if (pic && !headshot) {
        headshot = pic;
      }
    });

    if (headshot) {
      const avatar = document.createElement('div');
      avatar.classList.add('testimonial-avatar');
      avatar.append(headshot);
      cite.append(avatar);
    }

    /* extract name and title from text cells */
    const info = document.createElement('div');
    info.classList.add('testimonial-info');

    const textCells = cells.filter((cell) => !cell.querySelector('picture'));
    if (textCells.length > 0) {
      const name = document.createElement('span');
      name.classList.add('testimonial-name');
      name.textContent = textCells[0].textContent.trim();
      info.append(name);
    }

    if (textCells.length > 1) {
      const title = document.createElement('span');
      title.classList.add('testimonial-title');
      title.textContent = textCells[1].textContent.trim();
      info.append(title);
    }

    cite.append(info);
    blockquote.append(cite);
  }

  block.textContent = '';
  block.append(blockquote);
}
