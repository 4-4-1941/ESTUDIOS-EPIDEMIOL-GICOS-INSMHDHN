// =====================================
// SIP RESEARCH
// MOTOR DE INTERPRETACIÓN EVIDENCIAL
// =====================================

const MotorSIP = {

resumen(estudio){

return `
📚 ${estudio.titulo}

📍 Región: ${estudio.region}

📅 Año: ${estudio.anio_pub}

🏷️ Tema: ${estudio.tema}

📖 Fuente: ${estudio.fuente}
`;

},

interpretacion(estudio){

return `
El estudio corresponde a la región
${estudio.region} y aborda la temática
de ${estudio.tema}.

La publicación fue incorporada a la
base SIP Research en calidad de
evidencia documental para análisis
epidemiológico y comparación futura.
`;

},

conclusion(estudio){

return `
La información disponible permite
incorporar este estudio como evidencia
para futuras comparaciones regionales
y análisis de tendencias temporales.
`;

},

analizarPrimero(){

if(!data || data.length === 0) return;

const estudio = data[0];

const bloque =
document.createElement("div");

bloque.innerHTML = `
<h2>🧠 IA SIP Research</h2>

<pre>${this.resumen(estudio)}</pre>

<p>${this.interpretacion(estudio)}</p>

<p><b>Conclusión:</b></p>

<p>${this.conclusion(estudio)}</p>
`;

document.body.appendChild(bloque);

}

};

MotorSIP.analizarPrimero();
// =====================================
// ANÁLISIS GLOBAL DE LA BASE SIP
// =====================================

function analisisGlobalSIP(){

const temaDominante =
Object.entries(conteoTemas)
.sort((a,b)=>b[1]-a[1])[0];

const regionDominante =
Object.entries(conteoRegiones)
.sort((a,b)=>b[1]-a[1])[0];

const bloque =
document.createElement("div");

bloque.innerHTML = `
<h2>🌎 Análisis Global SIP</h2>

<p>
La base contiene ${totalEstudios} estudios.
</p>

<p>
La región con mayor producción es
<b>${regionDominante[0]}</b>
(${regionDominante[1]} estudios).
</p>

<p>
La temática predominante es
<b>${temaDominante[0]}</b>
(${temaDominante[1]} publicaciones).
</p>

<p>
La cobertura temporal se extiende desde
${minimo} hasta ${maximo}.
</p>

<p>
Interpretación:
La producción científica disponible
presenta una concentración temática
en ${temaDominante[0]} y una concentración
territorial en ${regionDominante[0]}.
</p>
`;

document.body.appendChild(bloque);

}

analisisGlobalSIP();
// =====================================
// DETECCIÓN DE PATRONES SIP
// =====================================

function detectarPatronesSIP(){

const regionTop =
Object.entries(conteoRegiones)
.sort((a,b)=>b[1]-a[1])[0];

const porcentajeTop =
(
(regionTop[1] / totalEstudios) * 100
).toFixed(1);

let interpretacion = "";

if(porcentajeTop >= 50){

interpretacion =
"La evidencia científica se encuentra altamente concentrada en una región específica.";

}
else if(porcentajeTop >= 30){

interpretacion =
"La evidencia presenta una concentración moderada en determinadas regiones.";

}
else{

interpretacion =
"La evidencia muestra una distribución relativamente equilibrada.";
}

const bloque =
document.createElement("div");

bloque.innerHTML = `
<h2>🔍 Detección de Patrones</h2>

<p>
Región predominante:
<b>${regionTop[0]}</b>
</p>

<p>
Participación:
<b>${porcentajeTop}%</b>
</p>

<p>
${interpretacion}
</p>
`;

document.body.appendChild(bloque);

}

detectarPatronesSIP();
// =====================================
// COMPARADOR SIP
// =====================================

function compararEstudios(idA,idB){

const A = data.find(x=>x.id===idA);
const B = data.find(x=>x.id===idB);

if(!A || !B) return;

const bloque = document.createElement("div");

bloque.innerHTML = `
<h2>⚖️ Comparación de Estudios</h2>

<table border="1" cellpadding="8">
<tr>
<th>Variable</th>
<th>${A.id}</th>
<th>${B.id}</th>
</tr>

<tr>
<td>Título</td>
<td>${A.titulo}</td>
<td>${B.titulo}</td>
</tr>

<tr>
<td>Región</td>
<td>${A.region}</td>
<td>${B.region}</td>
</tr>

<tr>
<td>Año</td>
<td>${A.anio_pub}</td>
<td>${B.anio_pub}</td>
</tr>

<tr>
<td>Tema</td>
<td>${A.tema}</td>
<td>${B.tema}</td>
</tr>

</table>

<p><b>Interpretación:</b></p>

<p>
Se compararon los estudios
${A.id} y ${B.id}.
Ambos pertenecen a la línea
${A.tema}.
Las diferencias observadas se
relacionan principalmente con
la región y el periodo de estudio.
</p>
`;

document.body.appendChild(bloque);

}

compararEstudios(
"REG-001",
"REG-002"
);
// =====================================
// MATRIZ SIP
// =====================================

function matrizSIP(){

const bloque = document.createElement("div");

let html = `
<h2>📊 Matriz General SIP</h2>

<table border="1" cellpadding="6">

<tr>
<th>ID</th>
<th>Región</th>
<th>Año</th>
<th>Tema</th>
</tr>
`;

data.forEach(estudio=>{

html += `
<tr>
<td>${estudio.id}</td>
<td>${estudio.region}</td>
<td>${estudio.anio_pub}</td>
<td>${estudio.tema}</td>
</tr>
`;

});

html += `</table>`;

bloque.innerHTML = html;

document.body.appendChild(bloque);

}

matrizSIP();
