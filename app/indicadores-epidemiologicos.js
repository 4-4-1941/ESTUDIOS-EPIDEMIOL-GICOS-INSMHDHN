(function(){
"use strict";
const estudios=(typeof data!=="undefined"&&Array.isArray(data))?data:[];
const macro=t=>{
 const n=String(t||"").toLowerCase();
 if(/lima|callao|chiclayo|tumbes|trujillo/.test(n)) return "Costa";
 if(/ayacucho|cajamarca|huaraz|cusco|huancayo|abancay|huancavelica|puno/.test(n)) return "Sierra";
 if(/iquitos|pucallpa/.test(n)) return "Selva";
 return "";
};
const docs=estudios.map(e=>({
 estudio_id:e.id,titulo:e.titulo,region:e.region,territorio:e.ciudad,anio_ejecucion:typeof anioEjecucion==="function"?anioEjecucion(e):null,
 anio_publicacion:e.anio_pub,tema:e.tema,fuente:e.fuente,fuente_url:e.url,paginas:e.paginas||"",resumen:e.resumen_breve||"",
 prevalencia_definicion:e.prevalencia_definicion||"",macroregion:macro(e.ciudad+" "+e.region)
}));
const base=[];
function add(est,terr,ind,per,val,pop,crit,ref,year,lo=null,hi=null){
 const e=estudios.find(x=>x.id===est)||{};
 base.push({estudio_id:est,territorio:terr,region:e.region||"",macroregion:macro(terr+" "+(e.region||"")),unidad_geografica:"ciudad",
 indicador_canonico:ind,indicador:ind,periodo_prevalencia:per,valor:val,unidad:"%",poblacion:pop,sexo:"Total",criterio:crit,
 instrumento:crit,referencia:ref,tabla:ref,pagina:null,ic95_inferior:lo,ic95_superior:hi,anio_ejecucion:year||(typeof anioEjecucion==="function"?anioEjecucion(e):null),
 titulo:e.titulo||"",fuente_url:e.url||"",fuente:e.fuente||""});
}
add("REG-002","Cusco","cualquier trastorno mental","vida",30.9,"Adultos","CIE-10","Registro maestro",2011,27.8,34.3);
add("REG-002","Huancayo","cualquier trastorno mental","vida",30.0,"Adultos","CIE-10","Registro maestro",2011,27.1,33.1);
add("REG-005","Lima/Callao","cualquier trastorno mental","vida",26.1,"Adultos","CIE-10","Resultados principales",2012);
add("REG-005","Lima/Callao","cualquier trastorno mental","12 meses",11.8,"Adultos","CIE-10","Resultados principales",2012);
add("REG-006","Lima/Callao","cualquier trastorno mental","vida",37.3,"Adultos","CIE-10","Dato secundario: verificar fuente primaria",2002);
add("REG-006","Lima/Callao","episodio depresivo","vida",18.2,"Adultos","CIE-10","Dato secundario: verificar fuente primaria",2002);
add("REG-007","Chiclayo","cualquier trastorno mental","vida",31.9,"Adultos","CIE-10","Resultados principales p.19",2019);
add("REG-007","Chiclayo","cualquier trastorno mental","12 meses",14.5,"Adultos","CIE-10","Resultados principales p.19",2019);
add("REG-007","Chiclayo","episodio depresivo","vida",22.4,"Adultos","CIE-10","Resultados principales p.19",2019);
add("REG-007","Chiclayo","trastorno de estrés postraumático","vida",4.3,"Adultos","CIE-10","Resultados principales p.19",2019);
add("REG-007","Chiclayo","consumo perjudicial o dependencia de alcohol","vida",9.5,"Adultos","CIE-10","Resultados principales p.19",2019);
add("REG-013","Arequipa","cualquier trastorno mental","vida",28.5,"Adultos","CIE-10","Tablas 2-3",2018);
add("REG-013","Moquegua","cualquier trastorno mental","vida",31.6,"Adultos","CIE-10","Tablas 2-3",2018);
add("REG-013","Puno","cualquier trastorno mental","vida",35.4,"Adultos","CIE-10","Tablas 2-3",2018);
add("REG-014","Lima/Callao","cualquier trastorno mental","vida",37.2,"Adultos atendidos en establecimientos","CIE-10","Registro maestro",2015);
add("REG-016","Abancay","cualquier trastorno mental","vida",28.8,"Adultos","CIE-10","Informe general",2010);
add("REG-016","Abancay","cualquier trastorno mental","vida",27.5,"Adultos","CIE-10","Informe general",2016);
add("REG-016","Abancay","cualquier trastorno mental","12 meses",13.5,"Adultos","CIE-10","Informe general",2010);
add("REG-016","Abancay","cualquier trastorno mental","12 meses",14.6,"Adultos","CIE-10","Informe general",2016);

window.INDICE_ESTUDIOS_EPIDEMIOLOGICOS=docs;
window.INDICADORES_EPIDEMIOLOGICOS=base;
})();
