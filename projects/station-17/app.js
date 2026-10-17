const SAVE_KEY = "station-n17-save-v1";

const scenes = {
  airlock: {
    code: "N-17 / ВХОДНОЙ ШЛЮЗ", chapter: "01 / БЕЛЫЙ ШУМ", time: "23:48", art: "airlock", coordinate: "72°31′ N / 42°08′ E", caption: "WINTER CONTOUR · FIELD NOTE 01", location: "Входной шлюз",
    text: [
      "Внутренняя дверь шлюза закрывается за спиной. По металлу снаружи бьёт метель — будто кто-то торопится войти.",
      "Три дня без связи. Ни одного ответа из штаба. На панели теплится одна лампа, а в наушнике вдруг шепчет незнакомый голос: <em>«Ты всё-таки приехал».</em>"
    ],
    journal: "Шлюз закрылся. В рации прозвучало: «Ты всё-таки приехал». Не помню, чтобы называл им своё имя.",
    choices: [
      { label: "Заглянуть в столовую", detail: "Там должен быть аварийный запас.", next: "dining", icon: "⌂" },
      { label: "Идти на радиорубку", detail: "Попробовать поймать сигнал штаба.", next: "radio", icon: "⌁" },
      { label: "Проверить служебный тоннель", detail: "Дверь закрыта на магнитный замок.", next: "tunnel", icon: "↘", requires: ["keycard"], reason: "Нужна карта доступа из архива." }
    ]
  },
  dining: {
    code: "N-17 / ЖИЛОЙ СЕКТОР", chapter: "01 / БЕЛЫЙ ШУМ", time: "23:56", art: "dining", coordinate: "ЖИЛОЙ БЛОК / СЕКТОР B", caption: "ПЕРСОНАЛ: 06 → 00", location: "Столовая",
    text: [
      "Столовая выглядит так, будто смена закончилась пять минут назад. На столе стоит кружка с тонкой коркой льда. На стене — шесть фотографий экипажа.",
      "Одна фотография перевёрнута лицом к стене. На обороте свежим маркером написано твоё имя."
    ],
    journal: "В столовой нашли мою фотографию. Я никогда не был на этой станции — по крайней мере, так мне говорили.",
    choices: [
      { label: "Обыскать ящик у плиты", detail: "Может, здесь остались запчасти.", next: "dining", icon: "＋", once: "foundFuse", effects: { addItem: "Предохранитель", set: { foundFuse: true }, journal: "В ящике под плитой лежал исправный керамический предохранитель." }, actionText: "В ящике нашёлся предохранитель." },
      { label: "Прочитать сменный журнал", detail: "Последняя запись датирована сегодняшним числом.", next: "dining", icon: "≡", once: "readDiningLog", effects: { set: { readDiningLog: true }, trust: 1, journal: "В журнале: «Если он спросит о нижнем уровне — не отвечать. Он ещё не вспомнил»." }, actionText: "Кто такой «он»?" },
      { label: "Вернуться к шлюзу", detail: "Проверить другие помещения.", next: "airlock", icon: "←" },
      { label: "Идти на радиорубку", detail: "Попробовать связаться со штабом.", next: "radio", icon: "⌁" }
    ]
  },
  radio: {
    code: "N-17 / РАДИОРУБКА", chapter: "02 / ЧУЖОЙ ГОЛОС", time: "00:09", art: "radio", coordinate: "КОММУТАЦИОННЫЙ УЗЕЛ / 03", caption: "ЧАСТОТА: 41.08 MHZ", location: "Радиорубка",
    text: [
      "Панель связи цела, но резервное питание отключено. Из динамика тянется ровный шорох. Среди помех кто-то трижды стучит — с паузами, как в старом сигнале бедствия.",
      "На столе лежит схема станции. Нижний тоннель ведёт к радару, но без карты доступа дверь не открыть."
    ],
    journal: "На частоте 41.08 МГц слышен стук. Похоже на старый аварийный сигнал, но он повторяется в реальном времени.",
    choices: [
      { label: "Настроить частоту и слушать", detail: "В помехах будто есть слова.", next: "radio", icon: "◖", once: "heardLog", effects: { set: { heardLog: true }, trust: 1, radio: "В сигнале слышен голос", journal: "За помехами различил голос: «Мира, мы тебя не бросили». В списке экипажа нет никого по имени Мира." }, actionText: "В эфире проявился обрывок голоса." },
      { label: "Снять карту доступа с терминала", detail: "Старый терминал ещё работает.", next: "archive", icon: "⌑", once: "mapKnown", effects: { set: { mapKnown: true }, journal: "В терминале нашёл схему нижнего тоннеля и отметку архива." }, actionText: "На терминале нашлась схема нижнего уровня." },
      { label: "Проверить генераторную", detail: "Без питания рация не отправит сигнал.", next: "generator", icon: "ϟ" },
      { label: "Вернуться в шлюз", detail: "Продолжить осмотр станции.", next: "airlock", icon: "←" }
    ]
  },
  archive: {
    code: "N-17 / НИЖНИЙ АРХИВ", chapter: "02 / ЧУЖОЙ ГОЛОС", time: "00:22", art: "archive", coordinate: "НИЖНИЙ УРОВЕНЬ / A-09", caption: "ДОСТУП: ТОЛЬКО СТАРШИЙ СОСТАВ", location: "Архив",
    text: [
      "Архив зажат между двумя несущими стенами. На старых дисках нет ни одной записи о прежней смене — только медицинские карты и отчёты об эксперименте «Мнемосфера».",
      "В одном из файлов значится: «Испытуемый N-17. Реакция на голосовую петлю — устойчивая. Память о первом прибытии отсутствует»."
    ],
    journal: "Архив: «Испытуемый N-17. Память о первом прибытии отсутствует». Это моё имя или номер?",
    choices: [
      { label: "Взять карту доступа", detail: "Она открывает гермодвери нижнего уровня.", next: "archive", icon: "▣", once: "keycard", effects: { addItem: "Карта доступа", set: { keycard: true }, journal: "Забрал карту доступа из терминала архива." }, actionText: "Карта доступа теперь у меня." },
      { label: "Открыть файл эксперимента", detail: "Прочитать последнюю запись о N-17.", next: "archive", icon: "≡", once: "truth", effects: { set: { truth: true }, trust: 1, radio: "Запись экипажа найдена", journal: "В записи экипаж называет меня по имени и просит не верить станции. Последняя строка: «Мы ждём тебя у радара»." }, actionText: "Нашёл запись экипажа. Они знают меня." },
      { label: "Вернуться к радиорубке", detail: "Проверить найденные записи.", next: "radio", icon: "←" }
    ]
  },
  generator: {
    code: "N-17 / ГЕНЕРАТОРНАЯ", chapter: "02 / ЧУЖОЙ ГОЛОС", time: "00:34", art: "generator", coordinate: "ЭНЕРГОБЛОК / ТЕМПЕРАТУРА 06°", caption: "РЕЗЕРВ: 02%", location: "Генераторная",
    text: [
      "Станция дрожит от ветра. Главный генератор молчит; контрольная лампа моргает красным. За панелью сломан предохранитель.",
      "Узел можно починить найденной деталью — или запустить вручную. Но такой запуск отнимет остатки тепла в жилом секторе."
    ],
    journal: "Генератор остановлен. Ручной запуск возможен, но после него жилой сектор быстро остынет.",
    choices: [
      { label: "Установить предохранитель", detail: "Починить цепь и вернуть питание.", next: "generator", icon: "ϟ", requires: ["Предохранитель"], requireFlag: "!power", effects: { removeItem: "Предохранитель", set: { power: true }, radio: "Питание восстановлено", journal: "Установил предохранитель. Электричество вернулось, радар просыпается." }, actionText: "Генератор запустился. Станция оживает." },
      { label: "Запустить вручную", detail: "Сработает, но в жилом секторе станет холоднее.", next: "generator", icon: "ϟ", requireFlag: "!power", effects: { set: { power: true }, warmth: -27, journal: "Запустил генератор вручную. Тепло уходит из жилого сектора; долго так не протянем." }, actionText: "Генератор заработал, но тепло быстро уходит." },
      { label: "Подняться к радару", detail: "Проверить антенну и эвакуационную капсулу.", next: "radar", icon: "↑", requires: ["__power__"], reason: "Сначала нужно запустить генератор." },
      { label: "Вернуться на радиорубку", detail: "Проверить связь.", next: "radio", icon: "←" }
    ]
  },
  tunnel: {
    code: "N-17 / СЛУЖЕБНЫЙ ТОННЕЛЬ", chapter: "03 / НИЖНИЙ УРОВЕНЬ", time: "00:51", art: "tunnel", coordinate: "ТОННЕЛЬ T-4 / ГЛУБИНА 12 М", caption: "ВОЗДУХ: 41% · ДАВЛЕНИЕ: ПАДАЕТ", location: "Служебный тоннель",
    text: [
      "Тоннель уходит под лёд. На стенах — следы ладоней, словно кто-то шёл здесь, касаясь металла. Впереди слышится гул антенны.",
      "Красный аварийный свет включается только на несколько секунд. В эти мгновения кажется, что тоннель становится длиннее."
    ],
    journal: "В тоннеле следы ладоней ведут к радару. Кажется, они сделаны изнутри — с обратной стороны стены.",
    choices: [
      { label: "Идти к радарной", detail: "До антенны осталось недалеко.", next: "radar", icon: "↑", requires: ["__power__"], reason: "Нужен генератор, чтобы открыть гермодверь." },
      { label: "Провести рукой по следам", detail: "Металл тёплый, как кожа.", next: "tunnel", icon: "✳", once: "touchMarks", effects: { warmth: -8, set: { touchMarks: true }, journal: "Прикоснулся к следу. В ответ металл трижды стукнул изнутри." }, actionText: "Из стены ответили три удара." },
      { label: "Вернуться к шлюзу", detail: "Путь назад ещё открыт.", next: "airlock", icon: "←" }
    ]
  },
  radar: {
    code: "N-17 / РАДАРНЫЙ ПОСТ", chapter: "03 / НИЖНИЙ УРОВЕНЬ", time: "01:07", art: "radar", coordinate: "АНТЕННА R-1 / ВНЕШНИЙ КОНТУР", caption: "КОНТАКТ: НЕОПОЗНАН · 0.8 KM", location: "Радарный пост",
    text: [
      "Антенна вращается, хотя снаружи ураган. На экране — одна отметка, почти вплотную к станции. Она движется синхронно с твоим дыханием.",
      "В углу мигают три команды: отправить координаты, открыть эвакуационную капсулу или передать найденную запись экипажа."
    ],
    journal: "На радаре отметка в восьмистах метрах от станции. Она перемещается, когда я задерживаю дыхание.",
    choices: [
      { label: "Отправить сигнал бедствия", detail: "Позвать поисковую группу и передать координаты.", next: "rescue", icon: "⌁", requires: ["__power__"], reason: "Сигналу нужно питание." },
      { label: "Открыть эвакуационную капсулу", detail: "Уйти до того, как станция погаснет.", next: "escape", icon: "↗", requires: ["__power__", "Карта доступа"], reason: "Нужны питание и карта доступа." },
      { label: "Передать запись экипажа", detail: "Отправить наружу то, что произошло на станции.", next: "truth-ending", icon: "◖", requires: ["__power__"], requireFlag: "truth", reason: "В архиве пока нет полной записи." },
      { label: "Спуститься к генератору", detail: "Проверить питание антенны.", next: "generator", icon: "↓" }
    ]
  }
};

const endings = {
  rescue: {
    symbol: "⌁", eyebrow: "КОНЦОВКА 01 / СИГНАЛ", title: "Утро приходит не сразу", stats: "СИГНАЛ ОТПРАВЛЕН · ПОИСКОВАЯ ГРУППА В ПУТИ",
    text: (state) => state.trust >= 2
      ? "К рассвету у станции появляются огни спасательного борта. Перед самым отключением рации голос произносит: «Теперь ты знаешь, что мы тебя не бросили». На этот раз ты веришь."
      : "Сигнал уходит в метель. Ответа нет, но на радаре отметка отдаляется от станции. Возможно, это поисковая группа. Возможно, впервые за ночь ты просто дышишь свободно."
  },
  escape: {
    symbol: "↗", eyebrow: "КОНЦОВКА 02 / ЭВАКУАЦИЯ", title: "За линией горизонта", stats: "КАПСУЛА ОТСТЫКОВАНА · КУРС НА ЮГ",
    text: () => "Капсула отстреливается от станции и падает сквозь облака. На последней записи радара ты видишь, как отметка остаётся внутри Н-17. Когда связь обрывается, голос в наушнике говорит: «До скорой встречи»."
  },
  "truth-ending": {
    symbol: "✳", eyebrow: "КОНЦОВКА 03 / АРХИВ", title: "Голос подо льдом", stats: "АРХИВ ОТПРАВЛЕН · ПРОТОКОЛ N-17 РАСКРЫТ",
    text: () => "Запись уходит на все аварийные частоты. В ответ голоса экипажа начинают называть тебя по имени — уже не из старого файла, а в прямом эфире. На радаре отметка останавливается. Впервые станция становится тихой."
  }
};

const mapNodes = [
  { id: "tunnel", label: "ТОННЕЛЬ", col: 1, row: 1 },
  { id: "generator", label: "ГЕНЕРАТОР", col: 2, row: 1 },
  { id: "archive", label: "АРХИВ", col: 3, row: 1 },
  { id: "dining", label: "СТОЛОВАЯ", col: 1, row: 2 },
  { id: "radar", label: "РАДАР", col: 2, row: 2 },
  { id: "radio", label: "РАДИО", col: 3, row: 2 },
  { id: "airlock", label: "ШЛЮЗ", col: 2, row: 3 }
];

const itemSymbols = { "Карманный фонарь": "◉", "Предохранитель": "ϟ", "Карта доступа": "▣" };
let state = null;
let toastTimer;
let moveTimer;

function createNewGame() {
  state = {
    scene: "airlock", warmth: 78, trust: 0,
    inventory: ["Карманный фонарь"], flags: {}, visited: [], journal: [], ending: null
  };
  visitScene("airlock");
  persist();
  showGame();
  renderGame();
}

function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!saved || !saved.scene || (!scenes[saved.scene] && !endings[saved.ending])) return null;
    return saved;
  } catch {
    return null;
  }
}

function persist() {
  if (!state) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    const indicator = document.querySelector(".save-indicator");
    if (indicator) indicator.classList.add("saved");
  } catch {
    showToast("Браузер не разрешил сохранить прогресс.");
  }
}

function visitScene(sceneId) {
  state.scene = sceneId;
  state.ending = null;
  if (!state.visited.includes(sceneId)) {
    state.visited.push(sceneId);
    const scene = scenes[sceneId];
    if (scene?.journal) addJournal(scene.journal, scene.time);
  }
}

function addJournal(text, time = "00:00") {
  state.journal.push({ text, time });
  if (state.journal.length > 30) state.journal.shift();
}

function showGame() {
  document.getElementById("homeScreen").hidden = true;
  document.getElementById("gameScreen").hidden = false;
  document.querySelector(".game-layout").hidden = false;
  document.getElementById("endingScreen").hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function returnHome() {
  clearTimeout(moveTimer);
  document.getElementById("gameScreen").hidden = true;
  document.getElementById("homeScreen").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
  updateHomeButtons();
}

function hasItem(item) { return state.inventory.includes(item); }

function hasRequirement(requirement) {
  if (requirement === "__power__") return Boolean(state.flags.power);
  return hasItem(requirement);
}

function checkChoice(choice) {
  if (choice.once && state.flags[choice.once]) return { visible: false, enabled: false, reason: "" };
  if (choice.requireFlag) {
    const negate = choice.requireFlag.startsWith("!");
    const key = negate ? choice.requireFlag.slice(1) : choice.requireFlag;
    const valid = negate ? !state.flags[key] : Boolean(state.flags[key]);
    if (!valid) return { visible: true, enabled: false, reason: choice.reason || "Это действие пока недоступно." };
  }
  const missing = (choice.requires || []).filter((item) => !hasRequirement(item));
  if (missing.length) return { visible: true, enabled: false, reason: choice.reason || `Не хватает: ${missing.join(", ")}.` };
  return { visible: true, enabled: true, reason: "" };
}

function renderChoices(scene) {
  const list = document.getElementById("choiceList");
  const available = scene.choices.map((choice) => ({ choice, status: checkChoice(choice) })).filter((entry) => entry.status.visible);
  list.innerHTML = available.map(({ choice, status }, index) => `
    <button class="choice-button" type="button" data-choice="${index}" ${status.enabled ? "" : "disabled"}>
      <span class="choice-index">${String(index + 1).padStart(2, "0")}</span>
      <span class="choice-copy"><strong>${choice.label}</strong><small>${choice.detail}</small></span>
      <span class="choice-arrow">${choice.icon || "→"}</span>
      ${status.reason ? `<small class="choice-reason">${status.reason}</small>` : ""}
    </button>`).join("");
  list.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => {
    const { choice } = available[Number(button.dataset.choice)];
    choose(choice);
  }));
}

function renderMap() {
  const map = document.getElementById("stationMap");
  map.innerHTML = mapNodes.map((node) => {
    const visited = state.visited.includes(node.id);
    const current = state.scene === node.id;
    const classes = ["map-node", visited && "visited", current && "current"].filter(Boolean).join(" ");
    return `<span class="${classes}" style="grid-column:${node.col};grid-row:${node.row}" title="${node.label}"><i class="map-label">${node.label}</i></span>`;
  }).join("");
}

function renderStatus() {
  const warmth = Math.max(0, Math.min(100, state.warmth));
  const meter = document.getElementById("warmthMeter");
  meter.style.width = `${warmth}%`;
  meter.style.background = warmth < 25 ? "#d27160" : warmth < 50 ? "#d7a26c" : "linear-gradient(90deg, #68b8dc, #b3e5f6)";
  document.getElementById("warmthLabel").textContent = warmth < 25 ? "КРИТИЧНО" : warmth < 50 ? "ХОЛОДНО" : "СТАБИЛЬНО";
  document.getElementById("warmthNote").textContent = warmth < 25 ? "Тепло заканчивается. Скорее к генератору." : warmth < 50 ? "Холод пробирается под одежду." : "Пока держишься.";
  document.querySelectorAll("#trustTrack i").forEach((bar, index) => bar.classList.toggle("active", index < Math.min(3, state.trust)));
  document.getElementById("trustLabel").textContent = ["НЕИЗВЕСТНО", "ОСТОРОЖНО", "ДОВЕРЯЕТ", "СВОЙ"] [Math.min(3, state.trust)];
  document.getElementById("trustNote").textContent = state.trust > 1 ? "Кажется, экипаж пытается помочь." : state.trust > 0 ? "В сигнале мелькнуло знакомое имя." : "На станции пока никого не встретил.";
  document.getElementById("radioStatus").textContent = state.flags.radio || "Сигнал потерян";
  document.getElementById("inventoryCount").textContent = String(state.inventory.length).padStart(2, "0");
  document.getElementById("inventoryList").innerHTML = state.inventory.length
    ? state.inventory.map((item) => `<div class="inventory-item"><span class="item-icon">${itemSymbols[item] || "·"}</span>${item}</div>`).join("")
    : '<span class="inventory-empty">Карманов тоже нет.</span>';
  const lastEntry = state.journal[state.journal.length - 1];
  document.getElementById("journalText").textContent = lastEntry?.text || "Пока ни одной записи.";
}

function renderGame() {
  if (state.ending) { renderEnding(); return; }
  document.getElementById("endingScreen").hidden = true;
  document.querySelector(".game-layout").hidden = false;
  const scene = scenes[state.scene];
  document.getElementById("sceneCode").textContent = scene.code;
  document.getElementById("sceneTime").textContent = scene.time;
  document.getElementById("chapterLabel").textContent = scene.chapter;
  document.getElementById("sceneVisual").dataset.art = scene.art;
  document.getElementById("visualCoordinate").textContent = scene.coordinate;
  document.getElementById("visualCaption").textContent = scene.caption;
  document.getElementById("sceneKicker").textContent = `${scene.chapter.replace(" / ", " — ")} · ${scene.time}`;
  document.getElementById("sceneTitle").textContent = scene.location;
  document.getElementById("sceneText").innerHTML = scene.text.map((paragraph) => `<p>${paragraph}</p>`).join("");
  renderChoices(scene);
  renderMap();
  renderStatus();
  persist();
}

function choose(choice) {
  const content = document.querySelector(".scene-content");
  content.classList.add("leaving");
  clearTimeout(moveTimer);
  moveTimer = setTimeout(() => {
    if (choice.effects) applyEffects(choice.effects);
    if (choice.actionText) showToast(choice.actionText);
    if (endings[choice.next]) {
      state.ending = choice.next;
      persist();
      renderEnding();
    } else {
      visitScene(choice.next);
      renderGame();
      document.querySelector(".scene-content")?.classList.remove("leaving");
    }
  }, 150);
}

function applyEffects(effects) {
  if (effects.addItem && !hasItem(effects.addItem)) state.inventory.push(effects.addItem);
  if (effects.removeItem) state.inventory = state.inventory.filter((item) => item !== effects.removeItem);
  if (effects.set) Object.assign(state.flags, effects.set);
  if (typeof effects.warmth === "number") state.warmth = Math.max(0, Math.min(100, state.warmth + effects.warmth));
  if (typeof effects.trust === "number") state.trust = Math.max(0, Math.min(3, state.trust + effects.trust));
  if (effects.radio) state.flags.radio = effects.radio;
  if (effects.journal) addJournal(effects.journal, scenes[state.scene]?.time);
}

function renderEnding() {
  document.querySelector(".game-layout").hidden = true;
  const ending = endings[state.ending];
  const endingScreen = document.getElementById("endingScreen");
  endingScreen.hidden = false;
  document.getElementById("endingCard").innerHTML = `
    <div class="ending-stamp">${ending.symbol}</div>
    <p class="eyebrow"><span></span> ${ending.eyebrow}</p>
    <h2>${ending.title}</h2>
    <p>${ending.text(state)}</p>
    <div class="ending-stats"><span>${ending.stats.split(" · ")[0]}</span><span>ЭКИПАЖУ ДОВЕРЯЮТ: ${state.trust}/3</span><span>ЗОН ИССЛЕДОВАНО: ${state.visited.length}/7</span></div>
    <div class="ending-actions"><button class="button-primary" type="button" id="playAgain">Пройти иначе <span>↻</span></button><button class="button-secondary" type="button" id="readEndingJournal">Перечитать записи <span>≡</span></button></div>`;
  document.getElementById("playAgain").addEventListener("click", () => {
    state = null;
    localStorage.removeItem(SAVE_KEY);
    createNewGame();
  });
  document.getElementById("readEndingJournal").addEventListener("click", openJournal);
  renderMap();
  renderStatus();
}

function updateHomeButtons() {
  const saved = loadGame();
  const continueButton = document.getElementById("continueButton");
  continueButton.hidden = !saved;
  document.getElementById("beginButton").textContent = saved ? "Новая история ↗" : "Начать историю ↗";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openJournal() {
  const modal = document.getElementById("journalModal");
  const entries = state?.journal || [];
  document.getElementById("journalEntries").innerHTML = entries.length
    ? entries.slice().reverse().map((entry) => `<article class="journal-entry"><time>${entry.time} / ПОЛЕВАЯ ЗАПИСЬ</time><p>${entry.text}</p></article>`).join("")
    : '<p class="inventory-empty">Записей пока нет.</p>';
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeJournal() {
  const modal = document.getElementById("journalModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

document.getElementById("beginButton").addEventListener("click", () => {
  const saved = loadGame();
  if (saved && !saved.ending && !confirm("Начать новую историю? Текущее прохождение будет удалено.")) return;
  if (saved?.ending && !confirm("Начать новую историю?")) return;
  localStorage.removeItem(SAVE_KEY);
  createNewGame();
});
document.getElementById("continueButton").addEventListener("click", () => {
  state = loadGame();
  if (!state) { updateHomeButtons(); showToast("Сохранение не найдено."); return; }
  showGame();
  renderGame();
});
document.getElementById("backHome").addEventListener("click", (event) => { event.preventDefault(); returnHome(); });
document.getElementById("headerSave").addEventListener("click", () => { persist(); showToast("Прогресс сохранён на этом устройстве."); });
document.getElementById("resetButton").addEventListener("click", () => {
  if (!confirm("Удалить текущее прохождение и начать заново?")) return;
  localStorage.removeItem(SAVE_KEY);
  createNewGame();
});
document.getElementById("journalButton").addEventListener("click", openJournal);
document.getElementById("journalModal").addEventListener("click", (event) => {
  if (event.target.closest("[data-close-modal]")) closeJournal();
});
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeJournal(); });

updateHomeButtons();
