// ============================================================
// MAPA DE INDICADORES POR DEPARTAMENTO v1.0 — SIP Research
// Pinta el mapa del Perú (usa la geometría PERU_DEPARTAMENTOS de
// mapa-peru-departamentos.js, que ya existe en el repo) con un
// coropleta de 4 clases estilo los mapas del MINSA/REUNIS:
//   • "Estudios" → nº de estudios epidemiológicos por departamento
//   • "Prevalencia" → promedio de prevalencia reportada
//   • "Casos REUNIS" → si cargas window.REUNIS_CASOS =
//     [{departamento, anio, casos}, ...] (datos abiertos MINSA).
// 100% aditivo: no modifica ningún otro módulo. Cargar DESPUÉS de
// data.js y de mapa-peru-departamentos.js.
// ============================================================
(function () {
  "use strict";

  const normalizar = (t) =>
    String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

  // Ciudades de la base -> departamento
  const CIUDAD_DEP = {
    "lima": "Lima", "callao": "Callao", "ayacucho": "Ayacucho",
    "cajamarca": "Cajamarca", "huaraz": "Ancash", "cusco": "Cusco",
    "huancayo": "Junín", "chiclayo": "Lambayeque", "arequipa": "Arequipa",
    "moquegua": "Moquegua", "puno": "Puno", "abancay": "Apurímac",
    "iquitos": "Loreto", "pucallpa": "Ucayali", "tacna": "Tacna",
    "trujillo": "La Libertad", "tumbes": "Tumbes", "huancavelica": "Huancavelica"
  };

  const COLORES = ["#fff7bc", "#a8ddb5", "#43a2ca", "#225ea8"]; // amarillo->verde->teal->azul
  const SIN_DATO = "#e5e7eb";
  const LAT_MIN = -19.5, LAT_MAX = 0.5, LON_MIN = -82.5, LON_MAX = -68.5;
  const W = 430, H = 500;
  const px = (lon) => ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W;
  const py = (lat) => H - ((lat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * H;
  const promedio = (l) => l.length ? l.reduce((a, b) => a + b, 0) / l.length : null;

  function departamentosDeEstudio(e) {
    const deps = new Set();
    String(e.ciudad || e.region || "").split(/[\/,]/).forEach((c) => {
      // palabra por palabra: "Lima Metropolitana" -> Lima
      normalizar(c).split(/[^a-z0-9]+/).forEach((palabra) => {
        const dep = CIUDAD_DEP[palabra];
        if (dep) deps.add(normalizar(dep));
      });
    });
    return [...deps];
  }

  function contarPorDepartamento(datos) {
    const out = {};
    datos.forEach((e) => departamentosDeEstudio(e)
      .forEach((d) => { out[d] = (out[d] || 0) + 1; }));
    return out;
  }

  function prevalenciaPorDepartamento(datos) {
    const tmp = {};
    datos.forEach((e) => {
      if (typeof e.prevalencia !== "number") return;
      departamentosDeEstudio(e).forEach((d) => {
        (tmp[d] = tmp[d] || []).push(e.prevalencia);
      });
    });
    const out = {};
    Object.keys(tmp).forEach((d) => { out[d] = promedio(tmp[d]); });
    return out;
  }

  // window.REUNIS_CASOS = [{departamento, anio, casos}, ...] -> último año por dep.
  function casosReunis() {
    if (!Array.isArray(window.REUNIS_CASOS)) return null;
    const porDep = {};
    window.REUNIS_CASOS.forEach((r) => {
      const d = normalizar(r.departamento);
      if (!d) return;
      if (!porDep[d] || r.anio > porDep[d].anio) porDep[d] = { anio: r.anio, casos: r.casos };
    });
    const out = {};
    Object.keys(porDep).forEach((d) => { out[d] = porDep[d].casos; });
    return out;
  }

  function metrica(modo, datos) {
    if (modo === "prevalencia") return prevalenciaPorDepartamento(datos);
    if (modo === "casos") return casosReunis() || {};
    return contarPorDepartamento(datos);
  }

  function calcularCortes(valores, k) {
    const v = valores.filter((x) => x != null);
    if (!v.length) return null;
    const min = Math.min(...v), max = Math.max(...v);
    if (min === max) return [max];
    const paso = (max - min) / k;
    return Array.from({ length: k }, (_, i) => min + paso * (i + 1));
  }

  function claseDe(valor, cortes) {
    if (valor == null || !cortes) return -1;
    let i = 0;
    while (i < cortes.length && valor > cortes[i]) i++;
    return Math.min(i, COLORES.length - 1);
  }

  function pathDepartamento(dep) {
    return (dep.poligonos || []).map((pol) =>
      pol.map((anillo) =>
        anillo.map(([lon, lat], idx) => `${idx ? "L" : "M"}${px(lon).toFixed(1)},${py(lat).toFixed(1)}`).join("") + "Z"
      ).join("")
    ).join("");
  }

  const fmt = (x) => (Math.round(x * 10) / 10).toLocaleString ? (Math.round(x * 100) / 100) : x;

  function construirMapaSVG(datos, geometria, modo) {
    const m = metrica(modo, datos);
    const vals = geometria.map((g) => m[normalizar(g.nombre)]);
    const cortes = calcularCortes(vals, COLORES.length);
    const unidad = modo === "prevalencia" ? "%" : modo === "casos" ? " casos" : " estudios";
    let svg = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Mapa por departamento" style="max-width:100%;height:auto;">`;
    geometria.forEach((dep) => {
      const clave = normalizar(dep.nombre);
      const valor = m[clave];
      const cls = claseDe(valor, cortes);
      const color = cls === -1 ? SIN_DATO : COLORES[cls];
      const d = pathDepartamento(dep);
      svg += `<path d="${d}" fill="${color}" stroke="#ffffff" stroke-width="0.8">` +
             `<title>${dep.nombre}: ${valor == null ? "sin datos" : fmt(valor) + unidad}</title></path>`;
      // etiqueta centrada
      const puntos = (dep.poligonos || []).flat(2);
      if (puntos.length) {
        const cx = puntos.reduce((a, p) => a + px(p[0]), 0) / puntos.length;
        const cy = puntos.reduce((a, p) => a + py(p[1]), 0) / puntos.length;
        svg += `<text x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" font-size="8" text-anchor="middle" fill="#333" pointer-events="none">${dep.nombre}</text>`;
      }
    });
    svg += `</svg>`;
    // leyenda estilo REUNIS
    let leyenda = `<div style="font-size:0.85rem;margin-top:6px;"><b>${modo === "prevalencia" ? "Prevalencia promedio" : modo === "casos" ? "Casos" : "Estudios"}:</b> `;
    if (!cortes) {
      leyenda += `sin datos`;
    } else if (cortes.length === 1) {
      leyenda += `<span style="display:inline-block;width:14px;height:14px;background:${COLORES[3]};margin:0 4px;vertical-align:middle;border:1px solid #ccc;"></span>${fmt(cortes[0])}${unidad}`;
    } else {
      let prev = Math.min(...vals.filter((x) => x != null));
      leyenda += cortes.map((c, i) => {
        const rango = `[${fmt(prev)} - ${fmt(c)}]`;
        prev = c;
        return `<span style="display:inline-block;width:14px;height:14px;background:${COLORES[i]};margin:0 4px 0 10px;vertical-align:middle;border:1px solid #ccc;"></span>${rango}`;
      }).join("");
      leyenda += `<span style="margin-left:10px;color:#777;">■ sin datos</span>`;
    }
    leyenda += `</div>`;
    return svg + leyenda;
  }

  function init() {
    if (typeof PERU_DEPARTAMENTOS === "undefined" || !Array.isArray(PERU_DEPARTAMENTOS)) {
      console.warn("SIPMapa: falta mapa-peru-departamentos.js (PERU_DEPARTAMENTOS)");
      return;
    }
    const datos = (typeof data !== "undefined" && Array.isArray(data)) ? data : [];
    let cont = document.getElementById("mapa-indicadores");
    if (!cont) {
      cont = document.createElement("div");
      cont.id = "mapa-indicadores";
      if (document.body) document.body.appendChild(cont);
    }
    const modos = ["estudios", "prevalencia"];
    if (casosReunis()) modos.push("casos");
    let modo = "estudios";
    function pintar() {
      const botones = modos.map((m) => {
        const activo = m === modo;
        return `<button type="button" data-modo="${m}" style="margin:0 6px 8px 0;padding:7px 14px;border-radius:8px;border:1px solid #0b4d69;cursor:pointer;font-weight:bold;background:${activo ? "#0b4d69" : "#eef5f8"};color:${activo ? "#fff" : "#0b3d5c"};">${m === "estudios" ? "📚 Estudios" : m === "prevalencia" ? "📊 Prevalencia" : "🦠 Casos REUNIS"}</button>`;
      }).join("");
      cont.innerHTML = `<h2 style="color:#0b3d5c;">🗺️ Mapa epidemiológico por departamento</h2><p style="font-size:0.85rem;color:#555;margin:0 0 8px;">Coropleta de 4 clases (estilo MINSA/REUNIS). Pasa el cursor sobre un departamento para ver el valor.</p>` + botones + construirMapaSVG(datos, PERU_DEPARTAMENTOS, modo);
    }
    cont.addEventListener("click", (ev) => {
      const b = ev.target && ev.target.closest ? ev.target.closest("[data-modo]") : null;
      if (!b) return;
      modo = b.getAttribute("data-modo");
      pintar();
    });
    pintar();
  }

  window.SIPMapaIndicadores = {
    contarPorDepartamento, prevalenciaPorDepartamento, casosReunis,
    calcularCortes, claseDe, construirMapaSVG, init
  };

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})();
