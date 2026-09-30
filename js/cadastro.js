const formStates = new WeakMap();
const volunteerStorageKey = "voluntarios_ong";

const readVolunteers = () => {
  const storedVolunteers = localStorage.getItem(volunteerStorageKey);
  if (!storedVolunteers) return [];

  const volunteers = JSON.parse(storedVolunteers);
  if (!Array.isArray(volunteers)) throw new Error("O histórico de cadastros está inválido.");
  return volunteers;
};

const renderVolunteerList = () => {
  const list = document.querySelector("#volunteer-history-list");
  const emptyMessage = document.querySelector("#volunteer-history-empty");
  if (!list || !emptyMessage) return;

  try {
    const volunteers = readVolunteers();
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
  } catch {
    list.replaceChildren();
    emptyMessage.textContent = "Não foi possível recuperar o histórico salvo neste dispositivo.";
    emptyMessage.hidden = false;
  }
};

document.addEventListener("DOMContentLoaded", renderVolunteerList);
document.addEventListener("page:rendered", renderVolunteerList);

const getFormState = (form) => {
  if (!formStates.has(form)) {
    formStates.set(form, { touchedFields: new Set(), submissionAttempted: false });
  }
  return formStates.get(form);
};

const getFieldMessage = (field) => {
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

const showFieldFeedback = (form, field) => {
  const message = getFieldMessage(field);
  const feedback = form.querySelector(`#${field.id}-feedback`);

  if (feedback) feedback.textContent = message;
  field.classList.toggle("is-invalid", Boolean(message));
  field.setAttribute("aria-invalid", String(Boolean(message)));
  return message;
};

const refreshErrorSummary = (form, fields) => {
  const errorSummary = form.querySelector("#form-errors");
  const invalidFields = fields.filter((field) => getFieldMessage(field));

  if (invalidFields.length === 0) {
    errorSummary.hidden = true;
    errorSummary.textContent = "";
    return invalidFields;
  }

  errorSummary.textContent = `Não foi possível enviar. Revise ${invalidFields.length === 1 ? "o campo destacado" : "os campos destacados"} e tente novamente.`;
  errorSummary.hidden = false;
  return invalidFields;
};

document.addEventListener("focusout", (event) => {
  const field = event.target;
  const form = field.closest("#cadastro-form");
  if (!form || !field.matches("input")) return;

  getFormState(form).touchedFields.add(field);
  showFieldFeedback(form, field);
});

document.addEventListener("input", (event) => {
  const field = event.target;
  const form = field.closest("#cadastro-form");
  if (!form || !field.matches("input")) return;

  const state = getFormState(form);
  if (!state.submissionAttempted && !state.touchedFields.has(field)) return;
  showFieldFeedback(form, field);
  if (state.submissionAttempted) refreshErrorSummary(form, [...form.querySelectorAll("input")]);
});

document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (!form.matches("#cadastro-form")) return;

  event.preventDefault();
  const fields = [...form.querySelectorAll("input")];
  const errorSummary = form.querySelector("#form-errors");
  const statusMessage = form.querySelector("#form-status");
  const submitButton = form.querySelector("#submit-cadastro");
  const state = getFormState(form);
  state.submissionAttempted = true;
  statusMessage.hidden = true;

  const isValid = form.checkValidity();
  fields.forEach((field) => showFieldFeedback(form, field));
  const invalidFields = isValid
    ? []
    : fields.filter((field) => !field.validity.valid);

  if (invalidFields.length > 0) {
    refreshErrorSummary(form, fields);
    invalidFields[0].focus();
    return;
  }

  errorSummary.hidden = true;
  form.setAttribute("aria-busy", "true");
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";
  statusMessage.className = "form-feedback form-feedback--status";
  statusMessage.textContent = "Enviando seu cadastro...";
  statusMessage.hidden = false;

  await new Promise((resolve) => window.setTimeout(resolve, 800));

  const simulatedResponse = {
    ok: true,
    protocol: `ONG-${Date.now().toString().slice(-6)}`,
    message: "Cadastro recebido com sucesso. Nossa equipe entrará em contato.",
  };

  if (simulatedResponse.ok) {
    try {
      const volunteer = {
        ...Object.fromEntries(new FormData(form).entries()),
        protocol: simulatedResponse.protocol,
        submittedAt: new Date().toISOString(),
      };
      const volunteers = readVolunteers();
      volunteers.push(volunteer);
      localStorage.setItem(volunteerStorageKey, JSON.stringify(volunteers));
      renderVolunteerList();
    } catch {
      form.removeAttribute("aria-busy");
      submitButton.disabled = false;
      submitButton.textContent = "Enviar Cadastro";
      statusMessage.textContent = "Não foi possível salvar seu cadastro neste dispositivo. Tente novamente.";
      statusMessage.hidden = false;
      return;
    }
  }

  form.removeAttribute("aria-busy");
  submitButton.disabled = false;
  submitButton.textContent = "Enviar Cadastro";

  if (simulatedResponse.ok) {
    statusMessage.textContent = `${simulatedResponse.message} Protocolo: ${simulatedResponse.protocol}.`;
    statusMessage.hidden = false;
    form.reset();
    fields.forEach((field) => {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
      form.querySelector(`#${field.id}-feedback`).textContent = "";
    });
    state.submissionAttempted = false;
    state.touchedFields.clear();
    window.setTimeout(() => {
      statusMessage.hidden = true;
      statusMessage.textContent = "";
    }, 5000);
  }
});