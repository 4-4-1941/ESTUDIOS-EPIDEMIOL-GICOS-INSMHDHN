"use strict";

/*
  Capa integrada.
  1) No reemplaza data.js.
  2) Genera un índice documental para TODOS los estudios cargados en window.data/const data.
  3) Añade cifras estructuradas solamente cuando el registro maestro las documenta de forma explícita.
*/
(function () {
  const estudios = (typeof data !== "undefined" && Array.isArray(data)) ? data : [];

  const dividirTerritorios = (valor) =>
    String(valor || "")
      .split(/[\/,]/)
      .map(v => v.trim())
      .filter(Boolean);

  const documentales = estudios.flatMap(estudio => {
    const territorios = dividirTerritorios(estudio.ciudad || estudio.region);
    return (territorios.length ? territorios : [estudio.region || "Perú"]).map(territorio => ({
      tipo: "documental",
      estudio_id: estudio.id,
      territorio,
      region: estudio.region || "",
      titulo: estudio.titulo || "",
      anio_ejecucion: typeof anioEjecucion === "function" ? anioEjecucion(estudio) : null,
      tema: estudio.tema || "",
      fuente_url: estudio.url || "",
      fuente: estudio.fuente || "",
      paginas: estudio.paginas || "",
      resumen: estudio.resumen_breve || "",
      prevalencia_definicion: estudio.prevalencia_definicion || ""
    }));
  });

  const cifras = [
    ["REG-002","Cusco","cualquier trastorno mental","vida",30.9,"Adultos","CIE-10","Definición de prevalencia del registro maestro"],
    ["REG-002","Huancayo","cualquier trastorno mental","vida",30.0,"Adultos","CIE-10","Definición de prevalencia del registro maestro"],
    ["REG-005","Lima","cualquier trastorno mental","vida",26.1,"Adultos","CIE-10","Resumen/definición del registro maestro"],
    ["REG-005","Lima","cualquier trastorno mental","12 meses",11.8,"Adultos","CIE-10","Resumen/definición del registro maestro"],
    ["REG-006","Lima","cualquier trastorno mental","vida",37.3,"Adultos","CIE-10","Dato secundario señalado en el registro maestro"],
    ["REG-006","Lima","episodio depresivo","vida",18.2,"Adultos","CIE-10","Dato secundario señalado en el registro maestro"],
    ["REG-007","Chiclayo","cualquier trastorno mental","vida",31.9,"Adultos","CIE-10","Resultados principales p. 19"],
    ["REG-007","Chiclayo","cualquier trastorno mental","12 meses",14.5,"Adultos","CIE-10","Resultados principales p. 19"],
    ["REG-007","Chiclayo","episodio depresivo","vida",22.4,"Adultos","CIE-10","Resultados principales p. 19"],
    ["REG-013","Arequipa","cualquier trastorno mental","vida",28.5,"Adultos","CIE-10","Tablas 2 y 3 indicadas en el registro maestro"],
    ["REG-013","Moquegua","cualquier trastorno mental","vida",31.6,"Adultos","CIE-10","Tablas 2 y 3 indicadas en el registro maestro"],
    ["REG-013","Puno","cualquier trastorno mental","vida",35.4,"Adultos","CIE-10","Tablas 2 y 3 indicadas en el registro maestro"],
    ["REG-014","Lima","cualquier trastorno mental","vida",37.2,"Adultos atendidos en establecimientos","CIE-10","Definición del registro maestro"],
    ["REG-014","Lima","cualquier trastorno mental","actual",8.0,"Adultos atendidos en establecimientos","CIE-10","Definición del registro maestro"],
    ["REG-015","Ayacucho","cualquier trastorno mental","vida",39.7,"Adultos","CIE-10","Resumen del Informe General"],
    ["REG-015","Cajamarca","cualquier trastorno mental","vida",27.6,"Adultos","CIE-10","Resumen del Informe General"],
    ["REG-015","Huaraz","cualquier trastorno mental","vida",36.6,"Adultos","CIE-10","Resumen del Informe General"],
    ["REG-015","Ayacucho","cualquier trastorno mental","12 meses",15.9,"Adultos","CIE-10","Resumen del Informe General"],
    ["REG-015","Cajamarca","cualquier trastorno mental","12 meses",7.9,"Adultos","CIE-10","Resumen del Informe General"],
    ["REG-015","Huaraz","cualquier trastorno mental","12 meses",14.2,"Adultos","CIE-10","Resumen del Informe General"],
    ["REG-016","Abancay","cualquier trastorno mental","vida",28.8,"Adultos","CIE-10","Resumen del Informe General",2010],
    ["REG-016","Abancay","cualquier trastorno mental","vida",27.5,"Adultos","CIE-10","Resumen del Informe General",2016],
    ["REG-016","Abancay","cualquier trastorno mental","12 meses",13.5,"Adultos","CIE-10","Resumen del Informe General",2010],
    ["REG-016","Abancay","cualquier trastorno mental","12 meses",14.6,"Adultos","CIE-10","Resumen del Informe General",2016],
    ["REG-016","Abancay","episodio depresivo","vida",5.3,"Adultos","CIE-10","Resumen del Informe General",2016]
  ].map((r,i) => {
    const e=estudios.find(x=>x.id===r[0]) || {};
    return {
      id:`IND-${String(i+1).padStart(3,"0")}`,
      tipo:"indicador",
      estudio_id:r[0],
      territorio:r[1],
      indicador_canonico:r[2],
      indicador:r[2]==="episodio depresivo" ? "Episodio depresivo" : "Cualquier trastorno mental",
      periodo_prevalencia:r[3],
      valor:r[4],
      unidad:"%",
      poblacion:r[5],
      criterio:r[6],
      referencia:r[7],
      anio_ejecucion:r[8] || (typeof anioEjecucion==="function" ? anioEjecucion(e) : null),
      titulo:e.titulo || "",
      fuente_url:e.url || "",
      region:e.region || ""
    };
  });

  window.INDICE_ESTUDIOS_EPIDEMIOLOGICOS = documentales;
  window.INDICADORES_EPIDEMIOLOGICOS = cifras;
})();
