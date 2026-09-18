// ============================================
// NÚCLEO - CONSULTANTE EPIDEMIOLÓGICO v2.2
// Ruta: core/consulta-epidemiologica.js
// ============================================

(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const inputConsulta = document.getElementById("epi-consulta");
    const contenedorRespuesta = document.getElementById("epi-resultado") || document.getElementById("epi-respuesta");

    if (!inputConsulta) return;

    const baseDatos = window.ESTUDIOS_EPIDEMIOLOGICOS || window.datos || [];

    if (typeof window.MotorNarrativo === "undefined") {
      console.error("Error: MotorNarrativo no está cargado. Revisa el orden de tus scripts en el HTML.");
      return;
    }

    const motor = new window.MotorNarrativo(baseDatos);

    inputConsulta.addEventListener("input", (e) => {
      const texto = e.target.value.trim();
      if (texto.length < 3) return;

      let region = "Lima";
      let trastorno = texto;

      if (texto.toLowerCase().includes(" en ")) {
        const partes = texto.split(/ en /i);
        trastorno = partes[0].trim();
        region = partes[1].trim();
      }

      const narrativa = motor.generarNarrativa(region, trastorno);
      const detalles = motor.obtenerDetalles(region, trastorno);

      if (contenedorRespuesta) {
        let htmlDetalles = "";
        if (detalles.length > 0) {
          htmlDetalles = `<details style="margin-top:10px; cursor:pointer;"><summary>📚 Estudios encontrados (${detalles.length})</summary><ul style="padding-left:15px; font-size:12px;">`;
          detalles.forEach(d => {
            htmlDetalles += `<li><strong>${d.titulo}</strong> — ${d.region} (${d.anio}) · Prevalencia: ${d.prevalencia}%</li>`;
          });
          htmlDetalles += `</ul></details>`;
        }

        contenedorRespuesta.innerHTML = `
          <div style="padding: 12px; background: #f8f9fa; border-radius: 6px; border: 1px solid #ddd;">
            <p style="margin: 0 0 8px 0; font-style: italic;">${narrativa}</p>
            ${htmlDetalles}
          </div>
        `;
      }
    });
  });

})();
