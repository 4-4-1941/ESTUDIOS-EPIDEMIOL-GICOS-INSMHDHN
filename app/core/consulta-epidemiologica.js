// ============================================
// CONSULTANTE EPIDEMIOLÓGICO v2.2
// CORREGIDO: integración mejorada con motor-narrativo
// Autor: Claude | Licencia: MIT
// ============================================

(function(){
"use strict";

// Accede a data.js
const obtenerDatos = () => {
  if (typeof window.data !== "undefined" && Array.isArray(window.data)) {
    return window.data;
  }
  console.warn("data.js no está cargado correctamente");
  return [];
};

// Identifica región desde consulta
function identificarRegion(q) {
  const regiones = ["lima", "ayacucho", "cusco", "huancayo", "sierra", "costa", "selva", "arequipa", "moquegua", "puno", "chiclayo", "callao", "iquitos", "pucallpa", "tacna", "tumbes", "trujillo", "abancay", "huancavelica"];
  const qNorm = String(q || "").toLowerCase();
  return regiones.find(r => qNorm.includes(r)) || "";
}

// Identifica trastorno desde consulta
function identificarTrastorno(q) {
  const qNorm = String(q || "").toLowerCase();
  if (qNorm.includes("depres")) return "depresión";
  if (qNorm.includes("ansiedad")) return "ansiedad";
  if (qNorm.includes("sustancia") || qNorm.includes("alcohol")) return "sustancia";
  if (qNorm.includes("suicid") || qNorm.includes("conducta")) return "conducta suicida";
  if (qNorm.includes("tdah") || qNorm.includes("déficit")) return "TDAH";
  if (qNorm.includes("psiquiátr") || qNorm.includes("trastorno mental")) return "trastorno mental";
  return "";
}

// Identifica tipo de consulta
function identificarTipo(q) {
  const qNorm = String(q || "").toLowerCase();
  if (qNorm.includes("vs") || qNorm.includes("versus") || qNorm.includes("comparar")) return "comparacion";
  if (qNorm.includes("tendencia") || qNorm.includes("cambio") || qNorm.includes("evolución")) return "tendencia";
  return "general";
}

// Extrae dos regiones para comparación
function extraerVariasRegiones(q) {
  const regiones = ["lima", "ayacucho", "cusco", "huancayo", "sierra", "costa", "selva", "arequipa", "moquegua", "puno", "chiclayo"];
  const qNorm = String(q || "").toLowerCase();
  return regiones.filter(r => qNorm.includes(r));
}

// CONSULTA PRINCIPAL
function consultar(texto) {
  if (!texto || texto.trim() === "") {
    return {
      narrativa: "Escribe una consulta (ej: 'depresión en Lima' o 'ansiedad Ayacucho').",
      estudios: [],
      tipo: "vacio"
    };
  }

  const region = identificarRegion(texto);
  const trastorno = identificarTrastorno(texto);
  const tipo = identificarTipo(texto);

  if (!region || !trastorno) {
    return {
      narrativa: `Por favor especifica región y trastorno. Ejemplo: "depresión en Lima", "ansiedad en Ayacucho".`,
      estudios: [],
      tipo: "incompleto"
    };
  }

  const datos = obtenerDatos();
  if (datos.length === 0) {
    return {
      narrativa: "⚠️ Error: No se encuentran datos. Verifica que data.js esté cargado.",
      estudios: [],
      tipo: "error"
    };
  }

  // Usa MotorNarrativo si existe
  if (typeof MotorNarrativo === "undefined") {
    return {
      narrativa: "⚠️ Error: motor-narrativo.js no cargó. Verifica el orden de scripts.",
      estudios: [],
      tipo: "error"
    };
  }

  const motor = new MotorNarrativo(datos);
  let resultado = {};

  try {
    if (tipo === "comparacion") {
      const regiones = extraerVariasRegiones(texto);
      if (regiones.length >= 2) {
        resultado.narrativa = motor.compararRegiones(regiones[0], regiones[1], trastorno);
        resultado.tipo = "comparacion";
      } else {
        resultado.narrativa = `Para comparar, especifica dos regiones (ej: "depresión Lima vs Ayacucho").`;
        resultado.tipo = "error";
      }
    } else if (tipo === "tendencia") {
      resultado.narrativa = motor.analizarTendencia(region, trastorno);
      resultado.tipo = "tendencia";
    } else {
      resultado.narrativa = motor.generarNarrativa(region, trastorno);
      resultado.tipo = "general";
    }

    resultado.estudios = motor.obtenerDetalles(region, trastorno);
  } catch (error) {
    console.error("Error en consultante:", error);
    resultado.narrativa = `❌ Error al procesar consulta: ${error.message}`;
    resultado.estudios = [];
    resultado.tipo = "error";
  }

  return resultado;
}

// RENDERIZA RESULTADO EN DOM
function render(resultado, nodo) {
  if (!nodo || !resultado.narrativa) return;

  const esc = v => String(v || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

  let html = `<article class="epi-resultado">`;

  // Narrativa principal
  html += `<p class="epi-narrativa">${esc(resultado.narrativa)}</p>`;

  // Detalles de estudios si hay
  if (resultado.estudios && resultado.estudios.length > 0) {
    html += `<details class="epi-detalles">
      <summary>📚 Estudios encontrados (${resultado.estudios.length})</summary>
      <ul class="epi-lista-estudios">`;

    resultado.estudios.forEach(e => {
      html += `<li>
        <strong>${esc(e.titulo)}</strong><br/>
        <small>
          <strong>${esc(e.region || "")}</strong> · 
          ${esc(e.ciudad || "")} · 
          ${e.anio || "s/f"} · 
          Prevalencia: <strong>${e.prevalencia || "N/A"}%</strong>
          ${e.url ? ` · <a href="${esc(e.url)}" target="_blank" rel="noopener">Ver fuente</a>` : ''}
        </small>
      </li>`;
    });

    html += `</ul></details>`;
  }

  html += `</article>`;
  nodo.innerHTML = html;
}

// INICIALIZACIÓN
function init() {
  const input = document.getElementById("epi-consulta");
  const btn = document.getElementById("epi-buscar");
  const output = document.getElementById("epi-respuesta");

  if (!input || !btn || !output) {
    console.warn("No se encuentran elementos del consultante en el DOM");
    return;
  }

  const ejecutar = () => {
    const resultado = consultar(input.value);
    render(resultado, output);
  };

  btn.addEventListener("click", ejecutar);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      ejecutar();
    }
  });

  // Muestra instrucciones iniciales
  output.innerHTML = `
    <p class="epi-instrucciones">
      <strong>🔬 Consultante Epidemiológico</strong><br/>
      <strong>Ejemplos de búsqueda:</strong><br/>
      • "depresión en Lima"<br/>
      • "ansiedad Ayacucho"<br/>
      • "depresión Lima vs Cusco"<br/>
      • "tendencia depresión Lima"
    </p>
  `;
}

// Exporta funciones públicas
window.SIPEpidemiologia = {
  consultar,
  render,
  init
};

// Inicia cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

})();
