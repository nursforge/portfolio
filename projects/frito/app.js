const products = [
  // Боксы
  { id: "salsa-box", name: "Сальса бокс", category: "box", description: "Сальса бургер, 3 стрипса, фирменный картофель фри, напиток 0,5 л на выбор и фирменный соус Frito.", price: 4090, image: "images/hero.jpg" },
  { id: "cheese-bbq-box", name: "Чиз BBQ бокс", category: "box", description: "Чиз BBQ бургер, 3 стрипса, картофель фри, напиток 0,5 л на выбор и фирменный соус Frito.", price: 4090, image: "images/hero.jpg" },
  { id: "seoul-box", name: "Сеул бокс", category: "box", description: "Сеул бургер, фирменный фри, три куриных стрипса, напиток 0,5 л и фирменный соус Frito.", price: 4190, image: "images/strips.jpg" },
  { id: "classic-box", name: "Классический бокс", category: "box", description: "Классический бургер, 3 стрипса, фри, фирменный соус Frito и напиток 0,5 л на выбор.", price: 3890, image: "images/hero.jpg" },
  { id: "crispy-box", name: "Криспи бокс", category: "box", description: "Криспи бургер, 3 стрипса, фри, напиток 0,5 л на выбор и фирменный соус Frito.", price: 4090, image: "images/strips.jpg" },
  { id: "deluxe-box", name: "Делюкс бокс", category: "box", description: "Делюкс бургер, 3 стрипса, фирменный картофель фри, напиток 0,5 л на выбор и фирменный соус Frito.", price: 4190, image: "images/hero.jpg" },
  // Комбо
  { id: "strips-combo", name: "Стрипсы комбо", category: "combo", description: "5 стрипсов, фирменный картофель фри и напиток 0,5 л.", price: 3390, image: "images/strips.jpg" },
  { id: "rap-cheese-bbq-combo", name: "Рап Чиз BBQ комбо", category: "combo", description: "Фритос, фирменный картофель фри, напиток 0,5 л на выбор и фирменный соус Frito.", price: 3290, image: "images/crispy.jpg" },
  { id: "salsa-combo", name: "Сальса комбо", category: "combo", description: "Сальса бургер, фирменный картофель фри, напиток 0,5 л на выбор и фирменный соус Frito.", price: 3390, image: "images/hero.jpg" },
  { id: "cheese-bbq-combo", name: "Чиз BBQ комбо", category: "combo", description: "Чиз BBQ бургер, картофель фри, напиток 0,5 л на выбор и фирменный соус Frito.", price: 3390, image: "images/hero.jpg" },
  { id: "seoul-combo", name: "Сеул комбо", category: "combo", description: "Сеул бургер, фирменный фри, напиток 0,5 л и фирменный соус Frito.", price: 3490, image: "images/crispy.jpg" },
  { id: "classic-combo", name: "Классический комбо", category: "combo", description: "Классический бургер, картофель фри, напиток 0,5 л на выбор и фирменный соус Frito.", price: 3190, image: "images/hero.jpg" },
  { id: "crispy-combo", name: "Криспи комбо", category: "combo", description: "Криспи бургер, картофель фри, напиток 0,5 л на выбор и фирменный соус Frito.", price: 3390, image: "images/hero.jpg" },
  { id: "fritos-combo", name: "Фритос комбо", category: "combo", description: "Фритос, фирменный картофель фри, напиток 0,5 л на выбор и фирменный соус Frito.", price: 3290, image: "images/crispy.jpg" },
  { id: "deluxe-combo", name: "Делюкс комбо", category: "combo", description: "Делюкс бургер, фирменный картофель фри, напиток 0,5 л на выбор и фирменный соус Frito.", price: 3490, image: "images/hero.jpg" },
  // Бургеры
  { id: "salsa-burger", name: "Сальса бургер", category: "burger", description: "Булочка бриошь, малосольные огурчики, маринованное куриное филе в панировке, соус сальса, сыр Гауда и коул-слоу.", price: 2090, image: "images/hero.jpg" },
  { id: "cheese-bbq-burger", name: "Чиз BBQ бургер", category: "burger", description: "Булочка бриошь, айсберг, малосольные огурчики, куриное филе в панировке, соус Чиз BBQ и сыр Гауда.", price: 2090, image: "images/crispy.jpg" },
  { id: "crispy-burger", name: "Криспи бургер", category: "burger", description: "Булочка бриошь, огурчики, коул-слоу, куриное филе в панировке, сыр Гауда и соус Frito.", price: 2090, image: "images/hero.jpg" },
  { id: "seoul-burger", name: "Сеул бургер", category: "burger", description: "Булочка бриошь, огурчики, куриное филе в панировке в корейском остро-сладком соусе и белый соус Frito.", price: 2090, image: "images/crispy.jpg" },
  { id: "classic-burger", name: "Классический бургер", category: "burger", description: "Булочка бриошь, малосольные огурчики, куриное филе в панировке и фирменный соус Frito.", price: 1890, image: "images/hero.jpg" },
  { id: "deluxe-burger", name: "Делюкс бургер", category: "burger", description: "Булочка бриошь, огурчики, лист салата, куриное филе в панировке, соус Frito, сыр Гауда и томат.", price: 2090, image: "images/hero.jpg" },
  // Твистеры
  { id: "rap-cheese-bbq", name: "Рап Чиз BBQ", category: "twister", description: "Секретный белый соус, томаты, сыр, айсберг и сочная курочка.", price: 1890, image: "images/crispy.jpg" },
  { id: "fritos-wrap", name: "Фритос", category: "twister", description: "Секретный белый соус, томаты, сыр, айсберг и сочная курочка.", price: 1890, image: "images/crispy.jpg" },
  // Закуски
  { id: "strips-s", name: "Стрипсы S", category: "snack", description: "Маринованное куриное филе в панировке — 3 штуки.", price: 1490, image: "images/strips.jpg" },
  { id: "strips-m", name: "Стрипсы M", category: "snack", description: "Маринованное куриное филе в панировке — 5 штук.", price: 2090, image: "images/strips.jpg" },
  { id: "fries", name: "Фирменный картофель фри", category: "snack", description: "Фирменный картофель фри со специями от Frito.", price: 750, image: "images/fries.jpg" },
  // Напитки
  { id: "fuse-strawberry-melon", name: "Fuse-tea клубника-дыня 0,5 л", category: "drink", description: "Чайный напиток со вкусом клубники и дыни.", price: 650, image: "images/drinks.jpg" },
  { id: "sprite-draft", name: "Sprite разлив 0,5 л", category: "drink", description: "Газированный напиток с лёгким цитрусовым вкусом.", price: 650, image: "images/drinks.jpg" },
  { id: "bonaqua", name: "Bonaqua 0,5 л", category: "drink", description: "Вода без газа.", price: 350, image: "images/drinks.jpg" },
  { id: "cola-draft", name: "Coca-Cola разлив 0,5 л", category: "drink", description: "Освежающий газированный напиток.", price: 650, image: "images/drinks.jpg" },
  { id: "fanta-draft", name: "Fanta разлив 0,5 л", category: "drink", description: "Апельсиновый газированный напиток.", price: 650, image: "images/drinks.jpg" },
  { id: "fuse-mango-pineapple", name: "Fuse-tea манго-ананас 0,5 л", category: "drink", description: "Чайный напиток со вкусом манго и ананаса.", price: 650, image: "images/drinks.jpg" },
  { id: "cola", name: "Coca-Cola 0,5 л", category: "drink", description: "Газированный напиток с освежающим вкусом.", price: 650, image: "images/drinks.jpg" },
  { id: "fuse-peach", name: "Fuse-tea персик 0,5 л", category: "drink", description: "Холодный чай со вкусом персика.", price: 650, image: "images/drinks.jpg" },
  { id: "cola-zero", name: "Coca-Cola Zero 0,5 л", category: "drink", description: "Освежающий напиток без сахара.", price: 650, image: "images/drinks.jpg" },
  { id: "fanta", name: "Fanta 0,5 л", category: "drink", description: "Апельсиновый газированный напиток.", price: 650, image: "images/drinks.jpg" },
  { id: "fuse-berry", name: "Fuse-tea ягодный 0,5 л", category: "drink", description: "Холодный чай с ягодным вкусом.", price: 650, image: "images/drinks.jpg" },
  { id: "sprite", name: "Sprite 0,5 л", category: "drink", description: "Освежающий газированный напиток с цитрусовым вкусом.", price: 650, image: "images/drinks.jpg" },
  { id: "fuse-mango-chamomile", name: "Fuse-tea манго-ромашка 0,5 л", category: "drink", description: "Чайный напиток со вкусом манго и ромашки.", price: 650, image: "images/drinks.jpg" },
  // Соусы
  { id: "cheese-sauce", name: "Соус сырный Astoria дипод", category: "sauce", description: "Кремовый соус с насыщенным сырным вкусом.", price: 200, image: "images/sauces.jpg" },
  { id: "ketchup", name: "Соус кетчуп Astoria дипод", category: "sauce", description: "Томатный соус с ярким сладко-пряным вкусом.", price: 200, image: "images/sauces.jpg" },
  { id: "frito-sauce-50", name: "Соус Frito 50 мл", category: "sauce", description: "Авторский кисло-сладкий фирменный соус.", price: 250, image: "images/sauces.jpg" },
  { id: "frito-sauce-30", name: "Соус Frito 30 мл", category: "sauce", description: "Авторский кисло-сладкий фирменный соус.", price: 200, image: "images/sauces.jpg" },
  { id: "bbq-sauce", name: "Соус барбекю Astoria дипод", category: "sauce", description: "Соус барбекю для фри и хрустящей курочки.", price: 200, image: "images/sauces.jpg" },
  { id: "garlic-sauce", name: "Соус чесночный Astoria дипод", category: "sauce", description: "Нежный чесночный соус.", price: 200, image: "images/sauces.jpg" }
];

const categoryNames = { box: "Боксы", combo: "Комбо", burger: "Бургеры", twister: "Твистеры", snack: "Закуски", drink: "Напитки", sauce: "Соусы" };
const menuGrid = document.getElementById("menuGrid");
let cart = loadCart();
let activeFilter = "all";
let toastTimer;

function loadCart() {
  try { return new Map(JSON.parse(localStorage.getItem("frito-cart") || "[]")); }
  catch { return new Map(); }
}

function saveCart() {
  localStorage.setItem("frito-cart", JSON.stringify([...cart.entries()]));
}

function renderMenu() {
  if (!menuGrid) return;
  const visibleProducts = activeFilter === "all" ? products : products.filter((product) => product.category === activeFilter);
  let previousCategory = "";
  menuGrid.innerHTML = visibleProducts.map((product) => {
    const heading = activeFilter === "all" && product.category !== previousCategory
      ? `<h2 class="menu-category-heading" id="${product.category === "box" ? "boxes" : product.category === "burger" ? "burgers" : product.category === "snack" ? "snacks" : product.category}">${categoryNames[product.category]}</h2>`
      : "";
    previousCategory = product.category;
    return `${heading}<article class="product-card"><div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy"><span class="product-category">${categoryNames[product.category]}</span></div><div class="product-body"><h3>${product.name}</h3><p>${product.description}</p><div class="product-bottom"><span class="product-price">${formatPrice(product.price)}</span><button class="add-button" type="button" data-add="${product.id}">+ В корзину</button></div></div></article>`;
  }).join("");
}

function formatPrice(value) { return `${Number(value).toLocaleString("ru-RU")} ₸`; }

function renderCart() {
  const items = [...cart.values()];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  document.getElementById("cartCount").textContent = itemCount;
  document.getElementById("cartTotal").textContent = formatPrice(total);
  const cartItems = document.getElementById("cartItems");
  if (cart.size === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Пока тут пусто. Добавь что-нибудь хрустящее из меню.</p>';
  } else {
    cartItems.innerHTML = items.map(({ product, quantity }) => `<div class="cart-row"><div><strong>${product.name}</strong><small>${formatPrice(product.price)} / шт.</small></div><div class="quantity"><button type="button" data-quantity="${product.id}" data-step="-1" aria-label="Убрать один">−</button><span>${quantity}</span><button type="button" data-quantity="${product.id}" data-step="1" aria-label="Добавить один">+</button></div></div>`).join("");
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function setCartOpen(isOpen) {
  document.getElementById("drawerBackdrop").classList.toggle("open", isOpen);
  const drawer = document.getElementById("cartDrawer");
  drawer.classList.toggle("open", isOpen);
  drawer.setAttribute("aria-hidden", String(!isOpen));
  document.body.classList.toggle("locked", isOpen);
  if (isOpen) document.getElementById("closeCart").focus();
}

if (menuGrid) menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const product = products.find((item) => item.id === button.dataset.add);
  const current = cart.get(product.id);
  cart.set(product.id, { product, quantity: (current?.quantity || 0) + 1 });
  saveCart(); renderCart(); showToast(`${product.name} добавлен в корзину`);
});

document.querySelector(".filters")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter").forEach((filter) => filter.classList.toggle("active", filter === button));
  renderMenu();
});

document.getElementById("cartItems").addEventListener("click", (event) => {
  const button = event.target.closest("[data-quantity]");
  if (!button) return;
  const item = cart.get(button.dataset.quantity);
  item.quantity += Number(button.dataset.step);
  if (item.quantity <= 0) cart.delete(button.dataset.quantity);
  saveCart(); renderCart();
});

document.getElementById("openCart").addEventListener("click", () => setCartOpen(true));
document.getElementById("closeCart").addEventListener("click", () => setCartOpen(false));
document.getElementById("drawerBackdrop").addEventListener("click", () => setCartOpen(false));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") { setCartOpen(false); closeCityPicker(); } });
document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("nav").classList.toggle("open"));
document.querySelectorAll(".nav a").forEach((link) => link.addEventListener("click", () => document.getElementById("nav").classList.remove("open")));

const cities = [
  { name: "Астана", locative: "Астане" }, { name: "Алматы", locative: "Алматы" },
  { name: "Шымкент", locative: "Шымкенту" }, { name: "Караганда", locative: "Караганде" },
  { name: "Актобе", locative: "Актобе" }
];
const cityModal = document.getElementById("cityModal");
const currentCity = localStorage.getItem("frito-city") || "Астана";

function updateCity(name) {
  const city = cities.find((item) => item.name === name) || cities[0];
  document.getElementById("cityTrigger").innerHTML = `${city.name} <span aria-hidden="true">⌄</span>`;
  document.querySelectorAll("[data-city-label]").forEach((label) => { label.textContent = label.closest(".footer-contact") ? city.name : city.locative; });
  document.querySelector(".topline").setAttribute("aria-label", `Выбран город ${city.name}`);
  localStorage.setItem("frito-city", city.name);
}

function openCityPicker() {
  document.getElementById("cityOptions").innerHTML = cities.map((city) => `<button class="city-option ${city.name === (localStorage.getItem("frito-city") || "Астана") ? "selected" : ""}" type="button" data-city="${city.name}">${city.name}<span>↗</span></button>`).join("");
  cityModal.classList.add("open"); cityModal.setAttribute("aria-hidden", "false"); document.body.classList.add("locked");
}
function closeCityPicker() { cityModal.classList.remove("open"); cityModal.setAttribute("aria-hidden", "true"); document.body.classList.remove("locked"); }
document.getElementById("cityTrigger").addEventListener("click", openCityPicker);
cityModal.addEventListener("click", (event) => {
  if (event.target.closest("[data-city-close]")) closeCityPicker();
  const choice = event.target.closest("[data-city]");
  if (choice) { updateCity(choice.dataset.city); closeCityPicker(); showToast(`Город: ${choice.dataset.city}`); }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));

updateCity(currentCity);
renderMenu();
renderCart();
