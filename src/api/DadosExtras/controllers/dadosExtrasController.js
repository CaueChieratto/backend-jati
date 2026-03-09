const {
  listarDadosExtrasService,
  obterDadosExtraPorIdService,
  criarDadosExtraService,
  alterarDadosExtraService,
  excluirDadosExtraService,
} = require("../services/dadosExtrasService");

async function listarDadosExtras(req, res, next) {
  try {
    const dados = await listarDadosExtrasService();
    res.json(dados);
  } catch (error) {
    next(error);
  }
}

async function obterDadosExtra(req, res, next) {
  try {
    const { id } = req.params;
    const dado = await obterDadosExtraPorIdService(id);
    res.json(dado);
  } catch (error) {
    next(error);
  }
}

async function adicionarDadosExtra(req, res, next) {
  try {
    const dados = req.body;
    const novoDado = await criarDadosExtraService(dados);
    res.status(201).json(novoDado);
  } catch (error) {
    next(error);
  }
}

async function alterarDadosExtra(req, res, next) {
  try {
    const { id } = req.params;
    const alteracoes = req.body;
    const dadoAlterado = await alterarDadosExtraService(id, alteracoes);
    res.status(200).json(dadoAlterado);
  } catch (error) {
    next(error);
  }
}

async function excluirDadosExtra(req, res, next) {
  try {
    const { id } = req.params;
    await excluirDadosExtraService(id);
    res
      .status(200)
      .json({ msg: "Dados Extras excluídos fisicamente com sucesso!" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarDadosExtras,
  obterDadosExtra,
  adicionarDadosExtra,
  alterarDadosExtra,
  excluirDadosExtra,
};
