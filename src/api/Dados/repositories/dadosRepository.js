const LinhaModel = require("../../../models/CatalogoSchema");

function acharCodigoReferencia(tabela, codigoReferencia) {
  if (!tabela || !tabela.dados) return undefined;
  return tabela.dados.find((d) => d.codigo === codigoReferencia);
}

async function verificarDuplicidadeDeCodigo(novoCodigo, codigoIgnorado = null) {
  const linha = await LinhaModel.findOne({
    "produtos_linha.tabelas_produto.dados": {
      $elemMatch: {
        codigo: { $eq: novoCodigo, $ne: codigoIgnorado },
      },
    },
  });
  return !!linha;
}

async function salvarDados(tabelaAlvo, dadosNovos) {
  if (!tabelaAlvo.dados) tabelaAlvo.dados = [];
  tabelaAlvo.dados.push(dadosNovos);

  const linhaPai = tabelaAlvo.ownerDocument
    ? tabelaAlvo.ownerDocument()
    : tabelaAlvo.parent();
  if (linhaPai) await linhaPai.save();
}

async function salvarAlteracoesDados(dadosParaAlterar, dadosAtualizados) {
  Object.assign(dadosParaAlterar, dadosAtualizados);

  const linhaPai = dadosParaAlterar.ownerDocument
    ? dadosParaAlterar.ownerDocument()
    : dadosParaAlterar.parent();
  if (linhaPai) await linhaPai.save();
}

async function excluirDadosFisicamente(linha, tabela, codigoReferencia) {
  tabela.dados = tabela.dados.filter((d) => d.codigo !== codigoReferencia);
  await linha.save();
}

module.exports = {
  acharCodigoReferencia,
  salvarDados,
  salvarAlteracoesDados,
  verificarDuplicidadeDeCodigo,
  excluirDadosFisicamente,
};
