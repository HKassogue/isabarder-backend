const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const { createCreneau, myRdvs, updateRdvStatus } = require("../controllers/coiffeur.controller");

router.use(auth, requireRole("COIFFEUR"));

router.post("/creneaux", createCreneau);
router.get("/rdvs", myRdvs);
router.patch("/rdvs/:id/status", updateRdvStatus);

module.exports = router;
