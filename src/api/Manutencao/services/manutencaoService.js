const {
  verEstadoManutencao,
  atualizarManutencao,
} = require("../repositories/manutencaoRepository");

async function obterConfiguracoesManutencao() {
  const configuracoes = await verEstadoManutencao();
  return configuracoes;
}

async function alterarConfiguracoesManutencao(ativarManutencao) {
  const configuracoesAtualizadas = await atualizarManutencao(ativarManutencao);

  return configuracoesAtualizadas;
}

module.exports = {
  obterConfiguracoesManutencao,
  alterarConfiguracoesManutencao,
};
