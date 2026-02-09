function errorHandler(err, req, res, next) {
  const erroDadosObrigatorios = {
    status: 400,
    msg: "Dados obrigatórios em falta!",
  };

  const errosConhecidos = {
    LINHA_NAO_ENCONTRADA: { status: 404, msg: "Linha não encontrada!" },
    LINHA_SEM_PRODUTOS: {
      status: 404,
      msg: "Linha não possui produtos cadastrados!",
    },
    PRODUTO_NAO_ENCONTRADO: { status: 404, msg: "Produto não encontrado!" },
    PRODUTO_SEM_TABELAS: {
      status: 404,
      msg: "Produto não possui tabelas cadastradas!",
    },
    TABELA_SEM_DADOS: {
      status: 404,
      msg: "Tabela não possui dados cadastrados!",
    },
    CATALOGO_VAZIO: { status: 404, msg: "O catálogo está vazio!" },
    TABELA_NAO_ENCONTRADA_PARA_O_INDICE_INFORMADO: {
      status: 400,
      msg: "Índice da tabela inválido!",
    },
    LINHA_DELETADA: {
      status: 400,
      msg: "Essa linha foi deletada!",
    },
    LINHA_NAO_DELETADA: {
      status: 400,
      msg: "Essa linha não foi deletada!",
    },
    PRODUTO_DELETADO: {
      status: 400,
      msg: "Esse produto foi deletado!",
    },
    PRODUTO_NAO_DELETADO: {
      status: 400,
      msg: "Esse produto não foi deletado!",
    },
    TABELA_DELETADA: {
      status: 400,
      msg: "Essa tabela foi deletada!",
    },
    TABELA_NAO_DELETADA: {
      status: 400,
      msg: "Essa tabela não foi deletada!",
    },
    DADOS_DELETADOS: {
      status: 400,
      msg: "Esses dados foram deletados!",
    },
    DADOS_NAO_DELETADOS: {
      status: 400,
      msg: "Esses dados não foram deletados!",
    },
    CODIGO_JA_EXISTENTE: {
      status: 400,
      msg: "Esse código está sendo utilizado!",
    },
    LINHA_INVALIDA: erroDadosObrigatorios,
    PRODUTO_INVALIDO: erroDadosObrigatorios,
    TABELA_INVALIDA: erroDadosObrigatorios,
    DADOS_DA_TABELA_INVALIDOS: erroDadosObrigatorios,
  };

  const erroMapeado = errosConhecidos[err.message];

  if (erroMapeado) {
    return res.status(erroMapeado.status).json({ erro: erroMapeado.msg });
  }

  console.error(err);
  return res.status(500).json({ erro: "Erro interno do servidor." });
}

module.exports = errorHandler;
