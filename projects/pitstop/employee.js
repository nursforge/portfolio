const PROFILE_KEY = "pitlane.employee.v1";
const ORDERS_KEY = "pitlane.orders.v1";

const defaultProfile = {
  id: "PL-001",
  name: "Нурсултан Манапов",
  role: "Администратор",
  phone: "",
  email: "",
  shift: "09:00—21:00",
  location: "PITLANE GARAGE · Астана, Бокс 01"
};

let profile = readStorage(PROFILE_KEY, defaultProfile);
let toastTimer;

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(fallback)) return Array.isArray(value) ? value : fallback;
    return value && typeof value === "object" ? { ...fallback, ...value } : { ...fallback };
  } catch {
    return { ...fallback };
  }
}

function saveProfile() {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    showToast("Браузер не разрешил сохранить профиль.");
  }
}

function getInitials(name) {
  return String(name).trim().split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();
}

function renderProfile() {
  const initials = getInitials(profile.name);
  document.getElementById("employeeName").textContent = profile.name;
  document.getElementById("employeeRole").textContent = profile.role;
  document.getElementById("accessRole").textContent = profile.role;
  document.getElementById("employeeAvatar").textContent = initials;
  document.getElementById("sidebarAvatar").textContent = initials;
  document.getElementById("topAvatar").textContent = initials;
  document.getElementById("sidebarName").textContent = profile.name.split(/\s+/)[0];
  document.getElementById("sidebarRole").textContent = profile.role;
  document.getElementById("employeeCode").textContent = profile.id;
  document.getElementById("employeeLocation").textContent = profile.location || "Не указана";
  document.getElementById("employeeShift").textContent = profile.shift || "Не указан";
  setContactField("employeePhone", profile.phone, "Не указан");
  setContactField("employeeEmail", profile.email, "Не указана");
  renderOrderMetrics();
  renderClock();
}

function setContactField(id, value, emptyText) {
  const element = document.getElementById(id);
  element.textContent = value || emptyText;
  element.classList.toggle("empty-value", !value);
}

function renderOrderMetrics() {
  const orders = readStorage(ORDERS_KEY, []);
  const assigned = Array.isArray(orders) ? orders.filter((order) => (order.employeeId || "PL-001") === profile.id) : [];
  const completed = assigned.filter((order) => order.status === "Готово").length;
  const active = assigned.filter((order) => order.status === "В работе" || order.status === "Новая").length;
  const denominator = assigned.filter((order) => order.status !== "Отменена").length;
  const ratio = denominator ? Math.round(completed / denominator * 100) : 0;

  document.getElementById("assignedOrders").textContent = String(assigned.length).padStart(2, "0");
  document.getElementById("completedOrders").textContent = String(completed).padStart(2, "0");
  document.getElementById("activeOrders").textContent = String(active).padStart(2, "0");
  document.getElementById("completionRate").textContent = `${ratio}%`;
  document.getElementById("completionMeter").style.width = `${ratio}%`;
}

function renderClock() {
  document.getElementById("shiftClock").textContent = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function openEditModal() {
  const form = document.getElementById("profileForm");
  for (const [key, value] of Object.entries(profile)) {
    if (form.elements.namedItem(key)) form.elements.namedItem(key).value = value || "";
  }
  const modal = document.getElementById("profileModal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  window.setTimeout(() => form.elements.name.focus(), 50);
}

function closeEditModal() {
  const modal = document.getElementById("profileModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

document.getElementById("editProfileButton").addEventListener("click", openEditModal);
document.getElementById("noteEditButton").addEventListener("click", openEditModal);
document.querySelectorAll("[data-close-profile]").forEach((button) => button.addEventListener("click", closeEditModal));
document.getElementById("profileModal").addEventListener("click", (event) => {
  if (event.target.id === "profileModal") closeEditModal();
});
document.getElementById("profileForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  profile = {
    ...profile,
    name: String(data.get("name")).trim(),
    role: String(data.get("role")).trim(),
    phone: String(data.get("phone") || "").trim(),
    email: String(data.get("email") || "").trim(),
    shift: String(data.get("shift")).trim(),
    location: String(data.get("location")).trim()
  };
  saveProfile();
  renderProfile();
  closeEditModal();
  showToast("Данные сотрудника сохранены.");
});
document.getElementById("mobileMenu").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeEditModal();
    document.getElementById("sidebar").classList.remove("open");
  }
});

renderProfile();
window.setInterval(renderClock, 60_000);
