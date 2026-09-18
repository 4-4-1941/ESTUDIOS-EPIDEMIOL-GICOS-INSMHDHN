(function() {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const inputConsulta = document.getElementById("epi-consulta");
    const contenedorRespuesta = document.getElementById("epi-resultado") || document.getElementById("epi-respuesta");

    if (!inputConsulta) return;

    const baseDatos = [
      ...(window.ESTUDIOS_EPIDEMIOLOGICOS || []),
      ...(window.CORPUS_CIENTIFICO_2017 || [])
    ];

    if (typeof window.MotorNarrativo === "undefined") {
      if (contenedorRespuesta) {
        contenedorRespuesta.innerHTML = `<div style="color:#b91c1c; font-size:13px; padding:10px; background:#fee2e2; border-radius:6px;">Error de sistema: motor-narrativo.js no se encuentra disponible.</div>`;
      }
      return;
    }

    const motor = new window.MotorNarrativo(baseDatos);

    const ejecutarConsulta = () => {
      const texto = inputConsulta.value.trim();
      if (texto.length < 2) {
        if (contenedorRespuesta) contenedorRespuesta.innerHTML = "";
        return;
      }

      let region = "";
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
          htmlDetalles = `
            <details style="margin-top:10px; cursor:pointer;" open>
              <summary style="font-weight:600; color:#1d4ed8;">📚 Fuentes epidemiológicas identificadas (${detalles.length})</summary>
              <ul style="padding-left:18px; margin-top:8px; font-size:13px;">
          `;
          detalles.forEach(d => {
            htmlDetalles += `<li style="margin-bottom:4px;"><strong>${d.titulo}</strong> — ${d.region} (${d.anio}) · Prevalencia: <strong>${d.prevalencia}%</strong></li>`;
          });
          htmlDetalles += `</ul></details>`;
        }

        contenedorRespuesta.innerHTML = `
          <div style="padding:14px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px;">
            <p style="margin:0 0 8px 0; font-size:14px; line-height:1.5;">${narrativa}</p>
            ${htmlDetalles}
          </div>
        `;
      }
    };

    inputConsulta.addEventListener("input", ejecutarConsulta);
  });
})();
