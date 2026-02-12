const { PrismaClient, RdvStatus } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * POST /client/rdvs
 * body: { modeleId, creneauId }
 */
async function createRdv(req, res) {
  const clientId = req.user.id;
  const { modeleId, creneauId } = req.body || {};
  if (!modeleId || !creneauId) return res.status(400).json({ message: "modeleId et creneauId requis." });

  const creneau = await prisma.creneau.findUnique({ where: { id: Number(creneauId) } });
  if (!creneau || !creneau.isActive) return res.status(404).json({ message: "Créneau introuvable." });

  const existing = await prisma.rdv.findUnique({ where: { creneauId: creneau.id } });
  if (existing && existing.statut !== RdvStatus.ANNULE) {
    return res.status(409).json({ message: "Créneau déjà réservé." });
  }

  const modele = await prisma.modele.findUnique({ where: { id: Number(modeleId) } });
  if (!modele) return res.status(404).json({ message: "Modèle introuvable." });

  const rdv = await prisma.rdv.create({
    data: {
      statut: RdvStatus.CONFIRME,
      date: creneau.startAt,
      clientId,
      coiffeurId: creneau.coiffeurId,
      modeleId: modele.id,
      creneauId: creneau.id,
    },
    include: {
      modele: { include: { service: true } },
      creneau: true,
      coiffeur: { select: { id: true, username: true } },
    },
  });

  res.status(201).json(rdv);
}

async function myRdvs(req, res) {
  const clientId = req.user.id;
  const rdvs = await prisma.rdv.findMany({
    where: { clientId },
    orderBy: { date: "desc" },
    include: {
      modele: { include: { service: true } },
      creneau: true,
      coiffeur: { select: { id: true, username: true } },
      avis: true,
    },
  });
  res.json(rdvs);
}

async function cancelRdv(req, res) {
  const clientId = req.user.id;
  const rdvId = Number(req.params.id);

  const rdv = await prisma.rdv.findUnique({ where: { id: rdvId } });
  if (!rdv || rdv.clientId !== clientId) return res.status(404).json({ message: "RDV introuvable." });

  if (rdv.statut === RdvStatus.TERMINE) return res.status(400).json({ message: "Impossible d'annuler un RDV terminé." });

  const updated = await prisma.rdv.update({
    where: { id: rdvId },
    data: { statut: RdvStatus.ANNULE },
  });

  res.json(updated);
}

async function addAvis(req, res) {
  const clientId = req.user.id;
  const rdvId = Number(req.params.id);
  const { note, commentaire } = req.body || {};

  if (!note || Number(note) < 1 || Number(note) > 5) {
    return res.status(400).json({ message: "note doit être entre 1 et 5." });
  }

  const rdv = await prisma.rdv.findUnique({ where: { id: rdvId }, include: { avis: true } });
  if (!rdv || rdv.clientId !== clientId) return res.status(404).json({ message: "RDV introuvable." });

  if (rdv.statut !== RdvStatus.TERMINE) return res.status(400).json({ message: "Avis possible uniquement si RDV terminé." });
  if (rdv.avis) return res.status(409).json({ message: "Avis déjà saisi." });

  const avis = await prisma.avis.create({
    data: { rdvId: rdv.id, note: Number(note), commentaire: commentaire || null },
  });

  res.status(201).json(avis);
}

module.exports = { createRdv, myRdvs, cancelRdv, addAvis };
