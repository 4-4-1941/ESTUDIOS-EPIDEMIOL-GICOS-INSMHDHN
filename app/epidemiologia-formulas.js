// ============================================================
// EPIDEMIOLOGÍA - FÓRMULAS (conexión de calculadoras)
// Reemplazo del "epidemiologia-formulas.js" original, que fue
// borrado del repositorio y dejó las 3 calculadoras de
// analisis.html inoperativas (botones sin respuesta).
//
// Conecta los formularios del HTML con las funciones puras de
// motor-epidemiologico.js: frecuencia(), razonPrevalencias(),
// oddsRatio() y tasa(). Cargar DESPUÉS de motor-epidemiologico.js.
// ============================================================
(function () {
  "use strict";

  const num = (v) => Number(v);
  // Formatea 1000 → "1 000" sin depender de toLocaleString/ICU
  const formatoFactor = (f) => String(f).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  function mostrarError(salida, mensaje) {
    salida.classList.add("error");
    salida.innerHTML = "<strong>Datos inválidos</strong>" + mensaje;
  }
  function mostrar(salida, html) {
    salida.classList.remove("error");
    salida.innerHTML = html;
  }

  // ---- 1) Frecuencia porcentual: n / N ----
  function conectarFrecuencia() {
    const form = document.getElementById("form-frecuencia");
    const salida = document.getElementById("resultado-frecuencia");
    if (!form || !salida || typeof frecuencia !== "function") return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const n = num(form.elements.n.value);
      const N = num(form.elements.N.value);
      if (!Number.isInteger(n) || !Number.isInteger(N) || n < 0 || N < 1 || n > N) {
        mostrarError(salida, "Se requiere 0 ≤ n ≤ N, con N ≥ 1 (enteros).");
        return;
      }
      mostrar(salida, `<strong>${frecuencia(n, N).toFixed(2)}%</strong>(${n} eventos de ${N} evaluados)`);
    });
  }

  // ---- 2) Tabla 2×2: RP y OR ----
  function conectarAsociacion() {
    const form = document.getElementById("form-asociacion");
    const salida = document.getElementById("resultado-asociacion");
    if (!form || !salida || typeof razonPrevalencias !== "function") return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const a = num(form.elements.a.value);
      const b = num(form.elements.b.value);
      const c = num(form.elements.c.value);
      const d = num(form.elements.d.value);
      if (![a, b, c, d].every((v) => Number.isInteger(v) && v >= 0)) {
        mostrarError(salida, "Los cuatro conteos (a, b, c, d) deben ser enteros ≥ 0.");
        return;
      }
      const rp = razonPrevalencias(a, b, c, d);
      const or = oddsRatio(a, b, c, d);
      let html = "";
      if (rp === null) {
        html += "<strong>RP: no calculable</strong>(la prevalencia en no expuestos es 0 o un total es 0). ";
      } else {
        const inter = rp > 1.1 ? "mayor probabilidad de evento en expuestos"
          : rp < 0.9 ? "menor probabilidad de evento en expuestos"
          : "probabilidad similar en ambos grupos";
        html += `<strong>RP = ${rp.toFixed(2)}</strong>${inter}. `;
      }
      if (or === null) {
        html += "<strong>OR: no calculable</strong>(b × c = 0).";
      } else {
        html += `<strong>OR = ${or.toFixed(2)}</strong>(odds ratio crudo).`;
      }
      mostrar(salida, html);
    });
  }

  // ---- 3) Tasa por factor poblacional ----
  function conectarTasa() {
    const form = document.getElementById("form-tasa");
    const salida = document.getElementById("resultado-tasa");
    if (!form || !salida || typeof tasa !== "function") return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const casos = num(form.elements.casos.value);
      const denominador = num(form.elements.denominador.value);
      const factor = num(form.elements.factor.value);
      if (!Number.isInteger(casos) || casos < 0 || !(denominador > 0) || !(factor > 0)) {
        mostrarError(salida, "Casos enteros ≥ 0, denominador > 0 y factor > 0.");
        return;
      }
      const valor = tasa(casos, denominador, factor);
      mostrar(salida,
        `<strong>${valor.toFixed(2)} por ${formatoFactor(factor)}</strong>(${casos} casos / ${denominador})`);
    });
  }

  function init() {
    conectarFrecuencia();
    conectarAsociacion();
    conectarTasa();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
