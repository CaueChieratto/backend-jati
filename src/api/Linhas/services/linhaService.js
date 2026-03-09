const { criarModeloLinha } = require("../../../models");
const {
  listarTodasLinhas,
  acharLinhaPeloNome,
  salvarLinha,
  salvarAlteracoesLinha,
  listarLinhasSemProdutos,
  excluirLinhaFisicamente,
} = require("../repositories/linhasRepository");
const { formatarParaSalvar } = require("../../../utils/formatador");
const { deletarArquivoCloudinary } = require("../../../utils/cloudinaryUtils");

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
  if (linha.linha) {
    linha.linha = formatarParaSalvar(linha.linha);
  }

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

  if (alteracoes.linha) {
    alteracoes.linha = formatarParaSalvar(alteracoes.linha);
  }

  if (
    alteracoes.imagem_linha !== undefined &&
    alteracoes.imagem_linha !== linhaParaAlterar.imagem_linha
  ) {
    if (
      linhaParaAlterar.imagem_linha &&
      linhaParaAlterar.imagem_linha.includes("cloudinary")
    ) {
      await deletarArquivoCloudinary(linhaParaAlterar.imagem_linha);
    }
  }

  if (
    alteracoes.painel_linha !== undefined &&
    alteracoes.painel_linha !== linhaParaAlterar.painel_linha
  ) {
    if (
      linhaParaAlterar.painel_linha &&
      linhaParaAlterar.painel_linha.includes("cloudinary")
    ) {
      await deletarArquivoCloudinary(linhaParaAlterar.painel_linha);
    }
  }

  if (
    alteracoes.pdf_linha !== undefined &&
    alteracoes.pdf_linha !== linhaParaAlterar.pdf_linha
  ) {
    if (
      linhaParaAlterar.pdf_linha &&
      linhaParaAlterar.pdf_linha.includes("cloudinary")
    ) {
      await deletarArquivoCloudinary(linhaParaAlterar.pdf_linha, true);
    }
  }

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

async function excluirLinhaService(nomeLinha) {
  const linhaParaExcluir = await obterLinha(nomeLinha);

  if (
    linhaParaExcluir.imagem_linha &&
    linhaParaExcluir.imagem_linha.includes("cloudinary")
  ) {
    await deletarArquivoCloudinary(linhaParaExcluir.imagem_linha);
  }

  if (
    linhaParaExcluir.painel_linha &&
    linhaParaExcluir.painel_linha.includes("cloudinary")
  ) {
    await deletarArquivoCloudinary(linhaParaExcluir.painel_linha);
  }

  if (
    linhaParaExcluir.pdf_linha &&
    linhaParaExcluir.pdf_linha.includes("cloudinary")
  ) {
    await deletarArquivoCloudinary(linhaParaExcluir.pdf_linha, true);
  }

  return await excluirLinhaFisicamente(linhaParaExcluir._id);
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
  excluirLinhaService,
};
