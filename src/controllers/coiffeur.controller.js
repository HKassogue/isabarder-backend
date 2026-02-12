const { PrismaClient, RdvStatus } = require("@prisma/client");
const prisma = new PrismaClient();

async function createCreneau(req, res) {
  const coiffeurId = req.user.id;
  const { startAt, endAt } = req.body || {};
  if (!startAt || !endAt) return res.status(400).json({ message: "startAt et endAt requis (ISO Date)." });

  const s = new Date(startAt);
  const e = new Date(endAt);
  if (!(s < e)) return res.status(400).json({ message: "startAt doit être < endAt." });

  // éviter chevauchement simple (même coiffeur)
  const overlap = await prisma.creneau.findFirst({
    where: {
      coiffeurId,
      isActive: true,
      AND: [{ startAt: { lt: e } }, { endAt: { gt: s } }],
    },
  });
  if (overlap) return res.status(409).json({ message: "Chevauchement avec un autre créneau." });

  const c = await prisma.creneau.create({
    data: { coiffeurId, startAt: s, endAt: e, isActive: true },
  });
  res.status(201).json(c);
}

async function myRdvs(req, res) {
  const coiffeurId = req.user.id;
  const rdvs = await prisma.rdv.findMany({
    where: { coiffeurId },
    orderBy: { date: "asc" },
    include: {
      client: { select: { id: true, username: true, email: true } },
      modele: { include: { service: true } },
      creneau: true,
      avis: true,
    },
  });
  res.json(rdvs);
}

async function updateRdvStatus(req, res) {
  const coiffeurId = req.user.id;
  const rdvId = Number(req.params.id);
  const { statut } = req.body || {};

  const allowed = ["CONFIRME", "ANNULE", "TERMINE"];
  if (!allowed.includes(String(statut))) {
    return res.status(400).json({ message: `statut doit être dans: ${allowed.join(", ")}` });
  }

  const rdv = await prisma.rdv.findUnique({ where: { id: rdvId } });
  if (!rdv || rdv.coiffeurId !== coiffeurId) return res.status(404).json({ message: "RDV introuvable." });

  const updated = await prisma.rdv.update({
    where: { id: rdvId },
    data: { statut: RdvStatus[statut] },
  });

  res.json(updated);
}

module.exports = { createCreneau, myRdvs, updateRdvStatus };
