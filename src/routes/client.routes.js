const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const { createRdv, myRdvs, cancelRdv, addAvis } = require("../controllers/client.controller");

router.use(auth, requireRole("CLIENT"));

router.post("/rdvs", createRdv);
router.get("/rdvs", myRdvs);
router.patch("/rdvs/:id/cancel", cancelRdv);
router.post("/rdvs/:id/avis", addAvis);

module.exports = router;
