// ============================================
// CONSULTANTE EPIDEMIOLÓGICO - VERSIÓN COMPLETA
// Desplegables + Narrativa automática + Búsqueda
// Funciona con data.js real - 14 estudios
// ============================================

(function() {
  "use strict";

  // CLASE CONSULTANTE
  class ConsultanteEpidemiologico {
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

    // BUSCA: región + trastorno en datos reales
    buscar(region, trastorno) {
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

    // GENERA NARRATIVA (PROMPT MAESTRO DE RICHARD)
    generar(region, trastorno) {
      const estudios = this.buscar(region, trastorno);

      if (estudios.length === 0) {
        return `No hay estudios documentados para "${trastorno}" en "${region}".`;
      }

      // Calcula prevalencias
      const prevs = estudios
        .map(e => Number(e.prevalencia))
        .filter(p => !isNaN(p));

      if (prevs.length === 0) {
        return `Se encontraron ${estudios.length} estudio(s) en "${region}", pero sin prevalencia cuantificada.`;
      }

      const promedio = (prevs.reduce((a, b) => a + b, 0) / prevs.length).toFixed(1);
      
      // Clasifica magnitud
      let magnitud = "indefinida";
      if (promedio < 5) magnitud = "baja";
      else if (promedio <= 15) magnitud = "media";
      else magnitud = "alta";

      // Extrae años
      const años = estudios
        .map(e => {
          const a = e.anio_estudio;
          return typeof a === "string" ? parseInt(a.split("/")[0]) : Number(a);
        })
        .filter(a => !isNaN(a))
        .sort((a, b) => a - b);

      const periodo = años.length > 1
        ? `entre ${años[0]} y ${años[años.length - 1]}`
        : `en ${años[0]}`;

      // NARRATIVA SEGÚN PROMPT MAESTRO
      const narrativa = 
        `Los indicadores muestran que la ${trastorno} en ${region} ${periodo} ` +
        `fue ${magnitud} (${promedio}%), siendo la población de adultos la más documentada. ` +
        `La evidencia proviene de ${estudios.length} estudio(s) epidemiológico(s) ` +
        `realizados entre ${años[0]} y ${años[años.length - 1]}.`;

      return narrativa;
    }

    // Obtiene regiones únicas
    obtenerRegiones() {
      const regiones = new Set();
      this.datos.forEach(e => {
        if (e.region) regiones.add(e.region);
        if (e.ciudad) {
          e.ciudad.split("/").forEach(c => {
            const ciudad = c.trim();
            if (ciudad) regiones.add(ciudad);
          });
        }
      });
      return Array.from(regiones).sort();
    }

    // Obtiene trastornos (detecta en texto)
    obtenerTrastornos() {
      const trastornos = new Set();
      const palabrasClave = {
        "depresión": ["depresión", "depresivo", "episodio depresivo"],
        "ansiedad": ["ansiedad", "generalizada"],
        "estrés postraumático": ["estrés postraumático", "tept"],
        "sustancias": ["sustancia", "alcohol", "droga", "marihuana"],
        "trastorno mental": ["trastorno mental", "psiquiátrico"]
      };

      this.datos.forEach(e => {
        const texto = (
          (e.prevalencia_definicion || "") + " " +
          (e.resumen_breve || "")
        ).toLowerCase();

        Object.keys(palabrasClave).forEach(trastorno => {
          if (palabrasClave[trastorno].some(p => texto.includes(p))) {
            trastornos.add(trastorno);
          }
        });
      });

      return Array.from(trastornos).sort();
    }
  }

  // INTERFAZ Y EVENTOS
  function inicializar() {
    const datos = Array.isArray(window.data) ? window.data : [];
    if (datos.length === 0) {
      console.error("data.js no cargó correctamente");
      return;
    }

    const consultante = new ConsultanteEpidemiologico(datos);
    
    // Elementos DOM
    const selectRegion = document.getElementById("epi-region");
    const selectTrastorno = document.getElementById("epi-trastorno");
    const btnConsultar = document.getElementById("epi-consultar");
    const divRespuesta = document.getElementById("epi-respuesta");

    if (!selectRegion || !selectTrastorno || !btnConsultar || !divRespuesta) {
      console.error("Elementos del consultante no encontrados");
      return;
    }

    // Pobla desplegables
    poblarSelect(selectRegion, consultante.obtenerRegiones());
    poblarSelect(selectTrastorno, consultante.obtenerTrastornos());

    // Evento: buscar
    const buscar = () => {
      const region = selectRegion.value;
      const trastorno = selectTrastorno.value;

      if (!region || !trastorno) {
        divRespuesta.innerHTML = `<p class="epi-instrucciones">Selecciona región y trastorno</p>`;
        return;
      }

      const estudios = consultante.buscar(region, trastorno);
      const narrativa = consultante.generar(region, trastorno);

      mostrarResultado(narrativa, estudios, divRespuesta);
    };

    btnConsultar.addEventListener("click", buscar);
    
    // Busca automática al cambiar selects
    selectRegion.addEventListener("change", buscar);
    selectTrastorno.addEventListener("change", buscar);

    // Instrucciones iniciales
    divRespuesta.innerHTML = `<p class="epi-instrucciones">Selecciona región y trastorno para consultar</p>`;
  }

  function poblarSelect(select, opciones) {
    opciones.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
      select.appendChild(option);
    });
  }

  function mostrarResultado(narrativa, estudios, nodo) {
    const esc = v => String(v || "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

    let html = `<div class="epi-resultado"><p class="epi-narrativa">${esc(narrativa)}</p>`;

    if (estudios.length > 0) {
      html += `<details class="epi-detalles"><summary>📚 Estudios encontrados (${estudios.length})</summary><ul class="epi-lista">`;
      estudios.forEach(e => {
        html += `<li>
          <strong>${esc(e.titulo)}</strong><br/>
          <small>
            <strong>${esc(e.region)}</strong> · 
            ${esc(e.ciudad)} · 
            ${e.anio_estudio} · 
            Prevalencia: <strong>${e.prevalencia || "N/A"}%</strong>
            ${e.url ? ` · <a href="${esc(e.url)}" target="_blank" rel="noopener">Ver</a>` : ''}
          </small>
        </li>`;
      });
      html += `</ul></details>`;
    }

    html += `</div>`;
    nodo.innerHTML = html;
  }

  // Inicia al cargar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar);
  } else {
    inicializar();
  }

})();
