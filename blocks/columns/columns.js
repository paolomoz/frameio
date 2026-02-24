import { createOptimizedPicture } from '../../scripts/aem.js';

const IMAGE_MAP = {
  'Workflow Management': '/images/feature-workflow.png',
  'File Management': '/images/feature-file-mgmt.png',
  'Review and Approval': '/images/feature-review.png',
  'Share and Present': '/images/feature-share.png',
  'Enterprise Security': '/images/enterprise-security.png',
  'Enterprise Scale': '/images/enterprise-scale.png',
  'Enterprise Support': '/images/feature-share.png',
  'Organize assets': '/images/feature-file-mgmt.png',
  'Connect teams': '/images/feature-workflow.png',
  'Move faster': '/images/feature-review.png',
};

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      let pic = col.querySelector('picture');

      // Handle broken images (about:error) from AEM pipeline
      if (!pic) {
        const img = col.querySelector('img');
        if (img) {
          const alt = img.alt || '';
          const mappedSrc = IMAGE_MAP[alt];
          if (mappedSrc || img.src.includes('about:error')) {
            const src = mappedSrc || '/images/feature-workflow.png';
            pic = createOptimizedPicture(src, alt, false);
            img.replaceWith(pic);
          }
        }
      }

      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
