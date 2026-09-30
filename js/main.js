import { obterHistorico, salvarVoluntario } from "./storage.js";
import {
  atualizarStatusFormulario,
  definirEnvioEmAndamento,
  exibirNotificacao,
  fecharMenus,
  limparFeedbackFormulario,
  renderizarErroHistorico,
  renderizarFeedbackCampo,
  renderizarHistorico,
  renderizarProjetos,
  renderizarResumoErros,
} from "./ui.js";
import { formatarCampo, obterCamposInvalidos, obterMensagemDoCampo } from "./validation.js";
import { carregarRotaAtual, navegarPara } from "./router.js";

const formStates = new WeakMap();

const atualizarHistorico = () => {
  try {
    renderizarHistorico(obterHistorico());
  } catch {
    renderizarErroHistorico();
  }
};

const obterEstadoFormulario = (form) => {
  if (!formStates.has(form)) {
    formStates.set(form, { touchedFields: new Set(), submissionAttempted: false });
  }
  return formStates.get(form);
};

const atualizarFeedbackCampo = (form, field) => {
  renderizarFeedbackCampo(form, field, obterMensagemDoCampo(field));
};

const enviarCadastro = async (form) => {
  const fields = [...form.querySelectorAll("input")];
  const state = obterEstadoFormulario(form);
  state.submissionAttempted = true;
  atualizarStatusFormulario(form, "", false);

  const invalidFields = obterCamposInvalidos(form);
  fields.forEach((field) => atualizarFeedbackCampo(form, field));
  if (invalidFields.length > 0) {
    renderizarResumoErros(form, invalidFields);
    invalidFields[0].focus();
    return;
  }

  renderizarResumoErros(form, []);
  definirEnvioEmAndamento(form, true);
  atualizarStatusFormulario(form, "Enviando seu cadastro...");
  await new Promise((resolve) => window.setTimeout(resolve, 800));

  const protocol = `ONG-${Date.now().toString().slice(-6)}`;
  const volunteer = {
    ...Object.fromEntries(new FormData(form).entries()),
    protocol,
    submittedAt: new Date().toISOString(),
  };

  try {
    salvarVoluntario(volunteer);
    atualizarHistorico();
  } catch {
    definirEnvioEmAndamento(form, false);
    atualizarStatusFormulario(form, "Não foi possível salvar seu cadastro neste dispositivo. Tente novamente.");
    exibirNotificacao("error", "Não foi possível salvar o cadastro.");
    return;
  }

  definirEnvioEmAndamento(form, false);
  const notificationShown = exibirNotificacao(
    "success",
    "Cadastro recebido com sucesso!",
    `Protocolo: ${protocol}`,
  );
  atualizarStatusFormulario(
    form,
    `Cadastro recebido com sucesso. Nossa equipe entrará em contato. Protocolo: ${protocol}.`,
    !notificationShown,
  );
  form.reset();
  limparFeedbackFormulario(form, fields);
  state.submissionAttempted = false;
  state.touchedFields.clear();
};

document.addEventListener("page:rendered", () => {
  renderizarProjetos();
  atualizarHistorico();
});

renderizarProjetos();
atualizarHistorico();

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
    if (!target.closest(".site-nav")) fecharMenus();
    return;
  }

  if (
    window.location.protocol === "file:" ||
    event.button !== 0 ||
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
    link.target === "_blank" || link.hasAttribute("download")
  ) {
    fecharMenus();
    return;
  }

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return;

  event.preventDefault();
  try {
    await navegarPara(url);
  } catch {
    window.location.assign(url.href);
  }
});

document.addEventListener("focusout", (event) => {
  const field = event.target;
  if (!(field instanceof HTMLInputElement)) return;
  const form = field.closest("#cadastro-form");
  if (!form) return;

  obterEstadoFormulario(form).touchedFields.add(field);
  atualizarFeedbackCampo(form, field);
});

document.addEventListener("input", (event) => {
  const field = event.target;
  if (!(field instanceof HTMLInputElement)) return;

  formatarCampo(field);
  const form = field.closest("#cadastro-form");
  if (!form) return;

  const state = obterEstadoFormulario(form);
  if (!state.submissionAttempted && !state.touchedFields.has(field)) return;
  atualizarFeedbackCampo(form, field);
  if (state.submissionAttempted) {
    renderizarResumoErros(form, obterCamposInvalidos(form));
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches("#cadastro-form")) return;

  event.preventDefault();
  enviarCadastro(form);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const openToggle = document.querySelector(".menu-toggle[aria-expanded='true']");
  if (!openToggle) return;
  fecharMenus();
  openToggle.focus();
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 769px)").matches) fecharMenus();
});

window.addEventListener("popstate", () => {
  carregarRotaAtual().catch(() => window.location.reload());
});