const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? '×' : '☰';
  });
}

const galleryImages = Array.from(document.querySelectorAll('.collection-photos img'));

if (galleryImages.length > 0) {
  const lightbox = document.createElement('dialog');
  lightbox.className = 'photo-lightbox';
  lightbox.setAttribute('aria-label', 'Expanded gallery photo');
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close photo viewer">×</button>
    <button class="lightbox-arrow lightbox-previous" type="button" aria-label="Previous photo">‹</button>
    <figure>
      <img class="lightbox-image" alt="">
      <figcaption class="lightbox-caption"></figcaption>
    </figure>
    <button class="lightbox-arrow lightbox-next" type="button" aria-label="Next photo">›</button>
    <p class="lightbox-count" aria-live="polite"></p>
  `;
  document.body.append(lightbox);

  const expandedImage = lightbox.querySelector('.lightbox-image');
  const caption = lightbox.querySelector('.lightbox-caption');
  const count = lightbox.querySelector('.lightbox-count');
  let currentIndex = 0;

  function showPhoto(index) {
    currentIndex = (index + galleryImages.length) % galleryImages.length;
    const source = galleryImages[currentIndex];
    expandedImage.src = source.src;
    expandedImage.alt = source.alt;
    caption.textContent = source.closest('figure')?.querySelector('figcaption')?.textContent || source.alt;
    count.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
  }

  galleryImages.forEach((image, index) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', `Enlarge photo: ${image.alt}`);
    image.addEventListener('click', () => {
      showPhoto(index);
      lightbox.showModal();
    });
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showPhoto(index);
        lightbox.showModal();
      }
    });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.querySelector('.lightbox-previous').addEventListener('click', () => showPhoto(currentIndex - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(currentIndex + 1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showPhoto(currentIndex - 1);
    if (event.key === 'ArrowRight') showPhoto(currentIndex + 1);
  });
}
