/**
 * Copia el contenido de out/ a la raíz del proyecto (cwd).
 * Para Hostinger: Output directory null o raíz.
 */
const fs = require("fs");
const path = require("path");

const cwd = process.cwd();
const outDir = path.join(cwd, "out");
const rootDir = cwd;

if (!fs.existsSync(outDir)) {
  console.error("No existe la carpeta out/ en " + outDir + " (cwd: " + cwd + ")");
  try {
    const entries = fs.readdirSync(cwd);
    console.error("Contenido de cwd:", entries.join(", "));
  } catch (e) {
    console.error(e.message);
  }
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
