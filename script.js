const loader = document.getElementById("loader");
const contador = document.getElementById("contador");
const finalmsg = document.getElementById("finalmsg");
const canvas = document.getElementById("heartFireworks");
const ctx = canvas.getContext("2d");
let particles = [];
let animationFrame;

function sizeCanvas(){
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio,0,0,window.devicePixelRatio,0,0);
}
window.addEventListener("resize", sizeCanvas);
sizeCanvas();

function createFloatingDecor(){
  const sky = document.querySelector(".love-sky");
  const petals = document.querySelector(".petal-field");
  for(let i=0;i<26;i++){
    const heart = document.createElement("span");
    heart.textContent = i % 3 === 0 ? "\u2661" : "\u2764";
    heart.style.left = Math.random()*100 + "vw";
    heart.style.animationDuration = 9 + Math.random()*12 + "s";
    heart.style.animationDelay = -Math.random()*12 + "s";
    heart.style.fontSize = 12 + Math.random()*22 + "px";
    sky.appendChild(heart);
  }
  for(let i=0;i<34;i++){
    const petal = document.createElement("span");
    petal.style.left = Math.random()*100 + "vw";
    petal.style.animationDuration = 7 + Math.random()*10 + "s";
    petal.style.animationDelay = -Math.random()*10 + "s";
    petal.style.opacity = .35 + Math.random()*.55;
    petals.appendChild(petal);
  }
}

function heartPoint(t, scale){
  const x = 16 * Math.pow(Math.sin(t),3);
  const y = -(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));
  return {x:x*scale,y:y*scale};
}

function launchHeartFirework(cx, cy, scale = 9){
  const colors = ["#ff477e", "#ff85a1", "#ffd166", "#ffffff", "#c9184a"];
  for(let i=0;i<120;i++){
    const t = (Math.PI*2*i)/120;
    const point = heartPoint(t, scale);
    particles.push({
      x:cx, y:cy,
      vx:point.x/(28+Math.random()*14),
      vy:point.y/(28+Math.random()*14),
      life:90 + Math.random()*25,
      age:0,
      size:1.5 + Math.random()*2.8,
      color:colors[Math.floor(Math.random()*colors.length)],
      sparkle:Math.random()>.72
    });
  }
}

function animateFireworks(){
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
  particles = particles.filter(p => p.age < p.life);
  particles.forEach(p => {
    p.age++;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += .012;
    const alpha = 1 - p.age/p.life;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.sparkle ? 18 : 8;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  if(particles.length){
    animationFrame = requestAnimationFrame(animateFireworks);
  }else{
    cancelAnimationFrame(animationFrame);
  }
}

function openingFireworks(){
  const w = window.innerWidth;
  const h = window.innerHeight;
  launchHeartFirework(w*.5, h*.32, Math.min(11, w/42));
  setTimeout(()=>launchHeartFirework(w*.28, h*.45, Math.min(7.5, w/58)), 430);
  setTimeout(()=>launchHeartFirework(w*.72, h*.44, Math.min(7.5, w/58)), 760);
  animateFireworks();
}

function startExperience(){
  const music = document.getElementById("music");
  music.play().catch(()=>{});
  document.getElementById("timeline").scrollIntoView({behavior:"smooth"});
  launchHeartFirework(window.innerWidth*.5, window.innerHeight*.36, Math.min(9, window.innerWidth/48));
  animateFireworks();
}

const start = new Date("2026-01-02T00:00:00");
function update(){
  const now = new Date();
  const diff = now - start;
  const d = Math.floor(diff/86400000);
  const h = Math.floor((diff%86400000)/3600000);
  const m = Math.floor((diff%3600000)/60000);
  contador.innerHTML = `${d} dias ${h} horas ${m} minutos \u2764`;
}
setInterval(update,1000);
update();

function hearts(){
  finalmsg.style.display = "block";
  for(let i=0;i<90;i++){
    const e = document.createElement("div");
    e.className = "burst-heart";
    e.textContent = i % 4 === 0 ? "\u2661" : "\u2764";
    e.style.left = "50vw";
    e.style.top = "58vh";
    e.style.setProperty("--x", (Math.random()*220-110) + "vw");
    e.style.setProperty("--y", (Math.random()*-90-18) + "vh");
    e.style.animationDelay = Math.random()*.35 + "s";
    document.body.appendChild(e);
    setTimeout(()=>e.remove(), 2200);
  }
  launchHeartFirework(window.innerWidth*.5, window.innerHeight*.38, Math.min(10, window.innerWidth/44));
  animateFireworks();
}

function revealOnScroll(){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.16});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

function initHistoryCarousel(){
  const carousel = document.querySelector(".history-carousel");
  const dotsWrap = document.querySelector(".history-dots");
  if(!carousel || !dotsWrap) return;
  const slides = [...carousel.querySelectorAll(".history-slide")];
  dotsWrap.innerHTML = "";
  const dots = slides.map((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ir al recuerdo ${index + 1}`);
    dot.addEventListener("click", () => slide.scrollIntoView({behavior:"smooth", inline:"center", block:"nearest"}));
    dotsWrap.appendChild(dot);
    return dot;
  });
  function setActive(){
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    let activeIndex = 0;
    let closest = Infinity;
    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(center - slideCenter);
      if(distance < closest){
        closest = distance;
        activeIndex = index;
      }
    });
    slides.forEach((slide, index) => slide.classList.toggle("is-active", index === activeIndex));
    dots.forEach((dot, index) => dot.classList.toggle("is-active", index === activeIndex));
  }
  carousel.addEventListener("scroll", () => requestAnimationFrame(setActive), {passive:true});
  window.addEventListener("resize", setActive);
  setActive();
}

function initMusicPlayer(){
  const music = document.getElementById("music");
  const playBtn = document.getElementById("playPauseBtn");
  const progress = document.getElementById("songProgress");
  const current = document.getElementById("currentTime");
  const remaining = document.getElementById("remainingTime");
  const rewind = document.getElementById("rewindBtn");
  const forward = document.getElementById("forwardBtn");
  const volume = document.getElementById("volumeControl");
  if(!music || !playBtn || !progress) return;
  music.volume = volume ? Number(volume.value) : .85;

  function formatTime(seconds){
    if(!Number.isFinite(seconds) || seconds < 0) seconds = 0;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2,"0");
    return `${minutes}:${secs}`;
  }
  function paintRange(){
    const duration = music.duration || 0;
    const percent = duration ? (music.currentTime / duration) * 100 : 0;
    progress.value = duration ? music.currentTime : 0;
    progress.max = duration || 100;
    progress.style.setProperty("--progress", `${percent}%`);
    if(current) current.textContent = formatTime(music.currentTime);
    if(remaining) remaining.textContent = `-${formatTime(duration - music.currentTime)}`;
  }
  function paintPlayState(){
    const playing = !music.paused;
    playBtn.classList.toggle("is-playing", playing);
    playBtn.setAttribute("aria-label", playing ? "Pausar cancion" : "Reproducir cancion");
  }
  playBtn.addEventListener("click", () => music.paused ? music.play().catch(()=>{}) : music.pause());
  progress.addEventListener("input", () => {
    music.currentTime = Number(progress.value);
    paintRange();
  });
  rewind?.addEventListener("click", () => { music.currentTime = Math.max(0, music.currentTime - 10); });
  forward?.addEventListener("click", () => { music.currentTime = Math.min(music.duration || music.currentTime + 10, music.currentTime + 10); });
  volume?.addEventListener("input", () => {
    music.volume = Number(volume.value);
    volume.style.setProperty("--volume", `${music.volume * 100}%`);
  });
  music.addEventListener("loadedmetadata", paintRange);
  music.addEventListener("timeupdate", paintRange);
  music.addEventListener("play", paintPlayState);
  music.addEventListener("pause", paintPlayState);
  music.addEventListener("ended", paintPlayState);
  volume?.style.setProperty("--volume", `${music.volume * 100}%`);
  paintRange();
  paintPlayState();
}

function initDigitalLetter(){
  const stage = document.querySelector(".letter-stage");
  const envelope = document.querySelector(".envelope-card");
  const close = document.querySelector(".letter-close");
  if(!stage || !envelope) return;
  function openLetter(){
    stage.classList.add("open");
    launchHeartFirework(window.innerWidth * .5, window.innerHeight * .38, Math.min(7, window.innerWidth / 62));
    animateFireworks();
  }
  function closeLetter(event){
    event.stopPropagation();
    stage.classList.remove("open");
  }
  envelope.addEventListener("click", openLetter);
  close?.addEventListener("click", closeLetter);
}

createFloatingDecor();
revealOnScroll();
initHistoryCarousel();
initMusicPlayer();
initDigitalLetter();
window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hide"), 1700);
  setTimeout(openingFireworks, 1900);
});
