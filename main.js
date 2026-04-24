// ── NAV SCROLL ──
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  document.querySelector('.scroll-top')?.classList.toggle('show', window.scrollY > 400);
});

// ── MOBILE MENU ──
document.querySelector('.hamburger')?.addEventListener('click', () => {
  document.querySelector('.mobile-menu')?.classList.add('open');
});
document.querySelector('.mobile-close')?.addEventListener('click', () => {
  document.querySelector('.mobile-menu')?.classList.remove('open');
});

// ── NOTICE BANNER ──
document.querySelector('.notice-close')?.addEventListener('click', e => {
  e.target.closest('.notice-banner')?.remove();
});

// ── FAQ ACCORDION ──
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── SCROLL TO TOP ──
document.querySelector('.scroll-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── AVAILABILITY FORM ──
document.querySelector('.avail-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const ci = document.getElementById('checkin')?.value;
  const co = document.getElementById('checkout')?.value;
  const rt = document.getElementById('roomtype')?.value;
  if (!ci || !co) { alert('Please select check-in and check-out dates.'); return; }
  const params = new URLSearchParams({ checkin: ci, checkout: co, type: rt || '' });
  window.location.href = 'booking.html?' + params.toString();
});

// ── BOOKING PRICE CALCULATOR ──
function calcBooking() {
  const roomType = document.getElementById('b-roomtype')?.value || 'Double';
  const mealPlan = document.getElementById('b-meal')?.value || 'Room Only';
  const checkin = document.getElementById('b-checkin')?.value;
  const checkout = document.getElementById('b-checkout')?.value;

  const rates = {
    'Single': { 'Room Only': 12000, 'Half Board': 15000, 'Full Board': 18000 },
    'Double': { 'Room Only': 15500, 'Half Board': 18500, 'Full Board': 24500 },
    'Triple': { 'Room Only': 18000, 'Half Board': 22500, 'Full Board': 24500 },
  };

  let nights = 1;
  if (checkin && checkout) {
    const d = (new Date(checkout) - new Date(checkin)) / 86400000;
    if (d > 0) nights = d;
  }

  const pricePerNight = rates[roomType]?.[mealPlan] || 15500;
  const total = pricePerNight * nights;

  if (document.getElementById('sum-type')) document.getElementById('sum-type').textContent = roomType + ' Room';
  if (document.getElementById('sum-meal')) document.getElementById('sum-meal').textContent = mealPlan;
  if (document.getElementById('sum-nights')) document.getElementById('sum-nights').textContent = nights + (nights === 1 ? ' Night' : ' Nights');
  if (document.getElementById('sum-rate')) document.getElementById('sum-rate').textContent = 'Rs. ' + pricePerNight.toLocaleString();
  if (document.getElementById('sum-total')) document.getElementById('sum-total').textContent = 'Rs. ' + total.toLocaleString();
}

document.querySelectorAll('#b-roomtype, #b-meal, #b-checkin, #b-checkout').forEach(el => {
  el?.addEventListener('change', calcBooking);
});

// Pre-fill booking from URL params
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('type') && document.getElementById('b-roomtype')) {
  document.getElementById('b-roomtype').value = urlParams.get('type');
}
if (urlParams.get('checkin') && document.getElementById('b-checkin')) {
  document.getElementById('b-checkin').value = urlParams.get('checkin');
}
if (urlParams.get('checkout') && document.getElementById('b-checkout')) {
  document.getElementById('b-checkout').value = urlParams.get('checkout');
}
calcBooking();

// ── BOOKING FORM SUBMIT ──
document.getElementById('booking-form')?.addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('booking-success')?.style.setProperty('display', 'block');
  e.target.style.display = 'none';
});

// ── CONTACT FORM ──
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('contact-success')?.style.setProperty('display', 'block');
  e.target.style.display = 'none';
});

// ── GALLERY LIGHTBOX ──
const lightbox = document.getElementById('lightbox');
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => {
    if (lightbox) {
      lightbox.querySelector('img').src = img.src;
      lightbox.style.display = 'flex';
    }
  });
});
lightbox?.addEventListener('click', () => { lightbox.style.display = 'none'; });

// ── NEWSLETTER ──
document.querySelector('.newsletter-form')?.addEventListener('submit', e => {
  e.preventDefault();
  e.target.innerHTML = '<p style="color:white;font-size:1rem;">✓ Thank you for subscribing!</p>';
});

// ── SET MIN DATES ──
const today = new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type="date"]').forEach(el => el.setAttribute('min', today));
