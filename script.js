const gate = document.getElementById("invitationGate");
const openBtn = document.getElementById("openInvitation");
const music = document.getElementById("bgMusic");
const soundToggle = document.getElementById("soundToggle");
const pageMusicToggle = document.getElementById("pageMusicToggle");
let soundOn = false;
function syncMusicButtons(){const label=soundOn?"♫ Music On":"♪ Play Music";[soundToggle,pageMusicToggle].filter(Boolean).forEach(btn=>{btn.textContent=label;btn.setAttribute("aria-label",soundOn?"Pause background music":"Play background music")})}
openBtn?.addEventListener("click",()=>{gate.classList.add("opened");document.body.classList.remove("locked");setTimeout(()=>{gate.style.display="none"},1150)});
async function toggleMusic(e){e?.stopPropagation();if(music.paused){try{await music.play();soundOn=true}catch(_){soundOn=false}}else{music.pause();soundOn=false}syncMusicButtons()}
soundToggle?.addEventListener("click",toggleMusic);pageMusicToggle?.addEventListener("click",toggleMusic);syncMusicButtons();

// Countdown is anchored to the same absolute Kolkata instant for every guest worldwide.
function updateCountdown(){const el=document.getElementById("countdown");if(!el)return;const target=Date.parse(el.dataset.date);const diff=Math.max(0,target-Date.now());const sec=Math.floor(diff/1000);document.getElementById("days").textContent=String(Math.floor(sec/86400)).padStart(2,"0");document.getElementById("hours").textContent=String(Math.floor((sec%86400)/3600)).padStart(2,"0");document.getElementById("minutes").textContent=String(Math.floor((sec%3600)/60)).padStart(2,"0");document.getElementById("seconds").textContent=String(sec%60).padStart(2,"0")}
updateCountdown();setInterval(updateCountdown,1000);

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll(".reveal-on-scroll").forEach(el=>observer.observe(el));
function makePetal(){if(document.hidden||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const p=document.createElement("i");p.className="petal";p.style.left=Math.random()*100+"vw";p.style.animationDuration=(9+Math.random()*7)+"s";p.style.setProperty("--drift",(-70+Math.random()*140)+"px");p.style.transform=`rotate(${Math.random()*360}deg) scale(${.55+Math.random()*.5})`;document.getElementById("petals")?.appendChild(p);setTimeout(()=>p.remove(),16500)}
setInterval(makePetal,1500);for(let i=0;i<4;i++)setTimeout(makePetal,i*450);

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
  const attending=events.length?events.join("; "):"Not selected / not sure yet";
  const help=v("travelHelp")==="Yes"?"Yes — I would like assistance with travel/stay arrangements.":"No";
  const plain=`Wedding RSVP\n\nName: ${v("guestName")}\nGuests: ${v("guestCount")}\nCelebrations: ${attending}\nFood: ${v("foodPreference")}\nStay / travel help: ${help}\nMessage: ${v("guestMessage")||"-"}`;
  window.open(`https://wa.me/918256995690?text=${encodeURIComponent(plain)}`,"_blank","noopener");
  document.getElementById("formStatus").textContent="Opening WhatsApp…";
});
