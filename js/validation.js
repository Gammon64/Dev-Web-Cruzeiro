const fieldPatterns = {
  cpf: { limit: 11, pattern: /^(\d{3})(\d)/, replacement: "$1.$2" },
  telefone: { limit: 11 },
  cep: { limit: 8 },
};

export const formatarCampo = (field) => {
  const format = fieldPatterns[field.id];
  if (!format) return;

  let value = field.value.replace(/\D/g, "").slice(0, format.limit);

  if (field.id === "cpf") {
    if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, "$1.$2");
    if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  } else if (field.id === "telefone") {
    if (value.length > 2) value = value.replace(/^(\d{2})(\d)/, "($1) $2");
    if (value.length > 10) value = value.replace(/(\d{5})(\d)/, "$1-$2");
  } else if (field.id === "cep" && value.length > 5) {
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  }

  field.value = value;
};

export const obterMensagemDoCampo = (field) => {
  const validity = field.validity;

  if (validity.valueMissing) return "Este campo é obrigatório.";
  if (validity.typeMismatch) return "Informe um endereço de e-mail válido.";
  if (field.minLength > 0 && field.value.length > 0 && field.value.length < field.minLength) {
    return `Informe pelo menos ${field.minLength} caracteres.`;
  }
  if (validity.tooShort) return `Informe pelo menos ${field.minLength} caracteres.`;
  if (validity.patternMismatch) {
    const messages = {
      cpf: "Informe o CPF no formato 000.000.000-00.",
      telefone: "Informe o telefone no formato (00) 00000-0000.",
      cep: "Informe o CEP no formato 00000-000.",
    };

    return messages[field.name] || "Confira o formato informado.";
  }

  return "";
};

export const obterCamposInvalidos = (form) => [...form.querySelectorAll("input")]
  .filter((field) => !field.validity.valid);