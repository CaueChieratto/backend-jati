require("dotenv").config();
const express = require("express");
const app = express();

const routes = require("./src/routes");
const errorHandler = require("./src/middlewares/errorHandler");

app.use(express.json());

const connectDatabase = require("./src/config/databaseConfig");
connectDatabase();

app.use(routes);
app.use(errorHandler);

if (require.main === module) {
  app.listen(3000, () => {
    console.log("🚀 Servidor rodando em http://localhost:3000");
  });
}

module.exports = app;
