const express = require("express");
const router = express.Router();

const {
  buscarManutencao,
  atualizarManutencao,
} = require("../controllers/manutencaoController");

router.get("/configs/manutencao", buscarManutencao);
router.patch("/configs/manutencao", atualizarManutencao);

module.exports = router;
