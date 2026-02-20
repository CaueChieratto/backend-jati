const {
  obterTabelasDoProduto,
  criarTabelasDoProdutoService,
  obterTabelaPorId,
  alterarTabelaService,
  deletarTabelaService,
  restaurarTabelaService,
  excluirTabelaService,
} = require("../services/tabelaService");

async function listarTabelasPorId(req, res, next) {
  try {
    const { linha, produtoId, tabelaId } = req.params;
    const tabela = await obterTabelaPorId(linha, produtoId, tabelaId);
    res.json(tabela);
  } catch (error) {
    next(error);
  }
}

async function listarTabelasDoProduto(req, res, next) {
  try {
    const { linha, produtoId } = req.params;
    const tabelaDoProduto = await obterTabelasDoProduto(linha, produtoId);
    res.json(tabelaDoProduto);
  } catch (error) {
    next(error);
  }
}

async function criarTabelaDoProduto(req, res, next) {
  try {
    const { linha, produtoId } = req.params;
    const tabelaCriada = await criarTabelasDoProdutoService(
      linha,
      produtoId,
      req.body,
    );
    res.status(201).json(tabelaCriada);
  } catch (error) {
    next(error);
  }
}

async function alterarTabela(req, res, next) {
  try {
    const { linha, produtoId, tabelaId } = req.params;
    const alteracoes = req.body;
    const tabelaAlterada = await alterarTabelaService(
      linha,
      produtoId,
      tabelaId,
      alteracoes,
    );
    res.status(201).json(tabelaAlterada);
  } catch (error) {
    next(error);
  }
}

async function deletarTabela(req, res, next) {
  try {
    const { linha, produtoId, tabelaId } = req.params;
    const tabelaDeletada = await deletarTabelaService(
      linha,
      produtoId,
      tabelaId,
    );
    res.status(201).json(tabelaDeletada);
  } catch (error) {
    next(error);
  }
}

async function restaurarTabela(req, res, next) {
  try {
    const { linha, produtoId, tabelaId } = req.params;
    const tabelaRestaurada = await restaurarTabelaService(
      linha,
      produtoId,
      tabelaId,
    );
    res.status(201).json(tabelaRestaurada);
  } catch (error) {
    next(error);
  }
}

async function excluirTabela(req, res, next) {
  try {
    const { linha, produtoId, tabelaId } = req.params;
    await excluirTabelaService(linha, produtoId, tabelaId);
    res.status(200).json({ msg: "Tabela excluída fisicamente com sucesso!" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarTabelasDoProduto,
  criarTabelaDoProduto,
  listarTabelasPorId,
  alterarTabela,
  deletarTabela,
  restaurarTabela,
  excluirTabela,
};
