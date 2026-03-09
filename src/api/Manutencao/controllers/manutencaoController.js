const {
  obterConfiguracoesManutencao,
  alterarConfiguracoesManutencao,
} = require("../services/manutencaoService");

async function buscarManutencao(req, res, next) {
  try {
    const configuracoes = await obterConfiguracoesManutencao();
    res.json(configuracoes);
  } catch (error) {
    next(error);
  }
}

async function atualizarManutencao(req, res, next) {
  try {
    const { ativarManutencao } = req.body;
    const configuracoesAtualizadas =
      await alterarConfiguracoesManutencao(ativarManutencao);
    res.json(configuracoesAtualizadas);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buscarManutencao,
  atualizarManutencao,
};
