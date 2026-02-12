const LinhaModel = require("../models/CatalogoSchema");
const { formatarParaBusca } = require("../utils/formatador");

async function listarTodasLinhas() {
  return await LinhaModel.find();
}

async function listarLinhasSemProdutos(pagina = 1, limite = 10) {
  const pular = (pagina - 1) * limite;

  return await LinhaModel.find({}, { produtos_linha: 0 })
    .skip(pular)
    .limit(limite);
}

async function acharLinhaPeloNome(nomeLinha) {
  const nomeBuscadoFormatado = formatarParaBusca(nomeLinha);

  const todasLinhas = await LinhaModel.find();

  return todasLinhas.find(
    (l) => formatarParaBusca(l.linha) === nomeBuscadoFormatado,
  );
}
async function salvarLinha(novaLinha) {
  return await LinhaModel.create(novaLinha);
}

async function salvarAlteracoesLinha(linhaParaAlterar, linhaAtualizada) {
  Object.assign(linhaParaAlterar, linhaAtualizada);
  return await linhaParaAlterar.save();
}

module.exports = {
  listarTodasLinhas,
  listarLinhasSemProdutos,
  acharLinhaPeloNome,
  salvarLinha,
  salvarAlteracoesLinha,
};
