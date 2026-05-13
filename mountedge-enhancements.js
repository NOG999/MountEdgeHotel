/* Mount Edge Hotel UI Enhancements
   Safe script notes:
   - No eval()
   - No document.write()
   - No hidden network requests
   - No cookies/localStorage tracking
   - Only redirects users when they click booking/WhatsApp controls
*/

(function () {
  'use strict';

  const HOTEL_PHONE = '94777659300';
  const BOOKING_PAGE = '/booking/';

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'me-scroll-progress';
    document.body.appendChild(bar);

    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  function initRevealAnimations() {
    const targets = $$('section, .room-card, .room-card-3d, .pricing-card, .facility-card, .attraction-card, .feature-card, .feat-item, .welcome-img-wrap, .welcome-text');
    targets.forEach((el) => el.classList.add('reveal-ready'));

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('reveal-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el) => observer.observe(el));
  }

  function initFaqAccordion() {
    const buttons = $$('.faq-q, .faq-question, [data-faq-question]');
    buttons.forEach((button) => {
      button.setAttribute('type', 'button');
      button.setAttribute('aria-expanded', 'false');
      const item = button.closest('.faq-item') || button.parentElement;
      const answer = $('.faq-a, .faq-answer, [data-faq-answer]', item);
      if (answer) answer.setAttribute('aria-hidden', 'true');

      button.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open') || item.classList.contains('open');

        // Close siblings for cleaner UX
        $$('.faq-item').forEach((sibling) => {
          if (sibling !== item) {
            sibling.classList.remove('is-open', 'open');
            const siblingButton = $('.faq-q, .faq-question, [data-faq-question]', sibling);
            const siblingAnswer = $('.faq-a, .faq-answer, [data-faq-answer]', sibling);
            if (siblingButton) siblingButton.setAttribute('aria-expanded', 'false');
            if (siblingAnswer) siblingAnswer.setAttribute('aria-hidden', 'true');
          }
        });

        item.classList.toggle('is-open', !isOpen);
        item.classList.toggle('open', !isOpen);
        button.setAttribute('aria-expanded', String(!isOpen));
        if (answer) answer.setAttribute('aria-hidden', String(isOpen));
      });
    });
  }

  function initBookingForm() {
    const form = $('.avail-form, .booking-form, form[data-booking-form]');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const checkin = $('#checkin')?.value || '';
      const checkout = $('#checkout')?.value || '';
      const roomType = $('#roomtype')?.value || 'Any Type';
      const guests = $('#guests')?.value || '';

      if (checkin && checkout && new Date(checkout) <= new Date(checkin)) {
        showFormNote(form, 'Please choose a check-out date after your check-in date.');
        return;
      }

      const message = [
        'Hello Mount Edge Hotel, I would like to check availability.',
        checkin ? `Check-in: ${checkin}` : '',
        checkout ? `Check-out: ${checkout}` : '',
        roomType ? `Room type: ${roomType}` : '',
        guests ? `Guests: ${guests}` : ''
      ].filter(Boolean).join('\n');

      const url = `https://wa.me/${HOTEL_PHONE}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      showFormNote(form, 'Opening WhatsApp with your booking details...');
    });
  }

  function showFormNote(form, text) {
    let note = $('.me-form-note', form);
    if (!note) {
      note = document.createElement('p');
      note.className = 'me-form-note';
      form.appendChild(note);
    }
    note.textContent = text;
  }

  function initFloatingCtas() {
    const whatsapp = document.createElement('a');
    whatsapp.className = 'me-whatsapp-float';
    whatsapp.href = `https://wa.me/${HOTEL_PHONE}?text=${encodeURIComponent('Hello Mount Edge Hotel, I would like to make a booking.')}`;
    whatsapp.target = '_blank';
    whatsapp.rel = 'noopener noreferrer';
    whatsapp.setAttribute('aria-label', 'Book on WhatsApp');
    whatsapp.innerHTML = '<span>☏</span><span>Book on WhatsApp</span>';
    document.body.appendChild(whatsapp);

    const mini = document.createElement('div');
    mini.className = 'me-mini-booking';
    mini.innerHTML = '<span>Planning a stay in Nuwara Eliya?</span><a href="' + BOOKING_PAGE + '">Book Now</a>';
    document.body.appendChild(mini);

    const update = () => {
      const visible = window.scrollY > 450;
      whatsapp.classList.toggle('is-visible', visible);
      mini.classList.toggle('is-visible', visible);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function initRippleEffects() {
    const targets = $$('a, button');
    targets.forEach((target) => {
      target.classList.add('me-ripple-target');
      target.addEventListener('click', (event) => {
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'me-ripple';
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        target.appendChild(ripple);
        window.setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  function initLightTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = $$('.room-card, .room-card-3d, .pricing-card, .facility-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 5;
        const rotateX = ((0.5 - (y / rect.height)) * 5);
        card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  function initBackToTop() {
    let button = $('#scrollTopBtn, .scroll-top-btn');
    if (!button) {
      button = document.createElement('button');
      button.className = 'scroll-top-btn';
      button.id = 'scrollTopBtn';
      button.textContent = '↑';
      button.setAttribute('aria-label', 'Scroll to top');
      document.body.appendChild(button);
    }

    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const update = () => {
      button.classList.toggle('visible', window.scrollY > 500);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function initFooterYear() {
    const currentYear = new Date().getFullYear();
    $$('footer, .footer-bottom').forEach((footer) => {
      footer.innerHTML = footer.innerHTML.replace(/©\s*20\d{2}/g, `© ${currentYear}`);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initRevealAnimations();
    initFaqAccordion();
    initBookingForm();
    initFloatingCtas();
    initRippleEffects();
    initLightTilt();
    initBackToTop();
    initFooterYear();
  });
})();
