/**
 * FAQ accordion block using native <details>/<summary> for accessibility.
 * Authored rows: odd rows = question, even rows = answer.
 * Smooth height transition, rotating chevron icon.
 *
 * @param {Element} block The faq block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrapper = document.createElement('div');
  wrapper.classList.add('faq-list');

  /* pair rows: odd = question, even = answer */
  for (let i = 0; i < rows.length; i += 2) {
    const questionRow = rows[i];
    const answerRow = rows[i + 1];
    if (!questionRow) break;

    const details = document.createElement('details');
    details.classList.add('faq-item');

    const summary = document.createElement('summary');
    summary.classList.add('faq-question');

    const questionText = document.createElement('span');
    questionText.classList.add('faq-question-text');
    questionText.innerHTML = questionRow.textContent.trim();
    summary.append(questionText);

    /* chevron icon */
    const chevron = document.createElement('span');
    chevron.classList.add('faq-chevron');
    chevron.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    summary.append(chevron);

    details.append(summary);

    /* answer content */
    const answer = document.createElement('div');
    answer.classList.add('faq-answer');
    if (answerRow) {
      answer.innerHTML = answerRow.innerHTML;
    }

    /* inner wrapper for height animation */
    const answerInner = document.createElement('div');
    answerInner.classList.add('faq-answer-inner');
    answerInner.innerHTML = answer.innerHTML;
    answer.innerHTML = '';
    answer.append(answerInner);

    details.append(answer);
    wrapper.append(details);

    /* smooth open/close animation */
    let animation = null;

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (animation) animation.cancel();

      if (details.open) {
        /* closing */
        const startHeight = `${details.offsetHeight}px`;
        const endHeight = `${summary.offsetHeight}px`;
        animation = details.animate(
          { height: [startHeight, endHeight] },
          { duration: 250, easing: 'ease' },
        );
        animation.onfinish = () => {
          details.open = false;
          animation = null;
        };
        animation.oncancel = () => { animation = null; };
      } else {
        /* opening */
        details.open = true;
        const startHeight = `${summary.offsetHeight}px`;
        const endHeight = `${details.scrollHeight}px`;
        animation = details.animate(
          { height: [startHeight, endHeight] },
          { duration: 250, easing: 'ease' },
        );
        animation.onfinish = () => { animation = null; };
        animation.oncancel = () => { animation = null; };
      }
    });
  }

  block.textContent = '';
  block.append(wrapper);
}
