/* script.js - AirAware Exact Layout A
   Demo UI: random values, gauge, trend chart, flash effects, nav interactions
*/

const rand = (min, max) => Math.round(Math.random()*(max-min)+min);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* DOM elements */
const pageBody = document.getElementById('pageBody');
const showBtn = document.getElementById('showBtn');
const citySelect = document.getElementById('citySelect');

const aqiNumberEl = document.getElementById('aqiNumber');
const aqiCategoryEl = document.getElementById('aqiCategory');
const aqiEmojiEl = document.getElementById('aqiEmoji');

const pm25El = document.getElementById('valPM25');
const pm10El = document.getElementById('valPM10');
const no2El = document.getElementById('valNO2');
const coEl = document.getElementById('valCO');

const predValEl = document.getElementById('predVal');
const predLabelEl = document.getElementById('predLabel');

let gaugeChart = null;
let trendChart = null;

/* create semicircle gauge (Chart.js v3) */
function createGauge(aqi) {
  const ctx = document.getElementById('gaugeCanvas').getContext('2d');
  if (gaugeChart) gaugeChart.destroy();

  const colors = ['#8EE08F','#FFD66B','#FFB36B','#FF6B6B']; // green, yellow, orange, red
  const slices = [50,50,50,150]; // visual widths to form semicircle

  gaugeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: slices,
        backgroundColor: colors,
        borderWidth: 0
      }]
    },
    options: {
      rotation: Math.PI,        // start at left
      circumference: Math.PI,   // semicircle
      cutout: '72%',
      responsive: false,        // fixed pixel size from canvas
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } }
    }
  });
}



/* create AQI trend chart */
function createTrend(vals) {
  const ctx = document.getElementById('trendCanvas').getContext('2d');
  if (trendChart) trendChart.destroy();

  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Wed','Thu','Fri','Sat','Sun','Mon','Tue'],
      datasets: [{
        data: vals,
        borderColor: '#5fc7ff',
        backgroundColor: 'rgba(95,199,255,0.08)',
        fill: true,
        tension: 0.36,
        pointRadius: 4,
        pointBackgroundColor: '#cdefff',
        borderWidth: 2
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: 'rgba(255,255,255,0.78)' } },
        y: { ticks: { color: 'rgba(255,255,255,0.78)' } }
      }
    }
  });
}

/* AQI category helpers */
function getCategory(aqi) {
  if (aqi <= 50) return {label:'Good', emoji:'😊'};
  if (aqi <= 100) return {label:'Moderate', emoji:'🙂'};
  if (aqi <= 150) return {label:'Poor', emoji:'😐'};
  if (aqi <= 200) return {label:'Unhealthy', emoji:'😷'};
  if (aqi <= 300) return {label:'Very Unhealthy', emoji:'🤒'};
  return {label:'Hazardous', emoji:'☠️'};
}

/* flash effect based on AQI */
function flashFor(aqi) {
  pageBody.classList.remove('flash-red','flash-yellow');
  if (aqi > 150) {
    pageBody.classList.add('flash-red');
    setTimeout(()=> pageBody.classList.remove('flash-red'), 2000);
  } else if (aqi > 100 && aqi <= 150) {
    pageBody.classList.add('flash-yellow');
    setTimeout(()=> pageBody.classList.remove('flash-yellow'), 1600);
  } else if (aqi > 50 && aqi <= 100) {
    pageBody.classList.add('flash-yellow');
    setTimeout(()=> pageBody.classList.remove('flash-yellow'), 1200);
  }
}

/* generate demo data */
function generateDemo() {
  const pm25 = rand(8,140);
  const pm10 = rand(10,200);
  const no2 = rand(3,120);
  const co = (Math.random()*3).toFixed(1);
  let aqi = Math.round(pm25*1.05 + no2*0.6 + pm10*0.12 + co*12);
  aqi = clamp(aqi, 10, 340);
  const trend = Array.from({length:7}, ()=> clamp(aqi + rand(-40,40), 30, 300));
  return {pm25, pm10, no2, co, aqi, trend};
}

/* apply data to UI */
function setUI(data) {
  aqiNumberEl.textContent = data.aqi;
  const cat = getCategory(data.aqi);
  aqiCategoryEl.textContent = cat.label;
  aqiEmojiEl.textContent = cat.emoji;

  pm25El.textContent = data.pm25;
  pm10El.textContent = data.pm10;
  no2El.textContent = data.no2;
  coEl.textContent = data.co;

  createGauge(data.aqi);
  createTrend(data.trend);
  flashFor(data.aqi);
}

/* initial render */
document.addEventListener('DOMContentLoaded', ()=> {
  const d = generateDemo();
  setUI(d);
});

/* Show AQI button updates */
showBtn.addEventListener('click', ()=> {
  const d = generateDemo();
  setUI(d);
});

/* Predict button demo */
document.getElementById('predictBtn').addEventListener('click', ()=> {
  const p25 = Number(document.getElementById('inpPM25').value) || rand(10,80);
  const p10 = Number(document.getElementById('inpPM10').value) || rand(10,120);
  const n2  = Number(document.getElementById('inpNO2').value) || rand(2,80);
  const co  = Number(document.getElementById('inpCO').value) || (Math.random()*2).toFixed(1);

  let pred = Math.round(p25*1.05 + n2*0.6 + p10*0.12 + co*12);
  pred = clamp(pred, 10, 340);
  predValEl && (predValEl.textContent = pred);
  predLabelEl && (predLabelEl.textContent = getCategory(pred).label);

  flashFor(pred);
});
function createGauge(aqi) {
  const ctx = document.getElementById('gaugeCanvas').getContext('2d');
  if (gaugeChart) gaugeChart.destroy();

  const max = 300;
  const val = Math.min(aqi, max);

  gaugeChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [val, max - val],
          backgroundColor: [
            aqi <= 50 ? "#8EE08F" :
            aqi <= 100 ? "#FFD66B" :
            aqi <= 150 ? "#FFB36B" :
            aqi <= 200 ? "#FF6B6B" :
            "#C93C3C",
            "rgba(255,255,255,0.12)"
          ],
          borderWidth: 0,
          cutout: "68%"   // makes the middle hollow like your UI
        }
      ]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });
}


/* nav click active toggle (small UX) */
document.querySelectorAll('.topnav .nav-link').forEach(link=>{
  link.addEventListener('click', (e)=>{
    document.querySelectorAll('.topnav .nav-link').forEach(x=> x.classList.remove('active'));
    link.classList.add('active');
  });
});
