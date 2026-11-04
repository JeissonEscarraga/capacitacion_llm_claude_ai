// Servidor estático mínimo (sin dependencias) para probar el juego en
// Codespaces o en el equipo local: npm start  →  http://localhost:8080
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const RAIZ = path.resolve(__dirname, "..", "web");
const PUERTO = Number(process.env.PORT) || 8080;
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

http.createServer((req, res) => {
  let ruta = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (ruta.endsWith("/")) ruta += "index.html";
  const archivo = path.resolve(RAIZ, "." + ruta);
  if (!archivo.startsWith(RAIZ + path.sep)) {
    res.writeHead(403).end("Prohibido");
    return;
  }
  fs.readFile(archivo, (err, datos) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("No encontrado");
      return;
    }
    res.writeHead(200, {
      "Content-Type": TIPOS[path.extname(archivo)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(datos);
  });
}).listen(PUERTO, () => {
  console.log("Lex Boss en http://localhost:" + PUERTO);
});
