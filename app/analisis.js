const totalEstudios = data.length;

document.getElementById("total-estudios").textContent = totalEstudios;

const anios = data.map(d => d.anio_pub).filter(Boolean);

const minimo = Math.min(...anios);
const maximo = Math.max(...anios);

document.getElementById("cobertura").textContent =
`${minimo} - ${maximo}`;
const regiones = new Set(
  data.map(d => d.region).filter(Boolean)
);

document.getElementById("regiones").textContent =
regiones.size;

const temas = new Set(
  data.map(d => d.tema).filter(Boolean)
);

document.getElementById("temas").textContent =
temas.size;

document.getElementById("ultimo-anio").textContent =
maximo;
const conteoRegiones = {};

data.forEach(estudio => {
  if (!estudio.region) return;

  conteoRegiones[estudio.region] =
    (conteoRegiones[estudio.region] || 0) + 1;
});
const conteoTemas = {};

data.forEach(estudio => {
  if (!estudio.tema) return;

  conteoTemas[estudio.tema] =
    (conteoTemas[estudio.tema] || 0) + 1;
});

const listaTemas =
  document.getElementById("lista-temas");

listaTemas.innerHTML =
  Object.entries(conteoTemas)
    .sort((a,b) => b[1] - a[1])
    .map(([tema,cantidad]) =>
      `<p>${tema}: ${cantidad}</p>`
    )
    .join("");

const listaRegiones =
  document.getElementById("lista-regiones");

listaRegiones.innerHTML =
  Object.entries(conteoRegiones)
    .sort((a,b) => b[1] - a[1])
    .map(([region,cantidad]) =>
      `<p>${region}: ${cantidad}</p>`
    )
    .join("");
const conteoAnios = {};

data.forEach(estudio => {
  if (!estudio.anio_pub) return;

  conteoAnios[estudio.anio_pub] =
    (conteoAnios[estudio.anio_pub] || 0) + 1;
});

const listaAnios =
  document.getElementById("lista-anios");

listaAnios.innerHTML =
  Object.entries(conteoAnios)
    .sort((a,b) => Number(a[0]) - Number(b[0]))
    .map(([anio,cantidad]) =>
      `<p>${anio}: ${cantidad}</p>`
    )
    .join("");
// PROMEDIO DE PUBLICACIONES POR AÑO

const totalAnios = maximo - minimo + 1;

const promedioAnual =
(totalEstudios / totalAnios).toFixed(2);

const nuevoBloque = document.createElement("div");

nuevoBloque.innerHTML = `
<h2>Promedio anual</h2>
<p>${promedioAnual} estudios por año</p>
`;

document.body.appendChild(nuevoBloque);
// DENSIDAD REGIONAL

const promedioRegion =
(totalEstudios / regiones.size).toFixed(2);

const bloqueRegion =
document.createElement("div");

bloqueRegion.innerHTML = `
<h2>Promedio por región</h2>
<p>${promedioRegion} estudios por región</p>
`;

document.body.appendChild(bloqueRegion);
// AÑO MÁS PRODUCTIVO

let anioTop = "";
let cantidadTop = 0;

Object.entries(conteoAnios)
.forEach(([anio,cantidad]) => {

if(cantidad > cantidadTop){
anioTop = anio;
cantidadTop = cantidad;
}

});

const bloqueTop =
document.createElement("div");

bloqueTop.innerHTML = `
<h2>Año con más publicaciones</h2>
<p>${anioTop} (${cantidadTop} estudios)</p>
`;

document.body.appendChild(bloqueTop);
// REGIÓN MÁS ESTUDIADA

let regionTop = "";
let regionTopCantidad = 0;

Object.entries(conteoRegiones)
.forEach(([region,cantidad]) => {

if(cantidad > regionTopCantidad){
regionTop = region;
regionTopCantidad = cantidad;
}

});

const bloqueRegionTop =
document.createElement("div");

bloqueRegionTop.innerHTML = `
<h2>Región más estudiada</h2>
<p>${regionTop} (${regionTopCantidad} estudios)</p>
`;

document.body.appendChild(bloqueRegionTop);


// TEMA MÁS ESTUDIADO

let temaTop = "";
let temaTopCantidad = 0;

Object.entries(conteoTemas)
.forEach(([tema,cantidad]) => {

if(cantidad > temaTopCantidad){
temaTop = tema;
temaTopCantidad = cantidad;
}

});

const bloqueTemaTop =
document.createElement("div");

bloqueTemaTop.innerHTML = `
<h2>Tema predominante</h2>
<p>${temaTop} (${temaTopCantidad} estudios)</p>
`;

document.body.appendChild(bloqueTemaTop);


// ÍNDICE DE COBERTURA

const indiceCobertura =
((regiones.size / totalEstudios) * 100)
.toFixed(1);

const bloqueCobertura =
document.createElement("div");

bloqueCobertura.innerHTML = `
<h2>Índice de cobertura regional</h2>
<p>${indiceCobertura}%</p>
`;

document.body.appendChild(bloqueCobertura);
// NIVEL DE MADUREZ DE LA BASE

let nivel = "";

if(totalEstudios < 25){
nivel = "Inicial";
}else if(totalEstudios < 50){
nivel = "Intermedio";
}else{
nivel = "Avanzado";
}

const bloqueNivel =
document.createElement("div");

bloqueNivel.innerHTML = `
<h2>Madurez de la Base</h2>
<p>${nivel}</p>
`;

document.body.appendChild(bloqueNivel);


// DENSIDAD TEMPORAL

const densidadTemporal =
(totalEstudios / (maximo - minimo + 1))
.toFixed(2);

const bloqueDensidad =
document.createElement("div");

bloqueDensidad.innerHTML = `
<h2>Densidad Temporal</h2>
<p>${densidadTemporal} estudios/año</p>
`;

document.body.appendChild(bloqueDensidad);


// SCORE SIP RESEARCH

const score =
(
(totalEstudios * 2) +
(regiones.size * 5) +
(temas.size * 10)
);

const bloqueScore =
document.createElement("div");

bloqueScore.innerHTML = `
<h2>Score SIP Research</h2>
<p>${score} puntos</p>
`;

document.body.appendChild(bloqueScore);
// TOP 3 REGIONES

const topRegiones =
Object.entries(conteoRegiones)
.sort((a,b) => b[1] - a[1])
.slice(0,3);

const bloqueTopRegiones =
document.createElement("div");

bloqueTopRegiones.innerHTML = `
<h2>🏆 Top Regiones</h2>
<ol>
${topRegiones
.map(([region,cantidad]) =>
`<li>${region} (${cantidad})</li>`)
.join("")}
</ol>
`;

document.body.appendChild(bloqueTopRegiones);
// ÍNDICE DE CONCENTRACIÓN TEMÁTICA

const maxTema =
Math.max(...Object.values(conteoTemas));

const indiceConcentracion =
((maxTema / totalEstudios) * 100)
.toFixed(1);

const bloqueConcentracion =
document.createElement("div");

bloqueConcentracion.innerHTML = `
<h2>Índice de Concentración Temática</h2>
<p>${indiceConcentracion}%</p>
`;

document.body.appendChild(bloqueConcentracion);


// DIVERSIDAD REGIONAL

const diversidadRegional =
(regiones.size / totalEstudios * 100)
.toFixed(1);

const bloqueDiversidad =
document.createElement("div");

bloqueDiversidad.innerHTML = `
<h2>Diversidad Regional</h2>
<p>${diversidadRegional}%</p>
`;

document.body.appendChild(bloqueDiversidad);


// SCORE EPIDEMIOLÓGICO SIP

const coberturaTemporal =
maximo - minimo;

const scoreEpidemiologico =
(totalEstudios * 2)
+
(regiones.size * 5)
+
(temas.size * 10)
+
(coberturaTemporal);

const bloqueScoreEpi =
document.createElement("div");

bloqueScoreEpi.innerHTML = `
<h2>Score Epidemiológico SIP</h2>
<p>${scoreEpidemiologico}</p>
`;

document.body.appendChild(bloqueScoreEpi);


//
