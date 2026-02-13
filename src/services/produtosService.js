const {
  acharProdutoPeloId,
  salvarProduto,
  salvarAlteracoesProduto,
} = require("../repositories/produtosRepository");
const { obterLinha } = require("./linhaService");
const { criarIdProduto } = require("../utils/criarId");
const { criarModeloProduto } = require("../models");
const { acharLinhaPeloNome } = require("../repositories/linhasRepository");

async function obterProduto(linha, id) {
  const produto = await acharProdutoPeloId(linha, id);

  if (!produto) {
    throw new Error("PRODUTO_NAO_ENCONTRADO");
  }

  return produto;
}

async function listarProdutosDaLinhaService(nomeLinha) {
  const linha = await obterLinha(nomeLinha);

  const produtosLimpos = linha.produtos_linha.map((produto) => ({
    produto_id: produto.produto_id,
    nome_produto: produto.nome_produto,
    imagem_produto: produto.imagem_produto,
    imagem_patente: produto.imagem_patente,
    pdf_produto: produto.pdf_produto,
    descricao_produto: produto.descricao_produto,
    deletado: produto.deletado,
  }));

  return produtosLimpos;
}

async function listarProdutosPaginadosService(nomeLinha, pagina, limite) {
  const linha = await acharLinhaPeloNome(nomeLinha);

  if (!linha) {
    throw new Error("LINHA_NAO_ENCONTRADA");
  }

  const produtosLimpos = (linha.produtos_linha || []).map((produto) => ({
    produto_id: produto.produto_id,
    nome_produto: produto.nome_produto,
    imagem_produto: produto.imagem_produto,
    imagem_patente: produto.imagem_patente,
    pdf_produto: produto.pdf_produto,
    descricao_produto: produto.descricao_produto,
    deletado: produto.deletado,
  }));

  const total = produtosLimpos.length;
  const inicio = (pagina - 1) * limite;
  const fim = inicio + limite;

  const produtosPaginados = produtosLimpos.slice(inicio, fim);

  return {
    total,
    pagina,
    total_paginas: Math.ceil(total / limite),
    produtos: produtosPaginados,
  };
}

async function obterProdutosPorId(nomeLinha, id) {
  const linha = await obterLinha(nomeLinha);
  const produtoId = await obterProduto(linha, id);
  return produtoId;
}

async function criarProdutoService(nomeLinha, produto) {
  const linha = await obterLinha(nomeLinha);
  const id = await criarIdProduto();

  if (!produto.nome_produto || !produto.imagem_produto) {
    throw new Error("PRODUTO_INVALIDO");
  }

  const novoProduto = criarModeloProduto(produto, id);

  await salvarProduto(linha, novoProduto);
  return novoProduto;
}

async function alterarProdutoService(linha, produtoId, alteracoes) {
  const produtoParaAlterar = await obterProdutosPorId(linha, produtoId);
  if (produtoParaAlterar.deletado) {
    throw new Error("PRODUTO_DELETADO");
  }

  const produtoAtualizado = { ...alteracoes };
  await salvarAlteracoesProduto(produtoParaAlterar, produtoAtualizado);

  return produtoParaAlterar;
}

async function deletarProdutoService(linha, produtoId) {
  const produtoParaDeletar = await obterProdutosPorId(linha, produtoId);

  if (produtoParaDeletar.deletado) {
    throw new Error("PRODUTO_DELETADO");
  }

  await salvarAlteracoesProduto(produtoParaDeletar, { deletado: true });

  return produtoParaDeletar;
}

async function restaurarProdutoService(linha, produtoId) {
  const produtoParaRestaurar = await obterProdutosPorId(linha, produtoId);

  if (!produtoParaRestaurar.deletado) {
    throw new Error("PRODUTO_NAO_DELETADO");
  }

  await salvarAlteracoesProduto(produtoParaRestaurar, { deletado: false });

  return produtoParaRestaurar;
}

module.exports = {
  obterProduto,
  listarProdutosDaLinhaService,
  listarProdutosPaginadosService,
  obterProdutosPorId,
  criarProdutoService,
  alterarProdutoService,
  deletarProdutoService,
  restaurarProdutoService,
};
