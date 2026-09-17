// ============================================
// MOTOR DE NARRATIVA EPIDEMIOLÓGICA
// Transforma consultas + datos → párrafos automáticos
// Autor: Claude | Licencia: MIT
// ============================================

class MotorNarrativo {
  constructor(datos) {
    this.datos = datos || [];
  }

  // Clasifica prevalencia en magnitud epidemiológica
  clasificarMagnitud(prevalencia) {
    const p = Number(prevalencia);
    if (p < 5) return "baja";
    if (p <= 15) return "media";
    return "alta";
  }

  // Normaliza strings (elimina acentos, espacios)
  normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  // Busca estudios por región y trastorno
  buscarEstudios(region, trastorno) {
    if (!region || !trastorno) return [];

    const normRegion = this.normalizar(region);
    const normTrastorno = this.normalizar(trastorno);

    return this.datos.filter(estudio => {
      const regMatch = 
        this.normalizar(estudio.region).includes(normRegion) ||
        this.normalizar(estudio.ciudad).includes(normRegion);

      const trasMatch =
        this.normalizar(estudio.tema).includes(normTrastorno) ||
        this.normalizar(estudio.resumen_breve).includes(normTrastorno);

      return regMatch && trasMatch;
    });
  }

  // Genera narrativa epidemiológica (tu prompt maestro)
  generarNarrativa(region, trastorno) {
    const estudios = this.buscarEstudios(region, trastorno);

    if (estudios.length === 0) {
      return `No hay datos documentados para ${trastorno} en ${region}.`;
    }

    // Calcula prevalencia promedio
    const prevPromedio = estudios
      .reduce((suma, e) => suma + (Number(e.prevalencia) || 0), 0) / 
      estudios.length;

    const magnitud = this.clasificarMagnitud(prevPromedio);

    // Extrae años
    const años = estudios
      .map(e => Number(e.anio_estudio))
      .filter(a => !isNaN(a))
      .sort((a, b) => a - b);

    const periodoTexto = años.length > 1 
      ? `entre ${años[0]} y ${años[años.length - 1]}` 
      : `en ${años[0]}`;

    // PÁRRAFO NARRATIVO (PROMPT MAESTRO EJECUTABLE)
    const narrativa = 
      `Los indicadores muestran que la ${trastorno} en ${region} ${periodoTexto} ` +
      `fue ${magnitud} (${prevPromedio.toFixed(1)}%), ` +
      `siendo la población de adultos la más documentada. ` +
      `La evidencia proviene de ${estudios.length} estudio(s) epidemiológico(s) ` +
      `realizados entre ${años[0]} y ${años[años.length - 1]}.`;

    return narrativa;
  }

  // Compara prevalencias entre dos regiones
  compararRegiones(region1, region2, trastorno) {
    const e1 = this.buscarEstudios(region1, trastorno);
    const e2 = this.buscarEstudios(region2, trastorno);

    if (e1.length === 0 || e2.length === 0) {
      return "No hay datos suficientes para comparar ambas regiones.";
    }

    const p1 = e1.reduce((s, e) => s + (Number(e.prevalencia) || 0), 0) / e1.length;
    const p2 = e2.reduce((s, e) => s + (Number(e.prevalencia) || 0), 0) / e2.length;
    
    const diferencia = (p2 - p1).toFixed(1);
    const razon = (p2 / p1).toFixed(2);
    const comparacion = p2 > p1 ? `mayor en ${region2}` : `menor en ${region2}`;

    return `La ${trastorno} en ${region1} fue ${p1.toFixed(1)}% ` +
      `vs ${region2} ${p2.toFixed(1)}% (${comparacion}, diferencia ${diferencia} pp, RP=${razon}).`;
  }

  // Tendencia temporal en una región
  analizarTendencia(region, trastorno) {
    const estudios = this.buscarEstudios(region, trastorno)
      .sort((a, b) => a.anio_estudio - b.anio_estudio);

    if (estudios.length < 2) {
      return "Se necesitan al menos 2 estudios para analizar tendencia.";
    }

    const p_inicio = Number(estudios[0].prevalencia);
    const p_fin = Number(estudios[estudios.length - 1].prevalencia);
    const cambio = p_fin - p_inicio;
    const años = estudios[estudios.length - 1].anio_estudio - estudios[0].anio_estudio;
    const cambioAnual = (cambio / años).toFixed(2);

    const tendencia = cambio > 0 ? "aumentó" : "disminuyó";

    return `La ${trastorno} en ${region} ${tendencia} de ${p_inicio.toFixed(1)}% ` +
      `(${estudios[0].anio_estudio}) a ${p_fin.toFixed(1)}% ` +
      `(${estudios[estudios.length - 1].anio_estudio}), ` +
      `representando un cambio de ${cambioAnual} pp/año.`;
  }
}

// Exporta para uso global
window.MotorNarrativo = MotorNarrativo;
