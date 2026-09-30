import { renderizarPagina } from "./ui.js";

export const carregarPagina = async (url) => {
  const response = await fetch(url.href, { headers: { Accept: "text/html" } });
  if (!response.ok) throw new Error(`Falha ao carregar a página (${response.status}).`);
  renderizarPagina(await response.text(), url);
};

export const navegarPara = async (url) => {
  window.history.pushState({}, "", url.href);
  await carregarPagina(url);
};

export const carregarRotaAtual = () => carregarPagina(new URL(window.location.href));