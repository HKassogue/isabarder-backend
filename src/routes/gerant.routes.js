const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const { createService, listServices, updateService, deleteService, createModele, createCoiffeur } = require("../controllers/gerant.controller");

router.use(auth, requireRole("GERANT"));

router.get("/services", listServices);
router.post("/services", createService);
router.patch("/services/:id", updateService);
router.delete("/services/:id", deleteService);

router.post("/services/:serviceId/modeles", createModele);

router.post("/coiffeurs", createCoiffeur);

module.exports = router;
