/**
 * Comparison table block -- feature matrix with sticky header.
 * First row: header row with plan names (first cell can be empty or "Feature").
 * Remaining rows: feature rows. First cell = feature name,
 * other cells = values (check/x for booleans, text for others).
 *
 * @param {Element} block The comparison-table block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const table = document.createElement('table');
  table.classList.add('comparison-table-grid');

  /* build header */
  const thead = document.createElement('thead');
  const headerRow = rows[0];
  const headerCells = [...headerRow.children];
  const tr = document.createElement('tr');

  headerCells.forEach((cell, i) => {
    const th = document.createElement('th');
    th.scope = i === 0 ? 'col' : 'col';
    th.textContent = cell.textContent.trim();
    if (i === 0) th.classList.add('comparison-table-feature-header');
    tr.append(th);
  });

  thead.append(tr);
  table.append(thead);

  /* build body */
  const tbody = document.createElement('tbody');

  rows.slice(1).forEach((row) => {
    const cells = [...row.children];
    const bodyTr = document.createElement('tr');

    /* detect category rows (only first cell has content) */
    const nonEmpty = cells.filter((c) => c.textContent.trim() !== '');
    const isCategory = nonEmpty.length === 1 && cells[0].textContent.trim() !== '';

    cells.forEach((cell, i) => {
      const td = document.createElement('td');
      const text = cell.textContent.trim().toLowerCase();

      if (i === 0) {
        /* feature name or category */
        td.classList.add('comparison-table-feature-name');
        td.textContent = cell.textContent.trim();
        if (isCategory) {
          td.classList.add('comparison-table-category');
          td.setAttribute('colspan', String(headerCells.length));
        }
      } else if (!isCategory) {
        /* value cell -- detect booleans */
        if (text === 'yes' || text === 'true' || text === '\u2713' || text === '\u2714') {
          td.innerHTML = '<span class="comparison-check" aria-label="Included">&#10003;</span>';
        } else if (text === 'no' || text === 'false' || text === '\u2717' || text === '\u2718' || text === 'x' || text === '-') {
          td.innerHTML = '<span class="comparison-x" aria-label="Not included">&#10005;</span>';
        } else {
          td.textContent = cell.textContent.trim();
        }
      }

      if (!(isCategory && i > 0)) {
        bodyTr.append(td);
      }
    });

    if (isCategory) bodyTr.classList.add('comparison-table-category-row');
    tbody.append(bodyTr);
  });

  table.append(tbody);

  /* wrap in scrollable container for mobile */
  const scrollWrap = document.createElement('div');
  scrollWrap.classList.add('comparison-table-scroll');
  scrollWrap.append(table);

  block.textContent = '';
  block.append(scrollWrap);
}
