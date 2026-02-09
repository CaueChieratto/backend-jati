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

module.exports = {
  acharTabelaPorId,
  salvarTabela,
  salvarAlteracoesTabela,
};
