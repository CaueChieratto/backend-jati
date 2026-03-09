const express = require("express");
const router = express.Router();

const {
  listarDadosDaTabela,
  adicionarDadosNaTabela,
  alterarDados,
  deletarDados,
  restaurarDados,
  excluirDados,
} = require("../controllers/dadosController");

router.get(
  "/catalogo/:linha/:produtoId/tabelas/:tabelaId/dados",
  listarDadosDaTabela,
);
router.put(
  "/catalogo/:linha/:produtoId/tabelas/:tabelaId/dados",
  adicionarDadosNaTabela,
);
router.patch(
  "/catalogo/:linha/:produtoId/tabelas/:tabelaId/dados/:codigo",
  alterarDados,
);
router.patch(
  "/catalogo/:linha/:produtoId/tabelas/:tabelaId/dados/:codigo/deletar",
  deletarDados,
);
router.patch(
  "/catalogo/:linha/:produtoId/tabelas/:tabelaId/dados/:codigo/restaurar",
  restaurarDados,
);
router.delete(
  "/catalogo/:linha/:produtoId/tabelas/:tabelaId/dados/:codigo",
  excluirDados,
);

module.exports = router;
