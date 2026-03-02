const {
  listarProdutosDaLinhaService,
  listarProdutosPaginadosService,
  obterProdutosPorId,
  criarProdutoService,
  alterarProdutoService,
  deletarProdutoService,
  restaurarProdutoService,
  salvarProdutoCompletoService,
  excluirProdutoService,
} = require("../services/produtosService");
const { acharLinhaPeloNome } = require("../repositories/linhasRepository");
const {
  atualizarOrdemDosProdutos,
} = require("../repositories/produtosRepository");

async function listarProdutos(req, res, next) {
  try {
    const { linha } = req.params;
    const produtos = await listarProdutosDaLinhaService(linha);
    res.json(produtos);
  } catch (error) {
    next(error);
  }
}

async function listarProdutosPaginados(req, res, next) {
  try {
    const { linha } = req.params;
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;

    const resultado = await listarProdutosPaginadosService(
      linha,
      pagina,
      limite,
    );
    res.json(resultado);
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

async function salvarProdutoCompleto(req, res, next) {
  try {
    const { linha } = req.params;
    const produtoCompleto = req.body;

    const produtoSalvo = await salvarProdutoCompletoService(
      linha,
      produtoCompleto,
    );
    res.status(200).json(produtoSalvo);
  } catch (error) {
    if (error.message === "CODIGO_JA_EXISTENTE") {
      return res.status(400).json({
        erro: "Esse código está sendo utilizado!",
        codigo: error.codigo,
        produto: error.produto,
        linha: error.linha,
      });
    }
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

async function excluirProduto(req, res, next) {
  try {
    const { linha, produtoId } = req.params;
    await excluirProdutoService(linha, produtoId);
    res.status(200).json({ msg: "Produto excluído fisicamente com sucesso!" });
  } catch (error) {
    next(error);
  }
}

async function reordenarProdutos(req, res) {
  try {
    const { linha } = req.params;
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ message: "É necessário enviar um array de IDs válido." });
    }

    const linhaEncontrada = await acharLinhaPeloNome(linha);
    if (!linhaEncontrada) {
      return res.status(404).json({ message: "Linha não encontrada." });
    }

    await atualizarOrdemDosProdutos(linhaEncontrada, ids);
    return res
      .status(200)
      .json({ message: "Ordem dos produtos atualizada com sucesso." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao reordenar produtos", error: error.message });
  }
}

module.exports = {
  listarProdutos,
  listarProdutosPaginados,
  listarProdutoPorId,
  salvarProdutoCompleto,
  criarProduto,
  alterarProduto,
  deletarProduto,
  restaurarProduto,
  excluirProduto,
  reordenarProdutos,
};
