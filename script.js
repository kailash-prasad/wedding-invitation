const gate = document.getElementById("invitationGate");
const openBtn = document.getElementById("openInvitation");
const music = document.getElementById("bgMusic");
const soundToggle = document.getElementById("soundToggle");
let soundOn = false;

openBtn.addEventListener("click", async () => {
  gate.classList.add("opened");
  document.body.classList.remove("locked");
  try { await music.play(); soundOn = true; soundToggle.textContent = "♫ Sound On"; }
  catch (e) { soundOn = false; soundToggle.textContent = "♪ Sound Off"; }
  setTimeout(() => gate.style.display = "none", 1150);
});

soundToggle.addEventListener("click", async (e) => {
  e.stopPropagation();
  if (music.paused) { try { await music.play(); soundOn = true; } catch(e) {} }
  else { music.pause(); soundOn = false; }
  soundToggle.textContent = soundOn ? "♫ Sound On" : "♪ Sound Off";
});

function updateCountdown() {
  const targetEl = document.getElementById("countdown");
  const target = new Date(targetEl.dataset.date).getTime();
  const diff = Math.max(0, target - Date.now());
  const sec = Math.floor(diff / 1000);
  document.getElementById("days").textContent = String(Math.floor(sec / 86400)).padStart(2,"0");
  document.getElementById("hours").textContent = String(Math.floor((sec % 86400) / 3600)).padStart(2,"0");
  document.getElementById("minutes").textContent = String(Math.floor((sec % 3600) / 60)).padStart(2,"0");
  document.getElementById("seconds").textContent = String(sec % 60).padStart(2,"0");
}
updateCountdown(); setInterval(updateCountdown, 1000);

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
}), {threshold: .14});
document.querySelectorAll(".reveal-on-scroll").forEach(el => observer.observe(el));

function makePetal() {
  if (document.hidden) return;
  const p = document.createElement("i"); p.className = "petal";
  p.style.left = Math.random() * 100 + "vw";
  p.style.animationDuration = (7 + Math.random() * 7) + "s";
  p.style.setProperty("--drift", (-80 + Math.random() * 160) + "px");
  p.style.transform = `rotate(${Math.random()*360}deg) scale(${.65 + Math.random()*.7})`;
  document.getElementById("petals").appendChild(p); setTimeout(() => p.remove(), 14500);
}
setInterval(makePetal, 800); for(let i=0;i<7;i++) setTimeout(makePetal, i*220);

const dialog = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
document.querySelectorAll(".gallery-item img").forEach(img => img.parentElement.addEventListener("click", () => {
  lightboxImage.src = img.src; lightboxImage.alt = img.alt; dialog.showModal();
}));
document.getElementById("closeLightbox").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", e => { if(e.target === dialog) dialog.close(); });

document.getElementById("rsvpForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("guestName").value.trim();
  const count = document.getElementById("guestCount").value;
  const d1 = document.getElementById("dayOne").value;
  const d2 = document.getElementById("dayTwo").value;
  const food = document.getElementById("foodPreference").value;
  const help = document.getElementById("travelHelp").value;
  const note = document.getElementById("guestMessage").value.trim();
  const text = `Wedding RSVP%0A%0AName: ${encodeURIComponent(name)}%0AGuests: ${encodeURIComponent(count)}%0A4 December: ${encodeURIComponent(d1)}%0A5 December: ${encodeURIComponent(d2)}%0AFood: ${encodeURIComponent(food)}%0AStay/Travel Help: ${encodeURIComponent(help)}%0AMessage: ${encodeURIComponent(note || "-")}`;
  // IMPORTANT: replace 919999999999 with your WhatsApp number including country code.
  window.open(`https://wa.me/919999999999?text=${text}`, "_blank", "noopener");
  document.getElementById("formStatus").textContent = "Opening WhatsApp…";
});
