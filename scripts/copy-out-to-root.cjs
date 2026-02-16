/**
 * Copia el contenido de out/ a la raíz del proyecto.
 * Para Hostinger: con "Output directory" en null, sirven la raíz y así encuentran el sitio.
 */
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "out");
const rootDir = path.join(__dirname, "..");

if (!fs.existsSync(outDir)) {
  console.error("No existe la carpeta out/. Ejecutá npm run build primero.");
  process.exit(1);
}

for (const name of fs.readdirSync(outDir)) {
  const src = path.join(outDir, name);
  const dest = path.join(rootDir, name);
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.cpSync(src, dest, { recursive: true });
  } else {
    fs.copyFileSync(src, dest);
  }
  console.log("Copiado:", name);
}

console.log("Listo: contenido de out/ copiado a la raíz.");
