const { obterProduto } = require("../../Produtos/services/produtosService");
const { obterLinha } = require("../../Linhas/services/linhaService");
const {
  salvarTabela,
  acharTabelaPorId,
  salvarAlteracoesTabela,
  excluirTabelaFisicamente,
} = require("../repositories/tabelasRepository");
const { criarModeloTabela } = require("../../../models");
const { criarIdTabela } = require("../../../utils/criarId");

function obterTabelas(produto) {
  const tabelaProduto = produto.tabelas_produto;

  if (!tabelaProduto) {
    throw new Error("PRODUTO_SEM_TABELAS");
  }

  return tabelaProduto;
}

async function obterTabelaPorId(nomeLinha, produtoId, tabelaId) {
  const linha = await obterLinha(nomeLinha);
  const produto = await obterProduto(linha, produtoId);
  const tabela = acharTabelaPorId(produto, tabelaId);

  return tabela;
}

async function obterTabelasDoProduto(nomeLinha, id) {
  const linha = await obterLinha(nomeLinha);
  const produtoId = await obterProduto(linha, id);
  const tabelaProduto = await obterTabelas(produtoId);

  return tabelaProduto;
}

async function criarTabelasDoProdutoService(
  nomeLinha,
  produtoId,
  dadosDaTabela,
) {
  const linha = await obterLinha(nomeLinha);
  const produto = await obterProduto(linha, produtoId);

  if (!dadosDaTabela.pn) {
    throw new Error("TABELA_INVALIDA");
  }

  const id = await criarIdTabela();
  const novaTabela = criarModeloTabela(dadosDaTabela, id);

  await salvarTabela(linha, produto, novaTabela);

  return novaTabela;
}

async function alterarTabelaService(linha, produtoId, tabelaId, alteracoes) {
  const tabelaParaAlterar = await obterTabelaPorId(linha, produtoId, tabelaId);
  if (tabelaParaAlterar.deletado) {
    throw new Error("TABELA_DELETADA");
  }

  const tabelaAtualizada = { ...alteracoes };
  await salvarAlteracoesTabela(tabelaParaAlterar, tabelaAtualizada);

  return tabelaParaAlterar;
}

async function deletarTabelaService(linha, produtoId, tabelaId) {
  const tabelaParaDeletar = await obterTabelaPorId(linha, produtoId, tabelaId);

  if (tabelaParaDeletar.deletado) {
    throw new Error("TABELA_DELETADA");
  }

  await salvarAlteracoesTabela(tabelaParaDeletar, { deletado: true });

  return tabelaParaDeletar;
}

async function restaurarTabelaService(linha, produtoId, tabelaId) {
  const tabelaParaRestaurar = await obterTabelaPorId(
    linha,
    produtoId,
    tabelaId,
  );

  if (!tabelaParaRestaurar.deletado) {
    throw new Error("TABELA_NAO_DELETADA");
  }

  await salvarAlteracoesTabela(tabelaParaRestaurar, { deletado: false });

  return tabelaParaRestaurar;
}

async function excluirTabelaService(nomeLinha, produtoId, tabelaId) {
  const linha = await obterLinha(nomeLinha);
  const produto = await obterProduto(linha, produtoId);
  const tabelaParaExcluir = acharTabelaPorId(produto, tabelaId);

  if (!tabelaParaExcluir) {
    throw new Error("TABELA_NAO_ENCONTRADA_PARA_O_INDICE_INFORMADO");
  }

  await excluirTabelaFisicamente(linha, produto, tabelaId);
}

module.exports = {
  obterTabelas,
  obterTabelaPorId,
  obterTabelasDoProduto,
  criarTabelasDoProdutoService,
  alterarTabelaService,
  deletarTabelaService,
  restaurarTabelaService,
  excluirTabelaService,
};
