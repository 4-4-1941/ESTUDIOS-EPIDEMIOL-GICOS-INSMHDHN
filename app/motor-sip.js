// =====================================
// SIP RESEARCH
// MOTOR DE INTERPRETACIÓN EVIDENCIAL
// v1.0
// =====================================

const MotorSIP = {

generarResumen(estudio){

return `
Título:
${estudio.titulo}

Región:
${estudio.region}

Año:
${estudio.anio_pub}

Tema:
${estudio.tema}

Fuente:
${estudio.fuente}
`;

},

generarInterpretacion(estudio){

return `
El estudio "${estudio.titulo}"
corresponde a la región
${estudio.region}
y fue publicado en
${estudio.anio_pub}.

La temática principal
identificada corresponde a
${estudio.tema}.

Esta evidencia puede ser utilizada
como referencia para análisis
comparativos regionales y
revisión de antecedentes.
`;

},

generarConclusiones(estudio){

return `
La evidencia disponible
sugiere la importancia de continuar
la vigilancia epidemiológica en la
región estudiada.

Se recomienda ampliar la cobertura
documental para fortalecer la
representatividad de los hallazgos.
`;

}

};
