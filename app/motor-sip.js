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
