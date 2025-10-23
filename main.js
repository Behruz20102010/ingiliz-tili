
const lessons = [
  { time: "08:00 - 08:45", title: "Matematika", room: "101", day: "mon" },
  { time: "09:00 - 09:45", title: "Fizika", room: "203", day: "mon" },
  { time: "10:00 - 10:45", title: "Ingliz tili", room: "203", day: "mon" },
  { time: "11:00 - 11:45", title: "Tarix", room: "105", day: "mon" }
];

const i18n = {
  en: {
    classTitle: "Class Info",
    gradeLabel: "Grade:",
    schoolLabel: "School:",
    roomLabel: "Room:",
    scheduleTitle: "Today's Schedule",
    annTitle: "Announcements",
    addBtn: "Add",
    galleryTitle: "Gallery",
    graphTitle: "Weekly Overview",
    graphHint: "Bar shows number of periods",
    brand: "Maktab Portal"
  },
  ru: {
    classTitle: "Информация о классе",
    gradeLabel: "Класс:",
    schoolLabel: "Школа:",
    roomLabel: "Кабинет:",
    scheduleTitle: "Расписание на сегодня",
    annTitle: "Объявления",
    addBtn: "Добавить",
    galleryTitle: "Галерея",
    graphTitle: "Обзор за неделю",
    graphHint: "Столбцы — количество уроков",
    brand: "Портал Школы"
  },
  es: {
    classTitle: "Información de la clase",
    gradeLabel: "Grado:",
    schoolLabel: "Escuela:",
    roomLabel: "Aula:",
    scheduleTitle: "Horario de hoy",
    annTitle: "Anuncios",
    addBtn: "Agregar",
    galleryTitle: "Galería",
    graphTitle: "Resumen semanal",
    graphHint: "La barra muestra número de clases",
    brand: "Portal Escolar"
  }
};

// Elements
const scheduleList = document.getElementById("scheduleList");
const annList = document.getElementById("annList");
const annForm = document.getElementById("annForm");
const annInput = document.getElementById("annInput");
const themeToggle = document.getElementById("themeToggle");
const modeToggle = document.getElementById("modeToggle");
const langSelect = document.getElementById("langSelect");
const yearEl = document.getElementById("year");
const timeNowEl = document.getElementById("timeNow");
const barChart = document.getElementById("barChart");
const addSample = document.getElementById("addSample");
const clearSchedule = document.getElementById("clearSchedule");

let currentLang = 'en';
let graphMode = false;


function renderSchedule(){
  scheduleList.innerHTML = '';
  const now = new Date();
  const nowMinutes = now.getHours()*60 + now.getMinutes();
  lessons.forEach((l, i) => {
    const item = document.createElement('div');
    item.className = 'lesson';

    const [start, , end] = l.time.split(' ');
    function hmToMin(hm){ const [h,m]=hm.split(':').map(Number); return h*60+m }
    const isCurrent = nowMinutes >= hmToMin(start) && nowMinutes <= hmToMin(end);
    if(isCurrent) item.classList.add('current');
    item.innerHTML = `
      <div>
        <div class="meta"><strong>${l.title}</strong> <small>${l.time}</small></div>
        <small class="muted">${l.room}</small>
      </div>
      <div><small class="muted">#${i+1}</small></div>
    `;
    scheduleList.appendChild(item);
  });
  updateTimeNow();
  renderBarChart();
}

function renderAnnouncements(){
  const saved = JSON.parse(localStorage.getItem('announcements')||'[]');
  annList.innerHTML = '';
  if(saved.length===0){
    const p = document.createElement('div'); p.className='ann-item muted'; p.textContent = getText('annEmpty') || 'No announcements';
    annList.appendChild(p);
    return;
  }
  saved.forEach(a=>{
    const el = document.createElement('div');
    el.className = 'ann-item';
    el.textContent = a;
    annList.appendChild(el);
  });
}


function renderBarChart(){

  const days = ['Mon','Tue','Wed','Thu','Fri'];

  const counts = days.map((d,i)=> {

    return lessons[i] ? 1 + (i % 3) : Math.max(0, Math.floor(Math.random()*3));
  });

  barChart.innerHTML = '';
  counts.forEach((c,i)=>{
    const bar = document.createElement('div');
    bar.className = 'bar';
    const rect = document.createElement('div');
    rect.className = 'rect';
    const h = Math.max(6, (c / (Math.max(...counts)||(1))) * 100);
    rect.style.height = h + '%';
    rect.title = `${c} lessons`;
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = days[i];
    bar.appendChild(rect);
    bar.appendChild(label);
    barChart.appendChild(bar);
  });
}


function updateTimeNow(){
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  timeNowEl.textContent = `${hh}:${mm}`;
}

themeToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? 'Light' : 'Dark';
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});


modeToggle.addEventListener('click', ()=>{
  graphMode = !graphMode;
  modeToggle.textContent = graphMode ? 'ListMode' : 'GraphMode';
  document.getElementById('graphCard').style.display = graphMode ? 'block' : 'block';

});


function translateAll(lang){
  currentLang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(i18n[lang] && i18n[lang][key]) el.textContent = i18n[lang][key];
  });

  document.querySelectorAll('[data-i18n]').forEach(()=>{});
  localStorage.setItem('lang', lang);
}
langSelect.addEventListener('change', (e)=> translateAll(e.target.value));


annForm.addEventListener('submit', (ev)=>{
  ev.preventDefault();
  const v = annInput.value.trim();
  if(!v) return;
  const saved = JSON.parse(localStorage.getItem('announcements')||'[]');
  saved.unshift(v);
  localStorage.setItem('announcements', JSON.stringify(saved.slice(0,20)));
  annInput.value = '';
  renderAnnouncements();
});


function getText(key){
  return (i18n[currentLang] && i18n[currentLang][key]) || key;
}


addSample.addEventListener('click', ()=>{
  lessons.push({ time: "12:00 - 12:45", title: "Biologiya", room: "204", day: "mon" });
  renderSchedule();
});
clearSchedule.addEventListener('click', ()=>{
  lessons.length = 0;
  renderSchedule();
});


(function init(){

  const th = localStorage.getItem('theme');
  if(th === 'dark') { document.body.classList.add('dark'); themeToggle.textContent = 'Light' }

  const lang = localStorage.getItem('lang') || 'en';
  langSelect.value = lang;
  translateAll(lang);

  document.getElementById('year').textContent = new Date().getFullYear();


  if(!localStorage.getItem('announcements')){
    localStorage.setItem('announcements', JSON.stringify([
      "23 Oct — Sport day: wear sports uniform.",
      "25 Oct — Mother tongue olympiad registration."
    ]));
  }

  renderSchedule();
  renderAnnouncements();
  setInterval(updateTimeNow, 30*1000);
})();
