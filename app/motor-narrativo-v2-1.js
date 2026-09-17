// ============================================
// MOTOR DE NARRATIVA EPIDEMIOLÓGICA v2.1
// CORREGIDO: busca en región + ciudad + tema + resumen
// Autor: Claude | Licencia: MIT
// ============================================

class MotorNarrativo {
  constructor(datos) {
    this.datos = datos || [];
  }

  // Normaliza strings (elimina acentos, espacios)
  normalizar(texto) {
    return String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  // Clasifica prevalencia en magnitud epidemiológica
  clasificarMagnitud(prevalencia) {
    const p = Number(prevalencia);
    if (isNaN(p)) return "indefinida";
    if (p < 5) return "baja";
    if (p <= 15) return "media";
    return "alta";
  }

  // Busca estudios por región y trastorno (MEJORADO)
  buscarEstudios(region, trastorno) {
    if (!region || !trastorno) return [];

    const normRegion = this.normalizar(region);
    const normTrastorno = this.normalizar(trastorno);

    return this.datos.filter(estudio => {
      // Busca región en: region, ciudad
      const regMatch = 
        this.normalizar(estudio.region || "").includes(normRegion) ||
        this.normalizar(estudio.ciudad || "").includes(normRegion);

      // Busca trastorno en: tema, resumen_breve, prevalencia_definicion
      const trasMatch =
        this.normalizar(estudio.tema || "").includes(normTrastorno) ||
        this.normalizar(estudio.resumen_breve || "").includes(normTrastorno) ||
        this.normalizar(estudio.prevalencia_definicion || "").includes(normTrastorno);

      return regMatch && trasMatch;
    });
  }

  // Genera narrativa epidemiológica (CORREGIDA)
  generarNarrativa(region, trastorno) {
    const estudios = this.buscarEstudios(region, trastorno);

    if (estudios.length === 0) {
      return `❌ No hay datos documentados para "${trastorno}" en "${region}".`;
    }

    // Calcula prevalencia promedio
    const prevalencias = estudios
      .map(e => Number(e.prevalencia))
      .filter(p => !isNaN(p));

    if (prevalencias.length === 0) {
      return `⚠️ Se encontraron ${estudios.length} estudio(s) para "${trastorno}" en "${region}", ` +
        `pero sin datos de prevalencia numéricos registrados.`;
    }

    const prevPromedio = prevalencias.reduce((a, b) => a + b, 0) / prevalencias.length;
    const magnitud = this.clasificarMagnitud(prevPromedio);

    // Extrae años
    const años = estudios
      .map(e => {
        const a = e.anio_estudio;
        return typeof a === "string" ? parseInt(a.split("/")[0]) : Number(a);
      })
      .filter(a => !isNaN(a))
      .sort((a, b) => a - b);

    const periodoTexto = años.length > 1 
      ? `entre ${años[0]} y ${años[años.length - 1]}` 
      : `en ${años[0]}`;

    // PÁRRAFO NARRATIVO AUTOMÁTICO
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
      return `⚠️ No hay datos suficientes para comparar "${region1}" y "${region2}" en "${trastorno}".`;
    }

    const prev1 = e1
      .map(e => Number(e.prevalencia))
      .filter(p => !isNaN(p));
    const prev2 = e2
      .map(e => Number(e.prevalencia))
      .filter(p => !isNaN(p));

    if (prev1.length === 0 || prev2.length === 0) {
      return `⚠️ Faltan datos de prevalencia para completar la comparación.`;
    }

    const p1 = prev1.reduce((a, b) => a + b, 0) / prev1.length;
    const p2 = prev2.reduce((a, b) => a + b, 0) / prev2.length;
    
    const diferencia = (p2 - p1).toFixed(1);
    const razon = (p2 / p1).toFixed(2);
    const comparacion = p2 > p1 ? `mayor en ${region2}` : `menor en ${region2}`;

    return `La ${trastorno} en ${region1} fue ${p1.toFixed(1)}% ` +
      `vs ${region2} ${p2.toFixed(1)}% (${comparacion}, diferencia ${diferencia} pp, RP=${razon}).`;
  }

  // Tendencia temporal en una región
  analizarTendencia(region, trastorno) {
    const estudios = this.buscarEstudios(region, trastorno)
      .map(e => ({
        ...e,
        anio_num: typeof e.anio_estudio === "string" 
          ? parseInt(e.anio_estudio.split("/")[0]) 
          : Number(e.anio_estudio)
      }))
      .filter(e => !isNaN(e.anio_num) && !isNaN(Number(e.prevalencia)))
      .sort((a, b) => a.anio_num - b.anio_num);

    if (estudios.length < 2) {
      return `⚠️ Se necesitan al menos 2 estudios para analizar tendencia. Se encontró ${estudios.length}.`;
    }

    const p_inicio = Number(estudios[0].prevalencia);
    const p_fin = Number(estudios[estudios.length - 1].prevalencia);
    const cambio = p_fin - p_inicio;
    const años = estudios[estudios.length - 1].anio_num - estudios[0].anio_num;
    
    if (años === 0) {
      return `⚠️ No hay variación temporal en los datos.`;
    }

    const cambioAnual = (cambio / años).toFixed(2);
    const tendencia = cambio > 0 ? "aumentó" : "disminuyó";

    return `La ${trastorno} en ${region} ${tendencia} de ${p_inicio.toFixed(1)}% ` +
      `(${estudios[0].anio_num}) a ${p_fin.toFixed(1)}% ` +
      `(${estudios[estudios.length - 1].anio_num}), ` +
      `representando un cambio de ${cambioAnual} pp/año.`;
  }

  // Obtiene detalles de estudios encontrados
  obtenerDetalles(region, trastorno) {
    return this.buscarEstudios(region, trastorno).map(e => ({
      id: e.id,
      titulo: e.titulo,
      region: e.region,
      ciudad: e.ciudad,
      anio: e.anio_estudio,
      prevalencia: e.prevalencia,
      url: e.url,
      fuente: e.fuente
    }));
  }
}

// Exporta para uso global
window.MotorNarrativo = MotorNarrativo;
