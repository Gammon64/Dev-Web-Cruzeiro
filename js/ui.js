const projects = [
  {
    titulo: "Programa Código Cidadão",
    descricao:
      "Oficinas gratuitas de lógica de programação e desenvolvimento web para jovens do ensino médio público. O projeto visa inserir novos talentos no mercado de tecnologia.",
  },
  {
    titulo: "Inclusão Digital para Terceira Idade",
    descricao:
      "Aulas práticas de uso de smartphones, segurança na internet e navegação básica, promovendo a independência tecnológica de idosos.",
  },
];

export const renderizarProjetos = () => {
  const projectList = document.querySelector("[data-project-list]");
  if (!projectList) return;

  projectList.innerHTML = projects
    .map((project) => `
      <article class="projeto">
        <h3>${project.titulo}</h3>
        <p>${project.descricao}</p>
      </article>
    `)
    .join("");
};

export const renderizarHistorico = (volunteers) => {
  const list = document.querySelector("#volunteer-history-list");
  const emptyMessage = document.querySelector("#volunteer-history-empty");
  if (!list || !emptyMessage) return;

  list.replaceChildren();
  volunteers.forEach((volunteer) => {
    if (!volunteer || typeof volunteer.nome !== "string" || typeof volunteer.email !== "string") return;

    const item = document.createElement("li");
    const name = document.createElement("strong");
    name.textContent = volunteer.nome;
    item.append(name, document.createTextNode(` - ${volunteer.email}`));
    list.append(item);
  });
  emptyMessage.hidden = list.childElementCount > 0;
};

export const renderizarErroHistorico = () => {
  const list = document.querySelector("#volunteer-history-list");
  const emptyMessage = document.querySelector("#volunteer-history-empty");
  if (!list || !emptyMessage) return;

  list.replaceChildren();
  emptyMessage.textContent = "Não foi possível recuperar o histórico salvo neste dispositivo.";
  emptyMessage.hidden = false;
};

export const renderizarPagina = (documentMarkup, url) => {
  const pageDocument = new DOMParser().parseFromString(documentMarkup, "text/html");
  const mainContainer = document.querySelector("main");
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

  document.dispatchEvent(new CustomEvent("page:rendered"));
  fecharMenus();
  window.scrollTo(0, 0);
};

export const fecharMenus = () => {
  document.querySelectorAll(".menu-toggle[aria-expanded='true']").forEach((toggle) => {
    const menu = document.getElementById(toggle.getAttribute("aria-controls"));
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    menu?.classList.remove("is-active");
  });
};

export const renderizarFeedbackCampo = (form, field, message) => {
  const feedback = form.querySelector(`#${field.id}-feedback`);
  if (feedback) feedback.textContent = message;
  field.classList.toggle("is-invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
};

export const renderizarResumoErros = (form, invalidFields) => {
  const errorSummary = form.querySelector("#form-errors");
  if (invalidFields.length === 0) {
    errorSummary.hidden = true;
    errorSummary.textContent = "";
    return;
  }

  errorSummary.textContent = `Não foi possível enviar. Revise ${invalidFields.length === 1 ? "o campo destacado" : "os campos destacados"} e tente novamente.`;
  errorSummary.hidden = false;
};

export const atualizarStatusFormulario = (form, message, visible = true) => {
  const statusMessage = form.querySelector("#form-status");
  statusMessage.textContent = message;
  statusMessage.hidden = !visible;
};

export const definirEnvioEmAndamento = (form, isSubmitting) => {
  const submitButton = form.querySelector("#submit-cadastro");
  form.toggleAttribute("aria-busy", isSubmitting);
  submitButton.disabled = isSubmitting;
  submitButton.textContent = isSubmitting ? "Enviando..." : "Enviar Cadastro";
};

export const limparFeedbackFormulario = (form, fields) => {
  fields.forEach((field) => {
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
    const feedback = form.querySelector(`#${field.id}-feedback`);
    if (feedback) feedback.textContent = "";
  });
};

export const exibirNotificacao = (type, title, text = "") => {
  if (!window.Swal) return false;

  window.Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    customClass: { popup: "ong-alerta-custom" },
  }).fire({ icon: type, title, text });
  return true;
};