// ============================================
// MOTOR NARRATIVO - CONSULTANTE EPIDEMIOLÓGICO
// Ruta: motor-narrativo.js
// ============================================

(function() {
  "use strict";

  class MotorNarrativo {
    constructor(datos) {
      this.datos = datos || [];
    }

    norm(txt) {
      return String(txt || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    }

    // Busca estudios filtrando por región y trastorno
    buscarEstudios(region, trastorno) {
      if (!region || !trastorno) return [];

      const normReg = this.norm(region);
      const normTras = this.norm(trastorno);

      return this.datos.filter(e => {
        const tieneRegion = 
          this.norm(e.region || "").includes(normReg) ||
          this.norm(e.ciudad || "").includes(normReg);

        const tieneTrastorno =
          this.norm(e.prevalencia_definicion || "").includes(normTras) ||
          this.norm(e.resumen_breve || "").includes(normTras) ||
          this.norm(e.tema || "").includes(normTras);

        return tieneRegion && tieneTrastorno;
      });
    }

    // Genera narrativa automática basada en promedios
    generarNarrativa(region, trastorno) {
      const estudios = this.buscarEstudios(region, trastorno);

      if (estudios.length === 0) {
        return `No se encuentran registros documentados para "${trastorno}" en la región o localidad de ${region}.`;
      }

      const prevs = estudios
        .map(e => Number(e.prevalencia))
        .filter(p => !isNaN(p));

      if (prevs.length === 0) {
        return `Se identificaron ${estudios.length} estudio(s) en ${region} relacionados con ${trastorno}, pero sin valores de prevalencia cuantificados.`;
      }

      const promedio = (prevs.reduce((a, b) => a + b, 0) / prevs.length).toFixed(1);
      
      let magnitud = "moderada";
      if (promedio < 5) magnitud = "baja";
      else if (promedio <= 15) magnitud = "media";
      else magnitud = "alta";

      const anios = estudios
        .map(e => {
          const a = e.anio_estudio;
          return typeof a === "string" ? parseInt(a.split("/")[0]) : Number(a);
        })
        .filter(a => !isNaN(a))
        .sort((a, b) => a - b);

      const periodo = anios.length > 1
        ? `entre ${anios[0]} y ${anios[anios.length - 1]}`
        : `en el año ${anios[0]}`;

      return `Los indicadores muestran que la prevalencia de ${trastorno} en ${region} ${periodo} fue de magnitud ${magnitud} (${promedio}% en promedio). La evidencia está respaldada por ${estudios.length} estudio(s) epidemiológico(s) oficial(es).`;
    }

    // Compara dos regiones para un trastorno
    compararRegiones(reg1, reg2, trastorno) {
      const est1 = this.buscarEstudios(reg1, trastorno);
      const est2 = this.buscarEstudios(reg2, trastorno);

      if (est1.length === 0 && est2.length === 0) {
        return `No hay datos suficientes para realizar una comparativa sobre ${trastorno} entre ${reg1} y ${reg2}.`;
      }

      const calcPromedio = (estudios) => {
        const prevs = estudios.map(e => Number(e.prevalencia)).filter(p => !isNaN(p));
        if (prevs.length === 0) return null;
        return (prevs.reduce((a, b) => a + b, 0) / prevs.length).toFixed(1);
      };

      const p1 = calcPromedio(est1);
      const p2 = calcPromedio(est2);

      return `Comparativa territorial para ${trastorno}: En ${reg1} se registra un promedio de ${p1 !== null ? p1 + '%' : 'sin cuantificar'} (${est1.length} estudios), frente a ${reg2} con un promedio de ${p2 !== null ? p2 + '%' : 'sin cuantificar'} (${est2.length} estudios).`;
    }

    // Analiza tendencia histórica
    analizarTendencia(region, trastorno) {
      const estudios = this.buscarEstudios(region, trastorno);
      if (estudios.length < 2) {
        return `No existen suficientes registros históricos en ${region} para trazar una tendencia evolutiva sobre ${trastorno} (se localizó solo ${estudios.length} estudio).`;
      }

      return `El análisis evolutivo de ${trastorno} en ${region} comprende ${estudios.length} mediciones documentadas a lo largo de los años, reflejando el comportamiento histórico del indicador.`;
    }

    // Devuelve los detalles listos para la interfaz
    obtenerDetalles(region, trastorno) {
      return this.buscarEstudios(region, trastorno).map(e => ({
        titulo: e.titulo,
        region: e.region,
        ciudad: e.ciudad,
        anio: e.anio_estudio,
        prevalencia: e.prevalencia,
        url: e.url
      }));
    }
  }

  // Exporta globalmente para el núcleo v2.2
  window.MotorNarrativo = MotorNarrativo;

})();
                                                                               ⁰9
