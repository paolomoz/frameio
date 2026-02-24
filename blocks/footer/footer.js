import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // identify link columns vs bottom section
  const sections = footer.querySelectorAll(':scope > div');
  if (sections.length > 1) {
    // Wrap all but the last section as footer-links
    const linksWrap = document.createElement('div');
    linksWrap.classList.add('footer-links');
    [...sections].slice(0, -1).forEach((s) => linksWrap.append(s));
    footer.prepend(linksWrap);

    // Last section is the bottom bar
    const last = footer.querySelector(':scope > div:last-child');
    if (last) last.classList.add('footer-bottom');
  }

  // fix heading hierarchy: H4 -> H3 in footer (WCAG)
  footer.querySelectorAll('h4').forEach((h4) => {
    const h3 = document.createElement('h3');
    [...h4.attributes].forEach((attr) => h3.setAttribute(attr.name, attr.value));
    h3.innerHTML = h4.innerHTML;
    h4.replaceWith(h3);
  });

  // decorate social icon links with accessible names
  footer.querySelectorAll('a .icon').forEach((icon) => {
    const link = icon.closest('a');
    if (link) {
      const socialWrap = link.closest('p') || link.closest('div');
      if (socialWrap && !socialWrap.classList.contains('footer-social')) {
        socialWrap.classList.add('footer-social');
      }
      // add aria-label from icon class name (e.g. icon-instagram -> Instagram)
      if (!link.getAttribute('aria-label') && !link.textContent.trim()) {
        const iconClass = [...icon.classList].find((c) => c.startsWith('icon-'));
        if (iconClass) {
          const name = iconClass.replace('icon-', '').replace(/-/g, ' ');
          link.setAttribute('aria-label', name.charAt(0).toUpperCase() + name.slice(1));
        }
      }
    }
  });

  block.append(footer);
}
