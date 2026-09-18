// ============================================
// CONSULTANTE EPIDEMIOLÓGICO v3.0 (REPARADO)
// INSM "Honorio Delgado - Hideyo Noguchi"
// --------------------------------------------
// REPARACIONES respecto a la v2.2 rota:
// 1) LECTURA DE DATOS: data.js declara "const data = [...]".
//    Un const de script clásico NO crea window.data (solo var y
//    funciones lo hacen). Leer window.data dejaba el consultante
//    ciego ("No se encuentran datos"). Ahora se lee la variable
//    directamente con typeof, igual que indicadores-epidemiologicos.js.
// 2) COBERTURA TOTAL: el vocabulario territorial se construye
//    DINÁMICAMENTE desde la propia base (regiones + ciudades), así
//    ningún estudio queda fuera por una lista fija incompleta
//    (la v2.2 no reconocía Cajamarca, Huaraz, violencia, estrés
//    postraumático, etc.).
// 3) MODO GENÉRICO: "prevalencia en X" / "salud mental en X"
//    devuelve TODOS los estudios del territorio, no exige trastorno.
// 4) COMPARACIÓN con "vs", "versus" o "y" (dos territorios).
// 5) TENDENCIA: "tendencia/evolución/cambio en X".
// ============================================
(function () {
  "use strict";

  // ---- Lectura segura de la base ----
  const obtenerDatos = () =>
    (typeof data !== "undefined" && Array.isArray(data)) ? data : [];

  const normalizar = (t) =>
    String(t || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .trim();

  // ---- Vocabulario territorial construido DESDE la base ----
  function vocabularioTerritorial(datos) {
    const voc = new Set();
    const agregar = (s) =>
      normalizar(s).split(/[^a-z0-9]+/).forEach((p) => {
        if (p.length >= 4) voc.add(p);
      });
    datos.forEach((e) => {
      [e.region, e.ciudad].forEach((campo) =>
        String(campo || "").split(/[\/,]/).forEach(agregar)
      );
    });
    ["sierra", "costa", "selva", "norte", "sur", "andina", "andino",
     "peru", "hospitales", "regionales", "metropolitana", "rural"]
      .forEach((w) => voc.add(w));
    return [...voc].sort((a, b) => b.length - a.length);
  }

  const detectarTerritorios = (qNorm, vocabulario) =>
    vocabulario.filter((v) => qNorm.includes(v));

  // Une palabras territoriales adyacentes cuando la frase completa
  // existe en la base ("trapecio andino", "costa norte", ...), así no
  // se interpretan como dos territorios a comparar.
  function consolidarTerritorios(qNorm, territorios, datos) {
    const ordenados = [...territorios].sort((a, b) => qNorm.indexOf(a) - qNorm.indexOf(b));
    const salida = [];
    let i = 0;
    while (i < ordenados.length) {
      const siguiente = ordenados[i + 1];
      if (siguiente) {
        const candidato = ordenados[i] + " " + siguiente;
        const existe = datos.some((e) =>
          normalizar((e.region || "") + " " + (e.ciudad || "")).includes(candidato));
        if (existe) { salida.push(candidato); i += 2; continue; }
      }
      salida.push(ordenados[i]); i++;
    }
    return salida;
  }

  function coincideTerritorio(estudio, claveNorm) {
    if (claveNorm === "peru") return true; // alcance nacional: toda la base
    return [estudio.region, estudio.ciudad, estudio.titulo]
      .some((c) => normalizar(c).includes(claveNorm));
  }

  // ---- Diccionario de trastornos/temas consultables ----
  const GENERICO = "cualquier trastorno mental";
  const TRASTORNOS = [
    { nombre: "depresión", claves: ["depres", "depresivo"] },
    { nombre: "ansiedad", claves: ["ansiedad", "ansios"] },
    { nombre: "uso de alcohol y sustancias", claves: ["alcohol", "sustancia", "marihuana", "droga", "adiccion"] },
    { nombre: "conducta suicida", claves: ["suicid", "autolesion"] },
    { nombre: "estrés postraumático", claves: ["postraumatic", "ptsd"] },
    { nombre: "violencia de género", claves: ["violencia", "maltrato", "abuso"] },
    { nombre: "episodio psicótico", claves: ["psicotic", "psicosis"] },
    { nombre: "TDAH", claves: ["tdah", "deficit de atencion"] },
    { nombre: "COVID-19", claves: ["covid", "pandemia"] },
    { nombre: "salud mental infantil", claves: ["niño", "niños", "adolescent", "infantil", "escolar"] },
    { nombre: GENERICO, claves: ["trastorno mental", "trastorno psiquiatric", "psiquiatric", "salud mental", "prevalencia", "epidemiolog", "estudio"] }
  ];

  const detectarTrastorno = (qNorm) =>
    TRASTORNOS.find((t) => t.claves.some((c) => qNorm.includes(c))) || null;

  function coincideTrastorno(estudio, claves) {
    const campos = [estudio.tema, estudio.resumen_breve,
                    estudio.prevalencia_definicion, estudio.titulo]
      .map(normalizar);
    return claves.some((c) => campos.some((campo) => campo.includes(c)));
  }

  // ---- Estadísticos ----
  const promedio = (lista) =>
    lista.length ? lista.reduce((a, b) => a + b, 0) / lista.length : null;

  function magnitudDe(p) {
    if (typeof MotorNarrativo !== "undefined") {
      return MotorNarrativo.prototype.clasificarMagnitud.call({}, p);
    }
    return p < 5 ? "baja" : p <= 15 ? "media" : "alta";
  }

  const anioDe = (estudio) =>
    (typeof anioEjecucion === "function") ? anioEjecucion(estudio) : null;

  function narrativaDe(estudios, territorio, trastornoNombre) {
    if (!estudios.length) return `❌ No hay estudios documentados para "${territorio}".`;
    const conCifra = estudios.filter((e) => typeof e.prevalencia === "number");
    const años = estudios.map(anioDe).filter(Boolean).sort((a, b) => a - b);
    let txt = `Se encontraron ${estudios.length} estudio(s)` +
      (trastornoNombre ? ` sobre ${trastornoNombre}` : "") +
      ` en "${territorio}"` +
      (años.length ? ` (ejecutados entre ${años[0]} y ${años[años.length - 1]})` : "") + ". ";
    if (conCifra.length) {
      const p = promedio(conCifra.map((e) => e.prevalencia));
      txt += `Prevalencia promedio registrada: ${p.toFixed(1)}% (magnitud ${magnitudDe(p)}) en ${conCifra.length} estudio(s) con cifra numérica.`;
    } else {
      txt += "Ninguno registra aún una cifra de prevalencia numérica.";
    }
    return txt;
  }

  const detallesDe = (estudios) => estudios.map((e) => ({
    id: e.id, titulo: e.titulo, region: e.region, ciudad: e.ciudad,
    anio: e.anio_estudio, prevalencia: e.prevalencia, url: e.url, fuente: e.fuente
  }));

  // ---- Consulta principal ----
  function consultar(texto) {
    if (!texto || !String(texto).trim()) {
      return { narrativa: "Escribe una consulta (ej.: \"prevalencia en Lima\" o \"depresión en Ayacucho\").", estudios: [], tipo: "vacio" };
    }
    const qNorm = normalizar(texto);
    const datos = obtenerDatos();
    if (!datos.length) {
      return { narrativa: "⚠️ Error: data.js no está cargado.", estudios: [], tipo: "error" };
    }

    const territorios = consolidarTerritorios(
      qNorm, detectarTerritorios(qNorm, vocabularioTerritorial(datos)), datos);
    if (!territorios.length) {
      return {
        narrativa: "No reconocí el territorio. Ejemplos: Lima, Ayacucho, Cusco, Chiclayo, Cajamarca, Huaraz, \"sierra\", \"costa norte\", \"Perú\".",
        estudios: [], tipo: "incompleto"
      };
    }

    const trastorno = detectarTrastorno(qNorm);
    const trastornoEspecifico = trastorno && trastorno.nombre !== GENERICO;
    const esTendencia = /tendencia|evolucion|cambio|aument|disminu/.test(qNorm);

    const territorio = territorios[0];
    const delTerritorio = datos.filter((e) => coincideTerritorio(e, territorio));

    // Dos territorios detectados => comparación automática ("vs" o "y")
    if (territorios.length >= 2 && !esTendencia) {
      const t2 = territorios[1];
      const base2 = datos.filter((e) => coincideTerritorio(e, t2));
      const g1 = trastornoEspecifico ? delTerritorio.filter((e) => coincideTrastorno(e, trastorno.claves)) : delTerritorio;
      const g2 = trastornoEspecifico ? base2.filter((e) => coincideTrastorno(e, trastorno.claves)) : base2;
      if (!g1.length || !g2.length) {
        return {
          narrativa: `⚠️ No hay datos suficientes para comparar "${territorio}" y "${t2}"` + (trastornoEspecifico ? ` en ${trastorno.nombre}` : "") + ".",
          estudios: [], tipo: "error"
        };
      }
      const c1 = g1.filter((e) => typeof e.prevalencia === "number");
      const c2 = g2.filter((e) => typeof e.prevalencia === "number");
      let narrativa = `"${territorio}": ${g1.length} estudio(s). "${t2}": ${g2.length} estudio(s). `;
      if (c1.length && c2.length) {
        const p1 = promedio(c1.map((e) => e.prevalencia));
        const p2 = promedio(c2.map((e) => e.prevalencia));
        narrativa += `Prevalencia promedio: ${p1.toFixed(1)}% vs ${p2.toFixed(1)}% (diferencia ${(p2 - p1).toFixed(1)} pp, RP=${(p2 / p1).toFixed(2)}).`;
      } else {
        narrativa += "No hay cifras numéricas en ambos territorios para cuantificar la diferencia.";
      }
      return { narrativa, estudios: detallesDe(g1.concat(g2)), tipo: "comparacion" };
    }

    // Subconjunto por trastorno; si no hay match, se muestra el
    // territorio completo con una nota (nunca se oculta data).
    let usados = delTerritorio, nota = null;
    if (trastornoEspecifico) {
      const sub = delTerritorio.filter((e) => coincideTrastorno(e, trastorno.claves));
      if (sub.length) {
        usados = sub;
      } else if (delTerritorio.length) {
        nota = `No hay datos específicos de "${trastorno.nombre}" en "${territorio}"; se muestran los ${delTerritorio.length} estudio(s) del territorio.`;
        usados = delTerritorio;
      }
    }

    if (esTendencia) {
      const serie = usados
        .filter((e) => typeof e.prevalencia === "number" && anioDe(e))
        .sort((a, b) => anioDe(a) - anioDe(b));
      if (serie.length < 2) {
        return {
          narrativa: (nota ? nota + " " : "") + `⚠️ Se necesitan al menos 2 estudios con cifra de prevalencia para analizar tendencia en "${territorio}" (se encontraron ${serie.length}).`,
          estudios: detallesDe(serie), tipo: "tendencia"
        };
      }
      const p0 = serie[0].prevalencia, p1 = serie[serie.length - 1].prevalencia;
      const y0 = anioDe(serie[0]), y1 = anioDe(serie[serie.length - 1]);
      const cambio = p1 - p0;
      const ppAnio = (y1 - y0) ? (cambio / (y1 - y0)).toFixed(2) : "0.00";
      const narrativa = `La prevalencia en "${territorio}" ${cambio > 0 ? "aumentó" : cambio < 0 ? "disminuyó" : "se mantuvo"} de ${p0.toFixed(1)}% (${y0}) a ${p1.toFixed(1)}% (${y1}): ${Math.abs(cambio).toFixed(1)} pp en total (${ppAnio} pp/año), con ${serie.length} puntos de datos.`;
      return { narrativa: (nota ? nota + " " : "") + narrativa, estudios: detallesDe(serie), tipo: "tendencia" };
    }

    return {
      narrativa: (nota ? nota + " " : "") + narrativaDe(usados, territorio, trastorno ? trastorno.nombre : null),
      estudios: detallesDe(usados),
      tipo: "general"
    };
  }

  // ---- Render en DOM ----
  function render(resultado, nodo) {
    if (!nodo || !resultado || !resultado.narrativa) return;
    const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

    let html = `<article class="epi-resultado"><p class="epi-narrativa">${esc(resultado.narrativa)}</p>`;
    if (resultado.estudios && resultado.estudios.length) {
      html += `<details class="epi-detalles"><summary>📚 Estudios encontrados (${resultado.estudios.length})</summary><ul class="epi-lista-estudios">`;
      resultado.estudios.forEach((e) => {
        html += `<li><strong>${esc(e.titulo)}</strong><br/><small>` +
          `<strong>${esc(e.region)}</strong> · ${esc(e.ciudad || "")} · ${esc(e.anio || "s/f")} · ` +
          `Prevalencia: <strong>${e.prevalencia != null ? e.prevalencia + "%" : "N/A"}</strong>` +
          (e.url ? ` · <a href="${esc(e.url)}" target="_blank" rel="noopener">Ver fuente</a>` : "") +
          `</small></li>`;
      });
      html += `</ul></details>`;
    }
    html += `</article>`;
    nodo.innerHTML = html;
  }

  // ---- Inicialización ----
  function init() {
    const input = document.getElementById("epi-consulta");
    const btn = document.getElementById("epi-buscar");
    const output = document.getElementById("epi-respuesta");
    if (!input || !btn || !output) {
      console.warn("Consultante: no se encuentran epi-consulta/epi-buscar/epi-respuesta en el DOM");
      return;
    }
    const ejecutar = () => render(consultar(input.value), output);
    btn.addEventListener("click", ejecutar);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); ejecutar(); }
    });
    output.innerHTML = `
      <p class="epi-instrucciones">
        <strong>🔬 Consultante Epidemiológico</strong><br/>
        <strong>Ejemplos de búsqueda:</strong><br/>
        • "prevalencia en Lima" → todos los estudios del territorio<br/>
        • "depresión en Ayacucho"<br/>
        • "violencia en Lima"<br/>
        • "Lima vs Cusco" o "Lima y Cusco"<br/>
        • "tendencia salud mental en Lima"
      </p>`;
  }

  window.SIPEpidemiologia = { consultar, render, init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
    
