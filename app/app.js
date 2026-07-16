const q = document.getElementById('q');
const region = document.getElementById('region');
const anio = document.getElementById('anio');
const rows = document.getElementById('rows');
const stats = document.getElementById('stats');

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
