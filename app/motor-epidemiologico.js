// =====================================
// MOTOR EPIDEMIOLÓGICO SIP
// =====================================

function crearBloque(titulo){

const bloque =
document.createElement("div");

bloque.style.marginTop = "30px";

bloque.innerHTML = `<h2>${titulo}</h2>`;

document.body.appendChild(bloque);

return bloque;

}

// =====================================
// INDICADORES
// =====================================

function indicadoresEpidemiologicos(){

const regionTop =
Object.entries(conteoRegiones)
.sort((a,b)=>b[1]-a[1])[0];

const temaTop =
Object.entries(conteoTemas)
.sort((a,b)=>b[1]-a[1])[0];

const anioTop =
Object.entries(conteoAnios)
.sort((a,b)=>b[1]-a[1])[0];

const bloque =
crearBloque("📈 Indicadores Epidemiológicos SIP");

bloque.innerHTML += `

<table border="1" cellpadding="6">

<tr>
<td>Total Estudios</td>
<td>${totalEstudios}</td>
</tr>

<tr>
<td>Regiones Cubiertas</td>
<td>${regiones.size}</td>
</tr>

<tr>
<td>Temas Cubiertos</td>
<td>${temas.size}</td>
</tr>

<tr>
<td>Periodo</td>
<td>${minimo}-${maximo}</td>
</tr>

<tr>
<td>Región Líder</td>
<td>${regionTop[0]}</td>
</tr>

<tr>
<td>Tema Dominante</td>
<td>${temaTop[0]}</td>
</tr>

<tr>
<td>Año Más Productivo</td>
<td>${anioTop[0]}</td>
</tr>

</table>

`;

}

indicadoresEpidemiologicos();

// =====================================
// RANKING REGIONAL
// =====================================

function rankingRegional(){

const ranking =
Object.entries(conteoRegiones)
.sort((a,b)=>b[1]-a[1]);

const bloque =
crearBloque("🏆 Ranking Regional SIP");

bloque.innerHTML += `
<ol>
${ranking.map(x =>
`<li>${x[0]} (${x[1]})</li>`
).join("")}
</ol>
`;

}

rankingRegional();

// =====================================
// TENDENCIA TEMPORAL
// =====================================

function tendenciaTemporal(){

const ranking =
Object.entries(conteoAnios)
.sort((a,b)=>a[0]-b[0]);

const bloque =
crearBloque("📅 Tendencia Temporal");

bloque.innerHTML += `
<table border="1" cellpadding="6">

<tr>
<th>Año</th>
<th>Estudios</th>
</tr>

${ranking.map(x => `
<tr>
<td>${x[0]}</td>
<td>${x[1]}</td>
</tr>
`).join("")}

</table>
`;

}

tendenciaTemporal();

// =====================================
// CONCENTRACIÓN TEMÁTICA
// =====================================

function concentracionTematica(){

const ranking =
Object.entries(conteoTemas)
.sort((a,b)=>b[1]-a[1]);

const bloque =
crearBloque("🔬 Concentración Temática");

bloque.innerHTML += `
<ul>
${ranking.map(x =>
`<li>${x[0]} (${x[1]})</li>`
).join("")}
</ul>
`;

}

concentracionTematica();

// =====================================
// SCORE CIENTÍFICO SIP
// =====================================

function scoreSIP(){

const cobertura =
maximo - minimo;

const score =
(totalEstudios * 2)
+
(regiones.size * 5)
+
(temas.size * 10)
+
(cobertura);

const bloque =
crearBloque("🎯 Score Científico SIP");

bloque.innerHTML += `
<p><b>${score}</b></p>
`;

}

scoreSIP();

// =====================================
// COBERTURA NACIONAL
// =====================================

function coberturaNacional(){

const regionesPeru = 25;

const indice =
(
(regiones.size / regionesPeru)
* 100
).toFixed(1);

const bloque =
crearBloque("🌎 Cobertura Nacional");

bloque.innerHTML += `
<p>${indice}%</p>
`;

}

coberturaNacional();

// =====================================
// DIVERSIDAD TEMÁTICA
// =====================================

function diversidadTematica(){

const indice =
(
(temas.size / totalEstudios)
* 100
).toFixed(1);

const bloque =
crearBloque("🧩 Diversidad Temática");

bloque.innerHTML += `
<p>${indice}%</p>
`;

}

diversidadTematica();

// =====================================
// ALERTAS SIP
// =====================================

function alertasSIP(){

const bloque =
crearBloque("⚠️ Alertas Epidemiológicas");

let alertas = [];

if(regiones.size < 10){

alertas.push(
"Cobertura regional limitada."
);

}

if(temas.size < 5){

alertas.push(
"Baja diversidad temática."
);

}

if(alertas.length===0){

alertas.push(
"No se detectan alertas relevantes."
);

}

bloque.innerHTML += `
<ul>
${alertas.map(x =>
`<li>${x}</li>`
).join("")}
</ul>
`;

}

alertasSIP();

// =====================================
// INFERENCIA IA SIP
// =====================================

function inferenciaSIP(){

const regionTop =
Object.entries(conteoRegiones)
.sort((a,b)=>b[1]-a[1])[0];

const temaTop =
Object.entries(conteoTemas)
.sort((a,b)=>b[1]-a[1])[0];

const bloque =
crearBloque("🧠 Inferencia Automática SIP");

bloque.innerHTML += `
<p>

La producción científica disponible
se concentra principalmente en
${regionTop[0]}.

La línea de investigación dominante
es ${temaTop[0]}.

Se recomienda fortalecer la
investigación en regiones con menor
representación y ampliar la cobertura
temática para mejorar la capacidad
de vigilancia epidemiológica.

</p>
`;

}

inferenciaSIP();
