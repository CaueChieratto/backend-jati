const {
  obterTodasLinhas,
  obterTodasLinhasDeletadas,
  obterLinha,
  criarLinhaService,
  alterarLinhaService,
  deletarLinhaService,
  restaurarLinhaService,
  obterLinhasPaginadas,
} = require("../services/linhaService");

async function listarTodasLinhas(req, res, next) {
  try {
    const linhas = await obterTodasLinhas();
    res.json(linhas);
  } catch (error) {
    next(error);
  }
}

async function listarLinhasResumidas(req, res, next) {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;

    const linhas = await obterLinhasPaginadas(pagina, limite);
    res.json(linhas);
  } catch (error) {
    next(error);
  }
}

async function listarTodasLinhasDeletadas(req, res, next) {
  try {
    const linhasDeletadas = await obterTodasLinhasDeletadas();
    res.json(linhasDeletadas);
  } catch (error) {
    next(error);
  }
}

async function listarLinha(req, res, next) {
  try {
    const { linha } = req.params;
    const produtosDaLinha = await obterLinha(linha);
    res.json(produtosDaLinha);
  } catch (error) {
    next(error);
  }
}

async function criarLinha(req, res, next) {
  try {
    const novaLinha = req.body;
    const linhaCriada = await criarLinhaService(novaLinha);
    res.status(201).json(linhaCriada);
  } catch (error) {
    next(error);
  }
}

async function alterarLinha(req, res, next) {
  try {
    const { linha } = req.params;
    const alteracoes = req.body;
    const linhaAlterada = await alterarLinhaService(linha, alteracoes);
    res.status(201).json(linhaAlterada);
  } catch (error) {
    next(error);
  }
}

async function deletarLinha(req, res, next) {
  try {
    const { linha } = req.params;
    const linhaDeletada = await deletarLinhaService(linha);
    res.status(201).json(linhaDeletada);
  } catch (error) {
    next(error);
  }
}

async function restaurarLinha(req, res, next) {
  try {
    const { linha } = req.params;
    const linhaRestaurada = await restaurarLinhaService(linha);
    res.status(201).json(linhaRestaurada);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarTodasLinhas,
  listarLinhasResumidas,
  listarTodasLinhasDeletadas,
  listarLinha,
  criarLinha,
  alterarLinha,
  deletarLinha,
  restaurarLinha,
};
