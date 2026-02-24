import { createOptimizedPicture } from '../../scripts/aem.js';

const HERO_IMAGES = {
  '/': { bg: '/images/hero-bg.jpg', screenshot: '/images/hero-screenshot.png' },
  '/enterprise': { bg: '/images/hero-enterprise-bg.jpg' },
  '/features/workflow-management': { bg: '/images/hero-workflow-bg.jpg' },
};

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Extract content from first row
  let picture = block.querySelector('picture');
  const h1 = block.querySelector('h1');
  const paragraphs = block.querySelectorAll('p:not(.button-wrapper)');
  const buttons = block.querySelectorAll('.button-wrapper');

  // Remove broken images (about:error) from content
  block.querySelectorAll('img[src="about:error"]').forEach((img) => img.remove());

  // Resolve hero images from config if no valid picture exists
  if (!picture || !picture.querySelector('img[src]:not([src="about:error"])')) {
    const { pathname } = window.location;
    const config = HERO_IMAGES[pathname];
    if (config?.bg) {
      picture = createOptimizedPicture(config.bg, h1?.textContent || '', true);
    } else {
      picture = null;
    }
  }

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

  // Handle product screenshot
  const { pathname } = window.location;
  const config = HERO_IMAGES[pathname];
  let screenshotPic = null;

  if (rows.length > 1) {
    screenshotPic = rows[1]?.querySelector('picture');
  }

  // Use config screenshot if no valid one from content
  if (!screenshotPic && config?.screenshot) {
    screenshotPic = createOptimizedPicture(config.screenshot, 'Frame.io interface', false);
  }

  if (screenshotPic) {
    const screenshotWrap = document.createElement('div');
    screenshotWrap.classList.add('hero-screenshot');
    screenshotWrap.append(screenshotPic);
    block.append(screenshotWrap);
  }
}
