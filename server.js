require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const routes = require("./src/routes");
const errorHandler = require("./src/middlewares/errorHandler");

app.use(express.json());
app.use(cors());

const connectDatabase = require("./src/config/databaseConfig");

app.use(routes);
app.use(errorHandler);

connectDatabase().then(() => {
  if (require.main === module) {
    app.listen(3000, () => {
      console.log("🚀 Servidor rodando em http://localhost:3000");
    });
  }
});

module.exports = app;
