function formatarParaBusca(texto) {
  if (!texto) return "";
  return texto
    .toString()
    .normalize("NFD") // Separa os acentos das letras
    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
    .replace(/[^a-zA-Z0-9]/g, "") // Remove tudo que não for letra ou número (incluindo espaços)
    .toUpperCase();
}

function formatarParaSalvar(texto) {
  if (!texto) return "";
  return texto.toString().toUpperCase();
}

module.exports = {
  formatarParaBusca,
  formatarParaSalvar,
};
