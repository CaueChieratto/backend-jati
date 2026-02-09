const express = require("express");
const router = express.Router();

const {
  listarTabelasDoProduto,
  criarTabelaDoProduto,
  listarTabelasPorId,
  alterarTabela,
  deletarTabela,
  restaurarTabela,
} = require("../controllers/tabelaController");

router.get("/catalogo/:linha/:produtoId/tabelas", listarTabelasDoProduto);
router.get("/catalogo/:linha/:produtoId/tabelas/:tabelaId", listarTabelasPorId);
router.post("/catalogo/:linha/:produtoId/tabelas", criarTabelaDoProduto);
router.patch("/catalogo/:linha/:produtoId/tabelas/:tabelaId", alterarTabela);
router.patch(
  "/catalogo/:linha/:produtoId/tabelas/:tabelaId/deletar",
  deletarTabela,
);
router.patch(
  "/catalogo/:linha/:produtoId/tabelas/:tabelaId/restaurar",
  restaurarTabela,
);

module.exports = router;
