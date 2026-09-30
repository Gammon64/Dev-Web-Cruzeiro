const volunteerStorageKey = "voluntarios_ong";

export const obterHistorico = () => {
  const storedVolunteers = localStorage.getItem(volunteerStorageKey);
  if (!storedVolunteers) return [];

  const volunteers = JSON.parse(storedVolunteers);
  if (!Array.isArray(volunteers)) throw new Error("O histórico de cadastros está inválido.");
  return volunteers;
};

export const salvarVoluntario = (volunteer) => {
  const volunteers = obterHistorico();
  volunteers.push(volunteer);
  localStorage.setItem(volunteerStorageKey, JSON.stringify(volunteers));
};