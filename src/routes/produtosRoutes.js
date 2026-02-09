const express = require("express");
const router = express.Router();

const {
  listarProdutoPorId,
  criarProduto,
  alterarProduto,
  deletarProduto,
  restaurarProduto,
} = require("../controllers/produtosController");

router.get("/catalogo/:linha/:produtoId", listarProdutoPorId);
router.post("/catalogo/:linha", criarProduto);
router.patch("/catalogo/:linha/:produtoId", alterarProduto);
router.patch("/catalogo/:linha/:produtoId/deletar", deletarProduto);
router.patch("/catalogo/:linha/:produtoId/restaurar", restaurarProduto);

module.exports = router;
