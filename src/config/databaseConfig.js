const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Erro: A variável de ambiente MONGO_URI não está definida.");
  process.exit(1);
}

async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Banco de dados MongoDB conectado com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar no MongoDB:", error);
    process.exit(1);
  }
}

module.exports = connectDatabase;
