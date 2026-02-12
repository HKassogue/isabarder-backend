const express = require("express");
const router = express.Router();
const { listServices, listModelesByService, listCoiffeurs, listCreneauxCoiffeur } = require("../controllers/public.controller");

router.get("/services", listServices);
router.get("/services/:serviceId/modeles", listModelesByService);

router.get("/coiffeurs", listCoiffeurs);
router.get("/coiffeurs/:coiffeurId/creneaux", listCreneauxCoiffeur);

module.exports = router;
