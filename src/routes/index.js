const express = require("express");
const router = express.Router();

const linhaRoutes = require("./linhaRoutes");
const produtosRoutes = require("./produtosRoutes");
const tabelaRoutes = require("./tabelaRoutes");
const dadosRoutes = require("./dadosRoutes");

router.use(linhaRoutes);
router.use(produtosRoutes);
router.use(tabelaRoutes);
router.use(dadosRoutes);

module.exports = router;
