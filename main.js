const $=(s,c=document)=>c.querySelector(s);const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const header=$('#siteHeader'),progress=$('#progress'),menuToggle=$('#menuToggle'),mobileMenu=$('#mobileMenu'),modal=$('#bookingModal'),bookingForm=$('#bookingForm'),formError=$('#formError');
function onScroll(){const y=window.scrollY;header?.classList.toggle('scrolled',y>24);if(progress){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?Math.min(100,y/max*100):0)+'%'}}
addEventListener('scroll',onScroll,{passive:true});onScroll();
function setMenu(open){menuToggle?.classList.toggle('open',open);menuToggle?.setAttribute('aria-expanded',String(open));mobileMenu?.classList.toggle('open',open);mobileMenu?.setAttribute('aria-hidden',String(!open));document.body.classList.toggle('no-scroll',open)}
menuToggle?.addEventListener('click',()=>setMenu(!mobileMenu.classList.contains('open')));$$('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
const reveals=$$('.reveal');if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});reveals.forEach(el=>io.observe(el))}else reveals.forEach(el=>el.classList.add('in'));
function setModal(open){if(open)setMenu(false);modal?.classList.toggle('open',open);modal?.setAttribute('aria-hidden',String(!open));document.body.classList.toggle('no-scroll',open);if(open)setTimeout(()=>$('#checkin')?.focus(),80)}
$$('.js-book').forEach(b=>b.addEventListener('click',()=>{const requested=b.dataset.room;if(requested&&$('#roomtype'))$('#roomtype').value=requested;setModal(true)}));$$('[data-close-modal]').forEach(b=>b.addEventListener('click',()=>setModal(false)));
const today=new Date();const localToday=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().split('T')[0];const ci=$('#checkin'),co=$('#checkout');if(ci){ci.min=localToday;ci.addEventListener('change',()=>{if(co){co.min=ci.value||localToday;if(co.value&&co.value<=ci.value)co.value=''}})}if(co)co.min=localToday;
bookingForm?.addEventListener('submit',e=>{e.preventDefault();formError.textContent='';if(!ci.value||!co.value){formError.textContent='Please choose both check-in and check-out dates.';return}if(new Date(co.value)<=new Date(ci.value)){formError.textContent='Check-out must be after check-in.';return}const room=$('#roomtype').value,guests=$('#guests').value;const msg=`Hello Mount Edge Hotel, I would like to check availability.\n\nCheck-in: ${ci.value}\nCheck-out: ${co.value}\nRoom: ${room}\nGuests: ${guests}`;window.open('https://wa.me/94777659300?text='+encodeURIComponent(msg),'_blank','noopener')});
const yr=$('#year');if(yr)yr.textContent=new Date().getFullYear();

// Dedicated gallery lightbox
const lightbox=$('#lightbox'), lightboxImage=$('#lightboxImage'), lightboxCaption=$('#lightboxCaption');
$$('[data-lightbox]').forEach(item=>{const open=()=>{
  const img=$('img',item); if(!lightbox||!img)return;
  lightboxImage.src=img.src; lightboxImage.alt=img.alt; lightboxCaption.textContent=$('figcaption',item)?.textContent||'';
  lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false'); document.body.classList.add('no-scroll');
}; item.addEventListener('click',open); item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});
function closeLightbox(){if(!lightbox)return;lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll')}
$$('[data-close-lightbox]').forEach(el=>el.addEventListener('click',closeLightbox));

// Hide floating booking actions while the footer is visible so footer links and credits remain unobstructed.
const siteFooter=document.querySelector('footer');
if(siteFooter&&'IntersectionObserver' in window){
  const footerObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>document.body.classList.toggle('footer-in-view',entry.isIntersecting));
  },{threshold:0.03});
  footerObserver.observe(siteFooter);
}

// Keyboard: Escape closes overlays; Tab stays inside open dialogs; focus returns to opener
let opener=null;
document.addEventListener('click',e=>{const b=e.target.closest('.js-book,[data-lightbox]');if(b)opener=b},true);
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){setModal(false);setMenu(false);closeLightbox();opener?.focus?.()}
  if(e.key==='Tab'){const dlg=[modal,lightbox,mobileMenu].find(d=>d&&(d.classList.contains('open')));if(!dlg)return;
    const f=$$('a[href],button:not([disabled]),input,select,textarea',dlg).filter(x=>x.offsetParent!==null);if(!f.length)return;
    const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}
});
