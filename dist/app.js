const boatSpaces = [
  { name: 'Upper Deck & Sunset Terrace', image: 'assets/terrace.webp', description: 'Open-air rooftop sky-lounge with sunbeds, built-in braai station, bar counter and 360-degree views.' },
  { name: 'Open-Plan Lounge & Chef’s Galley', image: 'assets/interior-lounge.jpg', description: 'Sunlit residential salon and full island kitchen framed by floor-to-ceiling sliding glass doors.' },
  { name: 'Panoramic Private Bedrooms', image: 'assets/interior-bedroom.jpg', description: 'Configure 2 to 4 custom timber-lined bedrooms with water-level windows and built-in wardrobes.' },
  { name: 'Luxury En-Suite Bathrooms', image: 'assets/interior-bathroom.jpg', description: 'Apartment-grade bathrooms with frameless rainfall showers, stone vanities and off-grid marine sanitation.' }
];

const heroPhotos = [
  'assets/hero.webp',
  'assets/houseboat.webp',
  'assets/terrace.webp',
  'assets/interior-lounge.jpg',
  'assets/interior-bedroom.jpg'
];

const quote = document.querySelector('#quote');
const gallery = document.querySelector('#gallery');
let currentBoat = 0;
let heroSlide = 0;

function openQuote(index) {
  if (gallery?.open) gallery.close();
  if (Number.isInteger(index) && document.querySelector('[name="boat"]')) {
    document.querySelector('[name="boat"]').selectedIndex = index;
  }
  const status = document.querySelector('#form-status');
  if (status) status.textContent = '';
  quote?.showModal();
}

document.querySelectorAll('[data-quote]').forEach(button => {
  button.addEventListener('click', () => openQuote());
});

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        dialog.close();
      }
    }
  });
});

function updateGallery() {
  if (!gallery) return;
  const space = boatSpaces[currentBoat];
  document.querySelector('#gallery-title').textContent = space.name;
  document.querySelector('#gallery-image').src = space.image;
  document.querySelector('#gallery-image').alt = space.name;
  document.querySelector('#gallery-description').textContent = space.description;
  document.querySelector('#gallery-counter').textContent = `${currentBoat + 1} / ${boatSpaces.length}`;
}

function showGallery(index = 0) {
  currentBoat = index;
  updateGallery();
  gallery?.showModal();
}

document.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click', () => showGallery()));
document.querySelectorAll('[data-boat]').forEach(button => button.addEventListener('click', () => showGallery(Number(button.dataset.boat))));
document.querySelector('#gallery-prev')?.addEventListener('click', () => { currentBoat = (currentBoat + boatSpaces.length - 1) % boatSpaces.length; updateGallery(); });
document.querySelector('#gallery-next')?.addEventListener('click', () => { currentBoat = (currentBoat + 1) % boatSpaces.length; updateGallery(); });
document.querySelector('#gallery-quote')?.addEventListener('click', () => openQuote(currentBoat));

document.querySelectorAll('[data-slide]').forEach(button => {
  button.addEventListener('click', () => {
    heroSlide = (heroSlide + Number(button.dataset.slide) + heroPhotos.length) % heroPhotos.length;
    const photo = document.querySelector('.hero-photo');
    if (photo) {
      photo.style.backgroundImage = `url('${heroPhotos[heroSlide]}')`;
      photo.style.backgroundSize = 'cover';
      photo.style.backgroundPosition = 'center';
    }
  });
});

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.header nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(opened));
    menu.setAttribute('aria-label', opened ? 'Close menu' : 'Open menu');
    menu.textContent = opened ? '×' : '☰';
  });
  nav.querySelectorAll('a,button').forEach(item => {
    item.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.textContent = '☰';
      menu.setAttribute('aria-label', 'Open menu');
    });
  });
}

document.querySelector('#quote-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const fields = ['name', 'email', 'phone', 'boat', 'rooms', 'timeline', 'vision'];
  const content = [
    'MK LEISURE — CUSTOM BOAT BRIEF & ENQUIRY',
    '========================================',
    '',
    ...fields.map(key => `${key[0].toUpperCase() + key.slice(1)}: ${data.get(key) || 'Not provided'}`),
    '',
    'Prepared for sharing with MK Leisure. This brief has been downloaded to your device.'
  ].join('\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mk-leisure-custom-boat-brief.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector('#form-status').textContent = 'Your custom boat brief is ready to download. Share it with the MK Leisure team to start building your boat.';
});
