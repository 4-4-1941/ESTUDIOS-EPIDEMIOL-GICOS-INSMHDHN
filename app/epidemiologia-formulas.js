// ============================================================
// EPIDEMIOLOGÍA - FÓRMULAS (conexión de calculadoras) v2.0
// Reemplazo del "epidemiologia-formulas.js" original, borrado
// del repositorio, que dejó las 3 calculadoras inoperativas.
//
// v2.0: agrega LEYENDA/INSTRUCCIONES ("¿Cómo usar las
// calculadoras?") con definiciones, ejemplos con datos reales
// de la base SIP y criterios de interpretación de RP/OR.
// Las fórmulas y los IDs de los formularios NO cambiaron:
// es 100% compatible con el HTML actual y no destruye nada.
// Cargar DESPUÉS de motor-epidemiologico.js.
// ============================================================
(function () {
  "use strict";

  const num = (v) => Number(v);
  // Formatea 1000 → "1 000" sin depender de toLocaleString/ICU
  const formatoFactor = (f) => String(f).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // ---------- LEYENDA / INSTRUCCIONES ----------
  const AYUDA_HTML = `
    <div style="font-size:0.92rem;line-height:1.65;color:#334;">
      <h4 style="margin:10px 0 4px;color:#0b3d5c;">1) Frecuencia porcentual — ¿qué proporción de la población presenta el evento?</h4>
      <p style="margin:0 0 8px;"><b>n</b> = número de casos/eventos detectados (ej.: personas con episodio depresivo).
      <b>N</b> = población evaluada (total de encuestados o atendidos).
      Resultado = (n ÷ N) × 100. <i>Ejemplo real de la base (REG-011, Lima 2020): encuesta a 2,639 niños y adolescentes; si se hubieran detectado 264 casos → n=264, N=2639 → 10.0%.</i></p>

      <h4 style="margin:10px 0 4px;color:#0b3d5c;">2) Tabla 2 × 2 — ¿el evento se asocia a la exposición?</h4>
      <table style="border-collapse:collapse;margin:4px 0 8px;font-size:0.85rem;">
        <tr><td style="border:1px solid #999;padding:4px 10px;background:#eef5f8;">a = expuestos CON evento</td>
            <td style="border:1px solid #999;padding:4px 10px;">b = expuestos SIN evento</td></tr>
        <tr><td style="border:1px solid #999;padding:4px 10px;">c = no expuestos CON evento</td>
            <td style="border:1px solid #999;padding:4px 10px;background:#eef5f8;">d = no expuestos SIN evento</td></tr>
      </table>
      <p style="margin:0 0 8px;"><b>RP</b> (razón de prevalencias) = [a/(a+b)] ÷ [c/(c+d)].
      Interpretación: <b>RP = 1</b> → sin asociación; <b>RP &gt; 1</b> → los expuestos tienen mayor probabilidad del evento; <b>RP &lt; 1</b> → la exposición es "protectora".
      <i>Ejemplo real (REG-003, Hospitales Regionales 2015): prevalencia de vida Arequipa 66.1% vs Iquitos 26.6% → RP = 66.1 ÷ 26.6 ≈ 2.48 (casi 2.5 veces más en Arequipa).</i><br/>
      <b>OR</b> (odds ratio) = (a×d) ÷ (b×c). Compara las "chances" del evento; cuando el evento es raro, OR ≈ RP. OR no se calcula si b×c = 0.</p>

      <h4 style="margin:10px 0 4px;color:#0b3d5c;">3) Tasa — eventos por población (o por tiempo)</h4>
      <p style="margin:0;"><b>Casos</b> = eventos ocurridos en el periodo; <b>denominador</b> = habitantes (o años-persona);
      <b>expresar por</b> = 1 000, 10 000 o 100 000 según qué tan raro es el evento.
      Resultado = (casos ÷ denominador) × factor. <i>Ejemplo: 25 casos entre 5,000 habitantes → 5.00 por 1 000.</i></p>
    </div>`;

  function inyectarAyuda() {
    if (!document.querySelector) return; // entorno de prueba sin DOM real
    const grid = document.querySelector(".calculadoras");
    if (!grid || !grid.parentNode) return;
    const yaExiste = document.getElementById("ayuda-formulas");
    if (yaExiste) return;
    const caja = document.createElement("details");
    caja.id = "ayuda-formulas";
    caja.className = "ayuda-formulas";
    caja.style.cssText = "border:1px solid #d9e1e7;border-radius:10px;padding:12px 15px;margin:0 0 15px;background:#fbfdfe;";
    caja.innerHTML = `<summary style="cursor:pointer;font-weight:bold;color:#0b3d5c;font-size:1rem;">📖 ¿Cómo usar las calculadoras? (leyenda e instrucciones)</summary>` + AYUDA_HTML;
    grid.parentNode.insertBefore(caja, grid);
  }

  // ---------- Conexión de calculadoras (igual que v1.0) ----------
  function mostrarError(salida, mensaje) {
    salida.classList.add("error");
    salida.innerHTML = "<strong>Datos inválidos</strong>" + mensaje;
  }
  function mostrar(salida, html) {
    salida.classList.remove("error");
    salida.innerHTML = html;
  }

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

  function conectarAsociacion() {
    const form = document.getElementById("form-asociacion");
    const salida = document.getElementById("resultado-asociacion");
    if (!form || !salida || typeof razonPrevalencias !== "function") return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const a = num(form.elements.a.value), b = num(form.elements.b.value);
      const c = num(form.elements.c.value), d = num(form.elements.d.value);
      if (![a, b, c, d].every((v) => Number.isInteger(v) && v >= 0)) {
        mostrarError(salida, "Los cuatro conteos (a, b, c, d) deben ser enteros ≥ 0.");
        return;
      }
      const rp = razonPrevalencias(a, b, c, d);
      const or = oddsRatio(a, b, c, d);
      let html = "";
      if (rp === null) {
        html += "<strong>RP: no calculable</strong>(prevalencia de no expuestos = 0 o un total = 0). ";
      } else {
        const inter = rp > 1.1 ? "mayor probabilidad de evento en expuestos"
          : rp < 0.9 ? "menor probabilidad de evento en expuestos"
          : "probabilidad similar en ambos grupos";
        html += `<strong>RP = ${rp.toFixed(2)}</strong>${inter}. `;
      }
      html += or === null
        ? "<strong>OR: no calculable</strong>(b × c = 0)."
        : `<strong>OR = ${or.toFixed(2)}</strong>(odds ratio crudo).`;
      mostrar(salida, html);
    });
  }

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
      mostrar(salida,
        `<strong>${tasa(casos, denominador, factor).toFixed(2)} por ${formatoFactor(factor)}</strong>(${casos} casos / ${denominador})`);
    });
  }

  function init() {
    inyectarAyuda();
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
