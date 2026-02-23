require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const routes = require("./src/routes");
const errorHandler = require("./src/middlewares/errorHandler");

app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);
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
