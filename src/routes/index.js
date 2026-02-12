const express = require("express");

const authRoutes = require("./auth.routes");
const publicRoutes = require("./public.routes");
const clientRoutes = require("./client.routes");
const coiffeurRoutes = require("./coiffeur.routes");
const gerantRoutes = require("./gerant.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/public", publicRoutes);

router.use("/client", clientRoutes);
router.use("/coiffeur", coiffeurRoutes);
router.use("/gerant", gerantRoutes);

module.exports = router;
