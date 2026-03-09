const {
  obterDadosDaTabela,
  adicionarDadosNaTabelaService,
  alterarDadosService,
  deletarDadosService,
  restaurarDadosService,
  excluirDadosService,
} = require("../services/dadosService");

async function listarDadosDaTabela(req, res, next) {
  try {
    const { linha, produtoId } = req.params;
    const dadosDaTabela = await obterDadosDaTabela(linha, produtoId);
    res.json(dadosDaTabela);
  } catch (error) {
    next(error);
  }
}

async function adicionarDadosNaTabela(req, res, next) {
  try {
    const { linha, produtoId, tabelaId } = req.params;
    const dados = req.body;

    const tabelaAtualizada = await adicionarDadosNaTabelaService(
      linha,
      produtoId,
      tabelaId,
      dados,
    );

    res.status(201).json(tabelaAtualizada);
  } catch (error) {
    next(error);
  }
}

async function alterarDados(req, res, next) {
  try {
    const { linha, produtoId, tabelaId, codigo } = req.params;
    const alteracoes = req.body;
    const dadosAlterados = await alterarDadosService(
      linha,
      produtoId,
      tabelaId,
      codigo,
      alteracoes,
    );
    res.status(201).json(dadosAlterados);
  } catch (error) {
    next(error);
  }
}

async function deletarDados(req, res, next) {
  try {
    const { linha, produtoId, tabelaId, codigo } = req.params;
    const dadosDeletados = await deletarDadosService(
      linha,
      produtoId,
      tabelaId,
      codigo,
    );
    res.status(201).json(dadosDeletados);
  } catch (error) {
    next(error);
  }
}

async function restaurarDados(req, res, next) {
  try {
    const { linha, produtoId, tabelaId, codigo } = req.params;
    const dadosRestaurados = await restaurarDadosService(
      linha,
      produtoId,
      tabelaId,
      codigo,
    );
    res.status(201).json(dadosRestaurados);
  } catch (error) {
    next(error);
  }
}

async function excluirDados(req, res, next) {
  try {
    const { linha, produtoId, tabelaId, codigo } = req.params;
    await excluirDadosService(linha, produtoId, tabelaId, codigo);
    res.status(200).json({ msg: "Dados excluídos fisicamente com sucesso!" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarDadosDaTabela,
  adicionarDadosNaTabela,
  alterarDados,
  deletarDados,
  restaurarDados,
  excluirDados,
};
