const express = require("express");
const router = express.Router();

const maintenanceRoutes = require("../api/Manutencao/routes/manutencaoRoutes");
const dadosExtraRoutes = require("../api/DadosExtras/routes/dadosExtrasRoutes");
const linhaRoutes = require("../api/Linhas/routes/linhaRoutes");
const produtosRoutes = require("../api/Produtos/routes/produtosRoutes");
const tabelaRoutes = require("../api/Tabelas/routes/tabelaRoutes");
const dadosRoutes = require("../api/Dados/routes/dadosRoutes");

const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.use(maintenanceRoutes);
router.use(dadosExtraRoutes);
router.use(linhaRoutes);
router.use(produtosRoutes);
router.use(tabelaRoutes);
router.use(dadosRoutes);

module.exports = router;
