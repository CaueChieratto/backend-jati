const mongoose = require("mongoose");

const DadosSchema = new mongoose.Schema({
  dn: { type: String, required: true },
  codigo: { type: String, required: true },
  embalagem: String,
  de: String,
  esp: String,
  comp: String,
  peso: String,
  deletado: { type: Boolean, default: false },
});

const TabelaSchema = new mongoose.Schema({
  tabela_id: Number,
  pn: { type: String, required: true },
  deletado: { type: Boolean, default: false },
  dados: [DadosSchema],
});

const ProdutoSchema = new mongoose.Schema({
  produto_id: Number,
  nome_produto: { type: String, required: true },
  imagem_produto: { type: String, required: true },
  imagem_patente: String,
  pdf_produto: String,
  descricao_produto: String,
  deletado: { type: Boolean, default: false },
  tabelas_produto: [TabelaSchema],
});

const LinhaSchema = new mongoose.Schema({
  linha: { type: String, required: true },
  painel_linha: { type: String, required: true },
  imagem_linha: { type: String, required: true },
  pdf_linha: String,
  deletado: { type: Boolean, default: false },
  produtos_linha: [ProdutoSchema],
});

module.exports = mongoose.model("Linha", LinhaSchema);
