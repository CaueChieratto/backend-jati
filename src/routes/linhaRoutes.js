const express = require("express");
const router = express.Router();

const {
  listarTodasLinhas,
  listarTodasLinhasDeletadas,
  listarLinha,
  criarLinha,
  alterarLinha,
  deletarLinha,
  restaurarLinha,
} = require("../controllers/linhaController");

router.get("/catalogo", listarTodasLinhas);
router.get("/catalogo/deletados", listarTodasLinhasDeletadas);
router.get("/catalogo/:linha", listarLinha);
router.post("/catalogo", criarLinha);
router.patch("/catalogo/:linha", alterarLinha);
router.patch("/catalogo/:linha/deletar", deletarLinha);
router.patch("/catalogo/:linha/restaurar", restaurarLinha);

module.exports = router;
