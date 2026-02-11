const { criarModeloLinha } = require("../models");
const {
  listarTodasLinhas,
  acharLinhaPeloNome,
  salvarLinha,
  salvarAlteracoesLinha,
  listarLinhasSemProdutos,
} = require("../repositories/linhasRepository");

async function obterTodasLinhas() {
  const linhas = await listarTodasLinhas();

  if (!linhas || linhas.length === 0) {
    throw new Error("CATALOGO_VAZIO");
  }

  const linhasAtivas = linhas.filter((linha) => !linha.deletado);

  return linhasAtivas;
}

async function obterLinhasPaginadas(pagina, limite) {
  const linhas = await listarLinhasSemProdutos(pagina, limite);

  if (!linhas || linhas.length === 0) {
    throw new Error("CATALOGO_VAZIO");
  }

  return linhas;
}

async function obterTodasLinhasDeletadas() {
  const linhas = await listarTodasLinhas();

  if (!linhas || linhas.length === 0) {
    throw new Error("CATALOGO_VAZIO");
  }

  const linhasDeletadas = linhas.filter((linha) => linha.deletado);

  return linhasDeletadas;
}

async function obterLinha(nomeLinha) {
  const linha = await acharLinhaPeloNome(nomeLinha);

  if (!linha) {
    throw new Error("LINHA_NAO_ENCONTRADA");
  }

  if (!linha.produtos_linha) {
    throw new Error("LINHA_SEM_PRODUTOS");
  }

  return linha;
}

async function criarLinhaService(linha) {
  const novaLinha = criarModeloLinha(linha);

  if (!linha.linha || !linha.painel_linha || !linha.imagem_linha) {
    throw new Error("LINHA_INVALIDA");
  }
  await salvarLinha(novaLinha);

  return novaLinha;
}

async function alterarLinhaService(nomeLinha, alteracoes) {
  const linhaParaAlterar = await obterLinha(nomeLinha);
  if (linhaParaAlterar.deletado) throw new Error("LINHA_DELETADA");

  const linhaAtualizada = { ...alteracoes };
  return await salvarAlteracoesLinha(linhaParaAlterar, linhaAtualizada);
}

async function deletarLinhaService(nomeLinha) {
  const linhaParaDeletar = await obterLinha(nomeLinha);
  if (linhaParaDeletar.deletado) throw new Error("LINHA_DELETADA");

  return await salvarAlteracoesLinha(linhaParaDeletar, { deletado: true });
}

async function restaurarLinhaService(nomeLinha) {
  const linhaParaRestaurar = await obterLinha(nomeLinha);
  if (!linhaParaRestaurar.deletado) throw new Error("LINHA_NAO_DELETADA");

  return await salvarAlteracoesLinha(linhaParaRestaurar, { deletado: false });
}

module.exports = {
  obterTodasLinhas,
  obterLinhasPaginadas,
  obterTodasLinhasDeletadas,
  obterLinha,
  criarLinhaService,
  alterarLinhaService,
  deletarLinhaService,
  restaurarLinhaService,
};
