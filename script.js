const PRESETS = [
  { label:"Person", topic:"person",
    img:"static/person.png", correct:[1,4,7],
    msg: "That doesn't look like a person" },
  { label:"Bat", topic:"bat",
    img:"static/bat.png", correct:[0,1,2,3,4,5,6,7,8],
    msg: "Please only select the bat" },
  { label:"Insect", topic:"insect",
    img:"static/person.png", correct:[1,4,7],
    msg: "I don't think insects wear clothes" },
  { label:"Bow", topic:"bow",
    img:"static/bow.png", correct:[0,1,2,3,4,5,6,7,8],
    msg: "Please only select the bow" },
];

let currentPreset = PRESETS[0];
let selected = new Set();

const grid       = document.getElementById('grid');
const topicLabel = document.getElementById('topic-label');
const verifyBtn  = document.getElementById('verify-btn');
const resultMsg  = document.getElementById('result-msg');
const refreshBtn = document.getElementById('refresh-btn');
const presetsEl  = document.getElementById('presets');

function buildGrid(imageUrl) {
  grid.innerHTML = '';
  selected.clear();
  resultMsg.textContent = '';
  resultMsg.className = 'result-msg';
  grid.style.setProperty('--captcha-img', `url('${imageUrl}')`);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const idx = row * 3 + col;
      const tile = document.createElement('button');
      tile.className = 'tile';
      tile.dataset.idx = idx;
      tile.dataset.row = row;
      tile.dataset.col = col;
      tile.setAttribute('aria-pressed','false');
      tile.setAttribute('aria-label',`Tile ${idx+1}`);
      tile.innerHTML = `
        <div class="tile-bg"></div>
        <div class="tile-overlay"></div>
        <div class="tile-check">
          <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        </div>`;
      tile.addEventListener('click', () => {
        if (selected.has(idx)) { selected.delete(idx); tile.classList.remove('selected'); tile.setAttribute('aria-pressed','false'); }
        else { selected.add(idx); tile.classList.add('selected'); tile.setAttribute('aria-pressed','true'); }
        resultMsg.textContent = ''; resultMsg.className = 'result-msg';
      });
      grid.appendChild(tile);
    }
  }
}

function verify() {
  const correct = new Set(currentPreset.correct);
  const missed  = [...correct].filter(i => !selected.has(i));
  const extra   = [...selected].filter(i => !correct.has(i));
  if (missed.length === 0 && extra.length === 0) {
    resultMsg.textContent = `\u2717 ${currentPreset.msg}`;
    resultMsg.className = 'result-msg fail';
  } else {
    resultMsg.textContent = `\u2717 Try again...`;
    resultMsg.className = 'result-msg fail';
    // flash wrong
    extra.forEach(idx => {
      const t = grid.querySelector(`[data-idx="${idx}"]`);
      if (t) { t.style.outline = '3px solid #e57373'; setTimeout(()=>t.style.outline='', 900); }
    });
    // reveal missed
    missed.forEach(idx => {
      const t = grid.querySelector(`[data-idx="${idx}"]`);
      if (t) { t.style.outline = '3px solid #ffb74d'; setTimeout(()=>t.style.outline='', 900); }
    });
  }
}

function loadPreset(p) {
  currentPreset = p;
  topicLabel.textContent = p.topic;
  buildGrid(p.img);
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.preset-btn[data-label="${p.label}"]`);
  if (btn) btn.classList.add('active');
}

function buildPresets() {
  PRESETS.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'preset-btn'; btn.dataset.label = p.label; btn.textContent = p.label;
    btn.addEventListener('click', () => loadPreset(p));
    presetsEl.appendChild(btn);
  });
}

refreshBtn.addEventListener('click', () => { buildGrid(currentPreset.img); topicLabel.textContent = currentPreset.topic; });
verifyBtn.addEventListener('click', verify);

(function(){
  const t=document.querySelector('[data-theme-toggle]'),r=document.documentElement;
  let d=r.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  r.setAttribute('data-theme',d);
  function setIcon(){t.innerHTML=d==='dark'
    ?'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> Light'
    :'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Theme';}
  setIcon();
  t.addEventListener('click',()=>{d=d==='dark'?'light':'dark';r.setAttribute('data-theme',d);setIcon();});
})();

buildPresets();
loadPreset(PRESETS[0]);
