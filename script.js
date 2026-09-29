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
attendance.addEventListener('change',()=>{const absent=attendance.value==='No';document.querySelectorAll('#guestCount, input[name="events"], #foodPreference, #travelHelp').forEach(el=>{el.disabled=absent});});
// Download one calendar file containing all five celebrations.
const saveWeekend=document.createElement('button');saveWeekend.type='button';saveWeekend.className='royal-btn';saveWeekend.textContent='Save all events';document.querySelector('.events .section-heading').append(saveWeekend);
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
