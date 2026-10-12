// Approved suite: Earth Dawn opens and closes the story; Deep Galaxy frames its content.
const backgrounds = {
  cover: {theme:'earth', file:'earth-v1.webp'},
  interior: {theme:'galaxy', file:'galaxy-interior-v2.webp'},
  closing: {theme:'earth', file:'earth-closing-v1.webp'}
};

export function createCosmicBackground() {
  const layer = document.querySelector('#cosmic-background');
  const images = new Map();
  let request = 0;

  // Old comparison links now open the corresponding page of the approved presentation.
  const url = new URL(location.href);
  const previewPage = url.searchParams.get('background-page');
  if (previewPage === 'closing') url.hash = 'closing';
  else if (previewPage === 'cover') url.hash = 'intro';
  else if (previewPage === 'interior' && (!url.hash || url.hash === '#intro')) url.hash = 'company';
  if (url.searchParams.has('background') || url.searchParams.has('background-page')) {
    url.searchParams.delete('background');
    url.searchParams.delete('background-page');
    history.replaceState(null, '', url);
  }

  function getImage(page) {
    if (!images.has(page)) {
      const img = new Image();
      img.alt = '';
      img.className = 'cosmic-image';
      img.decoding = 'async';
      img.src = `./assets/cosmic-backgrounds/${backgrounds[page].file}`;
      images.set(page, img);
    }
    return images.get(page);
  }

  async function setChapter(kind) {
    const page = kind === 'intro' ? 'cover' : kind === 'closing' ? 'closing' : 'interior';
    const ticket = ++request;
    const img = getImage(page);
    document.body.dataset.cosmicBackground = backgrounds[page].theme;
    document.body.dataset.cosmicPage = page;
    try {
      await img.decode();
    } catch (error) {
      if (ticket === request) layer.replaceChildren();
      console.warn('Presentation background unavailable', error);
      return;
    }
    if (ticket !== request) return;
    layer.replaceChildren(img);
    // Only three small WebP files are needed for the entire presentation.
    Object.keys(backgrounds).forEach(getImage);
  }

  return {setChapter};
}
