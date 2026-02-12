const { PrismaClient, Role, RdvStatus } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Nettoyage
  await prisma.avis.deleteMany();
  await prisma.rdv.deleteMany();
  await prisma.creneau.deleteMany();
  await prisma.modele.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  const hash = (pw) => bcrypt.hashSync(pw, 10);

  // Utilisateurs
  const gerant = await prisma.user.create({
    data: {
      username: "Gerant",
      email: "gerant@salon.test",
      passwordHash: hash("password123"),
      role: Role.GERANT,
    },
  });

  const coiffeur = await prisma.user.create({
    data: {
      username: "Coiffeur 1",
      email: "coiffeur1@salon.test",
      passwordHash: hash("password123"),
      role: Role.COIFFEUR,
    },
  });

  const client = await prisma.user.create({
    data: {
      username: "Client 1",
      email: "client1@salon.test",
      passwordHash: hash("password123"),
      role: Role.CLIENT,
    },
  });

  // Services + modèles
  const serviceCoupe = await prisma.service.create({
    data: { nom: "Coupe", details: "Coupes et finitions." },
  });

  const modeleA = await prisma.modele.create({
    data: {
      serviceId: serviceCoupe.id,
      nom: "Coupe homme classique",
      details: "Coupe + finition",
      prix: 2000,
      dureeMin: 20,
    },
  });

  const modeleB = await prisma.modele.create({
    data: {
      serviceId: serviceCoupe.id,
      nom: "Coupe femme + brushing",
      details: "Coupe + brushing simple",
      prix: 4000,
      dureeMin: 40,
    },
  });

  // Créneaux (dispo coiffeur)
  const now = new Date();
  const startAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // demain
  startAt.setHours(10, 0, 0, 0);
  const endAt = new Date(startAt.getTime() + 30 * 60 * 1000);

  const creneau = await prisma.creneau.create({
    data: {
      coiffeurId: coiffeur.id,
      startAt,
      endAt,
      isActive: true,
    },
  });

  // Exemple RDV confirmé
  await prisma.rdv.create({
    data: {
      statut: RdvStatus.CONFIRME,
      date: creneau.startAt,
      clientId: client.id,
      coiffeurId: coiffeur.id,
      modeleId: modeleA.id,
      creneauId: creneau.id,
    },
  });

  console.log("Seed OK ✅");
  console.log("Comptes de test :");
  console.log("GERANT   gerant@salon.test / password123");
  console.log("COIFFEUR coiffeur1@salon.test / password123");
  console.log("CLIENT   client1@salon.test / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
