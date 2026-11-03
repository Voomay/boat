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
    const opened = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(opened));
    menu.setAttribute('aria-label', opened ? 'Close menu' : 'Open menu');
    menu.textContent = opened ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => {
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

// Pre-select boat from query parameter if provided
const params = new URLSearchParams(window.location.search);
const boatParam = params.get('boat');
if (boatParam) {
  const select = document.querySelector('#contact-boat-select');
  if (select) {
    Array.from(select.options).forEach((opt, idx) => {
      if (opt.value.toLowerCase().includes(boatParam.toLowerCase())) {
        select.selectedIndex = idx;
      }
    });
  }
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

document.querySelector('#contact-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const fields = ['name', 'email', 'phone', 'boat', 'rooms', 'decks', 'timeline', 'budget', 'vision'];
  const text = [
    'MK LEISURE — CUSTOM BOAT BRIEF & CONTACT ENQUIRY',
    '================================================',
    '',
    ...fields.map(key => `${key[0].toUpperCase() + key.slice(1)}: ${data.get(key) || 'Not provided'}`),
    '',
    'This custom boat brief has been prepared for sharing with MK Leisure.'
  ].join('\n');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mk-leisure-contact-enquiry.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  const statusEl = document.querySelector('#contact-status');
  if (statusEl) {
    statusEl.textContent = 'Your custom boat brief is ready to download. Share it with the MK Leisure team to start your journey.';
    renderStatusActions(statusEl, text, `Custom Boat Enquiry — ${data.get('name') || 'MK Leisure'}`);
  }
});
