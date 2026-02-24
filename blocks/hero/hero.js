export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Extract content from first row
  const picture = block.querySelector('picture');
  const h1 = block.querySelector('h1');
  const paragraphs = block.querySelectorAll('p:not(.button-wrapper)');
  const buttons = block.querySelectorAll('.button-wrapper');

  // Build hero content wrapper
  const content = document.createElement('div');
  content.classList.add('hero-content');

  if (h1) content.append(h1);
  paragraphs.forEach((p) => {
    if (p.textContent.trim()) content.append(p);
  });

  if (buttons.length) {
    const btnGroup = document.createElement('div');
    btnGroup.classList.add('hero-actions');
    buttons.forEach((b) => btnGroup.append(b));
    content.append(btnGroup);
  }

  // Build background wrapper
  if (picture) {
    const bg = document.createElement('div');
    bg.classList.add('hero-background');
    bg.append(picture);
    block.textContent = '';
    block.append(bg);
  } else {
    block.textContent = '';
  }

  block.append(content);

  // Handle product screenshot (second row image if present)
  if (rows.length > 1) {
    const screenshotPic = rows[1]?.querySelector('picture');
    if (screenshotPic) {
      const screenshotWrap = document.createElement('div');
      screenshotWrap.classList.add('hero-screenshot');
      screenshotWrap.append(screenshotPic);
      block.append(screenshotWrap);
    }
  }
}
