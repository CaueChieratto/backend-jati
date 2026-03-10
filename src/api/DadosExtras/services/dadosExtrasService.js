const {
  buscarTodosDadosExtras,
  buscarDadosExtraPorId,
  salvarDadosExtra,
  atualizarDadosExtra,
  deletarDadosExtraFisicamente,
  atualizarOrdemDadosExtra,
} = require("../repositories/dadosExtrasRepository");
const { deletarArquivoCloudinary } = require("../../../utils/cloudinaryUtils");

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

  if (
    alteracoes.url_imagem &&
    alteracoes.url_imagem !== dadoExistente.url_imagem
  ) {
    await deletarArquivoCloudinary(dadoExistente.url_imagem);
  }

  if (alteracoes.url_pdf && alteracoes.url_pdf !== dadoExistente.url_pdf) {
    await deletarArquivoCloudinary(dadoExistente.url_pdf);
  }

  const dadoAtualizado = await atualizarDadosExtra(id, alteracoes);
  return dadoAtualizado;
}

async function excluirDadosExtraService(id) {
  const dadoExistente = await buscarDadosExtraPorId(id);

  if (!dadoExistente) {
    throw new Error("DADOS_EXTRA_NAO_ENCONTRADO");
  }

  if (dadoExistente.url_imagem) {
    await deletarArquivoCloudinary(dadoExistente.url_imagem);
  }

  if (dadoExistente.url_pdf) {
    await deletarArquivoCloudinary(dadoExistente.url_pdf);
  }

  await deletarDadosExtraFisicamente(id);
}

async function reordenarDadosExtrasService(idsOrdenados) {
  if (!idsOrdenados || !Array.isArray(idsOrdenados)) {
    throw new Error("DADOS_INVALIDOS_PARA_REORDENAR");
  }

  const promessas = idsOrdenados.map((id, index) => {
    return atualizarOrdemDadosExtra(id, index);
  });

  await Promise.all(promessas);
}

module.exports = {
  listarDadosExtrasService,
  obterDadosExtraPorIdService,
  criarDadosExtraService,
  alterarDadosExtraService,
  excluirDadosExtraService,
  reordenarDadosExtrasService,
};
