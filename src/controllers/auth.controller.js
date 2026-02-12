const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt");

const prisma = new PrismaClient();

/**
 * Register (public): rôle CLIENT uniquement
 */
async function register(req, res) {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password) {
    return res.status(400).json({ message: "username, email, password requis." });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ message: "Email déjà utilisé." });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, passwordHash, role: Role.CLIENT },
    select: { id: true, username: true, email: true, role: true },
  });

  const token = signToken({ userId: user.id, role: user.role });
  return res.status(201).json({ user, token });
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "email et password requis." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Identifiants invalides." });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Identifiants invalides." });

  const token = signToken({ userId: user.id, role: user.role });
  return res.json({
    user: { id: user.id, username: user.username, email: user.email, role: user.role },
    token,
  });
}

async function me(req, res) {
  return res.json({ user: req.user });
}

module.exports = { register, login, me };
