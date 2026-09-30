const mainContainer = document.querySelector("main");

const closeMenus = () => {
  document.querySelectorAll(".menu-toggle[aria-expanded='true']").forEach((toggle) => {
    const menu = document.getElementById(toggle.getAttribute("aria-controls"));
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    menu?.classList.remove("is-active");
  });
};

const renderPage = (documentMarkup, url) => {
  const pageDocument = new DOMParser().parseFromString(documentMarkup, "text/html");
  const nextMain = pageDocument.querySelector("main");

  if (!nextMain || !mainContainer) throw new Error("A página não contém um elemento main.");

  mainContainer.innerHTML = nextMain.innerHTML;
  mainContainer.className = nextMain.className;
  document.title = pageDocument.title;

  document.querySelectorAll("[data-link]").forEach((link) => {
    const isCurrentPage = new URL(link.href, window.location.href).pathname === url.pathname;
    if (isCurrentPage) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  closeMenus();
  window.scrollTo(0, 0);
};

const loadPage = async (url) => {
  const response = await fetch(url.href, { headers: { Accept: "text/html" } });
  if (!response.ok) throw new Error(`Falha ao carregar a página (${response.status}).`);
  renderPage(await response.text(), url);
};

document.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const menuToggle = target.closest(".menu-toggle");
  if (menuToggle) {
    const menu = document.getElementById(menuToggle.getAttribute("aria-controls"));
    if (!menu) return;

    const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    menu.classList.toggle("is-active", isOpen);
    return;
  }

  const link = target.closest("a[data-link]");
  if (!link) {
    if (!target.closest(".site-nav")) closeMenus();
    return;
  }

  if (
    window.location.protocol === "file:" ||
    event.button !== 0 ||
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
    link.target === "_blank" || link.hasAttribute("download")
  ) {
    closeMenus();
    return;
  }

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return;

  event.preventDefault();
  try {
    window.history.pushState({}, "", url.href);
    await loadPage(url);
  } catch {
    window.location.assign(url.href);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openToggle = document.querySelector(".menu-toggle[aria-expanded='true']");
  if (!openToggle) return;
  closeMenus();
  openToggle.focus();
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 769px)").matches) closeMenus();
});

window.addEventListener("popstate", () => {
  loadPage(new URL(window.location.href)).catch(() => window.location.reload());
});

document.addEventListener("input", (event) => {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;

  let value = input.value.replace(/\D/g, "");
  if (input.matches("#cpf")) {
    if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, "$1.$2");
    if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  } else if (input.matches("#telefone")) {
    if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    if (value.length > 10) value = value.replace(/(\d{5})(\d)/, "$1-$2");
  } else if (input.matches("#cep")) {
    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  } else {
    return;
  }

  input.value = value;
});
