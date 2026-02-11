const LinhaModel = require("../models/CatalogoSchema");

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
  return await LinhaModel.findOne({
    linha: { $regex: new RegExp(`^${nomeLinha}$`, "i") },
  });
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
