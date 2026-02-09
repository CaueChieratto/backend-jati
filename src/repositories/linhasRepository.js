const LinhaModel = require("../models/CatalogoSchema");

async function listarTodasLinhas() {
  return await LinhaModel.find();
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
  acharLinhaPeloNome,
  salvarLinha,
  salvarAlteracoesLinha,
};
