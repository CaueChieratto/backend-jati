const DadosExtraModel = require("../../../models/DadosExtrasSchema");

async function buscarTodosDadosExtras() {
  return await DadosExtraModel.find({});
}

async function buscarDadosExtraPorId(id) {
  return await DadosExtraModel.findById(id);
}

async function salvarDadosExtra(dados) {
  const novoDado = new DadosExtraModel(dados);
  return await novoDado.save();
}

async function atualizarDadosExtra(id, dadosAtualizados) {
  return await DadosExtraModel.findByIdAndUpdate(id, dadosAtualizados, {
    new: true,
  });
}

async function deletarDadosExtraFisicamente(id) {
  return await DadosExtraModel.findByIdAndDelete(id);
}

module.exports = {
  buscarTodosDadosExtras,
  buscarDadosExtraPorId,
  salvarDadosExtra,
  atualizarDadosExtra,
  deletarDadosExtraFisicamente,
};
