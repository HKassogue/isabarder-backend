const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

// --- Services
async function createService(req, res) {
  const { nom, details, photoUrl } = req.body || {};
  if (!nom) return res.status(400).json({ message: "nom requis." });
  const s = await prisma.service.create({ data: { nom, details: details || null, photoUrl: photoUrl || null } });
  res.status(201).json(s);
}

async function listServices(req, res) {
  const services = await prisma.service.findMany({ orderBy: { nom: "asc" } });
  res.json(services);
}

async function updateService(req, res) {
  const id = Number(req.params.id);
  const { nom, details, photoUrl } = req.body || {};
  const s = await prisma.service.update({
    where: { id },
    data: { ...(nom ? { nom } : {}), ...(details !== undefined ? { details } : {}), ...(photoUrl !== undefined ? { photoUrl } : {}) },
  });
  res.json(s);
}

async function deleteService(req, res) {
  const id = Number(req.params.id);
  await prisma.service.delete({ where: { id } });
  res.status(204).send();
}

// --- Modèles
async function createModele(req, res) {
  const serviceId = Number(req.params.serviceId);
  const { nom, details, photoUrl, prix, dureeMin } = req.body || {};
  if (!nom || !prix || !dureeMin) return res.status(400).json({ message: "nom, prix, dureeMin requis." });

  const m = await prisma.modele.create({
    data: {
      serviceId,
      nom,
      details: details || null,
      photoUrl: photoUrl || null,
      prix: Number(prix),
      dureeMin: Number(dureeMin),
    },
  });

  res.status(201).json(m);
}

async function createCoiffeur(req, res) {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password) return res.status(400).json({ message: "username, email, password requis." });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ message: "Email déjà utilisé." });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, passwordHash, role: Role.COIFFEUR },
    select: { id: true, username: true, email: true, role: true },
  });

  res.status(201).json(user);
}

module.exports = {
  createService,
  listServices,
  updateService,
  deleteService,
  createModele,
  createCoiffeur,
};
