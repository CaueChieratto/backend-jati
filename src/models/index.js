function criarModeloLinha(linha) {
  return {
    linha: linha.linha,
    painel_linha: linha.painel_linha,
    imagem_linha: linha.imagem_linha,
    pdf_linha: linha.pdf_linha,
    deletado: false,
    produtos_linha: [],
  };
}

function criarModeloProduto(produto, id) {
  return {
    produto_id: id,
    nome_produto: produto.nome_produto,
    imagem_produto: produto.imagem_produto,
    pdf_produto: produto.pdf_produto || "",
    descricao_produto: produto.descricao_produto || "",
    imagem_patente: produto.imagem_patente || undefined,
    deletado: false,
    tabelas_produto: [],
  };
}

function criarModeloTabela(tabela, id) {
  return {
    tabela_id: id,
    pn: tabela.pn,
    deletado: false,
    dados: [],
  };
}

function criarModeloDados(dados) {
  return {
    deletado: false,
    dn: dados.dn,
    codigo: dados.codigo,
    embalagem: dados.embalagem || undefined,
    de: dados.de || undefined,
    esp: dados.esp || undefined,
    comp: dados.comp || undefined,
    peso: dados.peso || undefined,
  };
}

module.exports = {
  criarModeloProduto,
  criarModeloLinha,
  criarModeloTabela,
  criarModeloDados,
};
