'use strict';
// Data original da história, com o fuso de São Paulo explícito.
const dataInicio = new Date('2024-10-10T20:40:00-03:00');
// Uma única lista alimenta o álbum, a colagem e as comemorações.
const memories = [
  { file: 'IMG_0344.jpeg', caption: 'meu abraço favorito', alt: 'Nós dois abraçados numa selfie', position: '50% 53%' },
  { file: 'IMG_6497.jpeg', caption: 'a melhor companhia', alt: 'Uma foto nossa juntos no espelho', position: '50% 35%' },
  { file: 'IMG_8208.jpeg', caption: 'meu mundo bem pertinho', alt: 'Nicolly encostada em mim numa foto no espelho', position: '50% 35%' },
  { file: 'IMG_9692.jpeg', caption: 'qualquer lugar, com você', alt: 'Nós dois juntos numa foto no espelho', position: '50% 35%' },
  { file: '177c4dae-eeb3-46c1-b18f-471dbbb61ef0.jpg', caption: 'meu carinho tem seu nome', alt: 'Um abraço nosso, com um beijo na cabeça da Nicolly', position: '50% 55%' },
  { file: '6b858032-3098-44cb-8d99-a814eea7028e.jpg', caption: 'a gente e nossas bobeiras', alt: 'Nós dois fazendo careta no espelho de uma loja', position: '50% 30%' },
  { file: '7a4c7bca-dbeb-409f-945c-05993084753f.jpg', caption: 'o doce é esse beijo', alt: 'Um beijo nosso à mesa, com açaí na frente', position: '50% 50%' },
  { file: '9225dabc-935e-4b27-bd5b-697745755529.jpg', caption: 'esse sorriso é meu favorito', alt: 'Uma selfie nossa, com a Nicolly sorrindo e fazendo careta', position: '50% 45%' },
  { file: 'dc5441ca-7a17-4cca-b8d4-5ce5e5bc2765.jpg', caption: 'meu encontro preferido', alt: 'Nicolly sorrindo ao meu lado numa foto no espelho do shopping', position: '50% 25%' },
  { file: 'f1c32d47-0dba-4670-90bc-767a2f0d9f83.jpg', caption: 'nosso amor daria um filme', alt: 'Nós dois juntinhos de óculos 3D no cinema', position: '50% 55%' }
];
const knownPhotoFiles = new Set(memories.map((memory) => memory.file));
const extraMemories = Array.isArray(window.additionalMemories) ? window.additionalMemories : [];
extraMemories.forEach((memory) => {
  if (memory && typeof memory.file === 'string' && /\.(jpe?g|png|webp)$/i.test(memory.file) && !/[\\/]/.test(memory.file) && !knownPhotoFiles.has(memory.file)) {
    memories.push({ file: memory.file, caption: memory.caption || 'mais um pedacinho de nós', alt: memory.alt || 'Uma lembrança do nosso álbum', position: memory.position || '50% 50%' });
    knownPhotoFiles.add(memory.file);
  }
});
const fotos = memories.map((memory) => `fotos.jpg/${encodeURIComponent(memory.file)}`);
const thumbnails = memories.map((memory, index) => window.photoThumbnails?.[memory.file] || { src: fotos[index], width: 900, height: 1600 });
const captions = memories.map((memory) => memory.caption);
const specialMoments = ['nossa primeira foto.jpg', 'nossa primeira foto se beijando.jpg', 'o dia que dei as alianças.jpg', 'buque que dei pra ela.jpg']
  .map((file) => memories.findIndex((memory) => memory.file === file)).filter((index) => index >= 0);
const albumOrder = [...new Set([7, 4, ...specialMoments, 5, 0, 6, 8, 1, 9, 2, 3, ...memories.slice(10).map((_, index) => index + 10)])];
const byId = (id) => document.getElementById(id);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const timeElements = ['days', 'hours', 'minutes', 'seconds'].map(byId);
function atualizarContador() {
  const total = Math.max(0, Math.floor((Date.now() - dataInicio.getTime()) / 1000));
  const values = [Math.floor(total / 86400), Math.floor(total / 3600) % 24, Math.floor(total / 60) % 60, total % 60];
  values.forEach((value, index) => { timeElements[index].textContent = String(value).padStart(2, '0'); });
}
atualizarContador();
setInterval(() => { if (!document.hidden) atualizarContador(); }, 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) atualizarContador(); });
function celebrate(withPhotos = false) {
  if (reducedMotion.matches) return;
  const layer = byId('particles');
  if (layer.childElementCount > 40) return;
  const photoOffset = Math.floor(Math.random() * fotos.length);
  for (let i = 0; i < 24; i++) {
    const isPhoto = withPhotos && i % 5 === 0;
    const particle = document.createElement(isPhoto ? 'img' : 'span');
    particle.className = `particle${isPhoto ? ' photo-heart' : ''}`;
    if (isPhoto) { particle.src = thumbnails[(photoOffset + Math.floor(i / 5)) % fotos.length].src; particle.alt = ''; }
    else particle.textContent = ['♥', '♡', '✧'][i % 3];
    particle.style.setProperty('--left', `${Math.random() * 95}%`);
    particle.style.setProperty('--duration', `${3 + Math.random() * 3}s`);
    particle.style.animationDelay = `${Math.random() * .8}s`;
    layer.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove(), { once: true });
    setTimeout(() => particle.remove(), 8000);
  }
}
const loveDialog = byId('love-dialog');
function showLove(title, paragraphs, signature = 'Com amor, de quem te escolheria mil vezes.') {
  const content = byId('dialog-content'); content.replaceChildren();
  const symbol = document.createElement('span'); symbol.className = 'dialog-symbol'; symbol.textContent = '♡'; symbol.setAttribute('aria-hidden', 'true');
  const heading = document.createElement('h2'); heading.id = 'dialog-title'; heading.textContent = title;
  content.append(symbol, heading);
  paragraphs.forEach((text) => { const p = document.createElement('p'); p.textContent = text; content.appendChild(p); });
  const sign = document.createElement('p'); sign.className = 'letter-signature'; sign.textContent = signature; content.appendChild(sign);
  loveDialog.showModal();
}
function openLetter() { showLove('Nicolly, meu amor,', [
  'Você é a mulher da minha vida. E eu queria que esse cantinho conseguisse te mostrar, nem que fosse um pouquinho, o tamanho do que eu sinto por você.',
  'Olho pra nossa primeira foto, pro nosso primeiro beijo registrado, pro dia das alianças… e vejo muito mais que imagens. Vejo o nosso começo, as nossas escolhas e todas as pequenas coisas que foram virando uma história tão nossa.',
  'Eu amo as nossas bobeiras, as caretas, os passeios e os abraços. Amo dividir um dia comum com você. A foto na escola, o cinema, o buquê: são jeitos diferentes de guardar a mesma certeza. É você que eu quero do meu lado.',
  'Não prometo dias perfeitos. Prometo carinho, parceria, escuta e vontade de cuidar da gente. Quero continuar te escolhendo nos dias leves e estar perto nos dias difíceis.',
  'Essas fotos são um pedacinho do que já vivemos. O resto? Eu quero viver com você. Que venham muitos outros sorrisos, beijos, planos e fotos sem pose. Eu te amo demais, Nicolly. ♥'
], 'Com todo o meu amor. Hoje e em todos os nossos ainda.'); }
byId('open-letter').addEventListener('click', openLetter);
byId('quote-letter').addEventListener('click', openLetter);
let escapes = 0;
let lastEscape = 0;
let accepted = false;
const noButton = byId('btn-nao');
const area = byId('runaway-area');
const escapeNotes = ['Opa! Esse botão tem medo de compromisso 😂', 'Ele disse que “não” não combina com a gente.', 'Tá difícil, né? O “sim” tá bem ali, ó. ♡', 'Pegadinha! Mas você pode escolher de verdade.'];
function fuga() {
  if (accepted) return;
  const now = Date.now(); if (now - lastEscape < 250) return; lastEscape = now;
  if (escapes >= 4) {
    showLove('Tá tudo bem, meu amor.', ['Você sempre pode escolher. A brincadeira termina aqui, mas meu carinho por você continua. ♡'], 'Um abraço, sem pegadinha.');
    return;
  }
  const maxX = Math.max(0, area.clientWidth - noButton.offsetWidth - 4);
  const maxY = Math.max(0, area.clientHeight - noButton.offsetHeight - 4);
  noButton.style.right = 'auto';
  noButton.style.left = `${escapes % 2 === 0 ? maxX : Math.min(12, maxX)}px`;
  noButton.style.top = `${maxY}px`;
  byId('question-note').textContent = escapeNotes[escapes]; escapes++;
  if (escapes === 4) noButton.textContent = 'Agora vale';
}
noButton.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse' && escapes < 4 && !reducedMotion.matches) fuga(); });
noButton.addEventListener('click', fuga);
// Reposiciona após mudar a largura da tela para manter o botão dentro do cartão.
window.addEventListener('resize', () => {
  if (!escapes || accepted) return;
  const maxX = Math.max(0, area.clientWidth - noButton.offsetWidth - 4);
  noButton.style.left = `${Math.min(parseFloat(noButton.style.left) || 0, maxX)}px`;
});
byId('btn-sim').addEventListener('click', () => {
  accepted = true; noButton.hidden = true;
  byId('btn-sim').textContent = 'Nosso sempre começa aqui ♥';
  byId('question-note').textContent = 'Meu “sim” para você também é de todos os dias.';
  showLove('Mil vezes você.', ['Eu já tava torcendo por esse sim. E prometo continuar te conquistando nos detalhes, nas risadas e nos dias mais comuns.', 'Nicolly, que a gente tenha muito tempo para viver tudo o que ainda cabe nesse amor. Te amo infinitamente!'], 'Você e eu. E uma vida inteirinha pela frente.');
  celebrate(true);
});
const measureButton = byId('measure-love');
let measuring = false;
measureButton.addEventListener('click', () => {
  if (measuring) return; measuring = true; measureButton.disabled = true;
  measureButton.textContent = 'Calculando os meus suspiros…';
  byId('meter-note').textContent = 'Somando carinho, saudade e vontade de te abraçar…';
  let value = 0;
  const timer = setInterval(() => {
    value = Math.min(120, value + 8);
    byId('meter-value').textContent = `${value}%`;
    byId('meter-fill').style.width = `${Math.min(100, value)}%`;
    if (value === 120) {
      clearInterval(timer); byId('meter-note').textContent = 'Ih… passou do limite. Eu avisei!';
      setTimeout(() => {
        byId('meter-value').textContent = '∞';
        byId('meter-note').textContent = 'Pegadinha. Amor assim não cabe em porcentagem. ♥';
        measureButton.textContent = 'Medir de novo ↻'; measureButton.disabled = false; measuring = false; celebrate();
      }, 650);
    }
  }, 85);
});
const reasons = ['seu sorriso melhora qualquer parte do meu dia.', 'meu abraço preferido sempre tem você dentro.', 'você é meu pensamento bom no meio da correria.', 'com você, eu quero viver as coisas pequenas e os sonhos grandes.', 'até a saudade me lembra da sorte que é ter você.', 'a nossa história é a que eu mais gosto de continuar.', 'você me faz sorrir até quando só aparece na minha cabeça.', 'tem um pedacinho de você em todos os meus planos bons.'];
let reasonIndex = 0;
byId('new-reason').addEventListener('click', () => { byId('reason-text').textContent = reasons[reasonIndex % reasons.length]; reasonIndex++; });
let secretClicks = 0;
byId('secret-heart').addEventListener('click', () => {
  secretClicks++;
  if (secretClicks < 5) byId('secret-note').textContent = ['Tem amor escondido aqui…', 'Quase! Esse coração é tímido.', 'Tá sentindo? É um carinho chegando.', 'Só mais um toque, prometo.'][secretClicks - 1];
  else {
    secretClicks = 0; byId('secret-note').textContent = 'Segredo descoberto: você é meu presente favorito. ♥';
    showLove('Você achou meu segredo!', ['Vale um abraço bem demorado, um beijo na testa e um “te amo” olhando nos olhos.', 'Para resgatar, é só me mostrar essa mensagem. Validade: sempre que você precisar de carinho.'], 'Um vale-carinho, exclusivo para Nicolly.');
    celebrate(true);
  }
});
const photoDialog = byId('photo-dialog');
let photoIndex = 0;
let slideshowTimer = null;
const gallery = byId('memory-gallery');
byId('memory-count').textContent = `${memories.length} LEMBRANÇAS. E TANTAS OUTRAS PRA VIVER.`;
let visibleMemories = 0;
const galleryPageSize = 12;
function openPhoto(index) { stopSlideshow(); photoIndex = index; renderPhoto(); photoDialog.showModal(); }
function appendMemories() {
  const nextLimit = Math.min(visibleMemories + galleryPageSize, albumOrder.length);
  albumOrder.slice(visibleMemories, nextLimit).forEach((index, batchIndex) => {
  const displayIndex = visibleMemories + batchIndex;
  const memory = memories[index];
  const button = document.createElement('button');
  button.className = 'polaroid memory-photo'; button.dataset.photo = index;
  if (thumbnails[index].width > thumbnails[index].height) button.classList.add('landscape');
  button.setAttribute('aria-label', `Ampliar foto: ${memory.caption}`);
  const image = document.createElement('img'); image.src = thumbnails[index].src; image.alt = memory.alt;
  image.loading = 'lazy'; image.decoding = 'async'; image.width = thumbnails[index].width; image.height = thumbnails[index].height;
  image.style.objectPosition = memory.position;
  const number = document.createElement('span'); number.className = 'memory-number'; number.textContent = String(displayIndex + 1).padStart(2, '0'); number.setAttribute('aria-hidden', 'true');
  const caption = document.createElement('span'); caption.className = 'handwritten'; caption.textContent = memory.caption;
  button.append(image, number, caption); gallery.appendChild(button);
  button.addEventListener('click', () => openPhoto(index));
});
  visibleMemories = nextLimit;
  byId('gallery-count').textContent = `${visibleMemories} de ${memories.length} lembranças do nosso infinito`;
  byId('load-more-memories').hidden = visibleMemories >= albumOrder.length;
}
appendMemories();
byId('load-more-memories').addEventListener('click', appendMemories);
const chapters = [
  { file: 'nossa primeira foto.jpg', title: 'Nossa primeira foto', note: 'Um pedacinho de onde tudo começou.', label: '01 / O NOSSO COMEÇO' },
  { file: 'nossa primeira foto se beijando.jpg', title: 'Nosso primeiro beijo registrado', note: 'Guardado numa foto. E em mim.', label: '02 / MAIS PERTINHO' },
  { file: 'o dia que dei as alianças.jpg', title: 'O dia das alianças', note: 'Minha escolha continua sendo você.', label: '03 / EU ESCOLHO NÓS' }
];
chapters.forEach((chapter) => {
  const index = memories.findIndex((memory) => memory.file === chapter.file);
  if (index < 0) return;
  const card = document.createElement('button'); card.className = 'chapter-card'; card.dataset.photo = index;
  card.setAttribute('aria-label', `Ampliar: ${chapter.title}`);
  const image = document.createElement('img'); image.src = thumbnails[index].src; image.alt = memories[index].alt;
  image.loading = 'lazy'; image.decoding = 'async'; image.width = thumbnails[index].width; image.height = thumbnails[index].height;
  image.style.objectPosition = memories[index].position;
  const label = document.createElement('span'); label.className = 'chapter-label'; label.textContent = chapter.label;
  const title = document.createElement('span'); title.className = 'chapter-title'; title.textContent = chapter.title;
  const note = document.createElement('span'); note.className = 'chapter-note'; note.textContent = chapter.note;
  card.append(image, label, title, note); card.addEventListener('click', () => openPhoto(index));
  byId('chapter-list').appendChild(card);
});
function renderPhoto() {
  byId('expanded-photo').src = fotos[photoIndex]; byId('expanded-photo').alt = memories[photoIndex].alt;
  const albumPosition = albumOrder.indexOf(photoIndex) + 1;
  byId('photo-caption').textContent = captions[photoIndex]; byId('photo-index').textContent = `${albumPosition} / ${fotos.length}`;
  byId('album-progress-fill').style.width = `${albumPosition / fotos.length * 100}%`;
}
function stopSlideshow() {
  clearInterval(slideshowTimer); slideshowTimer = null;
  byId('toggle-slideshow').textContent = '▷';
  byId('toggle-slideshow').setAttribute('aria-label', 'Reproduzir memórias');
  byId('toggle-slideshow').setAttribute('aria-pressed', 'false');
}
function startSlideshow() {
  stopSlideshow();
  byId('toggle-slideshow').textContent = 'Ⅱ';
  byId('toggle-slideshow').setAttribute('aria-label', 'Pausar memórias');
  byId('toggle-slideshow').setAttribute('aria-pressed', 'true');
  slideshowTimer = setInterval(() => {
    // Termina na última foto para deixar a pessoa curtir a lembrança.
    if (photoIndex === albumOrder.at(-1)) { stopSlideshow(); return; }
    changePhoto(1);
  }, 4200);
}
document.querySelectorAll('.photo-composition [data-photo]').forEach((button) => button.addEventListener('click', () => openPhoto(Number(button.dataset.photo))));
function changePhoto(step) { photoIndex = albumOrder[(albumOrder.indexOf(photoIndex) + step + fotos.length) % fotos.length]; renderPhoto(); }
function manualPhoto(step) { stopSlideshow(); changePhoto(step); }
byId('previous-photo').addEventListener('click', () => manualPhoto(-1));
byId('next-photo').addEventListener('click', () => manualPhoto(1));
byId('play-memories').addEventListener('click', () => { photoIndex = albumOrder[0]; renderPhoto(); photoDialog.showModal(); startSlideshow(); });
byId('toggle-slideshow').addEventListener('click', () => { if (slideshowTimer) stopSlideshow(); else { if (photoIndex === albumOrder.at(-1)) { photoIndex = albumOrder[0]; renderPhoto(); } startSlideshow(); } });
photoDialog.addEventListener('close', () => { if (!photoDialog.open) stopSlideshow(); });
photoDialog.addEventListener('cancel', stopSlideshow);
document.addEventListener('visibilitychange', () => { if (document.hidden) stopSlideshow(); });
photoDialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); manualPhoto(-1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); manualPhoto(1); }
});
let touchStart = null;
const photoStage = photoDialog.querySelector('.photo-stage');
photoStage.addEventListener('touchstart', (event) => { touchStart = { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY }; }, { passive: true });
photoStage.addEventListener('touchend', (event) => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) manualPhoto(dx < 0 ? 1 : -1);
  touchStart = null;
}, { passive: true });
document.querySelectorAll('dialog').forEach((dialog) => {
  function closeDialog() { if (dialog === photoDialog) stopSlideshow(); dialog.close(); }
  dialog.querySelector('.close-dialog').addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) closeDialog();
  });
});

// As lembranças aparecem suavemente; continuam visíveis sem suporte ou com movimento reduzido.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); } });
  }, { threshold: .08 });
  document.querySelectorAll('.surprises article, .love-quote, .memory-photo, .closing').forEach((element) => { element.classList.add('reveal-ready'); revealObserver.observe(element); });
}


// Tenta iniciar ao abrir; se o navegador bloquear, aguarda uma interação real.
const loveAudio = byId('love-audio');
const musicButtons = [byId('music-toggle'), byId('dock-music-toggle'), byId('album-music-toggle')];
const musicSource = window.siteMusic?.src;
let hasMusicStarted = false;
function skipMusicIntro() {
  const startAt = window.siteMusic?.startAt;
  if (loveAudio.readyState < 1 || !Number.isFinite(startAt) || startAt <= 0 || startAt >= loveAudio.duration) return;
  if (loveAudio.currentTime < startAt) loveAudio.currentTime = startAt;
}
function clearMusicGestureListeners() {
  document.removeEventListener('click', startMusicOnGesture, true);
  document.removeEventListener('keydown', startMusicOnGesture, true);
}
function updateMusicControls() {
  const playing = !loveAudio.paused && !loveAudio.ended;
  byId('music-toggle').textContent = playing ? 'Ⅱ' : '▷';
  byId('music-toggle').setAttribute('aria-pressed', String(playing));
  musicButtons.forEach(button => button.setAttribute('aria-label', playing ? 'Pausar nossa música' : 'Tocar nossa música'));
  byId('dock-music-toggle').textContent = playing ? 'Ⅱ' : '▷';
  byId('album-music-toggle').textContent = playing ? 'Pausar nossa música ♫' : 'Tocar nossa música ♫';
  byId('music-dock').hidden = !playing;
  document.body.classList.toggle('music-playing', playing);
  if (playing) byId('music-status').hidden = true;
}
async function startMusic() {
  try {
    skipMusicIntro();
    await loveAudio.play();
  }
  catch (error) {
    if (hasMusicStarted) return;
    byId('music-status').textContent = error.name === 'NotAllowedError'
      ? 'Toque em qualquer cantinho para ouvir nossa música. ♡'
      : 'Não consegui tocar agora. Você pode ouvir pelo YouTube. ♡';
    byId('music-status').hidden = false;
    if (error.name !== 'NotAllowedError') {
      byId('music-link').hidden = false;
      clearMusicGestureListeners();
    }
    updateMusicControls();
  }
}
function startMusicOnGesture(event) {
  if (hasMusicStarted || event.target.closest?.('#music-toggle, #dock-music-toggle, #album-music-toggle, #music-link')) return;
  if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
  startMusic();
}
async function toggleMusic() {
  if (!musicSource) return;
  if (!loveAudio.paused) { loveAudio.pause(); return; }
  await startMusic();
}
if (typeof musicSource === 'string' && musicSource) {
  loveAudio.addEventListener('loadedmetadata', skipMusicIntro);
  loveAudio.addEventListener('timeupdate', skipMusicIntro);
  loveAudio.src = musicSource;
  const configuredVolume = window.siteMusic.volume;
  loveAudio.volume = typeof configuredVolume === 'number' && Number.isFinite(configuredVolume) ? Math.min(1, Math.max(0, configuredVolume)) : .30;
  byId('music-link').hidden = true;
  byId('music-toggle').hidden = false;
  byId('album-music-toggle').hidden = false;
  musicButtons.forEach(button => button.addEventListener('click', toggleMusic));
  loveAudio.addEventListener('play', () => {
    hasMusicStarted = true;
    clearMusicGestureListeners();
    updateMusicControls();
  });
  loveAudio.addEventListener('pause', updateMusicControls);
  loveAudio.addEventListener('ended', updateMusicControls);
  if (window.siteMusic.autoplay !== false) {
    loveAudio.autoplay = true;
    loveAudio.preload = 'auto';
    document.addEventListener('click', startMusicOnGesture, true);
    document.addEventListener('keydown', startMusicOnGesture, true);
    startMusic();
  }
}
