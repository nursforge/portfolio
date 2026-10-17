const STORAGE_KEY = "pitlane.orders.v1";
const MAX_DAILY_BOOKINGS = 8;

const services = [
  { id: "wash", name: "Детейлинг-мойка", description: "Двухфазная мойка кузова и бережная сушка", price: 12000, duration: "1,5 часа" },
  { id: "interior", name: "Детейлинг салона", description: "Глубокая уборка и уход за материалами", price: 28000, duration: "3 часа" },
  { id: "polish", name: "Полировка кузова", description: "Восстановление блеска и удаление мелких дефектов", price: 65000, duration: "6 часов" },
  { id: "ceramic", name: "Керамическое покрытие", description: "Защита лака с подготовкой поверхности", price: 95000, duration: "1 день" },
  { id: "full", name: "Комплексный уход", description: "Мойка + воск + уборка салона", price: 35000, duration: "4 часа" },
  { id: "film", name: "Антигравийная плёнка", description: "Защита уязвимых зон кузова", price: 120000, duration: "1 день" }
];

const checkInItems = [
  "Обойти кузов вместе с клиентом",
  "Сфотографировать дефекты",
  "Записать пробег и уровень топлива",
  "Принять ключи и проверить салон"
];

const statusClass = {
  "Новая": "status-new",
  "В работе": "status-progress",
  "Готово": "status-done",
  "Отменена": "status-cancelled"
};

let orders = loadOrders();
const requestedView = new URLSearchParams(window.location.search).get("view");
let currentView = ["dashboard", "orders", "services"].includes(requestedView) ? requestedView : "dashboard";
let toastTimer;

try { if (!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); } catch { /* The app still works for this session. */ }

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDateString(date);
}

function withPrice(order) {
  const service = services.find((item) => item.name === order.service);
  return { ...order, price: service?.price || order.price || 0, employeeId: order.employeeId || "PL-001", checklist: Array.isArray(order.checklist) ? order.checklist : [] };
}

function createDemoOrders() {
  const demo = [
    { id: "PL-1042", customer: "Арман Садыков", phone: "+7 701 248 19 42", car: "BMW 530i · чёрный", service: "Комплексный уход", date: shiftDate(0), time: "09:00", status: "Готово", note: "Проверить состояние дисков" },
    { id: "PL-1043", customer: "Алия Нурбекова", phone: "+7 707 315 60 28", car: "Mercedes-Benz E-Class · белый", service: "Детейлинг салона", date: shiftDate(0), time: "12:00", status: "В работе", note: "Особое внимание светлой коже" },
    { id: "PL-1044", customer: "Данияр Касымов", phone: "+7 775 402 83 16", car: "Porsche Macan · серый", service: "Полировка кузова", date: shiftDate(0), time: "15:00", status: "Новая", note: "" },
    { id: "PL-1045", customer: "Мадина Ибраева", phone: "+7 702 119 47 03", car: "Toyota Land Cruiser · чёрный", service: "Керамическое покрытие", date: shiftDate(0), time: "18:00", status: "Новая", note: "" },
    { id: "PL-1046", customer: "Тимур Алиев", phone: "+7 747 860 21 54", car: "Audi RS6 · синий", service: "Детейлинг-мойка", date: shiftDate(1), time: "10:30", status: "Новая", note: "" },
    { id: "PL-1047", customer: "Ерлан Беков", phone: "+7 705 332 91 77", car: "Lexus RX · серебристый", service: "Антигравийная плёнка", date: shiftDate(1), time: "13:30", status: "Новая", note: "Оклеить переднюю часть" }
  ];
  return demo.map(withPrice);
}

function loadOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved.map(withPrice);
  } catch {
    // If local storage is unavailable, keep the app usable in memory.
  }
  return createDemoOrders();
}

function saveOrders() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    showToast("Браузер не разрешил сохранить заказы. Они останутся до закрытия вкладки.");
  }
}

function formatMoney(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₸`;
}

function formatShortDate(dateString) {
  if (dateString === localDateString()) return "Сегодня";
  if (dateString === shiftDate(1)) return "Завтра";
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(new Date(`${dateString}T12:00:00`)).replace(" г.", "");
}

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();
}

function plural(count, one, few, many) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function renderDateAndClock() {
  const now = new Date();
  const date = new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" }).format(now);
  document.getElementById("currentDate").textContent = date.toUpperCase();
  document.getElementById("shiftClock").textContent = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(now);
}

function todaysOrders() {
  return orders.filter((order) => order.date === localDateString() && order.status !== "Отменена");
}

function renderStats() {
  const today = todaysOrders();
  const completed = today.filter((order) => order.status === "Готово");
  const inProgress = today.filter((order) => order.status === "В работе");
  const next = today.filter((order) => order.status === "Новая" || order.status === "В работе").sort((a, b) => a.time.localeCompare(b.time))[0];
  const percent = Math.min(100, Math.round(today.length / MAX_DAILY_BOOKINGS * 100));

  document.getElementById("todayCount").textContent = String(today.length).padStart(2, "0");
  document.getElementById("todayFoot").textContent = `${today.length} ${plural(today.length, "запись", "записи", "записей")} в расписании`;
  document.getElementById("inProgressCount").textContent = String(inProgress.length).padStart(2, "0");
  document.getElementById("todayRevenue").innerHTML = `${new Intl.NumberFormat("ru-RU").format(completed.reduce((sum, order) => sum + order.price, 0))} <small>₸</small>`;
  document.getElementById("navOrderCount").textContent = String(orders.length);
  document.getElementById("capacityValue").textContent = `${percent}%`;
  document.getElementById("capacityMeter").style.width = `${percent}%`;
  document.getElementById("capacityBookings").textContent = `${today.length} / ${MAX_DAILY_BOOKINGS} записей`;
  document.getElementById("appointmentTrack").style.width = `${percent}%`;

  document.getElementById("nextAppointment").innerHTML = next
    ? `<b>${escapeHtml(next.time)} · ${escapeHtml(next.customer.split(" ")[0])}</b><small>${escapeHtml(next.car)}</small>`
    : "<b>Пока свободно</b><small>Добавь запись, чтобы заполнить расписание</small>";

  document.getElementById("hourSlots").innerHTML = Array.from({ length: MAX_DAILY_BOOKINGS }, (_, index) => {
    const hour = 9 + Math.floor(index * 1.5);
    const slot = `${String(hour).padStart(2, "0")}:${index % 2 ? "30" : "00"}`;
    const booked = today.some((order) => order.time === slot);
    return `<i class="${booked ? "booked" : ""} ${next?.time === slot ? "current-slot" : ""}" title="${slot}"></i>`;
  }).join("");
}

function getVisibleOrders() {
  const query = document.getElementById("searchInput").value.trim().toLocaleLowerCase("ru");
  const status = document.getElementById("statusFilter").value;
  return orders
    .filter((order) => currentView === "orders" || order.date === localDateString())
    .filter((order) => status === "all" || order.status === status)
    .filter((order) => !query || `${order.customer} ${order.car} ${order.phone} ${order.service} ${order.id}`.toLocaleLowerCase("ru").includes(query))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}

function renderOrderTable() {
  const body = document.getElementById("ordersTableBody");
  const empty = document.getElementById("emptyState");
  if (currentView === "services") {
    document.getElementById("tableHeaders").innerHTML = "<th>УСЛУГА</th><th>ДЛИТЕЛЬНОСТЬ</th><th>СТАТУС</th><th>ЦЕНА</th><th><span class=\"sr-only\">Действия</span></th>";
    renderServiceTable(body);
    empty.hidden = services.some((service) => `${service.name} ${service.description}`.toLocaleLowerCase("ru").includes(document.getElementById("searchInput").value.trim().toLocaleLowerCase("ru")));
    document.getElementById("tableSummary").textContent = `${services.length} услуг в прайс-листе`;
    document.querySelector(".table-status").innerHTML = "<i></i> ПРАЙС АКТУАЛЕН";
    return;
  }

  document.getElementById("tableHeaders").innerHTML = "<th>КЛИЕНТ / АВТОМОБИЛЬ</th><th>УСЛУГА</th><th>ВРЕМЯ</th><th>СТАТУС</th><th>СУММА</th><th><span class=\"sr-only\">Действия</span></th>";
  const filtered = getVisibleOrders();
  body.innerHTML = filtered.map((order) => `
    <tr data-order-id="${escapeHtml(order.id)}" tabindex="0" aria-label="Открыть заказ ${escapeHtml(order.id)}">
      <td><div class="customer-cell"><span class="customer-avatar">${escapeHtml(initials(order.customer))}</span><span class="customer-meta"><b>${escapeHtml(order.customer)}</b><small>${escapeHtml(order.car)}</small></span></div></td>
      <td class="service-cell">${escapeHtml(order.service)}</td>
      <td class="time-cell">${escapeHtml(currentView === "orders" ? `${formatShortDate(order.date)}, ${order.time}` : order.time)}</td>
      <td><span class="status-pill ${statusClass[order.status] || "status-new"}">${escapeHtml(order.status)}</span></td>
      <td class="money-cell">${formatMoney(order.price)}</td>
      <td><button type="button" class="row-menu" data-open-order="${escapeHtml(order.id)}" aria-label="Открыть заказ">···</button></td>
    </tr>`).join("");
  empty.hidden = filtered.length > 0;
  document.getElementById("tableSummary").textContent = currentView === "orders"
    ? `Показано ${filtered.length} из ${orders.length} заказов`
    : `Показаны записи на сегодня · ${filtered.length} ${plural(filtered.length, "заказ", "заказа", "заказов")}`;
  document.querySelector(".table-status").innerHTML = "<i></i> ОБНОВЛЕНО ТОЛЬКО ЧТО";
}

function renderServiceTable(body) {
  const query = document.getElementById("searchInput").value.trim().toLocaleLowerCase("ru");
  const filtered = services.filter((service) => `${service.name} ${service.description}`.toLocaleLowerCase("ru").includes(query));
  body.innerHTML = filtered.map((service) => `
    <tr>
      <td><div class="customer-cell"><span class="customer-avatar service-avatar">✦</span><span class="customer-meta"><b>${escapeHtml(service.name)}</b><small>${escapeHtml(service.description)}</small></span></div></td>
      <td class="service-cell">${escapeHtml(service.duration)}</td>
      <td><span class="status-pill status-done">Доступна</span></td><td class="money-cell">${formatMoney(service.price)}</td>
      <td><button type="button" class="row-menu" data-book-service="${service.id}" aria-label="Записать на услугу">＋</button></td>
    </tr>`).join("");
  document.getElementById("tableSummary").textContent = `${filtered.length} услуг в прайс-листе`;
}

function renderView() {
  const isServices = currentView === "services";
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === currentView));
  document.getElementById("breadcrumbCurrent").textContent = isServices ? "УСЛУГИ" : currentView === "orders" ? "ЗАКАЗЫ" : "ОБЗОР";
  document.getElementById("pageTitle").innerHTML = isServices ? `Прайс-лист<span class="heading-period">.</span>` : currentView === "orders" ? `Все заказы<span class="heading-period">.</span>` : `Рабочий день<span class="heading-period">.</span>`;
  document.getElementById("pageSubtitle").textContent = isServices ? "Услуги детейлинг-студии и запись клиентов." : currentView === "orders" ? "Все записи клиентов и текущие статусы заказов." : "Всё под контролем. Вот что происходит в боксе сегодня.";
  document.querySelector(".hero-strip").hidden = isServices;
  document.querySelector(".stats-grid").hidden = isServices;
  document.querySelector(".side-column").hidden = isServices;
  document.querySelector(".lower-grid").classList.toggle("services-view", isServices);
  document.getElementById("ordersHeading").textContent = isServices ? "Услуги студии" : currentView === "orders" ? "Все заказы" : "План на сегодня";
  document.getElementById("seeAllButton").hidden = currentView !== "dashboard";
  document.getElementById("statusFilter").hidden = isServices;
  renderOrderTable();
}

function renderAll() {
  renderDateAndClock();
  renderEmployeePreview();
  renderStats();
  renderView();
}

function renderEmployeePreview() {
  try {
    const profile = JSON.parse(localStorage.getItem("pitlane.employee.v1"));
    if (!profile) return;
    const name = profile.name || "Нурсултан Манапов";
    document.getElementById("sidebarEmployeeName").textContent = name.split(/\s+/)[0];
    document.getElementById("sidebarEmployeeRole").textContent = profile.role || "Администратор";
    document.getElementById("sidebarEmployeeAvatar").textContent = initials(name);
    document.getElementById("topEmployeeAvatar").textContent = initials(name);
  } catch {
    // The dashboard keeps its default demo profile when saved data is unavailable.
  }
}

function openOrderModal(serviceId = "") {
  const select = document.getElementById("serviceSelect");
  select.innerHTML = '<option value="" disabled>Выберите услугу</option>' + services.map((service) => `<option value="${service.id}">${escapeHtml(service.name)} · ${formatMoney(service.price)}</option>`).join("");
  document.getElementById("orderForm").reset();
  select.value = serviceId || "full";
  document.getElementById("orderDate").value = localDateString();
  document.getElementById("orderDate").min = localDateString();
  updatePricePreview();
  const modal = document.getElementById("orderModal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  window.setTimeout(() => document.querySelector('[name="customer"]').focus(), 60);
}

function closeOrderModal() {
  const modal = document.getElementById("orderModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function updatePricePreview() {
  const service = services.find((item) => item.id === document.getElementById("serviceSelect").value);
  document.getElementById("selectedServiceName").textContent = service?.name || "Выберите услугу";
  document.getElementById("selectedServicePrice").textContent = service ? formatMoney(service.price) : "0 ₸";
}

function createOrder(formData) {
  const service = services.find((item) => item.id === formData.get("service"));
  if (!service) return;
  const order = {
    id: `PL-${String(Date.now()).slice(-5)}`,
    customer: String(formData.get("customer")).trim(),
    phone: String(formData.get("phone")).trim(),
    car: String(formData.get("car")).trim(),
    service: service.name,
    price: service.price,
    date: String(formData.get("date")),
    time: String(formData.get("time")),
    status: "Новая",
    employeeId: "PL-001",
    note: String(formData.get("note") || "").trim(),
    checklist: []
  };
  orders.push(order);
  saveOrders();
  currentView = "orders";
  closeOrderModal();
  renderAll();
  showToast(`Заказ ${order.id} добавлен в расписание.`);
}

function openOrderDetails(orderId) {
  const order = orders.find((item) => item.id === orderId);
  if (!order) return;
  document.getElementById("detailContent").innerHTML = `
    <div class="detail-heading"><span class="customer-avatar">${escapeHtml(initials(order.customer))}</span><span><h2 id="detailTitle">${escapeHtml(order.customer)}</h2><p>${escapeHtml(order.car)} · ${escapeHtml(order.id)}</p></span></div>
    <label class="field"><span>СТАТУС ЗАКАЗА</span><select class="detail-status-select" id="detailStatus" aria-label="Статус заказа">${["Новая", "В работе", "Готово", "Отменена"].map((status) => `<option ${order.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
    <div class="detail-block"><h3>ИНФОРМАЦИЯ О ЗАКАЗЕ</h3><div class="detail-list">
      <div class="detail-row"><span>Услуга</span><b>${escapeHtml(order.service)}</b></div><div class="detail-row"><span>Стоимость</span><b>${formatMoney(order.price)}</b></div>
      <div class="detail-row"><span>Дата и время</span><b>${escapeHtml(formatShortDate(order.date))}, ${escapeHtml(order.time)}</b></div>
      <div class="detail-row"><span>Телефон</span><b><a href="tel:${escapeHtml(order.phone.replace(/[^+\d]/g, ""))}">${escapeHtml(order.phone)}</a></b></div>
    </div></div>
    <div class="detail-block"><h3>КОММЕНТАРИЙ</h3><div class="detail-note">${order.note ? escapeHtml(order.note) : "Клиент не оставил комментарий."}</div></div>
    <div class="detail-block checkin-block"><div class="checkin-heading"><h3>ЧЕК-ЛИСТ ПРИЁМКИ</h3><span class="check-progress-count">${order.checklist.length} / ${checkInItems.length}</span></div><div class="check-progress"><span style="width:${order.checklist.length / checkInItems.length * 100}%"></span></div><div class="checklist">${checkInItems.map((item, index) => `<label class="checklist-item"><input type="checkbox" data-check-index="${index}" ${order.checklist.includes(index) ? "checked" : ""}><span class="custom-check"></span><span>${item}</span></label>`).join("")}</div></div>
    <div class="drawer-actions"><button type="button" class="delete-button" id="deleteOrder">Удалить заказ</button><button type="button" class="button-primary" id="closeDetails">Готово</button></div>`;

  document.querySelectorAll("[data-check-index]").forEach((checkbox) => checkbox.addEventListener("change", (event) => {
    const index = Number(event.currentTarget.dataset.checkIndex);
    order.checklist = event.currentTarget.checked
      ? [...new Set([...order.checklist, index])]
      : order.checklist.filter((item) => item !== index);
    const percent = order.checklist.length / checkInItems.length * 100;
    document.querySelector(".check-progress-count").textContent = `${order.checklist.length} / ${checkInItems.length}`;
    document.querySelector(".check-progress span").style.width = `${percent}%`;
    saveOrders();
  }));

  document.getElementById("detailStatus").addEventListener("change", (event) => {
    order.status = event.target.value;
    saveOrders();
    renderAll();
    openOrderDetails(order.id);
    showToast(`Статус заказа изменён: ${order.status.toLowerCase()}.`);
  });
  document.getElementById("deleteOrder").addEventListener("click", () => {
    orders = orders.filter((item) => item.id !== orderId);
    saveOrders();
    closeOrderDetails();
    renderAll();
    showToast("Заказ удалён.");
  });
  document.getElementById("closeDetails").addEventListener("click", closeOrderDetails);
  const backdrop = document.getElementById("detailBackdrop");
  backdrop.classList.add("open");
  backdrop.setAttribute("aria-hidden", "false");
}

function closeOrderDetails() {
  const backdrop = document.getElementById("detailBackdrop");
  backdrop.classList.remove("open");
  backdrop.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

document.getElementById("newOrderButton").addEventListener("click", () => openOrderModal());
document.getElementById("heroBooking").addEventListener("click", () => openOrderModal());
document.getElementById("emptyAddButton").addEventListener("click", () => openOrderModal());
document.getElementById("popularServiceButton").addEventListener("click", () => openOrderModal("full"));
document.getElementById("serviceSelect").addEventListener("change", updatePricePreview);
document.getElementById("orderForm").addEventListener("submit", (event) => {
  event.preventDefault();
  createOrder(new FormData(event.currentTarget));
  event.currentTarget.reset();
});
document.getElementById("searchInput").addEventListener("input", renderOrderTable);
document.getElementById("statusFilter").addEventListener("change", renderOrderTable);
document.getElementById("seeAllButton").addEventListener("click", () => { currentView = "orders"; renderAll(); });
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeOrderModal));
document.getElementById("orderModal").addEventListener("click", (event) => { if (event.target.id === "orderModal") closeOrderModal(); });
document.getElementById("closeDrawer").addEventListener("click", closeOrderDetails);
document.getElementById("detailBackdrop").addEventListener("click", (event) => { if (event.target.id === "detailBackdrop") closeOrderDetails(); });
document.getElementById("ordersTableBody").addEventListener("click", (event) => {
  const serviceButton = event.target.closest("[data-book-service]");
  if (serviceButton) { openOrderModal(serviceButton.dataset.bookService); return; }
  const row = event.target.closest("[data-order-id]");
  if (row) openOrderDetails(row.dataset.orderId);
});
document.getElementById("ordersTableBody").addEventListener("keydown", (event) => {
  const row = event.target.closest("[data-order-id]");
  if (row && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openOrderDetails(row.dataset.orderId); }
});
document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => {
  currentView = button.dataset.view;
  document.getElementById("sidebar").classList.remove("open");
  renderAll();
}));
document.getElementById("mobileMenu").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeOrderModal();
    closeOrderDetails();
    document.getElementById("sidebar").classList.remove("open");
  }
});

renderAll();
window.setInterval(renderDateAndClock, 60_000);
