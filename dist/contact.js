const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.header nav');
if (menu && nav) {
  menu.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(opened));
    menu.setAttribute('aria-label', opened ? 'Close menu' : 'Open menu');
    menu.textContent = opened ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open menu');
      menu.textContent = '☰';
    });
  });
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
  document.querySelector('#contact-status').textContent = 'Your custom boat brief is ready to download. Share it with the MK Leisure team to start your journey.';
});
