function authMiddleware(req, res, next) {
  if (req.method === "GET") {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ erro: "Acesso negado. Token não fornecido." });
  }
  const token = authHeader.split(" ")[1];
  const TOKEN_SECRETO = process.env.TOKEN_SECRETO;

  if (token !== TOKEN_SECRETO) {
    return res
      .status(403)
      .json({ erro: "Acesso não autorizado. Token inválido." });
  }

  next();
}

module.exports = authMiddleware;
