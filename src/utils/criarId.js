const LinhaModel = require("../models/CatalogoSchema");

async function criarIdProduto() {
  const linhas = await LinhaModel.find({}, "produtos_linha.produto_id");

  const todosOsIds = linhas.flatMap((linha) =>
    linha.produtos_linha.map((produto) => produto.produto_id),
  );

  const maiorIdAtual = todosOsIds.length > 0 ? Math.max(...todosOsIds) : 0;
  return maiorIdAtual + 1;
}

async function criarIdTabela() {
  const linhas = await LinhaModel.find(
    {},
    "produtos_linha.tabelas_produto.tabela_id",
  );

  const todosOsIds = linhas.flatMap((linha) =>
    (linha.produtos_linha || []).flatMap((produto) =>
      (produto.tabelas_produto || []).map((tabela) => tabela.tabela_id),
    ),
  );

  const maiorIdAtual = todosOsIds.length > 0 ? Math.max(...todosOsIds) : 0;
  return maiorIdAtual + 1;
}

module.exports = {
  criarIdProduto,
  criarIdTabela,
};
