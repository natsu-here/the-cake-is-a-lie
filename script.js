const themeToggleBtn = document.getElementById("theme-toggle");
const magicBtn = document.getElementById("magic-button");
const infoBlock = document.getElementById("info-block");
const cakeLie = document.getElementById("cake-lie");
const backgroundGradients = document.getElementById("background-gradients");

let isDay = true;
let magicEmojiTimeout = null;

// Ініціалізуємо тему за замовчуванням - день
document.body.classList.add("day");

// --- Перемикання теми ---
themeToggleBtn.addEventListener("click", () => {
  isDay = !isDay;
  if (isDay) {
    document.body.classList.replace("night", "day");
    themeToggleBtn.textContent = "☀️";
  } else {
    document.body.classList.replace("day", "night");
    themeToggleBtn.textContent = "🌙";
  }

  updateMagicBtnColor();

  if (!infoBlock.classList.contains("hidden")) {
    updateGlassBlockColors();
  }

  updateGradientsColors();
});

// --- Оновити колір кнопки магії ---
function updateMagicBtnColor() {
  if (isDay) {
    magicBtn.style.backgroundColor = "#6a4aff"; // фіолетовий
  } else {
    magicBtn.style.backgroundColor = "#2e7d32"; // зелений
  }
}

// --- Оновити фон скляного блоку та кольори ---
function updateGlassBlockColors() {
  if (isDay) {
    infoBlock.style.background = "rgba(220, 220, 220, 0.25)";
    infoBlock.style.color = "black";
    cakeLie.style.color = "rgba(0,0,0,0.3)";
  } else {
    infoBlock.style.background = "rgba(40, 40, 40, 0.6)";
    infoBlock.style.color = "white";
    cakeLie.style.color = "rgba(255,255,255,0.3)";
  }
}


// --- Поведінка кнопки магії ---
magicBtn.addEventListener("click", () => {
  magicBtn.textContent = "🔮";

  infoBlock.classList.remove("hidden");
  cakeLie.classList.remove("hidden");

  positionCakeLie();

  updateGlassBlockColors();

  if (magicEmojiTimeout) clearTimeout(magicEmojiTimeout);
  magicEmojiTimeout = setTimeout(() => {
    magicBtn.textContent = "🪄";
  }, 3000);
});


// --- Позиціонування напису "the cake is a lie" ---
function positionCakeLie() {
  const infoRect = infoBlock.getBoundingClientRect();
  const pList = infoBlock.querySelectorAll("p");
  let cakeP = null;

  pList.forEach(p => {
    if (p.textContent.trim() === "🎂") cakeP = p;
  });

  // Отримуємо ширину напису "the cake is a lie"
  const cakeLieWidth = cakeLie.offsetWidth;
  const viewportWidth = window.innerWidth;

  // Перевірка: чи влазить напис праворуч від блоку?
  const spaceRight = viewportWidth - infoRect.right;

  if (spaceRight >= cakeLieWidth + 20) {
    // Якщо влазить, ставимо праворуч від блоку

    if (!cakeP) {
      // Якщо не знайшли 🎂, позиціонуємо зверху блоку
      cakeLie.style.top = infoRect.top + "px";
    } else {
      const cakeRect = cakeP.getBoundingClientRect();
      const topPosition = cakeRect.top + window.scrollY + cakeRect.height / 2 - cakeLie.offsetHeight / 2;
      cakeLie.style.top = `${topPosition}px`;
    }

    cakeLie.style.left = `${infoRect.right + 10}px`;
    cakeLie.style.position = "absolute";
    cakeLie.style.textAlign = "left";
  } else {
    // Якщо не влазить, ставимо під блоком

    const belowTop = infoRect.bottom + window.scrollY + 10; // 10px відступ знизу блоку
    cakeLie.style.top = `${belowTop}px`;

    // Вирівнюємо по горизонталі вправо від центру екрану
    // Центр сторінки - половина ширини viewport + невеликий зсув вправо (наприклад 20% від ширини viewport)
    const centerX = viewportWidth / 2;
    const offsetRight = viewportWidth * 0.2; // 20% від ширини
    const leftPos = centerX + offsetRight - cakeLieWidth / 2;

    cakeLie.style.left = `${leftPos}px`;
    cakeLie.style.position = "absolute";
    cakeLie.style.textAlign = "center";
  }
}


// --- Плаваючі градієнти ---
const gradientsData = [
  {colorsDay: ['#ffafbd', '#ffc3a0'], colorsNight: ['#2193b0', '#6dd5ed'], size: 350, duration: 10000},
  {colorsDay: ['#a1c4fd', '#c2e9fb'], colorsNight: ['#654ea3', '#eaafc8'], size: 300, duration: 12000},
  {colorsDay: ['#fbc7aa', '#f78ca0'], colorsNight: ['#20002c', '#cbb4d4'], size: 250, duration: 8000},
  {colorsDay: ['#84fab0', '#8fd3f4'], colorsNight: ['#000428', '#004e92'], size: 400, duration: 11000},
  {colorsDay: ['#fddb92', '#d1fdff'], colorsNight: ['#232526', '#414345'], size: 280, duration: 13000},
  {colorsDay: ['#a6c0fe', '#f68084'], colorsNight: ['#1e3c72', '#2a5298'], size: 320, duration: 9000},
  {colorsDay: ['#f77062', '#fe5196'], colorsNight: ['#283e51', '#485563'], size: 260, duration: 14000},
];

let gradients = [];

function createGradientCircle(data) {
  const div = document.createElement("div");
  div.classList.add("gradient-circle");

  div.style.width = `${data.size}px`;
  div.style.height = `${data.size}px`;

  const x = Math.random() * (window.innerWidth - data.size);
  const y = Math.random() * (window.innerHeight - data.size);
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;

  const colors = isDay ? data.colorsDay : data.colorsNight;
  div.style.background = `radial-gradient(circle, ${colors.join(", ")})`;

  div.animate(
    [
      { transform: "translate(0, 0)" },
      { transform: `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)` }
    ],
    {
      duration: data.duration / 6,
      iterations: Infinity,
      direction: "alternate",
      easing: "ease-in-out",
    }
  );

  backgroundGradients.appendChild(div);

  return div;
}

function initGradients() {
  backgroundGradients.innerHTML = "";
  gradients = gradientsData.map(data => createGradientCircle(data));
}

function updateGradientsColors() {
  gradients.forEach((div, i) => {
    const data = gradientsData[i];
    const colors = isDay ? data.colorsDay : data.colorsNight;
    div.style.background = `radial-gradient(circle, ${colors.join(", ")})`;
  });
}

initGradients();
updateMagicBtnColor();

window.addEventListener("resize", () => {
  initGradients();
});

////////////////

let csvData = [];

// Функція для завантаження CSV
async function loadCSV() {
  const response = await fetch('uni-data.csv');
  const text = await response.text();
  csvData = parseCSV(text);
}

// Парсинг CSV → масив об’єктів
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // розбиває, враховуючи лапки

    return headers.reduce((acc, header, index) => {
      let value = values[index]?.trim();

      if (!value) {
        acc[header.trim()] = '';
        return acc;
      }

      // Видаляємо зовнішні лапки (якщо є)
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      // Замінюємо всі подвійні лапки всередині значення
      value = value.replace(/""/g, '"');

      acc[header.trim()] = value;
      return acc;
    }, {});
  });
}


// Заповнити info-block
function fillInfoBlock(data) {
  const infoBlock = document.getElementById('info-block');
  const paragraphs = infoBlock.querySelectorAll('p');

  const bmValue = data.bm_max !== 'N/A' ? data.bm_max : data.bm;

  const values = [
    data.specialty,
    data.uni_short,
    data.uni_full,
    `бюджет у 2025: ${bmValue}`,
    `подано заяв у 2025: ${data.applications}`,
    '🎂'
  ];

  paragraphs.forEach((p, i) => {
    p.textContent = values[i] || '';
  });
}

// Оновити подію кнопки магії
magicBtn.addEventListener('click', () => {
  if (csvData.length === 0) return;

  magicBtn.textContent = "🔮";

  const random = csvData[Math.floor(Math.random() * csvData.length)];
  fillInfoBlock(random);

  infoBlock.classList.remove("hidden");
  cakeLie.classList.remove("hidden");

  positionCakeLie();

  updateGlassBlockColors();

  if (magicEmojiTimeout) clearTimeout(magicEmojiTimeout);
  magicEmojiTimeout = setTimeout(() => {
    magicBtn.textContent = "🪄";
  }, 3000);
});

// Старт
loadCSV();
