(function() {
  "use strict";

  class MotorNarrativo {
    constructor(datos) {
      this.datos = Array.isArray(datos) ? datos : [];
    }

    norm(txt) {
      return String(txt || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    }

    getProp(obj, keys) {
      for (let k of keys) {
        if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
      }
      return "";
    }

    buscarEstudios(region, trastorno) {
      if (!region && !trastorno) return this.datos;
      const nReg = region ? this.norm(region) : "";
      const nTras = trastorno ? this.norm(trastorno) : "";

      return this.datos.filter(item => {
        const fullText = Object.values(item).map(v => this.norm(v)).join(" ");
        return (!nReg || fullText.includes(nReg)) && (!nTras || fullText.includes(nTras));
      });
    }

    generarNarrativa(region, trastorno) {
      const estudios = this.buscarEstudios(region, trastorno);

      if (estudios.length === 0) {
        return `No se registran fuentes epidemiológicas para "${trastorno || 'la condición'}" en ${region || 'la ubicación consultada'}.`;
      }

      // Invoca el cálculo de indicadores-epidemiologicos.js si está cargado
      let promedio = null;
      if (window.IndicadoresEpidemiologicos && typeof window.IndicadoresEpidemiologicos.calcularPrevalenciaPromedio === 'function') {
        promedio = window.IndicadoresEpidemiologicos.calcularPrevalenciaPromedio(estudios);
      } else {
        const prevs = estudios
          .map(e => parseFloat(String(this.getProp(e, ['prevalencia', 'porcentaje', 'tasa', 'valor'])).replace(',', '.')))
          .filter(p => !isNaN(p));
        if (prevs.length > 0) {
          promedio = parseFloat((prevs.reduce((a, b) => a + b, 0) / prevs.length).toFixed(1));
        }
      }

      if (promedio === null || isNaN(promedio) || promedio === 0) {
        return `Se identificaron ${estudios.length} fuente(s) oficiales para ${trastorno || 'la condición'} en ${region || 'la zona'}, pero sin valores numéricos de prevalencia registrados.`;
      }

      let magnitud = "moderada";
      if (window.IndicadoresEpidemiologicos && typeof window.IndicadoresEpidemiologicos.determinarMagnitud === 'function') {
        magnitud = window.IndicadoresEpidemiologicos.determinarMagnitud(promedio).toLowerCase();
      } else {
        if (promedio < 5) magnitud = "baja";
        else if (promedio <= 15) magnitud = "media";
        else magnitud = "alta";
      }

      return `Los indicadores muestran una prevalencia promedio del ${promedio}% (magnitud ${magnitud}) para ${trastorno || 'la condición'} en ${region || 'la zona'}, respaldada por ${estudios.length} fuente(s) de tu base de datos INSM.`;
    }

    obtenerDetalles(region, trastorno) {
      return this.buscarEstudios(region, trastorno).map(e => ({
        titulo: this.getProp(e, ['titulo', 'nombre', 'estudio', 'resumen_breve', 'tema', 'prevalencia_definicion']) || "Estudio Epidemiológico INSM",
        region: this.getProp(e, ['region', 'departamento', 'ciudad', 'lugar']) || "N/D",
        anio: this.getProp(e, ['anio_estudio', 'anio', 'fecha', 'periodo']) || "N/D",
        prevalencia: this.getProp(e, ['prevalencia', 'porcentaje', 'tasa', 'valor']) || "N/D"
      }));
    }
  }

  window.MotorNarrativo = MotorNarrativo;
})();
