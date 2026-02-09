require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const connectDatabase = require("./src/config/databaseConfig");

const LinhaModel = require("./src/models/CatalogoSchema");

async function importarDados() {
  try {
    await connectDatabase();

    const caminhoArquivo = path.join(__dirname, "src", "data", "catalogo.json");
    const dadosBrutos = fs.readFileSync(caminhoArquivo, "utf-8");
    const catalogo = JSON.parse(dadosBrutos);

    console.log(`Lido(s) ${catalogo.length} registro(s) do arquivo JSON.`);

    console.log("Limpando coleção 'linhas' antiga...");
    await LinhaModel.deleteMany({});
    console.log("Coleção limpa.");

    console.log("Inserindo novos dados...");
    await LinhaModel.insertMany(catalogo);

    console.log("✅ Importação concluída com sucesso!");
  } catch (erro) {
    console.error("❌ Erro ao importar dados:", erro);
  } finally {
    await mongoose.connection.close();
    console.log("Conexão encerrada.");
    process.exit();
  }
}

importarDados();
