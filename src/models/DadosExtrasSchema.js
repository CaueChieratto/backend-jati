const mongoose = require("mongoose");

const DadosExtrasSchema = new mongoose.Schema({
  url_imagem: { type: String, required: true },
  url_pdf: { type: String, required: true },
  texto: { type: String, required: true },
});

module.exports = mongoose.model("DadosExtra", DadosExtrasSchema);
