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
