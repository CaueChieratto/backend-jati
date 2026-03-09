const LinhaModel = require("../../../models/CatalogoSchema");
const { formatarParaBusca } = require("../../../utils/formatador");

async function listarTodasLinhas() {
  return await LinhaModel.find().sort({ ordem: 1 });
}

async function listarLinhasSemProdutos(pagina = 1, limite = 10) {
  const pular = (pagina - 1) * limite;

  return await LinhaModel.find({}, { produtos_linha: 0 })
    .sort({ ordem: 1 })
    .skip(pular)
    .limit(limite);
}

async function acharLinhaPeloNome(nomeLinha) {
  const nomeBuscadoFormatado = formatarParaBusca(nomeLinha);

  const todasLinhas = await LinhaModel.find().sort({ ordem: 1 });

  return todasLinhas.find(
    (l) => formatarParaBusca(l.linha) === nomeBuscadoFormatado,
  );
}

async function atualizarOrdemDasLinhas(idsOrdenados) {
  const operacoes = idsOrdenados.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { ordem: index } },
    },
  }));

  if (operacoes.length > 0) {
    return await LinhaModel.bulkWrite(operacoes);
  }
}

async function salvarLinha(novaLinha) {
  return await LinhaModel.create(novaLinha);
}

async function salvarAlteracoesLinha(linhaParaAlterar, linhaAtualizada) {
  Object.assign(linhaParaAlterar, linhaAtualizada);
  return await linhaParaAlterar.save();
}

async function excluirLinhaFisicamente(id) {
  return await LinhaModel.findByIdAndDelete(id);
}

module.exports = {
  listarTodasLinhas,
  listarLinhasSemProdutos,
  acharLinhaPeloNome,
  salvarLinha,
  atualizarOrdemDasLinhas,
  salvarAlteracoesLinha,
  excluirLinhaFisicamente,
};
