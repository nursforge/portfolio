const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".project-card");
const count = document.querySelector(".project-count");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    let visible = 0;

    filters.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    cards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });

    count.textContent = `${String(visible).padStart(2, "0")} проекта`;
  });
});
