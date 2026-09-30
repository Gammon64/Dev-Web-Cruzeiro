document.querySelectorAll(".site-nav").forEach((nav) => {
  const toggle = nav.querySelector(".menu-toggle");
  const menu = nav.querySelector(".nav-list");

  if (!toggle || !menu) return;

  const setMenuOpen = (isOpen) => {
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    menu.classList.toggle("is-active", isOpen);
  };

  toggle.addEventListener("click", () => {
    setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || toggle.getAttribute("aria-expanded") !== "true") return;
    setMenuOpen(false);
    toggle.focus();
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) setMenuOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 769px)").matches) setMenuOpen(false);
  });
});