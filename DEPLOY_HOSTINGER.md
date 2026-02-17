# Despliegue en Hostinger (sitio estático)

Este proyecto se exporta como sitio 100% estático.

---

## Opción A: Hostinger leyendo la rama `build` (recomendado)

El build en el servidor de Hostinger **no genera** la carpeta `out` (limitación de su entorno). La solución es construir en **GitHub Actions** y que Hostinger sirva la rama **`build`**, que ya contiene el sitio estático.

1. **En Hostinger (Deployments / Settings):**
   - **Branch:** **`build`** (no `main`).
   - **Build command:** `npm run build` (en esa rama solo hace `echo done`).
   - **Output directory:** **`.`** (punto) o **`null`** — así se sirve la raíz, donde ya están `index.html`, `_next`, `en`, `es`.
2. **En GitHub:** Cada push a **`main`** dispara el workflow: construye el sitio, sube la carpeta **`deploy`** (sitio + un `package.json` mínimo) a la rama **`build`**.
3. **En Hostinger:** Activar **Auto Deployment** (webhook) para que, al actualizar `build`, se redespliegue el sitio.

**Resumen:** Push a `main` → GitHub Actions construye y sube a `build` → Hostinger hace pull de `build` y sirve la raíz (index.html, _next, en, es).

Si el repo es privado, en Hostinger genera la SSH key y añádela en GitHub como Deploy key (solo lectura) del repo.

### Si Hostinger cambia sola la rama a `main`

En algunos paneles la rama se resetea a **`main`** después del deploy. **Solución:** después de cada deploy, entrá en **Deployments → Settings**, volvé a elegir la rama **`build`** y guardá.

---

## Opción B: Subida manual

### 1. Generar el build

En tu máquina local:

```bash
npm install && npm run build
```

El build genera la carpeta **`out`** en la raíz del proyecto con todo el sitio listo para hosting estático.

### 2. Subir los archivos a Hostinger

- Sube **el contenido** de la carpeta **`out`** (no la carpeta `out` en sí) a la raíz de tu hosting.
- En Hostinger, la raíz suele ser **`public_html`** (o el directorio que tengas como “document root”).

Estructura que debe quedar en el servidor:

- `public_html/index.html` (redirección raíz)
- `public_html/_next/` (CSS, JS y assets de Next.js)
- `public_html/en/` (páginas en inglés)
- `public_html/es/` (páginas en español)

**Importante:** La carpeta **`_next`** debe estar **dentro** de `public_html` (o del document root), al mismo nivel que `index.html`. El HTML usa rutas absolutas `/_next/...`; si `_next` no está en la raíz del sitio, CSS y JS no cargarán.

### 3. Configurar el document root (si aplica)

- Si subes el contenido de `out` directamente a `public_html`, no hace falta cambiar nada.
- Si por alguna razón usas una subcarpeta (por ejemplo `public_html/mirz`), configura en el panel de Hostinger que el **document root** sea esa carpeta donde están `index.html`, `_next`, `en` y `es`.

### 4. Caché (opcional)

Si Hostinger tiene caché (por ejemplo “LiteSpeed Cache” o similar), después de subir una nueva versión conviene **limpiar la caché** para que se sirvan los archivos nuevos.

### Resumen (manual)

| Paso | Acción |
|------|--------|
| 1 | `npm install && npm run build` |
| 2 | Subir **contenido** de `out` a `public_html` |
| 3 | Comprobar que `_next`, `en` y `es` están en el document root |
| 4 | (Opcional) Limpiar caché en el panel de Hostinger |
