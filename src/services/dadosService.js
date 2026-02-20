const { obterProduto } = require("./produtosService");
const { obterTabelas, obterTabelaPorId } = require("./tabelaService");
const { obterLinha } = require("./linhaService");
const {
  salvarDados,
  acharCodigoReferencia,
  salvarAlteracoesDados,
  verificarDuplicidadeDeCodigo,
  excluirDadosFisicamente,
} = require("../repositories/dadosRepository");
const { criarModeloDados } = require("../models");
const { acharTabelaPorId } = require("../repositories/tabelasRepository");

async function obterCodigoReferencia(
  nomeLinha,
  produtoId,
  tabelaId,
  codigoReferencia,
) {
  const linha = await obterLinha(nomeLinha);
  const produto = await obterProduto(linha, produtoId);
  const tabela = await acharTabelaPorId(produto, tabelaId);
  const codigo = acharCodigoReferencia(tabela, codigoReferencia);

  return codigo;
}

function obterDados(tabelaProduto) {
  const tabelaDados = tabelaProduto.map((tabela) => tabela.dados);

  if (tabelaDados.length === 0) {
    throw new Error("TABELA_SEM_DADOS");
  }

  return tabelaDados;
}

async function obterDadosDaTabela(nomeLinha, id) {
  const linha = await obterLinha(nomeLinha);
  const produtoId = await obterProduto(linha, id);
  const tabelaProduto = await obterTabelas(produtoId);
  const tabelaDados = obterDados(tabelaProduto);

  return tabelaDados;
}

async function adicionarDadosNaTabelaService(
  nomeLinha,
  produtoId,
  tabelaId,
  dados,
) {
  const tabela = await obterTabelaPorId(nomeLinha, produtoId, tabelaId);

  if (!dados.dn || !dados.codigo) {
    throw new Error("DADOS_DA_TABELA_INVALIDOS");
  }

  const existe = await verificarDuplicidadeDeCodigo(dados.codigo);
  if (existe) {
    throw new Error("CODIGO_JA_EXISTENTE");
  }

  const dadosNovos = criarModeloDados(dados);
  await salvarDados(tabela, dadosNovos);

  return dadosNovos;
}

async function alterarDadosService(
  nomeLinha,
  produtoId,
  tabelaId,
  codigoReferencia,
  alteracoes,
) {
  const dadosParaAlterar = await obterCodigoReferencia(
    nomeLinha,
    produtoId,
    tabelaId,
    codigoReferencia,
  );
  if (dadosParaAlterar.deletado) {
    throw new Error("DADOS_DELETADOS");
  }

  if (alteracoes.codigo && alteracoes.codigo !== codigoReferencia) {
    const existe = await verificarDuplicidadeDeCodigo(
      alteracoes.codigo,
      codigoReferencia,
    );
    if (existe) {
      throw new Error("CODIGO_JA_EXISTENTE");
    }
  }

  const dadosAtualizados = { ...alteracoes };
  await salvarAlteracoesDados(dadosParaAlterar, dadosAtualizados);

  return dadosParaAlterar;
}

async function deletarDadosService(
  nomeLinha,
  produtoId,
  tabelaId,
  codigoReferencia,
) {
  const dadosParaDeletar = await obterCodigoReferencia(
    nomeLinha,
    produtoId,
    tabelaId,
    codigoReferencia,
  );

  if (dadosParaDeletar.deletado) {
    throw new Error("DADOS_DELETADOS");
  }
  await salvarAlteracoesDados(dadosParaDeletar, { deletado: true });

  return dadosParaDeletar;
}

async function restaurarDadosService(
  nomeLinha,
  produtoId,
  tabelaId,
  codigoReferencia,
) {
  const dadosParaRestaurar = await obterCodigoReferencia(
    nomeLinha,
    produtoId,
    tabelaId,
    codigoReferencia,
  );

  if (!dadosParaRestaurar.deletado) {
    throw new Error("DADOS_NAO_DELETADOS");
  }

  await salvarAlteracoesDados(dadosParaRestaurar, { deletado: false });

  return dadosParaRestaurar;
}

async function excluirDadosService(
  nomeLinha,
  produtoId,
  tabelaId,
  codigoReferencia,
) {
  const dados = await obterCodigoReferencia(
    nomeLinha,
    produtoId,
    tabelaId,
    codigoReferencia,
  );

  if (!dados) {
    throw new Error("DADOS_DA_TABELA_INVALIDOS");
  }

  const linha = await obterLinha(nomeLinha);
  const produto = await obterProduto(linha, produtoId);
  const tabela = await acharTabelaPorId(produto, tabelaId);

  await excluirDadosFisicamente(linha, tabela, codigoReferencia);
}

module.exports = {
  obterDados,
  obterDadosDaTabela,
  adicionarDadosNaTabelaService,
  alterarDadosService,
  deletarDadosService,
  restaurarDadosService,
  excluirDadosService,
};
