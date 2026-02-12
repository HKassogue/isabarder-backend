const { PrismaClient } = require("@prisma/client");
const { verifyToken } = require("../utils/jwt");

const prisma = new PrismaClient();

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Token manquant." });
    }

    const decoded = verifyToken(token); // { userId, role }
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ message: "Utilisateur introuvable." });

    req.user = { id: user.id, role: user.role, email: user.email, username: user.username };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token invalide." });
  }
}

module.exports = auth;
