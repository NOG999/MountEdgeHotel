(()=>{
const $=(s,c=document)=>c.querySelector(s);
const RATES={Single:[12000,15000,18000],Double:[15500,18500,24500],Triple:[18000,22500,26500]};
const MEALS=['Room only','Half board','Full board'];
const fmt=n=>'Rs. '+n.toLocaleString('en-US');
const room=$('#bRoom'),meal=$('#bMeal'),ci=$('#bCheckin'),co=$('#bCheckout');
function summary(){
  if(!room)return;
  const rate=RATES[room.value][MEALS.indexOf(meal.value)];
  const nights=ci.value&&co.value?Math.round((new Date(co.value)-new Date(ci.value))/864e5):0;
  $('#sRoom').textContent=room.value;$('#sMeal').textContent=meal.value;$('#sRate').textContent=fmt(rate);
  $('#sNights').textContent=nights>0?String(nights):'—';$('#sTotal').textContent=nights>0?fmt(rate*nights):'—';
}
if(room){
  const q=new URLSearchParams(location.search).get('room');
  if(q&&RATES[q])room.value=q; // whitelisted values only
  const t=new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
  ci.min=co.min=t;
  ci.addEventListener('change',()=>{co.min=ci.value||t;if(co.value&&co.value<=ci.value)co.value='';summary()});
  [co,room,meal].forEach(e=>e.addEventListener('change',summary));summary();
}
document.querySelectorAll('form.js-ajax').forEach(form=>{
  const status=$('.form-status',form),btn=$('button[type=submit]',form);
  const say=(m,c)=>{status.textContent=m;status.className='form-status '+c};
  form.addEventListener('submit',async e=>{
    e.preventDefault();say('','');
    form.querySelectorAll('[aria-invalid]').forEach(i=>i.removeAttribute('aria-invalid'));
    const bad=[...form.elements].find(el=>el.willValidate&&!el.checkValidity());
    if(bad){bad.setAttribute('aria-invalid','true');bad.focus();say('Please complete the highlighted field.','err');return}
    if(ci&&form.contains(ci)&&new Date(co.value)<=new Date(ci.value)){say('Check-out must be after check-in.','err');return}
    if(form.elements._gotcha&&form.elements._gotcha.value)return; // bot
    btn.disabled=true;say('Sending…','');
    try{
      const r=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      if(!r.ok)throw 0;
      form.reset();summary();say('Thank you — your message has been sent. We will reply shortly.','ok');
    }catch{say('Sorry, that did not send. Please call +94 77 765 9300 or use WhatsApp.','err')}
    finally{btn.disabled=false}
  });
});
})();
