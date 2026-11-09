# MiniFauna 🌿🦖
### Explorador 3D Art-Toy de Hábitats, Figuras Articuladas y Tienda Oficial WooCommerce
*Marca artesanal hermana de Martenscrap · Creado por Marta Pastor Escribano*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/superabienator/MiniFauna)

---

## 🌟 Características Principales

### 1. Globo Terráqueo 3D Interactivo (Dirección de Arte Art-Toy / Soft-Touch Vinyl)
- **Geometría y Costas Nítidas**: Curvatura esférica limpia sin invasión ni superposición de tierras sobre el agua. Mares interiores abiertos y definidos (Mediterráneo, Mar Rojo, Golfo Pérsico, Mar Báltico, Caribe).
- **Transición y Difusión Suave de Color**: Fusión continua en fronteras terrestres (Europa–Asia, Norteamérica–Sudamérica, África–Asia) con paleta extraída del logotipo botánico oficial.
- **Relieve Compacto**: Micro-elevación de continentes con bisel acolchado suave tipo juguete moldeado y normales suaves (`computeVertexNormals()`).
- **Letras 3D de Plastilina Curvadas**: Nombres de los continentes (*América*, *Europa*, *África*, *Asia*, *Oceanía*, *Polo Norte*, *Polo Sur*) modelados en Three.js con tipografía redondeada Fredoka, adheridos y curvados físicamente a la superficie esférica.
- **Micro-interacción "Jelly Bounce"**: Reacción táctil con física de muelle amortiguado (squash & stretch) al rozar las letras con el cursor, sin alterar el cursor de arrastre del globo.
- **Biomas y Hábitats Activos**: Marcadores interactivos flotantes para explorar biomas (Sabana del Serengueti, Valle Cretácico, Selva Amazónica, Glaciar Ártico, etc.).

### 2. Configurador 3D de Hábitats Modulares (360°)
- 5 bases de terreno orgánicas (Montaña y Cascada, Oasis y Dunas, Valle Fluvial, Isla Volcánica, Jaula Clásica).
- Soporte para subir archivos `.GLB` y `.STL` propios de artesanos con cálculo de límites y anclajes.
- 8 puntos de colocación (`slots 1..8`) para disponer figuras de animales y accesorios florales/vegetales.
- Controles de rotación, reubicación de punto y eliminación individual de piezas.

### 3. Catálogo E-Commerce y Cesta WooCommerce
- 28 artículos catalogados por bioma, articulación flexi y destacados.
- Paginación dinámica `+8` con botón "Cargar más".
- Drawer deslizable de Favoritos (Wishlist) y Cesta sincronizable con WooCommerce REST Store API.
- Cumplimiento normativo estricto RGPD, LSSI-CE, Cookies técnicas y política de desistimiento de 14 días.

---

## 🚀 Despliegue en Vercel

Este proyecto está preconfigurado para desplegarse instantáneamente en **Vercel**:
1. Conecta este repositorio en tu panel de [Vercel](https://vercel.com).
2. Selecciona **Other** (Static HTML) como Framework Preset.
3. El archivo [`vercel.json`](./vercel.json) gestiona automáticamente las cabeceras de seguridad y caché inmutable de assets 3D.

---

## 💻 Ejecución en Local

```bash
# Con npx serve
npx serve . -l 8080

# O con cualquier servidor HTTP local
python -m http.server 8080
```
Abre en tu navegador: `http://localhost:8080`.
