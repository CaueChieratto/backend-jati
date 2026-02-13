const {
  listarProdutosDaLinhaService,
  obterProdutosPorId,
  criarProdutoService,
  alterarProdutoService,
  deletarProdutoService,
  restaurarProdutoService,
} = require("../services/produtosService");

async function listarProdutos(req, res, next) {
  try {
    const { linha } = req.params;
    const produtos = await listarProdutosDaLinhaService(linha);
    res.json(produtos);
  } catch (error) {
    next(error);
  }
}

async function listarProdutoPorId(req, res, next) {
  try {
    const { linha, produtoId } = req.params;
    const produto = await obterProdutosPorId(linha, produtoId);
    res.json(produto);
  } catch (error) {
    next(error);
  }
}

async function criarProduto(req, res, next) {
  try {
    const { linha } = req.params;
    const produtoCriado = await criarProdutoService(linha, req.body || {});
    res.status(201).json(produtoCriado);
  } catch (error) {
    next(error);
  }
}

async function alterarProduto(req, res, next) {
  try {
    const { linha, produtoId } = req.params;
    const alteracoes = req.body;
    const produtoAlterado = await alterarProdutoService(
      linha,
      produtoId,
      alteracoes,
    );
    res.status(201).json(produtoAlterado);
  } catch (error) {
    next(error);
  }
}

async function deletarProduto(req, res, next) {
  try {
    const { linha, produtoId } = req.params;
    const produtoDeletado = await deletarProdutoService(linha, produtoId);
    res.status(201).json(produtoDeletado);
  } catch (error) {
    next(error);
  }
}

async function restaurarProduto(req, res, next) {
  try {
    const { linha, produtoId } = req.params;
    const produtoRestaurado = await restaurarProdutoService(linha, produtoId);
    res.status(201).json(produtoRestaurado);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarProdutos,
  listarProdutoPorId,
  criarProduto,
  alterarProduto,
  deletarProduto,
  restaurarProduto,
};
