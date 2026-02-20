function acharTabelaPorId(produto, tabelaId) {
  return produto.tabelas_produto.find((t) => t.tabela_id === Number(tabelaId));
}

async function salvarTabela(linha, produto, tabelaNova) {
  produto.tabelas_produto.push(tabelaNova);
  await linha.save();
}

async function salvarAlteracoesTabela(tabelaParaAlterar, tabelaAtualizada) {
  Object.assign(tabelaParaAlterar, tabelaAtualizada);

  const linhaPai = tabelaParaAlterar.ownerDocument
    ? tabelaParaAlterar.ownerDocument()
    : tabelaParaAlterar.parent();
  if (linhaPai) await linhaPai.save();
}

async function excluirTabelaFisicamente(linha, produto, tabelaId) {
  produto.tabelas_produto = produto.tabelas_produto.filter(
    (t) => t.tabela_id !== Number(tabelaId),
  );
  await linha.save();
}

module.exports = {
  acharTabelaPorId,
  salvarTabela,
  salvarAlteracoesTabela,
  excluirTabelaFisicamente,
};
