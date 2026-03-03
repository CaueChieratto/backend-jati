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
const { deletarArquivoCloudinary } = require("../utils/cloudinaryUtils");

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

  if (
    alteracoes.imagem_produto !== undefined &&
    alteracoes.imagem_produto !== produtoParaAlterar.imagem_produto
  ) {
    if (
      produtoParaAlterar.imagem_produto &&
      produtoParaAlterar.imagem_produto.includes("cloudinary")
    ) {
      await deletarArquivoCloudinary(produtoParaAlterar.imagem_produto);
    }
  }

  if (
    alteracoes.imagem_patente !== undefined &&
    alteracoes.imagem_patente !== produtoParaAlterar.imagem_patente
  ) {
    if (
      produtoParaAlterar.imagem_patente &&
      produtoParaAlterar.imagem_patente.includes("cloudinary")
    ) {
      await deletarArquivoCloudinary(produtoParaAlterar.imagem_patente);
    }
  }

  if (
    alteracoes.pdf_produto !== undefined &&
    alteracoes.pdf_produto !== produtoParaAlterar.pdf_produto
  ) {
    if (
      produtoParaAlterar.pdf_produto &&
      produtoParaAlterar.pdf_produto.includes("cloudinary")
    ) {
      await deletarArquivoCloudinary(produtoParaAlterar.pdf_produto, true);
    }
  }

  const produtoAtualizado = { ...alteracoes };
  await salvarAlteracoesProduto(produtoParaAlterar, produtoAtualizado);

  return produtoParaAlterar;
}

async function salvarProdutoCompletoService(nomeLinha, produtoCompleto) {
  const linhaDoc = await LinhaModel.findOne({
    linha: new RegExp(`^${nomeLinha}$`, "i"),
  });

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
    const existeEmOutroProduto = await LinhaModel.findOne(query);

    if (existeEmOutroProduto) {
      let nomeProdutoConflito = "Desconhecido";

      for (const prod of existeEmOutroProduto.produtos_linha) {
        if (prod.produto_id === produtoCompleto.produto_id) continue;

        let encontrou = false;
        for (const tab of prod.tabelas_produto || []) {
          if (tab.deletado) continue;
          for (const dado of tab.dados || []) {
            if (dado.codigo === codigo && !dado.deletado) {
              encontrou = true;
              break;
            }
          }
          if (encontrou) break;
        }

        if (encontrou) {
          nomeProdutoConflito = prod.nome_produto;
          break;
        }
      }

      const error = new Error("CODIGO_JA_EXISTENTE");
      error.codigo = codigo;
      error.produto = nomeProdutoConflito;
      error.linha = existeEmOutroProduto.linha;

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

  if (!produtoCompleto._id || produtoCompleto._id === "") {
    delete produtoCompleto._id;
  }

  for (const tabela of produtoCompleto.tabelas_produto || []) {
    if (!tabela._id || tabela._id === "") {
      delete tabela._id;
    }
    for (const dado of tabela.dados || []) {
      if (!dado._id || dado._id === "") {
        delete dado._id;
      }
    }
  }

  const indexProduto = linhaDoc.produtos_linha.findIndex(
    (p) => p.produto_id === produtoCompleto.produto_id,
  );

  const debugCloudinary = {
    deletions: [],
  };

  if (indexProduto >= 0) {
    const produtoAntigo = linhaDoc.produtos_linha[indexProduto];

    if (produtoCompleto.imagem_produto !== produtoAntigo.imagem_produto) {
      if (
        produtoAntigo.imagem_produto &&
        produtoAntigo.imagem_produto.includes("cloudinary")
      ) {
        const r = await deletarArquivoCloudinary(
          produtoAntigo.imagem_produto,
          false,
        );
        debugCloudinary.deletions.push({
          campo: "imagem_produto",
          ...r,
        });
      }
    }

    if (produtoCompleto.imagem_patente !== produtoAntigo.imagem_patente) {
      if (
        produtoAntigo.imagem_patente &&
        produtoAntigo.imagem_patente.includes("cloudinary")
      ) {
        const r = await deletarArquivoCloudinary(
          produtoAntigo.imagem_patente,
          false,
        );
        debugCloudinary.deletions.push({
          campo: "imagem_patente",
          ...r,
        });
      }
    }

    if (produtoCompleto.pdf_produto !== produtoAntigo.pdf_produto) {
      if (
        produtoAntigo.pdf_produto &&
        produtoAntigo.pdf_produto.includes("cloudinary")
      ) {
        const r = await deletarArquivoCloudinary(
          produtoAntigo.pdf_produto,
          true,
        );
        debugCloudinary.deletions.push({
          campo: "pdf_produto",
          ...r,
        });
      }
    }

    linhaDoc.produtos_linha.set(indexProduto, produtoCompleto);
  } else {
    linhaDoc.produtos_linha.push(produtoCompleto);
  }

  await linhaDoc.save();

  return {
    ...produtoCompleto,
    _debugCloudinary: debugCloudinary,
  };
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

  if (
    produtoParaExcluir.imagem_produto &&
    produtoParaExcluir.imagem_produto.includes("cloudinary")
  ) {
    await deletarArquivoCloudinary(produtoParaExcluir.imagem_produto);
  }

  if (
    produtoParaExcluir.imagem_patente &&
    produtoParaExcluir.imagem_patente.includes("cloudinary")
  ) {
    await deletarArquivoCloudinary(produtoParaExcluir.imagem_patente);
  }

  if (
    produtoParaExcluir.pdf_produto &&
    produtoParaExcluir.pdf_produto.includes("cloudinary")
  ) {
    await deletarArquivoCloudinary(produtoParaExcluir.pdf_produto, true);
  }

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
