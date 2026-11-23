import './styles/main.css';

// Arranque en 2 etapas inspirado en arquitecturas WebGL modernas:
// 1) CSS + HTML interactivos al instante con barra de precarga en el visor
// 2) Carga dinámica diferida de Three.js y la escena 3D completa
const preloader = document.getElementById('explorer-preloader');
const fillEl = document.getElementById('preloader-bar-fill');
const pctEl = document.getElementById('preloader-pct');

function setPreloadProgress(pct) {
  const clamped = Math.max(0, Math.min(100, Math.round(pct)));
  if (fillEl) fillEl.style.width = `${clamped}%`;
  if (pctEl) pctEl.textContent = `${clamped}%`;
}

window.__setExplorerProgress = (pct, done = false) => {
  setPreloadProgress(pct);
  if (done && preloader) {
    preloader.classList.add('is-ready');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 520);
  }
};

setPreloadProgress(25);

import('./main.js')
  .then(() => {
    setPreloadProgress(72);
  })
  .catch((err) => {
    console.error('Error cargando el visor 3D:', err);
    if (preloader) preloader.style.display = 'none';
  });
