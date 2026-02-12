const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function listServices(req, res) {
  const services = await prisma.service.findMany({
    orderBy: { nom: "asc" },
    select: { id: true, nom: true, photoUrl: true, details: true },
  });
  res.json(services);
}

async function listModelesByService(req, res) {
  const serviceId = Number(req.params.serviceId);
  const modeles = await prisma.modele.findMany({
    where: { serviceId },
    orderBy: { nom: "asc" },
    select: { id: true, nom: true, photoUrl: true, details: true, prix: true, dureeMin: true, serviceId: true },
  });
  res.json(modeles);
}

async function listCoiffeurs(req, res) {
  const coiffeurs = await prisma.user.findMany({
    where: { role: "COIFFEUR" },
    orderBy: { username: "asc" },
    select: { id: true, username: true, email: true, photoUrl: true },
  });
  res.json(coiffeurs);
}

async function listCreneauxCoiffeur(req, res) {
  const coiffeurId = Number(req.params.coiffeurId);
  const from = req.query.from ? new Date(String(req.query.from)) : undefined;
  const to = req.query.to ? new Date(String(req.query.to)) : undefined;

  const where = {
    coiffeurId,
    isActive: true,
    ...(from || to ? { startAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
  };

  const creneaux = await prisma.creneau.findMany({
    where,
    orderBy: { startAt: "asc" },
    select: { id: true, startAt: true, endAt: true, coiffeurId: true },
  });

  // Un créneau est "pris" s'il a un RDV non annulé
  const creneauxAvecEtat = await Promise.all(
    creneaux.map(async (c) => {
      const rdv = await prisma.rdv.findUnique({ where: { creneauId: c.id } });
      const taken = rdv && rdv.statut !== "ANNULE";
      return { ...c, taken };
    })
  );

  res.json(creneauxAvecEtat);
}

module.exports = { listServices, listModelesByService, listCoiffeurs, listCreneauxCoiffeur };
