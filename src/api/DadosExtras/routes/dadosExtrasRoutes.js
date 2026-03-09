const express = require("express");
const router = express.Router();
const {
  listarDadosExtras,
  obterDadosExtra,
  adicionarDadosExtra,
  alterarDadosExtra,
  excluirDadosExtra,
} = require("../controllers/dadosExtrasController");

router.get("/dadosExtra", listarDadosExtras);
router.get("/dadosExtra/:id", obterDadosExtra);
router.post("/dadosExtra", adicionarDadosExtra);
router.patch("/dadosExtra/:id", alterarDadosExtra);
router.delete("/dadosExtra/:id", excluirDadosExtra);

module.exports = router;
