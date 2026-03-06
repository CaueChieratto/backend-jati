const express = require("express");
const router = express.Router();

const maintenanceRoutes = require("./manutencaoRoutes");
const linhaRoutes = require("./linhaRoutes");
const produtosRoutes = require("./produtosRoutes");
const tabelaRoutes = require("./tabelaRoutes");
const dadosRoutes = require("./dadosRoutes");

const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.use(maintenanceRoutes);
router.use(linhaRoutes);
router.use(produtosRoutes);
router.use(tabelaRoutes);
router.use(dadosRoutes);

module.exports = router;
