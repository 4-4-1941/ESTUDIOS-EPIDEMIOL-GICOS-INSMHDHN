#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="${1:-insm-anales-salud-mental}"
REMOTE_URL="${2:-}"

mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

mkdir -p setup data/raw data/cleaned data/metadata database app docs .github/workflows

cat > README.md <<'EOF'
# Anales de Salud Mental - Catálogo y buscador

Repositorio para indexar metadatos de la revista Anales de Salud Mental del INSM Honorio Delgado - Hideyo Noguchi.

## Funciones
- Buscador por título, autor, región y tema.
- Filtros por año y volumen.
- Catálogo de artículos y estudios epidemiológicos.
- Base lista para GitHub Pages.

## Uso
1. Ejecuta el generador.
2. Revisa los archivos creados.
3. Sube a GitHub.
EOF

cat > .gitignore <<'EOF'
.DS_Store
node_modules/
dist/
*.log
EOF

cat > config.json <<'EOF'
{
  "project": "insm-anales-salud-mental",
  "author": "Tu Nombre",
  "language": "es",
  "source": "Anales de Salud Mental",
  "mode": "catalogo"
}
EOF

cat > database/schema.sql <<'EOF'
CREATE TABLE volumenes (
  id TEXT PRIMARY KEY,
  revista TEXT NOT NULL,
  volumen INTEGER NOT NULL,
  numero TEXT NOT NULL,
  anio INTEGER NOT NULL,
  portada_url TEXT
);

CREATE TABLE articulos (
  id TEXT PRIMARY KEY,
  volumen_id TEXT NOT NULL,
  titulo TEXT NOT NULL,
  autores TEXT,
  paginas TEXT,
  anio_pub INTEGER,
  tipo TEXT,
  region TEXT,
  tema TEXT,
  url TEXT,
  resumen TEXT,
  FOREIGN KEY (volumen_id) REFERENCES volumenes(id)
);

CREATE INDEX idx_articulos_titulo ON articulos(titulo);
CREATE INDEX idx_articulos_region ON articulos(region);
CREATE INDEX idx_articulos_tema ON articulos(tema);
EOF

cat > data/metadata/publicaciones.csv <<'EOF'
id,titulo,region,anio_pub,tema,url,fuente
ART-001,Estudio Epidemiológico de Salud Mental en la Costa Peruana,Costa Peruana,2023,Epidemiología,https://openjournal.insm.gob.pe/revistasm/asm/article/view/23,Anales de Salud Mental
ART-002,Estudio Epidemiológico de Salud Mental en Lima Metropolitana y Callao,Lima Metropolitana y Callao,2013,Epidemiología,https://openjournal.insm.gob.pe/revistasm/asm/article/view/5,Anales de Salud Mental
ART-003,Estudio Epidemiológico de Salud Mental en Cajamarca,Cajamarca,2003,Epidemiología,https://openjournal.insm.gob.pe/revistasm/op/article/view/118,Anales de Salud Mental
EOF

cat > data/metadata/volumenes.csv <<'EOF'
id,revista,volumen,numero,anio,portada_url
VOL-2024-01,Anales de Salud Mental,40,1,2024,https://openjournal.insm.gob.pe/revistasm/asm/issue/view/v40n1a2024
EOF

cat > app/data.js <<'EOF'
const data = [
  {
    id: "ART-001",
    titulo: "Estudio Epidemiológico de Salud Mental en la Costa Peruana",
    autores: "INSM",
    region: "Costa Peruana",
    anio_pub: 2023,
    volumen: "23",
    tema: "Epidemiología",
    url: "https://openjournal.insm.gob.pe/revistasm/asm/article/view/23",
    fuente: "Anales de Salud Mental"
  },
  {
    id: "ART-002",
    titulo: "Estudio Epidemiológico de Salud Mental en Lima Metropolitana y Callao",
    autores: "INSM",
    region: "Lima Metropolitana y Callao",
    anio_pub: 2013,
    volumen: "16",
    tema: "Epidemiología",
    url: "https://openjournal.insm.gob.pe/revistasm/asm/article/view/5",
    fuente: "Anales de Salud Mental"
  },
  {
    id: "ART-003",
    titulo: "Estudio Epidemiológico de Salud Mental en Cajamarca",
    autores: "INSM",
    region: "Cajamarca",
    anio_pub: 2003,
    volumen: "8",
    tema: "Epidemiología",
    url: "https://openjournal.insm.gob.pe/revistasm/op/article/view/118",
    fuente: "Anales de Salud Mental"
  }
];
EOF

cat > app/app.js <<'EOF'
const q = document.getElementById('q');
const region = document.getElementById('region');
const anio = document.getElementById('anio');
const rows = document.getElementById('rows');
const stats = document.getElementById('stats');

const regions = [...new Set(data.map(d => d.region).filter(Boolean))].sort();
const years = [...new Set(data.map(d => d.anio_pub).filter(Boolean))].sort((a,b) => b-a);

regions.forEach(r => region.innerHTML += `<option value="${r}">${r}</option>`);
years.forEach(y => anio.innerHTML += `<option value="${y}">${y}</option>`);

function render() {
  const qq = q.value.toLowerCase();
  const rr = region.value;
  const yy = anio.value;

  const filtered = data.filter(d => {
    const text = `${d.titulo} ${d.autores} ${d.region} ${d.tema} ${d.fuente}`.toLowerCase();
    return (!qq || text.includes(qq)) &&
           (!rr || d.region === rr) &&
           (!yy || String(d.anio_pub) === yy);
  });

  stats.textContent = `${filtered.length} resultados`;
  rows.innerHTML = filtered.map(d => `
    <tr>
      <td><a href="${d.url}" target="_blank" rel="noopener">${d.titulo}</a></td>
      <td>${d.region}</td>
      <td>${d.anio_pub}</td>
      <td>${d.volumen}</td>
      <td>${d.fuente}</td>
    </tr>
  `).join('');
}

q.addEventListener('input', render);
region.addEventListener('change', render);
anio.addEventListener('change', render);
render();
EOF

cat > app/index.html <<'EOF'
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Anales de Salud Mental</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main class="wrap">
    <h1>Anales de Salud Mental</h1>
    <p>Buscador de publicaciones y estudios epidemiológicos.</p>

    <section class="filters">
      <input id="q" placeholder="Buscar título, autor, región o tema">
      <select id="region"><option value="">Todas las regiones</option></select>
      <select id="anio"><option value="">Todos los años</option></select>
    </section>

    <section id="stats" class="stats"></section>

    <table>
      <thead>
        <tr>
          <th>Título</th>
          <th>Región</th>
          <th>Año</th>
          <th>Volumen</th>
          <th>Fuente</th>
        </tr>
      </thead>
      <tbody id="rows"></tbody>
    </table>
  </main>
  <script src="data.js"></script>
  <script src="app.js"></script>
</body>
</html>
EOF

cat > app/styles.css <<'EOF'
body{font-family:system-ui,Arial,sans-serif;margin:0;background:#f7f7f7;color:#222}
.wrap{max-width:1100px;margin:0 auto;padding:20px}
.filters{display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px;margin:15px 0}
input,select{padding:10px;border:1px solid #ccc;border-radius:8px}
table{width:100%;border-collapse:collapse;background:#fff}
th,td{padding:10px;border:1px solid #ddd;vertical-align:top}
th{background:#efefef;text-align:left}
.stats{margin:10px 0;font-weight:600}
a{text-decoration:none;color:#0b66c3}
EOF

cat > docs/formulas.md <<'EOF'
# Fórmulas de análisis

- Frecuencia: f = n / N * 100
- Razón de prevalencias: RP = [a/(a+b)] / [c/(c+d)]
- Odds ratio: OR = (a*d)/(b*c)
- Tasa: T = casos / población * 1000
EOF

cat > .github/workflows/deploy.yml <<'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: ./app

      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
EOF

git init
git branch -M main
git add .
git commit -m "Generar estructura inicial"

if [ -n "$REMOTE_URL" ]; then
  git remote add origin "$REMOTE_URL"
  git push -u origin main
fi

echo "Proyecto generado en: $PROJECT_NAME"
echo "Si conectaste REMOTE_URL, ya quedó listo para GitHub."
