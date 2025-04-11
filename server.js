const express = require("express");
const app = express();

let accessCode = generateCode();
let isActive = true;
let lastUpdate = new Date();

// Genera un código aleatorio
function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Middleware para procesar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Actualización automática cada 90 minutos
setInterval(() => {
  if (isActive) {
    accessCode = generateCode();
    lastUpdate = new Date();
    console.log("Código actualizado automáticamente:", accessCode);
  }
}, 90 * 60 * 1000); // 90 minutos en milisegundos

// Ruta de estado
app.get("/status", (req, res) => {
  res.json({ code: accessCode, active: isActive, lastUpdate });
});

app.get("/status", (req, res) => {
  console.log("Solicitud recibida para obtener estado"); // Log para verificar que la solicitud llega
  res.json({ code: accessCode, active: isActive, lastUpdate });
});
// Control de encendido y apagado
app.post("/power", (req, res) => {
  const { action } = req.body;
  if (action === "on") isActive = true;
  if (action === "off") isActive = false;
  res.json({ ok: true });
});

// Actualización manual del código
app.post("/update", (req, res) => {
  accessCode = generateCode();
  lastUpdate = new Date();
  res.json({ ok: true });
});

// Verificación de código
app.get("/verify/:code", (req, res) => {
  if (!isActive) return res.status(403).send("Acceso deshabilitado.");
  if (req.params.code === accessCode) {
    return res.send("Código válido.");
  } else {
    return res.status(400).send("Código inválido.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});
