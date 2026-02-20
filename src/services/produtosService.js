const {
  acharProdutoPeloId,
  salvarProduto,
  salvarAlteracoesProduto,
  excluirProdutoFisicamente,
} = require("../repositories/produtosRepository");
const { obterLinha } = require("./linhaService");
const { criarIdProduto, criarIdTabela } = require("../utils/criarId");
const { criarModeloProduto } = require("../models");
const { acharLinhaPeloNome } = require("../repositories/linhasRepository");
const mongoose = require("mongoose");
const LinhaModel = require("../models/CatalogoSchema");

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

async function salvarProdutoCompletoService(nomeLinha, produtoCompleto) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const linhaDoc = await LinhaModel.findOne({
      linha: new RegExp(`^${nomeLinha}$`, "i"),
    }).session(session);
    if (!linhaDoc) throw new Error("LINHA_NAO_ENCONTRADA");

    const codigosNovos = [];
    for (const tabela of produtoCompleto.tabelas_produto || []) {
      if (tabela.deletado) continue;
      for (const dado of tabela.dados || []) {
        if (dado.codigo && !dado.deletado) {
          codigosNovos.push(dado.codigo);
        }
      }
    }

    for (const codigo of codigosNovos) {
      const query = {
        produtos_linha: {
          $elemMatch: {
            produto_id: { $ne: produtoCompleto.produto_id || -1 },
            "tabelas_produto.dados": {
              $elemMatch: { codigo: codigo, deletado: { $ne: true } },
            },
          },
        },
      };
      const existeEmOutroProduto =
        await LinhaModel.findOne(query).session(session);

      if (existeEmOutroProduto) {
        const error = new Error("CODIGO_JA_EXISTENTE");
        error.codigo = codigo;
        throw error;
      }
    }

    if (!produtoCompleto.produto_id) {
      produtoCompleto.produto_id = await criarIdProduto();
    }

    let maxTabelaId = (await criarIdTabela()) - 1;
    for (const tabela of produtoCompleto.tabelas_produto || []) {
      if (!tabela._id || tabela._id === "") {
        maxTabelaId++;
        tabela.tabela_id = maxTabelaId;
      }
    }

    if (produtoCompleto._id === "") {
      delete produtoCompleto._id;
    }

    for (const tabela of produtoCompleto.tabelas_produto || []) {
      if (tabela._id === "") {
        delete tabela._id;
      }
      for (const dado of tabela.dados || []) {
        if (dado._id === "") {
          delete dado._id;
        }
      }
    }

    const indexProduto = linhaDoc.produtos_linha.findIndex(
      (p) => p.produto_id === produtoCompleto.produto_id,
    );

    if (indexProduto >= 0) {
      linhaDoc.produtos_linha[indexProduto] = produtoCompleto;
    } else {
      linhaDoc.produtos_linha.push(produtoCompleto);
    }

    await linhaDoc.save({ session });

    await session.commitTransaction();
    session.endSession();

    return produtoCompleto;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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

async function excluirProdutoService(nomeLinha, produtoId) {
  const linha = await obterLinha(nomeLinha);
  const produtoParaExcluir = await obterProdutosPorId(nomeLinha, produtoId);

  await excluirProdutoFisicamente(linha, produtoParaExcluir.produto_id);
  return true;
}

module.exports = {
  obterProduto,
  listarProdutosDaLinhaService,
  listarProdutosPaginadosService,
  obterProdutosPorId,
  criarProdutoService,
  alterarProdutoService,
  salvarProdutoCompletoService,
  deletarProdutoService,
  restaurarProdutoService,
  excluirProdutoService,
};
