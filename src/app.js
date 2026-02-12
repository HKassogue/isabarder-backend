require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Backend Salon RDV OK ✅", version: "1.0.0" });
});

app.use("/api", routes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable." });
});

module.exports = app;
