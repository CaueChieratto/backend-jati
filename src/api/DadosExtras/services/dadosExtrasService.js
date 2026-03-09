const {
  buscarTodosDadosExtras,
  buscarDadosExtraPorId,
  salvarDadosExtra,
  atualizarDadosExtra,
  deletarDadosExtraFisicamente,
} = require("../repositories/dadosExtrasRepository");

async function listarDadosExtrasService() {
  const dados = await buscarTodosDadosExtras();
  return dados;
}

async function obterDadosExtraPorIdService(id) {
  const dado = await buscarDadosExtraPorId(id);
  if (!dado) {
    throw new Error("DADOS_EXTRA_NAO_ENCONTRADO");
  }
  return dado;
}

async function criarDadosExtraService(dados) {
  if (!dados.url_imagem || !dados.url_pdf || !dados.texto) {
    throw new Error("DADOS_EXTRAS_INCOMPLETOS");
  }

  const novoDado = await salvarDadosExtra(dados);
  return novoDado;
}

async function alterarDadosExtraService(id, alteracoes) {
  const dadoExistente = await buscarDadosExtraPorId(id);

  if (!dadoExistente) {
    throw new Error("DADOS_EXTRA_NAO_ENCONTRADO");
  }

  const dadoAtualizado = await atualizarDadosExtra(id, alteracoes);
  return dadoAtualizado;
}

async function excluirDadosExtraService(id) {
  const dadoExistente = await buscarDadosExtraPorId(id);

  if (!dadoExistente) {
    throw new Error("DADOS_EXTRA_NAO_ENCONTRADO");
  }

  await deletarDadosExtraFisicamente(id);
}

module.exports = {
  listarDadosExtrasService,
  obterDadosExtraPorIdService,
  criarDadosExtraService,
  alterarDadosExtraService,
  excluirDadosExtraService,
};
