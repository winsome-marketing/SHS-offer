const form = document.getElementById('quoteForm');
const dropdown = document.getElementById('categoryDropdown');
const toggle = document.getElementById('interestToggle');
const menu = document.getElementById('interestMenu');
const summary = document.getElementById('interestSummary');
const error = document.getElementById('interestError');
const checkboxes = [...menu.querySelectorAll('input[name="interest"]')];
function updateSelected() {
  const selected=checkboxes.filter(x=>x.checked).map(x=>x.value);
  summary.textContent = selected.length ? (selected.length===1 ? selected[0] : `${selected.length} categories selected`) : 'Select supply categories';
  dropdown.classList.toggle('selected', selected.length>0);
  error.hidden = true;
  dropdown.classList.remove('invalid');
}
function setOpen(open) { menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));dropdown.classList.toggle('open',open); }
toggle.addEventListener('click',()=>setOpen(menu.hidden));
checkboxes.forEach(x=>x.addEventListener('change',updateSelected));
document.addEventListener('click',e=>{if(!dropdown.contains(e.target))setOpen(false)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
function selectCategory(category) {
 const match=checkboxes.find(x=>x.value===category);
 if(match){match.checked=true;updateSelected();setOpen(false)}
}
document.querySelectorAll('.btn-card[data-category]').forEach(link=>{
 link.addEventListener('click',()=>selectCategory(link.dataset.category));
});
document.querySelectorAll('.btn-industry[data-industry]').forEach(link=>{
 link.addEventListener('click',()=>{
   const message=document.getElementById('message');
   const context=`Sector: ${link.dataset.industry}`;
   if(!message.value.includes(context)) message.value=message.value.trim()?`${message.value.trim()}\n${context}`:context;
 });
});
form.addEventListener('submit',e=>{
 e.preventDefault();
 if(!form.reportValidity()) return;
 const categories=checkboxes.filter(x=>x.checked).map(x=>x.value);
 if(!categories.length){error.hidden=false;dropdown.classList.add('invalid');toggle.focus();setOpen(true);return;}
 const val=id=>document.getElementById(id).value.trim();
 const lines=['SHS TRADING — 50% OCTOBER BUSINESS OFFER','',`Company: ${val('company')}`,`Contact: ${val('person')}`,`Email: ${val('email')}`,`Phone / WhatsApp: ${val('phone')}`,'','SUPPLY CATEGORIES:',...categories.map(c=>`- ${c}`),'','REQUIREMENTS / ESTIMATED QUANTITIES:',val('message')||'Not specified','','October offer ends 31 October 2026.'];
 const subject=`SHS Trading | Business Quote Request | ${val('company')}`;
 window.location.href=`mailto:info@sajahospitality.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
 document.getElementById('announce').textContent='Your email draft is being prepared. Send the email to complete your enquiry.';
});

// Continuous, user-controllable marquee. One card per distinct product type; duplicate DOM set only to loop seamlessly.
const viewport=document.getElementById('tickerViewport');
const track=document.getElementById('tickerTrack');
const original=[...track.children];
original.forEach(card=>{const clone=card.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.querySelectorAll('img').forEach(img=>img.loading='lazy');track.appendChild(clone)});
let position=0;let playing=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let hover=false,dragging=false,downX=0,startPosition=0,last=0;
const toggleMotion=document.getElementById('tickerToggle');
const totalWidth=()=>{const el=original[0];return track.children[original.length].offsetLeft-el.offsetLeft};
function render(){const total=totalWidth();if(!total)return;position=((position%total)+total)%total;track.style.transform=`translate3d(${-position}px,0,0)`}
function refreshButton(){toggleMotion.textContent=playing?'Ⅱ':'▶';toggleMotion.setAttribute('aria-label',playing?'Pause automatic product scrolling':'Resume automatic product scrolling');toggleMotion.setAttribute('aria-pressed',String(!playing))}
function tick(time){if(last && playing && !hover && !dragging){position+=(Math.min(50,time-last)*0.025);render()}last=time;requestAnimationFrame(tick)}
function move(amount){playing=false;refreshButton();position+=amount;render()}
document.getElementById('tickerPrev').addEventListener('click',()=>move(-290));
document.getElementById('tickerNext').addEventListener('click',()=>move(290));
toggleMotion.addEventListener('click',()=>{playing=!playing;refreshButton()});
viewport.addEventListener('mouseenter',()=>hover=true);
viewport.addEventListener('mouseleave',()=>{hover=false;dragging=false});
viewport.addEventListener('pointerdown',e=>{dragging=true;downX=e.clientX;startPosition=position;viewport.setPointerCapture(e.pointerId)});
viewport.addEventListener('pointermove',e=>{if(!dragging)return;position=startPosition-(e.clientX-downX);render()});
viewport.addEventListener('pointerup',()=>{if(dragging){dragging=false;playing=false;refreshButton()}});
window.addEventListener('resize',render);
refreshButton();requestAnimationFrame(tick);
