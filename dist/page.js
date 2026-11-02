const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.header nav');

if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a, button').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open menu');
      menu.textContent = '☰';
    });
  });
}

// Custom Boat Modal on Our Boats & Gallery pages
const quoteDialog = document.querySelector('#quote');
if (quoteDialog) {
  document.querySelectorAll('[data-quote]').forEach(btn => {
    btn.addEventListener('click', () => {
      const boatType = btn.getAttribute('data-quote');
      const roomsType = btn.getAttribute('data-rooms');
      const boatSelect = document.querySelector('#modal-boat-select');
      const roomsSelect = document.querySelector('#modal-rooms-select');
      if (boatType && boatSelect) {
        Array.from(boatSelect.options).forEach((opt, idx) => {
          if (opt.value === boatType || opt.textContent === boatType) boatSelect.selectedIndex = idx;
        });
      }
      if (roomsType && roomsSelect) {
        Array.from(roomsSelect.options).forEach((opt, idx) => {
          if (opt.value === roomsType || opt.textContent === roomsType) roomsSelect.selectedIndex = idx;
        });
      }
      const status = document.querySelector('#form-status');
      if (status) status.textContent = '';
      quoteDialog.showModal();
    });
  });

  quoteDialog.querySelector('.close')?.addEventListener('click', () => quoteDialog.close());
  quoteDialog.addEventListener('click', event => {
    if (event.target === quoteDialog) {
      const rect = quoteDialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        quoteDialog.close();
      }
    }
  });

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
    document.querySelector('#form-status').textContent = 'Your custom boat brief has been downloaded. Share it with the MK Leisure team to start creating your boat.';
  });
}

// Gallery category filters on gallery.html
const filterPills = document.querySelectorAll('[data-filter]');
const galleryItems = document.querySelectorAll('.gallery-item');
if (filterPills.length && galleryItems.length) {
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const category = pill.getAttribute('data-filter');
      filterPills.forEach(p => {
        const active = p === pill;
        p.classList.toggle('active', active);
        p.setAttribute('aria-selected', String(active));
      });
      galleryItems.forEach(item => {
        const categories = (item.getAttribute('data-category') || '').split(/\s+/);
        const match = category === 'all' || categories.includes(category);
        item.classList.toggle('hidden', !match);
      });
    });
  });
}

// Interactive Inside/Outside Lightbox when clicking any gallery image
const lightbox = document.querySelector('#gallery-lightbox');
if (lightbox) {
  const lightboxTitle = document.querySelector('#lightbox-title');
  const lightboxImg = document.querySelector('#lightbox-img');
  const roomTabs = lightbox.querySelectorAll('[data-room-view]');
  let activeOutsideImg = 'assets/hero-boat.webp';

  const roomImages = {
    inside: 'assets/interior-lounge.jpg',
    bedrooms: 'assets/interior-bedroom.jpg',
    toilet: 'assets/interior-bathroom.jpg'
  };

  function setRoomView(view) {
    roomTabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-room-view') === view);
    });
    if (view === 'outside') {
      lightboxImg.src = activeOutsideImg;
      lightboxImg.alt = 'Outside view';
    } else if (roomImages[view]) {
      lightboxImg.src = roomImages[view];
      lightboxImg.alt = `${view} view`;
    }
  }

  document.querySelectorAll('.gallery-photo-only').forEach(card => {
    card.addEventListener('click', () => {
      activeOutsideImg = card.getAttribute('data-outside-img') || card.querySelector('img')?.getAttribute('src') || 'assets/hero-boat.webp';
      const title = card.getAttribute('data-boat-title') || 'Custom Houseboat';
      const initialView = card.getAttribute('data-initial-view') || 'inside';
      if (lightboxTitle) lightboxTitle.textContent = title;
      // When clicking an outside boat photo, show its inside right away or let user switch tabs
      const targetView = initialView === 'outside' ? 'inside' : initialView;
      setRoomView(targetView);
      lightbox.showModal();
    });
  });

  roomTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setRoomView(tab.getAttribute('data-room-view'));
    });
  });

  lightbox.querySelector('.close')?.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) {
      const rect = lightbox.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        lightbox.close();
      }
    }
  });
}
