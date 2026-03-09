const express = require("express");
const router = express.Router();

const {
  listarProdutos,
  listarProdutoPorId,
  listarProdutosPaginados,
  criarProduto,
  alterarProduto,
  deletarProduto,
  restaurarProduto,
  salvarProdutoCompleto,
  excluirProduto,
  reordenarProdutos,
} = require("../controllers/produtosController");

router.get("/catalogo/:linha/produtos", listarProdutos);
router.get("/catalogo/:linha/produtos/paginados", listarProdutosPaginados);
router.get("/catalogo/:linha/:produtoId", listarProdutoPorId);
router.put("/catalogo/:linha/produtos/completo", salvarProdutoCompleto);
router.post("/catalogo/:linha", criarProduto);
router.patch("/catalogo/:linha/produtos/reordenar", reordenarProdutos);
router.patch("/catalogo/:linha/:produtoId", alterarProduto);
router.patch("/catalogo/:linha/:produtoId/deletar", deletarProduto);
router.patch("/catalogo/:linha/:produtoId/restaurar", restaurarProduto);
router.delete("/catalogo/:linha/:produtoId", excluirProduto);

module.exports = router;
