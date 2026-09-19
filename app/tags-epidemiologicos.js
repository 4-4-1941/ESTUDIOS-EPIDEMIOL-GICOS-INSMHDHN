// ============================================================
// TAGS EPIDEMIOLÓGICOS v1.0 — SIP Research
// Extrae palabras clave (tags) de cada investigación de la base
// (indicadores, trastornos, población, métodos, territorio) y
// muestra un panel interactivo junto al consultante para que el
// usuario CONSTRUYA sus preguntas con un clic. 100% aditivo:
// no modifica ningún otro módulo. Cargar DESPUÉS de data.js y
// de core/consulta-epidemiologica.js.
// ============================================================
(function () {
  "use strict";

  const normalizar = (t) =>
    String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

  // Diccionario de tags: tag visible -> claves de búsqueda en el texto
  const TAGS = {
    "Indicadores epidemiológicos": {
      "prevalencia": ["prevalencia"],
      "comorbilidad": ["comorbilidad", "comorbido"],
      "factores asociados": ["factor", "asociad", "determinante"],
      "nivel de identificación": ["identificaci", "detectad", "no identificad"],
      "incidencia / casos": ["incidencia", "numero de casos", "casos"],
      "uso de servicios": ["servicio", "atención", "consulta", "identificado por el médico"],
      "calidad de vida": ["calidad de vida", "autoestima"],
      "discriminación": ["discrimin"],
      "violencia": ["violencia", "maltrato", "abuso"]
    },
    "Trastornos y temas de salud mental": {
      "depresión": ["depres"],
      "ansiedad": ["ansied"],
      "estrés postraumático": ["postraum", "ptsd"],
      "alcohol y sustancias": ["alcohol", "sustancia", "marihuana", "drogas"],
      "conducta suicida": ["suicid"],
      "episodio psicótico": ["psicotic", "psicosis"],
      "cualquier trastorno mental": ["trastorno mental", "trastorno psiquiatric", "salud mental"]
    },
    "Población estudiada": {
      "adultos": ["adulto"],
      "adolescentes": ["adolescent"],
      "niños": ["niños", "infantil"],
      "mujeres": ["mujer", "pareja"],
      "adulto mayor": ["adulto mayor"]
    },
    "Métodos y fuentes": {
      "CIE-10 / CIE-11": ["cie-10", "cie-11", "icd-10", "icd-10"],
      "encuesta poblacional": ["encuesta", "muestra", "hogares"],
      "estudio de replicación / comparativo": ["replicaci", "comparativ", "tendencia"],
      "hospitales y centros de salud": ["hospital", "centros de salud", "minsa"],
      "contexto COVID-19": ["covid", "pandemia"]
    }
  };

  // Extrae los tags de un estudio a partir de su texto completo
  function extraerTags(estudio) {
    const texto = normalizar([
      estudio.titulo, estudio.tema, estudio.resumen_breve, estudio.prevalencia_definicion
    ].join(" "));
    const encontrados = [];
    Object.entries(TAGS).forEach(([grupo, dic]) => {
      Object.entries(dic).forEach(([tag, claves]) => {
        if (claves.some((c) => texto.includes(normalizar(c)))) {
          encontrados.push({ grupo, tag });
        }
      });
    });
    return encontrados;
  }

  // Territorios y trastornos preguntables, derivados de la base
  function vocabularioPreguntas(datos) {
    const territorios = new Set();
    const trastornos = new Set();
    datos.forEach((e) => {
      [e.region, e.ciudad].forEach((campo) =>
        String(campo || "").split(/[\/,]/).forEach((x) => {
          const n = normalizar(x);
          if (n.length >= 4) territorios.add(n);
        }));
      extraerTags(e)
        .filter((t) => t.grupo === "Trastornos y temas de salud mental" && t.tag !== "cualquier trastorno mental")
        .forEach((t) => trastornos.add(t.tag));
    });
    return { territorios: [...territorios].sort(), trastornos: [...trastornos].sort() };
  }

  const chip = (etiqueta, consulta, titulo) =>
    `<button type="button" data-tag="${consulta.replace(/"/g, "&quot;")}" title="${(titulo || ("Consultar: " + consulta)).replace(/"/g, "&quot;")}" ` +
    `style="margin:3px;padding:6px 11px;border:1px solid #0b4d69;border-radius:16px;background:#eef5f8;color:#0b3d5c;cursor:pointer;font-size:0.85rem;">${etiqueta}</button>`;

  function construirHTMLPanel(datos) {
    const voc = vocabularioPreguntas(datos);
    let html = `<div style="border:1px solid #d9e1e7;border-radius:10px;padding:14px 16px;margin:14px 0;background:#fbfdfe;">
      <h3 style="margin:0 0 6px;color:#0b3d5c;">🏷️ Tags epidemiológicos — palabras clave de las investigaciones</h3>
      <p style="margin:0 0 8px;font-size:0.88rem;color:#555;">Toca un territorio para ver todos sus estudios, o un tema e completa con un territorio (ej.: <i>"estrés postraumático en Chiclayo"</i>).</p>
      <p style="margin:6px 0 3px;font-size:0.85rem;"><b>🧭 Cómo preguntar:</b> "prevalencia en X" · "trastorno en X" · "X vs Y" · "tendencia en X"</p>
      <p style="margin:8px 0 3px;font-size:0.85rem;"><b>🗺️ Territorios (${voc.territorios.length}):</b><br/>` +
      voc.territorios.map((t) => chip(t, "prevalencia en " + t)).join("") + `</p>
      <p style="margin:8px 0 3px;font-size:0.85rem;"><b>🧠 Trastornos y temas:</b><br/>` +
      voc.trastornos.map((t) => chip(t, t + " en ", "Escribe un territorio después de 'en'")).join("") + `</p>
      <p style="margin:8px 0 3px;font-size:0.85rem;"><b>🔎 Indicadores:</b><br/>` +
      ["prevalencia", "comorbilidad", "factores asociados", "nivel de identificación", "violencia"]
        .map((t) => chip(t, t + " en ", "Escribe un territorio después de 'en'")).join("") + `</p>
      <details style="margin-top:10px;"><summary style="cursor:pointer;font-size:0.85rem;font-weight:bold;color:#0b3d5c;">📚 Tags por estudio (${datos.length})</summary><ul style="font-size:0.83rem;line-height:1.6;margin:6px 0 0;padding-left:18px;">`;

    datos.forEach((e) => {
      const tags = extraerTags(e);
      html += `<li><b>${e.id}</b> — ${tags.map((t) => t.tag).join(" · ") || "(sin tags)"}</li>`;
    });
    html += `</ul></details></div>`;
    return html;
  }

  function init() {
    const ancla = document.getElementById("epi-respuesta");
    if (!ancla || !ancla.parentNode) {
      console.warn("SIPTags: no se encuentra #epi-respuesta; panel no insertado");
      return;
    }
    if (document.getElementById("epi-tags-panel")) return; // no duplicar
    const datos = (typeof data !== "undefined" && Array.isArray(data)) ? data : [];
    const panel = document.createElement("div");
    panel.id = "epi-tags-panel";
    panel.innerHTML = construirHTMLPanel(datos);
    ancla.parentNode.insertBefore(panel, ancla.nextSibling);

    panel.addEventListener("click", (ev) => {
      const btn = ev.target && ev.target.closest ? ev.target.closest("[data-tag]") : null;
      if (!btn) return;
      const consulta = btn.getAttribute("data-tag") || "";
      const input = document.getElementById("epi-consulta");
      const boton = document.getElementById("epi-buscar");
      const salida = document.getElementById("epi-respuesta");
      if (input) { input.value = consulta; input.focus(); }
      if (consulta.slice(-3) === "en ") return; // tema: el usuario completa el territorio
      if (boton) { boton.click(); return; }
      if (window.SIPEpidemiologia && salida) {
        window.SIPEpidemiologia.render(window.SIPEpidemiologia.consultar(consulta), salida);
      }
    });
  }

  window.SIPTags = { TAGS, extraerTags, vocabularioPreguntas, construirHTMLPanel, init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
