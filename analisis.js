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
// ======================================
// ISRN - INDICE SIP DE REPRESENTATIVIDAD NACIONAL
// ======================================

const puntajeEstudios =
Math.min((totalEstudios / 50) * 25, 25);

const puntajeRegiones =
Math.min((regiones.size / 25) * 25, 25);

const puntajeTemas =
Math.min((temas.size / 10) * 25, 25);

const puntajeTiempo =
Math.min(((maximo - minimo) / 25) * 25, 25);

const ISRN =
(
puntajeEstudios +
puntajeRegiones +
puntajeTemas +
puntajeTiempo
).toFixed(1);

let categoriaISRN = "";

if(ISRN < 25){
categoriaISRN = "Baja";
}
else if(ISRN < 50){
categoriaISRN = "Moderada";
}
else if(ISRN < 75){
categoriaISRN = "Alta";
}
else{
categoriaISRN = "Excelente";
}

const bloqueISRN =
document.createElement("div");

bloqueISRN.innerHTML = `
<h2>🌎 ISRN</h2>
<p>${ISRN}/100</p>
<p>Nivel: ${categoriaISRN}</p>
`;

document.body.appendChild(bloqueISRN);


// ======================================
// EFICIENCIA DE COBERTURA
// ======================================

const eficiencia =
(
(regiones.size / totalEstudios) * 100
).toFixed(1);

const bloqueEficiencia =
document.createElement("div");

bloqueEficiencia.innerHTML = `
<h2>📡 Eficiencia de Cobertura</h2>
<p>${eficiencia}%</p>
`;

document.body.appendChild(bloqueEficiencia);


// ======================================
// DIVERSIDAD TEMÁTICA
// ======================================

const diversidadTematica =
(
(temas.size / totalEstudios) * 100
).toFixed(1);

const bloqueDiversidadTematica =
document.createElement("div");

bloqueDiversidadTematica.innerHTML = `
<h2>🧠 Diversidad Temática</h2>
<p>${diversidadTematica}%</p>
`;

document.body.appendChild(bloqueDiversidadTematica);
// ======================================
// COMPARADOR EPIDEMIOLÓGICO SIP
// ======================================

// Región con más estudios
const regionMayor =
Object.entries(conteoRegiones)
.sort((a,b) => b[1] - a[1])[0];

// Región con menos estudios
const regionMenor =
Object.entries(conteoRegiones)
.sort((a,b) => a[1] - b[1])[0];

const diferenciaRegional =
regionMayor[1] - regionMenor[1];

const razonRegional =
(regionMayor[1] / regionMenor[1]).toFixed(2);

const bloqueComparador =
document.createElement("div");

bloqueComparador.innerHTML = `
<h2>⚖️ Comparador Regional SIP</h2>

<p><b>Mayor producción:</b>
${regionMayor[0]} (${regionMayor[1]} estudios)</p>

<p><b>Menor producción:</b>
${regionMenor[0]} (${regionMenor[1]} estudios)</p>

<p><b>Diferencia absoluta:</b>
${diferenciaRegional}</p>

<p><b>Razón relativa:</b>
${razonRegional}</p>
`;

document.body.appendChild(bloqueComparador);


// ======================================
// INDICE DE EQUILIBRIO REGIONAL
// ======================================

const equilibrioRegional =
(
(regionMenor[1] / regionMayor[1]) * 100
).toFixed(1);

const bloqueEquilibrio =
document.createElement("div");

bloqueEquilibrio.innerHTML = `
<h2>🗺️ Equilibrio Regional</h2>
<p>${equilibrioRegional}%</p>
`;

document.body.appendChild(bloqueEquilibrio);


// ======================================
// POTENCIAL DE EXPANSIÓN SIP
// ======================================

const potencialExpansion =
(
((25 - regiones.size) / 25) * 100
).toFixed(1);

const bloqueExpansion =
document.createElement("div");

bloqueExpansion.innerHTML = `
<h2>🚀 Potencial de Expansión</h2>
<p>${potencialExpansion}%</p>
`;

document.body.appendChild(bloqueExpansion);
// ======================================
// SEMÁFORO EPIDEMIOLÓGICO SIP
// ======================================

let colorEstado = "🔴";
let estadoSistema = "Débil";

if(totalEstudios >= 25){
colorEstado = "🟡";
estadoSistema = "Intermedio";
}

if(totalEstudios >= 50){
colorEstado = "🟢";
estadoSistema = "Fuerte";
}

const bloqueSemaforo =
document.createElement("div");

bloqueSemaforo.innerHTML = `
<h2>${colorEstado} Estado General SIP</h2>

<p><b>Nivel:</b> ${estadoSistema}</p>

<p><b>Estudios:</b> ${totalEstudios}</p>

<p><b>Regiones:</b> ${regiones.size}</p>

<p><b>Temas:</b> ${temas.size}</p>
`;

document.body.appendChild(bloqueSemaforo);


// ======================================
// META SIGUIENTE
// ======================================

const faltantes25 =
Math.max(0,25-totalEstudios);

const bloqueMeta =
document.createElement("div");

bloqueMeta.innerHTML = `
<h2>🎯 Meta SIP</h2>

<p>Faltan ${faltantes25} estudios para alcanzar el Nivel Intermedio.</p>
`;

document.body.appendChild(bloqueMeta);


// ======================================
// PROGRESO HACIA 50 ESTUDIOS
// ======================================

const progreso50 =
((totalEstudios/50)*100).toFixed(1);

const bloqueProgreso =
document.createElement("div");

bloqueProgreso.innerHTML = `
<h2>📈 Progreso Estratégico</h2>

<p>${progreso50}% de la meta de 50 estudios.</p>
`;

document.body.appendChild(bloqueProgreso);
// ======================================
// MOTOR DE INTERPRETACIÓN SIP v1
// ======================================

function interpretarBase(){

let texto = "";

texto += `La base documental contiene ${totalEstudios} estudios. `;

texto += `Se identificaron ${regiones.size} regiones estudiadas y ${temas.size} temas principales. `;

texto += `La cobertura temporal comprende desde ${minimo} hasta ${maximo}. `;

if(totalEstudios < 25){

texto += "La evidencia disponible aún es limitada y se recomienda ampliar la base documental.";

}
else if(totalEstudios < 50){

texto += "La evidencia disponible es moderada y permite realizar comparaciones preliminares.";

}
else{

texto += "La evidencia disponible es amplia y permite análisis comparativos robustos.";

}

return texto;

}

const bloqueInterpretacion =
document.createElement("div");

bloqueInterpretacion.innerHTML = `
<h2>🧠 Interpretación Automática SIP</h2>
<p>${interpretarBase()}</p>
`;

document.body.appendChild(bloqueInterpretacion);
// ======================================
// INFORME EPIDEMIOLÓGICO AUTOMÁTICO SIP
// ======================================

function generarInformeSIP(){

const regionTop =
Object.entries(conteoRegiones)
.sort((a,b)=>b[1]-a[1])[0];

const temaTop =
Object.entries(conteoTemas)
.sort((a,b)=>b[1]-a[1])[0];

const anioTop =
Object.entries(conteoAnios)
.sort((a,b)=>b[1]-a[1])[0];

return `
La base SIP Research contiene ${totalEstudios} estudios documentados.

La región con mayor producción científica es ${regionTop[0]}
con ${regionTop[1]} estudios registrados.

El tema predominante es ${temaTop[0]}
con ${temaTop[1]} publicaciones.

El año con mayor actividad científica fue ${anioTop[0]}
con ${anioTop[1]} publicaciones.

La cobertura temporal comprende desde ${minimo}
hasta ${maximo}.

Se identificaron ${regiones.size} regiones
y ${temas.size} áreas temáticas.

Estos resultados sugieren que la producción
científica disponible presenta concentración
en determinadas regiones y líneas de investigación,
por lo que se recomienda ampliar la cobertura
territorial y temática para mejorar la
representatividad nacional.
`;
}

const bloqueInforme =
document.createElement("div");

bloqueInforme.innerHTML = `
<h2>📄 Informe Epidemiológico Automático</h2>
<p style="line-height:1.7;">
${generarInformeSIP()}
</p>
`;

document.body.appendChild(bloqueInforme);


// ======================================
// RESUMEN EJECUTIVO SIP
// ======================================

const bloqueResumen =
document.createElement("div");

bloqueResumen.innerHTML = `
<h2>📌 Resumen Ejecutivo</h2>

<ul>
<li>Total estudios: ${totalEstudios}</li>
<li>Regiones: ${regiones.size}</li>
<li>Temas: ${temas.size}</li>
<li>Cobertura: ${minimo}-${maximo}</li>
<li>Último año: ${maximo}</li>
</ul>
`;

document.body.appendChild(bloqueResumen);
