/**
 * Tabs block -- accessible tab bar with panel switching.
 * Alternating authored rows: odd rows = tab label, even rows = tab content.
 * Supports keyboard navigation (arrow keys) and ARIA roles.
 *
 * @param {Element} block The tabs block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const tablist = document.createElement('div');
  tablist.classList.add('tabs-list');
  tablist.setAttribute('role', 'tablist');

  const panels = document.createElement('div');
  panels.classList.add('tabs-panels');

  const tabButtons = [];
  const tabPanels = [];
  let tabIndex = 0;

  /* pair rows: odd = label, even = content */
  for (let i = 0; i < rows.length; i += 2) {
    const labelRow = rows[i];
    const contentRow = rows[i + 1];
    if (!labelRow) break;

    const id = `tab-${block.id || 'block'}-${tabIndex}`;

    /* tab button */
    const button = document.createElement('button');
    button.classList.add('tabs-tab');
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', tabIndex === 0 ? 'true' : 'false');
    button.setAttribute('aria-controls', `${id}-panel`);
    button.setAttribute('id', `${id}-tab`);
    button.setAttribute('tabindex', tabIndex === 0 ? '0' : '-1');
    button.textContent = labelRow.textContent.trim();
    tablist.append(button);
    tabButtons.push(button);

    /* tab panel */
    const panel = document.createElement('div');
    panel.classList.add('tabs-panel');
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `${id}-tab`);
    panel.setAttribute('id', `${id}-panel`);
    panel.hidden = tabIndex !== 0;

    if (contentRow) {
      /* move content cells into panel */
      const contentCells = [...contentRow.children];
      contentCells.forEach((cell) => {
        while (cell.firstElementChild) panel.append(cell.firstElementChild);
        /* handle text-only cells */
        const remaining = cell.textContent.trim();
        if (remaining && !panel.children.length) {
          const p = document.createElement('p');
          p.textContent = remaining;
          panel.append(p);
        }
      });
    }

    panels.append(panel);
    tabPanels.push(panel);
    tabIndex += 1;
  }

  /* switch tab handler */
  function switchTab(index) {
    tabButtons.forEach((btn, i) => {
      const selected = i === index;
      btn.setAttribute('aria-selected', String(selected));
      btn.setAttribute('tabindex', selected ? '0' : '-1');
    });
    tabPanels.forEach((pnl, i) => {
      pnl.hidden = i !== index;
    });
  }

  /* click handler */
  tablist.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (!tab) return;
    const idx = tabButtons.indexOf(tab);
    if (idx >= 0) {
      switchTab(idx);
      tab.focus();
    }
  });

  /* keyboard navigation */
  tablist.addEventListener('keydown', (e) => {
    const { key } = e;
    const current = tabButtons.findIndex(
      (btn) => btn.getAttribute('aria-selected') === 'true',
    );
    let next = current;

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      next = (current + 1) % tabButtons.length;
      e.preventDefault();
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      next = (current - 1 + tabButtons.length) % tabButtons.length;
      e.preventDefault();
    } else if (key === 'Home') {
      next = 0;
      e.preventDefault();
    } else if (key === 'End') {
      next = tabButtons.length - 1;
      e.preventDefault();
    }

    if (next !== current) {
      switchTab(next);
      tabButtons[next].focus();
    }
  });

  block.textContent = '';
  block.append(tablist);
  block.append(panels);
}
