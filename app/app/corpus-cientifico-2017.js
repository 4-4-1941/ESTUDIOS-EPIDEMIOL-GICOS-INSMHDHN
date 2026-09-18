(function(){
"use strict";
const E="REG-015", Y=2017, SRC="https://openjournal.insm.gob.pe/revistasm/asm/article/view/19";
const rows=[];
function add(ind,period,val,territorio="Total",poblacion="Adultos",lo=null,hi=null,tabla="",pagina=null,criterio="CIE-10 / MINI",unidad="%",sexo="Total",dominio="Trastornos clínicos"){
 rows.push({estudio_id:E,anio_ejecucion:Y,territorio,region:"Sierra Peruana",unidad_geografica:territorio==="Total"?"conjunto de ciudades":"ciudad",poblacion,sexo,dominio,indicador_canonico:ind,indicador:ind,periodo_prevalencia:period,valor:val,unidad,ic95_inferior:lo,ic95_superior:hi,criterio,instrumento:criterio.includes("MINI")?"MINI CIE-10":criterio,tabla,pagina,fuente_url:SRC,fuente:"INSM / Anales de Salud Mental"});
}
const four=(ind,period,vals,pop="Adultos",tabla="",pag=null,crit="CIE-10 / MINI",dom="Trastornos clínicos")=>{
 [["Total",...vals[0]],["Huaraz",...vals[1]],["Ayacucho",...vals[2]],["Cajamarca",...vals[3]]].forEach(x=>add(ind,period,x[1],x[0],pop,x[2],x[3],tabla,pag,crit,"%","Total",dom));
};

// Tabla 34, adultos: grupos de trastornos.
four("cualquier trastorno mental","vida",[[34.4,32.4,36.5],[36.6,32.6,40.7],[39.7,36.3,43.1],[27.6,24.7,30.6]],"Adultos","Tabla 34",102);
four("cualquier trastorno mental","12 meses",[[12.5,11.2,13.9],[14.2,11.6,17.3],[15.9,13.4,18.7],[7.9,6.4,9.6]],"Adultos","Tabla 34",102);
four("cualquier trastorno mental","6 meses",[[10.7,9.5,12.1],[11.8,9.4,14.7],[13.9,11.6,16.7],[6.7,5.3,8.3]],"Adultos","Tabla 34",102);
four("cualquier trastorno mental","actual",[[7.7,6.7,8.9],[8.5,6.5,11.0],[10.6,8.6,12.9],[4.2,3.2,5.6]],"Adultos","Tabla 34",102);
four("trastornos de ansiedad en general","vida",[[15.0,13.6,16.4],[16.5,13.9,19.4],[20.3,17.7,23.1],[8.4,6.9,10.3]],"Adultos","Tabla 34",102);
four("trastornos de ansiedad en general","12 meses",[[3.1,2.5,3.9],[3.7,2.6,5.5],[4.2,3.1,5.7],[1.7,1.1,2.6]],"Adultos","Tabla 34",102);
four("abuso o dependencia de cualquier sustancia","12 meses",[[3.7,2.9,4.7],[4.0,2.7,5.9],[5.2,3.6,7.3],[2.0,1.4,3.0]],"Adultos","Tabla 34",103);

// Tabla 35A: vida, trastornos específicos.
[
["episodio psicótico",[[1.6,1.2,2.1],[1.7,.9,3.2],[2.0,1.3,3.1],[1.0,.5,1.7]]],
["episodio maníaco",[[.1,0,.2],[.1,0,.6],[.1,0,.4],[0,null,null]]],
["trastorno bipolar",[[.3,.1,.6],[.1,0,.6],[.4,.1,1.2],[.2,.1,1.0]]],
["episodio depresivo",[[23.4,21.7,25.3],[27.1,23.5,31.1],[24.1,21.3,27.1],[20.6,17.8,23.6]]],
["episodio depresivo leve",[[4.4,3.6,5.3],[4.5,3.2,6.1],[3.6,2.7,4.9],[5.2,3.8,7.1]]],
["episodio depresivo moderado",[[6.7,5.8,7.8],[7.7,6.1,9.7],[6.7,5.1,8.7],[6.1,4.7,7.8]]],
["episodio depresivo severo",[[12.4,11.1,13.8],[15.0,12.3,18.1],[13.8,11.6,16.5],[9.4,7.9,11.1]]],
["distimia",[[1.2,.9,1.6],[1.5,.9,2.6],[1.2,.7,1.9],[1.0,.6,1.9]]],
["agorafobia",[[1.8,1.3,2.3],[1.3,.7,2.3],[3.2,2.3,4.6],[.5,.3,1.0]]],
["trastorno de estrés postraumático",[[9.7,8.6,11.0],[10.1,8.2,12.4],[13.6,11.3,16.2],[5.4,4.1,6.9]]],
["fobia social",[[2.0,1.6,2.6],[3.4,2.4,4.9],[2.0,1.4,3.0],[1.2,.7,1.9]]],
["trastorno de pánico",[[.7,.5,1.2],[.5,.2,1.3],[1.1,.6,2.2],[.4,.2,1.1]]],
["trastorno de ansiedad generalizada",[[3.4,2.7,4.1],[4.2,2.8,6.1],[4.2,3.1,5.6],[2.0,1.3,3.0]]],
["trastorno obsesivo compulsivo",[[.3,.2,.6],[.7,.4,1.3],[.3,.1,1.1],[.1,0,.5]]],
["trastornos depresivos en general",[[23.7,21.9,25.6],[27.4,23.7,31.4],[24.4,21.6,27.4],[20.7,18.0,23.8]]],
["consumo perjudicial o dependencia de alcohol",[[9.1,7.9,10.6],[9.4,7.2,12.2],[10.7,8.4,13.6],[7.3,5.7,9.3]]]
].forEach(x=>four(x[0],"vida",x[1],"Adultos","Tabla 35A",103));

// Tabla 36: anual, principales.
[
["episodio depresivo",[[6.1,5.3,7.1],[7.6,5.8,9.8],[6.8,5.6,8.4],[4.6,3.5,6.0]]],
["episodio depresivo severo",[[4.0,3.3,4.7],[4.1,3.0,5.8],[5.1,4.0,6.6],[2.6,1.8,3.8]]],
["episodio psicótico",[[.8,.5,1.3],[.8,.3,2.2],[1.3,.7,2.3],[.3,.1,.7]]],
["agorafobia",[[.6,.4,.9],[.5,.2,1.2],[.9,.5,1.6],[.4,.2,.9]]],
["trastorno de estrés postraumático",[[1.1,.7,1.5],[1.0,.5,2.0],[1.2,.7,2.1],[.9,.5,1.8]]],
["fobia social",[[.7,.5,1.1],[1.2,.7,2.1],[.6,.3,1.3],[.5,.2,1.2]]],
["trastorno de ansiedad generalizada",[[.8,.5,1.2],[.8,.4,1.8],[1.4,.8,2.4],[.1,0,.4]]],
["trastornos depresivos en general",[[6.2,5.4,7.1],[7.7,6.0,9.9],[6.9,5.6,8.5],[4.6,3.5,6.0]]],
["consumo perjudicial o dependencia de alcohol",[[3.5,2.8,4.5],[3.8,2.5,5.5],[4.9,3.4,7.0],[1.9,1.3,2.9]]]
].forEach(x=>four(x[0],"12 meses",x[1],"Adultos","Tabla 36",104));

// Mujeres: violencia.
four("cualquier abuso violencia o maltrato","vida",[[63.1,61.1,65.1],[62.5,59.0,65.8],[70.7,67.6,73.7],[56.1,52.5,59.7]],"Mujeres unidas o alguna vez unidas","Tabla 77A",146,"Cuestionario de Violencia Familiar adaptado","Violencia");
four("cualquier abuso violencia o maltrato","12 meses",[[15.6,14.3,17.0],[12.5,10.6,14.7],[21.2,18.6,23.9],[12.1,10.2,14.3]],"Mujeres unidas o alguna vez unidas","Tabla 77A",146,"Cuestionario de Violencia Familiar adaptado","Violencia");

// Adolescentes: resultados comparables destacados.
four("episodio depresivo","actual",[[9.4,7.8,11.3],[10.7,null,null],[9.1,null,null],[9.2,null,null]],"Adolescentes 12-17","Tabla 112A / síntesis",216,"Cuestionario adolescente / criterios del estudio","Trastornos clínicos");
four("episodio psicótico","actual",[[3.5,2.5,4.8],[1.9,null,null],[3.5,null,null],[4.3,null,null]],"Adolescentes 12-17","Síntesis comparativa",275,"Cuestionario adolescente / criterios del estudio","Trastornos clínicos");
add("trastorno de ansiedad generalizada","actual",2.6,"Total","Adolescentes 12-17",1.8,3.8,"Síntesis comparativa",275,"Cuestionario adolescente / criterios del estudio");
add("tendencia a problemas alimentarios","actual",3.8,"Total","Adolescentes 12-17",2.7,5.3,"Síntesis comparativa",275,"Cuestionario adolescente / criterios del estudio");

// Adultos mayores: principales.
four("deterioro cognoscitivo y funcional sospechoso de demencia","actual",[[6.2,null,null],[6.1,null,null],[6.7,null,null],[5.8,null,null]],"Adultos mayores 60+","Resultados adulto mayor",null,"MMSE + Pfeffer","Cognición");
add("episodio depresivo","actual",5.5,"Total","Adultos mayores 60+",null,null,"Resultados adulto mayor",null,"MINI CIE-10");
add("consumo perjudicial o dependencia de alcohol","12 meses",1.5,"Total","Adultos mayores 60+",null,null,"Resultados adulto mayor",null,"MINI CIE-10");
add("consumo perjudicial o dependencia de alcohol","12 meses",2.9,"Ayacucho","Adultos mayores 60+",null,null,"Resultados adulto mayor",null,"MINI CIE-10");

// Other epidemiological domains verified in report.
add("mala o muy mala calidad del sueño","últimas 4 semanas",12.4,"Ayacucho","Adultos",null,null,"Resultados principales",null,"Índice de Calidad de Sueño de Pittsburgh","%","Total","Sueño");
add("mala o muy mala calidad del sueño","últimas 4 semanas",8.1,"Cajamarca","Adultos",null,null,"Resultados principales",null,"Índice de Calidad de Sueño de Pittsburgh","%","Total","Sueño");
add("mala o muy mala calidad del sueño","últimas 4 semanas",9.2,"Huaraz","Adultos",null,null,"Resultados principales",null,"Índice de Calidad de Sueño de Pittsburgh","%","Total","Sueño");
add("satisfacción con la vida","actual",60.3,"Ayacucho","Adultos",null,null,"Resultados principales",null,"Escala de Satisfacción con la Vida de Diener","%","Total","Bienestar");
add("satisfacción con la vida","actual",65.2,"Cajamarca","Adultos",null,null,"Resultados principales",null,"Escala de Satisfacción con la Vida de Diener","%","Total","Bienestar");
add("satisfacción con la vida","actual",62.1,"Huaraz","Adultos",null,null,"Resultados principales",null,"Escala de Satisfacción con la Vida de Diener","%","Total","Bienestar");

// Historical comparison rows from the 2017 report, kept as REG-001-derived observations.
const historical=[];
function hist(ind,period,val,pop="Adultos",lo=null,hi=null,ref="Comparación 2003-2017 del informe 2017"){
 historical.push({estudio_id:"REG-001",anio_ejecucion:2003,territorio:"Sierra Peruana",region:"Sierra Peruana",unidad_geografica:"conjunto de ciudades",poblacion:pop,sexo:"Total",dominio:"Trastornos clínicos",indicador_canonico:ind,indicador:ind,periodo_prevalencia:period,valor:val,unidad:"%",ic95_inferior:lo,ic95_superior:hi,criterio:"CIE-10 / instrumento compatible según informe comparativo",instrumento:"Estudio Sierra 2003",tabla:ref,pagina:null,fuente_url:SRC,fuente:"INSM / comparación incluida en informe 2017"});
}
hist("cualquier trastorno mental","vida",37.3);
hist("cualquier trastorno mental","12 meses",21.6);
hist("cualquier trastorno mental","actual",16.2);
hist("consumo perjudicial o dependencia de alcohol","12 meses",10.0,"Adultos",8.7,11.5);
hist("episodio depresivo","actual",5.7,"Adolescentes 12-17",4.5,7.2);
hist("episodio psicótico","actual",1.5,"Adolescentes 12-17",1.0,2.3);
hist("trastorno de ansiedad generalizada","actual",5.5,"Adolescentes 12-17",4.1,7.4);
hist("tendencia a problemas alimentarios","actual",5.9,"Adolescentes 12-17",4.7,7.5);

const metodologia={
 estudio_id:E,
 diseno:"Epidemiológico descriptivo de corte transversal; encuesta cara a cara.",
 cobertura:"Urbana: Ayacucho, Cajamarca y Huaraz; septiembre-diciembre 2017.",
 muestreo:"Probabilístico complejo en tres etapas; conglomerados, viviendas y personas; cada ciudad es estrato y nivel de inferencia; ponderación por probabilidades de selección y no respuesta.",
 muestra:{viviendas:4470,adultos:3893,adolescentes:1320,adultos_mayores:1040,mujeres_unidas:3475},
 analisis:"SPSS v20 para muestras complejas; proporciones, IC95%, pruebas chi-cuadrado convertidas a F y modelo lineal general; significancia <0,05.",
 fuente_url:SRC
};
const instrumentos=[
 "Cuestionario de Salud Mental adaptado",
 "MINI Entrevista Neuropsiquiátrica Internacional CIE-10 modificada",
 "MINI-PLUS",
 "Índice de Calidad de Vida de Mezzich",
 "EMBU (ítems seleccionados)",
 "Mini Mental State Examination (MMSE)",
 "Cuestionario de Pfeffer",
 "Cuestionario de Violencia Familiar adaptado",
 "Cuestionario de Determinantes de Acceso a Servicios de Salud",
 "Escala de Autoestima de Rosenberg",
 "Escala de Satisfacción con la Vida de Diener",
 "Escala de Autoeficacia de Schwarzer y Jerusalem",
 "Escala de Resiliencia del Yo de Block",
 "Cuestionario sobre Maltrato Escolar Modificado",
 "South Oaks Gambling Screen (SOGS)",
 "Test de Fagerström",
 "AUDIT",
 "Índice de Calidad de Sueño de Pittsburgh",
 "EDI-2 (escalas seleccionadas)",
 "Escala de Discapacidad/Inhabilidad"
];

window.SIP_CORPUS_CIENTIFICO=window.SIP_CORPUS_CIENTIFICO||{};
window.SIP_CORPUS_CIENTIFICO[E]={metodologia,instrumentos,resultados:rows};
window.INDICADORES_EPIDEMIOLOGICOS=[...(window.INDICADORES_EPIDEMIOLOGICOS||[]).filter(x=>x.estudio_id!==E),...rows,...historical];
})();
 
