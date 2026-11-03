const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.header nav');

function closeMobileMenu() {
  if (!menu || !nav) return;
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open menu');
  menu.textContent = '☰';
}

if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a, button').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  document.addEventListener('click', event => {
    if (nav.classList.contains('open') && !nav.contains(event.target) && !menu.contains(event.target)) {
      closeMobileMenu();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeMobileMenu();
      menu.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && nav.classList.contains('open')) {
      closeMobileMenu();
    }
  });
}

// Floating back-to-top visibility
const floatingTop = document.querySelector('.floating-top');
if (floatingTop) {
  window.addEventListener('scroll', () => {
    floatingTop.classList.toggle('visible', window.scrollY > 380);
  }, { passive: true });
}

// Sticky subnav scrollspy on Our Boat page (boats.html)
const subnavLinks = document.querySelectorAll('.fleet-subnav a[href^="#"]');
if (subnavLinks.length) {
  const sections = Array.from(subnavLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function updateActiveSubnav() {
    const scrollPos = window.scrollY + 180;
    let currentSection = sections[0];
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) {
        currentSection = sec;
      }
    });
    if (!currentSection) return;
    const activeId = `#${currentSection.id}`;
    subnavLinks.forEach(link => {
      const isMatch = link.getAttribute('href') === activeId;
      link.classList.toggle('active', isMatch);
    });
  }

  window.addEventListener('scroll', updateActiveSubnav, { passive: true });
}

function renderStatusActions(statusEl, content, subject) {
  if (!statusEl) return;
  const actionsWrap = document.createElement('div');
  actionsWrap.className = 'status-actions';

  const mailLink = document.createElement('a');
  mailLink.className = 'status-action-btn';
  mailLink.href = `mailto:info@mkleisure.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`;
  mailLink.textContent = 'Send via Email App →';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'status-action-btn';
  copyBtn.textContent = 'Copy Brief';
  copyBtn.addEventListener('click', () => {
    navigator.clipboard?.writeText(content).then(() => {
      copyBtn.textContent = 'Copied ✓';
      setTimeout(() => { copyBtn.textContent = 'Copy Brief'; }, 2200);
    });
  });

  actionsWrap.append(mailLink, copyBtn);
  statusEl.appendChild(actionsWrap);
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
    const statusEl = document.querySelector('#form-status');
    if (statusEl) {
      statusEl.textContent = 'Your custom boat brief has been downloaded. Share it with the MK Leisure team to start creating your boat.';
      renderStatusActions(statusEl, content, `Custom Boat Brief — ${data.get('name') || 'MK Leisure Enquiry'}`);
    }
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
  const roomTabs = Array.from(lightbox.querySelectorAll('[data-room-view]'));
  const roomOrder = ['outside', 'inside', 'bedrooms', 'toilet'];
  let activeOutsideImg = 'assets/hero-boat.webp';
  let currentRoomView = 'outside';

  const roomImages = {
    inside: 'assets/interior-lounge.jpg',
    bedrooms: 'assets/interior-bedroom.jpg',
    toilet: 'assets/interior-bathroom.jpg'
  };

  function setRoomView(view) {
    currentRoomView = view;
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
      const initialView = card.getAttribute('data-initial-view') || 'outside';
      if (lightboxTitle) lightboxTitle.textContent = title;
      setRoomView(initialView);
      lightbox.showModal();
    });
  });

  roomTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setRoomView(tab.getAttribute('data-room-view'));
    });
  });

  // Touch swipe inside lightbox stage on mobile
  const stage = lightbox.querySelector('.lightbox-stage');
  if (stage) {
    let startX = 0;
    let startY = 0;
    stage.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (!startX || e.changedTouches.length === 0) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        const idx = roomOrder.indexOf(currentRoomView);
        const nextIdx = (idx + (dx < 0 ? 1 : -1) + roomOrder.length) % roomOrder.length;
        setRoomView(roomOrder[nextIdx]);
      }
      startX = 0;
      startY = 0;
    }, { passive: true });
  }

  document.querySelector('#lightbox-quote')?.addEventListener('click', () => {
    lightbox.close();
    if (quoteDialog) {
      const status = document.querySelector('#form-status');
      if (status) status.textContent = '';
      quoteDialog.showModal();
    }
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
