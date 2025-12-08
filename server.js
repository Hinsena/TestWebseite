import express from "express";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// ===== statische Dateien ausliefern =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// ===== temporärer Speicher für Demo =====
const demoUsers = new Map(); // username -> hash

// ===== Registrierung =====
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Missing data");

  const hash = crypto.createHash("sha256").update(password).digest("hex");
  demoUsers.set(username, hash);

  res.send("registered");
});

// ===== Login =====
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Missing data");

  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const success = demoUsers.get(username) === hash;

  res.send(success ? "login ok" : "login failed");
});

// ===== Server starten =====
app.listen(3000, () => {
  console.log("Demo-Server läuft auf Port 3000");
});
