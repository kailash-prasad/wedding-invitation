

const gate = document.getElementById("invitationGate");
const openBtn = document.getElementById("openInvitation");
const music = document.getElementById("bgMusic");
const soundToggle = document.getElementById("soundToggle");
const pageMusicToggle = document.getElementById("pageMusicToggle");
let soundOn = false;
// Keep the wedding soundtrack intentionally soft beneath the invitation.
music.volume = 0.18;
function syncMusicButtons(){const label=soundOn?"♫ Music On":"♪ Play Music";[soundToggle,pageMusicToggle].filter(Boolean).forEach(btn=>{btn.textContent=label;btn.setAttribute("aria-label",soundOn?"Pause background music":"Play background music")})}
openBtn?.addEventListener("click",()=>{gate.classList.add("opened");document.body.classList.remove("locked");setTimeout(()=>{gate.style.display="none"},1150)});
async function toggleMusic(e){e?.stopPropagation();if(music.paused){try{await music.play();soundOn=true}catch(_){soundOn=false}}else{music.pause();soundOn=false}syncMusicButtons()}
soundToggle?.addEventListener("click",toggleMusic);pageMusicToggle?.addEventListener("click",toggleMusic);syncMusicButtons();

// Countdown is anchored to the same absolute Kolkata instant for every guest worldwide.
function updateCountdown(){const el=document.getElementById("countdown");if(!el)return;const target=Date.parse(el.dataset.date);const diff=Math.max(0,target-Date.now());const sec=Math.floor(diff/1000);document.getElementById("days").textContent=String(Math.floor(sec/86400)).padStart(2,"0");document.getElementById("hours").textContent=String(Math.floor((sec%86400)/3600)).padStart(2,"0");document.getElementById("minutes").textContent=String(Math.floor((sec%3600)/60)).padStart(2,"0");document.getElementById("seconds").textContent=String(sec%60).padStart(2,"0")}
updateCountdown();setInterval(updateCountdown,1000);

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll(".reveal-on-scroll").forEach(el=>observer.observe(el));
// Gallery: tap/click, keyboard navigation and touch swipe.
const dialog=document.getElementById("lightbox"), lightboxImage=document.getElementById("lightboxImage");
const galleryImages=[...document.querySelectorAll(".gallery-item img")];
let galleryIndex=0, touchStartX=0;
function showGalleryImage(index){if(!galleryImages.length)return;galleryIndex=(index+galleryImages.length)%galleryImages.length;const img=galleryImages[galleryIndex];lightboxImage.src=img.currentSrc||img.src;lightboxImage.alt=img.alt}
galleryImages.forEach((img,i)=>img.parentElement.addEventListener("click",()=>{showGalleryImage(i);dialog.showModal()}));
document.getElementById("closeLightbox")?.addEventListener("click",()=>dialog.close());
document.getElementById("prevLightbox")?.addEventListener("click",()=>showGalleryImage(galleryIndex-1));
document.getElementById("nextLightbox")?.addEventListener("click",()=>showGalleryImage(galleryIndex+1));
dialog?.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
dialog?.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")showGalleryImage(galleryIndex-1);if(e.key==="ArrowRight")showGalleryImage(galleryIndex+1)});
dialog?.addEventListener("touchstart",e=>{touchStartX=e.changedTouches[0].clientX},{passive:true});
dialog?.addEventListener("touchend",e=>{const delta=e.changedTouches[0].clientX-touchStartX;if(Math.abs(delta)>45)showGalleryImage(galleryIndex+(delta<0?1:-1))},{passive:true});

// A deliberately short, WhatsApp-first RSVP — designed to take about 30 seconds.
const form=document.getElementById("rsvpForm");
form?.addEventListener("submit",e=>{
  e.preventDefault();
  const v=id=>document.getElementById(id)?.value?.trim?.() ?? document.getElementById(id)?.value ?? "";
  const events=[...form.querySelectorAll('input[name="events"]:checked')].map(x=>x.value);
  const attending=v("attendance")==="No"?"Not attending":events.length?events.join("; "):"Not selected / not sure yet";
  const help=v("attendance")!=="No" && v("travelHelp")==="Yes"?"Yes — I would like assistance with travel/stay arrangements.":"No";
  const plain=`Wedding RSVP\n\nAttendance: ${v("attendance")}\nName: ${v("guestName")}\nGuests: ${v("attendance")==="No"?"0":v("guestCount")}\nCelebrations: ${attending}\nFood: ${v("attendance")==="No"?"Not applicable":v("foodPreference")}\nStay / travel help: ${help}\nMessage: ${v("guestMessage")||"-"}`;
  window.open(`https://wa.me/918256995690?text=${encodeURIComponent(plain)}`,"_blank","noopener");
  document.getElementById("formStatus").textContent="Opening WhatsApp…";
});

const attendance=document.getElementById('attendance');
attendance?.addEventListener('change',()=>{const absent=attendance.value==='No';document.querySelectorAll('#guestCount, input[name="events"], #foodPreference, #travelHelp').forEach(el=>{el.disabled=absent});});
// Download one calendar file containing all five celebrations.
const saveWeekend=document.createElement('button');saveWeekend.type='button';saveWeekend.className='royal-btn';saveWeekend.textContent='Save all events';document.querySelector('.events .section-heading')?.append(saveWeekend);
saveWeekend.addEventListener('click',()=>{
 const esc=v=>String(v).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
 const utc=v=>new Date(Date.UTC(+v.slice(0,4),+v.slice(4,6)-1,+v.slice(6,8),+v.slice(9,11),+v.slice(11,13))-19800000).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Adwitia Kailash//Wedding//EN','CALSCALE:GREGORIAN'];
 document.querySelectorAll('.js-calendar').forEach((a,i)=>lines.push('BEGIN:VEVENT','UID:wedding-2026-'+i+'@kailashprasad.com','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''),'DTSTART:'+utc(a.dataset.start),'DTEND:'+utc(a.dataset.end),'SUMMARY:'+esc(a.dataset.title),'DESCRIPTION:'+esc(a.dataset.description),'LOCATION:Vedic Village Spa Resort\\, Kolkata','END:VEVENT'));
 lines.push('END:VCALENDAR');const u=URL.createObjectURL(new Blob([lines.join('\r\n')+'\r\n'],{type:'text/calendar;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='adwitia-kailash-wedding.ics';a.click();setTimeout(()=>URL.revokeObjectURL(u),10000);
});

function makePetal(){if(document.hidden||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const p=document.createElement("i");p.className="petal";p.style.left=Math.random()*100+"vw";p.style.animationDuration=(9+Math.random()*7)+"s";p.style.setProperty("--drift",(-70+Math.random()*140)+"px");p.style.transform=`rotate(${Math.random()*360}deg) scale(${.55+Math.random()*.5})`;document.getElementById("petals")?.appendChild(p);setTimeout(()=>p.remove(),16500)}
setInterval(makePetal,1500);for(let i=0;i<4;i++)setTimeout(makePetal,i*450);

// Golden Thread: a restrained line that draws as the invitation unfolds.
const threadPath=document.getElementById('threadPath');
function drawStoryThread(){if(!threadPath)return;const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);const progress=Math.min(1,Math.max(0,scrollY/max));threadPath.style.strokeDashoffset=String(1400-(1400*progress));}
addEventListener('scroll',drawStoryThread,{passive:true});addEventListener('resize',drawStoryThread,{passive:true});drawStoryThread();

// --- Ultimate wow pass: closed invitation, mantra choreography, illustrated programme ---
(function initInvitationCover(){
  if(!gate || gate.querySelector('.invitation-cover')) return;
  document.body.classList.add('cover-closed');
  const cover=document.createElement('div');
  cover.className='invitation-cover';
  cover.innerHTML=`<button class="invitation-envelope" type="button" aria-label="Open Adwitia and Kailash's wedding invitation"><span class="invitation-card-face"><span class="cover-monogram"><span>A</span><i>&amp;</i><span>K</span></span><span class="cover-tap">Tap to open</span></span><span class="cover-seal"><span>A &amp; K</span></span></button>`;
  gate.prepend(cover);
  const envelope=cover.querySelector('.invitation-envelope');
  const reveal=()=>{
    if(cover.classList.contains('is-opening')) return;
    document.body.classList.remove('cover-closed');
    cover.classList.add('is-opening');
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(()=>gate.classList.add('cover-revealed'),reduce?0:450);
    setTimeout(()=>cover.classList.add('is-gone'),reduce?0:800);
    setTimeout(()=>{cover.remove();openBtn?.focus({preventScroll:true});},reduce?0:1300);
  };
  envelope.addEventListener('click',reveal,{once:true});

})();

(function initMantraReveal(){
  const blessing=document.querySelector('.blessing');
  if(!blessing) return;
  if(!('IntersectionObserver' in window)){blessing.classList.add('mantra-visible');return;}
  const mantraObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('mantra-visible');mantraObserver.unobserve(entry.target)}}),{threshold:.28});
  mantraObserver.observe(blessing);
})();

const programmeIcons={
  mehendi:`<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M55 79c-4-9-3-17-1-28l3-21c1-6-7-8-9-2l-4 20 1-29c1-6-8-7-9-1l-1 29-3-25c-1-6-10-4-9 2l3 26-5-17c-2-6-10-3-8 3l7 25c3 12 11 20 23 22 5 1 9-1 12-4Z"/><path d="M32 57c-6-2-11-1-15 3M58 54c7-4 12-3 17 1M31 37c5 3 9 7 12 12M23 65c8 2 14 7 18 14"/><circle cx="37" cy="60" r="5"/><path d="M37 55c0-7 8-11 13-7M37 65c6 1 10 5 11 10"/></svg>`,
  sangeet:`<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M19 64c10-8 22-9 31-2 9 7 10 17 2 23-8 6-21 2-27-7-3-5-5-10-6-14Z"/><path d="M47 64 72 26M70 27l9-9M66 33l12 8M60 41l12 8M54 49l12 8"/><path d="M19 67c11 1 21 7 28 17"/><path d="M68 69c0-8 7-12 13-8 5 4 2 10-4 11-5 1-9 4-9 9"/><path d="M75 55v17"/></svg>`,
  bidhi:`<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M31 42h34M35 42c-2 16-1 29 13 36 14-7 15-20 13-36"/><path d="M38 35c2-9 9-15 10-23 2 8 9 14 10 23"/><path d="M29 39c5-7 11-10 19-8 8-2 14 1 19 8"/><path d="M40 56c5 4 11 4 16 0M39 66c6 5 12 5 18 0"/><path d="M24 83h48"/></svg>`,
  haldi:`<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M18 56c4 17 15 27 30 27s26-10 30-27H18Z"/><path d="M23 56c8-7 16-10 25-10s18 3 25 10"/><path d="M31 46c1-10 6-17 15-23 3 9 2 17-3 24M52 46c4-10 11-15 21-16-1 9-6 15-15 19"/><path d="M25 74h46"/><circle cx="48" cy="57" r="3"/></svg>`,
  wedding:`<svg viewBox="0 0 96 96" aria-hidden="true"><path d="M16 78h64M22 78V46M74 78V46M20 46h56M27 46c3-13 10-22 21-29 11 7 18 16 21 29"/><path d="M36 78V59h24v19M48 17v-7M40 24h16"/><path d="M31 46v-8M65 46v-8"/><path d="M39 59c2-5 5-8 9-11 4 3 7 6 9 11"/></svg>`
};
document.querySelectorAll('.event-card').forEach(card=>{
  const title=(card.querySelector('h3')?.textContent||'').toLowerCase();
  let icon=programmeIcons.wedding;
  if(title.includes('mehendi')) icon=programmeIcons.mehendi;
  else if(title.includes('sangeet')) icon=programmeIcons.sangeet;
  else if(title.includes('bidhi')) icon=programmeIcons.bidhi;
  else if(title.includes('haldi')||title.includes('holud')) icon=programmeIcons.haldi;
  const slot=card.querySelector('.event-icon'); if(slot) slot.innerHTML=icon;
});
