// Máscara para CPF: 000.000.000-00
function mascaraCPF(input) {
  let value = input.value.replace(/\D/g, ""); // Remove tudo o que não é dígito
  if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, "$1.$2");
  if (value.length > 6)
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  if (value.length > 9)
    value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  input.value = value;
}

// Máscara para Telefone: (00) 00000-0000
function mascaraTelefone(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length > 2) value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
  if (value.length > 7) value = value.replace(/(\d{5})(\d)/, "$1-$2");
  input.value = value;
}

// Máscara para CEP: 00000-000
function mascaraCEP(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  input.value = value;
}
