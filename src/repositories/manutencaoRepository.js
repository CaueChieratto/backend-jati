const ManutencaoModel = require("../models/ConfigSchema");

async function verEstadoManutencao() {
  let configs = await ManutencaoModel.findOne();

  if (!configs) {
    configs = await ManutencaoModel.create({
      ativarManutencao: false,
    });
  }

  return configs;
}

async function atualizarManutencao(ativarManutencao) {
  let configs = await ManutencaoModel.findOne();

  if (!configs) {
    configs = new ManutencaoModel();
  }

  if (typeof ativarManutencao === "boolean") {
    configs.ativarManutencao = ativarManutencao;
  }

  await configs.save();

  return configs;
}

module.exports = {
  verEstadoManutencao,
  atualizarManutencao,
};
