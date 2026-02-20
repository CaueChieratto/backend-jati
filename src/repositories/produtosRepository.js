function acharProdutoPeloId(linha, id) {
  return linha.produtos_linha.find((p) => p.produto_id === Number(id));
}

async function salvarProduto(linha, produtoNovo) {
  linha.produtos_linha.push(produtoNovo);
  await linha.save();
}

async function salvarAlteracoesProduto(produtoParaAlterar, produtoAtualizado) {
  Object.assign(produtoParaAlterar, produtoAtualizado);

  const linhaPai = produtoParaAlterar.ownerDocument
    ? produtoParaAlterar.ownerDocument()
    : produtoParaAlterar.parent();
  if (linhaPai) await linhaPai.save();
}

async function excluirProdutoFisicamente(linha, produtoId) {
  linha.produtos_linha = linha.produtos_linha.filter(
    (p) => p.produto_id !== Number(produtoId),
  );
  await linha.save();
}

module.exports = {
  acharProdutoPeloId,
  salvarProduto,
  salvarAlteracoesProduto,
};
