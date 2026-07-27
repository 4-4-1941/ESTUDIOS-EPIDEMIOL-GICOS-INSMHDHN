// ============================================================
// SIP RESEARCH - Motor Fase II
// Mapas dinámicos (esquemáticos), series temporales,
// curvas históricas y proyección simple.
//
// Se apoya en variables ya calculadas por analisis.js
// (data, conteoAnios, conteoRegiones, minimo, maximo,
// totalEstudios), igual que motor-sip.js y
// motor-epidemiologico.js. Por eso este script debe cargarse
// DESPUÉS de esos tres en el HTML.
//
// Filosofía: cero librerías externas (Leaflet, Chart.js, etc.)
// para mantener el proyecto como PWA estática sin build step,
// tal como pide el documento de estado del proyecto. Todo el
// dibujo se hace con SVG generado a mano.
// ============================================================

function crearBloqueFase2(titulo){
  const bloque = document.createElement("div");
  bloque.className = "bloque-fase2";
  bloque.innerHTML = `<h2>${titulo}</h2>`;
  return bloque;
}

// ------------------------------------------------------------
// 1) MAPA DE DEPARTAMENTOS DEL PERÚ
// ------------------------------------------------------------
// El contorno real de los 25 departamentos proviene del
// shapefile oficial del INEI (archivo PERU_DEPARTAMENTOS,
// cargado desde mapa-peru-departamentos.js, que debe incluirse
// en el HTML ANTES de este script). La geometría fue
// simplificada con Douglas-Peucker (tolerancia ~2 km) para
// que el archivo sea liviano; sigue siendo el trazado real
// del país, no una proyección aproximada de puntos.
// Se sigue sin usar librerías externas (Leaflet, etc.): el
// contorno se dibuja como <path> SVG con la misma función
// proyectarCoordenada() que ya ubicaba los puntos de ciudades.

const coordenadasCiudad = {
  "Lima": [-12.05, -77.04],
  "Callao": [-12.06, -77.15],
  "Ayacucho": [-13.16, -74.22],
  "Cajamarca": [-7.16, -78.51],
  "Huaraz": [-9.53, -77.53],
  "Cusco": [-13.53, -71.97],
  "Huancayo": [-12.07, -75.21],
  "Chiclayo": [-6.77, -79.84],
  "Arequipa": [-16.40, -71.54],
  "Moquegua": [-17.20, -70.93],
  "Puno": [-15.84, -70.02],
  "Abancay": [-13.63, -72.88],
  "Iquitos": [-3.75, -73.25],
  "Tacna": [-18.01, -70.25],
  "Trujillo": [-8.11, -79.02],
  "Tumbes": [-3.57, -80.45],
  "Huancavelica": [-12.78, -74.97],
  "Pucallpa": [-8.38, -74.55],
  "Perú": [-9.19, -75.02]
};

const LAT_MIN = -18.5, LAT_MAX = -0.5;
const LON_MIN = -81.5, LON_MAX = -68.5;
const MAPA_ANCHO = 420, MAPA_ALTO = 480;

function proyectarCoordenada(lat, lon){
  const x = ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * MAPA_ANCHO;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * MAPA_ALTO;
  return [x, y];
}

function contornoDepartamentosSVG(){
  // PERU_DEPARTAMENTOS viene de mapa-peru-departamentos.js.
  // Si ese script no se cargó, se degrada sin romper el resto del mapa.
  if (typeof PERU_DEPARTAMENTOS === "undefined") return "";

  let paths = "";
  PERU_DEPARTAMENTOS.forEach(dep => {
    let d = "";
    dep.poligonos.forEach(poligono => {
      poligono.forEach(anillo => {
        const puntos = anillo.map(([lon, lat]) => {
          const [x, y] = proyectarCoordenada(lat, lon);
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        });
        d += `M ${puntos.join(" L ")} Z `;
      });
    });
    paths += `<path d="${d}" fill="#dbe6ee" stroke="#7a94a6" stroke-width="0.6">
      <title>${dep.nombre}</title>
      </path>`;
  });
  return paths;
}

function primeraCiudadValida(ciudadStr){
  if (!ciudadStr) return null;
  const partes = ciudadStr.split("/").map(s => s.trim());
  for (const p of partes){
    if (coordenadasCiudad[p]) return p;
  }
  return null;
}

function mapaEsquematico(){
  // Agrupar estudios por la primera ciudad reconocible
  const porCiudad = {};
  const sinUbicar = [];

  data.forEach(est => {
    const ciudad = primeraCiudadValida(est.ciudad);
    if (ciudad){
      if (!porCiudad[ciudad]) porCiudad[ciudad] = { total: 0, conPrevalencia: 0 };
      porCiudad[ciudad].total++;
      if (est.prevalencia !== undefined && est.prevalencia !== null) {
        porCiudad[ciudad].conPrevalencia++;
      }
    } else {
      sinUbicar.push(est.id);
    }
  });

  const maxEnCiudad = Math.max(...Object.values(porCiudad).map(c => c.total), 1);

  let puntos = "";
  let etiquetas = "";

  Object.entries(porCiudad).forEach(([ciudad, info]) => {
    const [lat, lon] = coordenadasCiudad[ciudad];
    const [x, y] = proyectarCoordenada(lat, lon);
    const radio = 6 + (info.total / maxEnCiudad) * 14;
    const color = info.conPrevalencia > 0 ? "#0b3d5c" : "#9db4c0";

    puntos += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radio.toFixed(1)}"
      fill="${color}" fill-opacity="0.75" stroke="white" stroke-width="1.5">
      <title>${ciudad}: ${info.total} estudio(s)${info.conPrevalencia ? ', ' + info.conPrevalencia + ' con prevalencia registrada' : ''}</title>
      </circle>`;

    etiquetas += `<text x="${x.toFixed(1)}" y="${(y - radio - 4).toFixed(1)}"
      font-size="10" text-anchor="middle" fill="#0b3d5c">${ciudad}</text>`;
  });

  const bloque = crearBloqueFase2("🗺️ Mapa de Estudios por Departamento (Fase II)");
  const contorno = contornoDepartamentosSVG();

  bloque.innerHTML += `
    <p style="font-size:0.85rem;color:#555;">
      Contorno de departamentos según shapefile oficial del INEI. El tamaño del círculo indica
      cuántos estudios hay en esa ciudad; el color oscuro indica que al menos uno de ellos ya
      tiene un dato de prevalencia cargado.
    </p>
    <svg viewBox="0 0 ${MAPA_ANCHO} ${MAPA_ALTO}" width="100%" style="max-width:420px;background:#eef3f7;border-radius:8px;">
      ${contorno}
      ${puntos}
      ${etiquetas}
    </svg>
    ${sinUbicar.length ? `<p style="font-size:0.8rem;color:#999;">Sin coordenada asignada aún: ${sinUbicar.join(", ")}</p>` : ""}
  `;

  document.body.appendChild(bloque);
}

// ------------------------------------------------------------
// 2) SERIE TEMPORAL (estudios por año de EJECUCIÓN, no de publicación)
// ------------------------------------------------------------
function serieTemporal(){
  const anios = Object.keys(conteoAnios).map(Number).sort((a,b) => a-b);
  const valores = anios.map(a => conteoAnios[a]);
  const maxValor = Math.max(...valores, 1);

  const anchoBarra = 28;
  const espacio = 10;
  const alto = 160;
  const ancho = anios.length * (anchoBarra + espacio) + espacio;

  let barras = "";
  anios.forEach((anio, i) => {
    const valor = conteoAnios[anio];
    const alturaBarra = (valor / maxValor) * (alto - 30);
    const x = espacio + i * (anchoBarra + espacio);
    const y = alto - alturaBarra - 20;

    barras += `
      <rect x="${x}" y="${y}" width="${anchoBarra}" height="${alturaBarra}" fill="#0b3d5c" rx="3"></rect>
      <text x="${x + anchoBarra/2}" y="${y - 4}" font-size="10" text-anchor="middle" fill="#0b3d5c">${valor}</text>
      <text x="${x + anchoBarra/2}" y="${alto - 6}" font-size="9" text-anchor="middle" fill="#555">${anio}</text>
    `;
  });

  const bloque = crearBloqueFase2("📈 Serie Temporal de Estudios (por año de ejecución)");
  bloque.innerHTML += `
    <svg viewBox="0 0 ${ancho} ${alto}" width="100%" style="max-width:${ancho}px;background:#f9fafb;border-radius:8px;">
      ${barras}
    </svg>
  `;
  document.body.appendChild(bloque);
}

// ------------------------------------------------------------
// 3) CURVA HISTÓRICA (cobertura acumulada)
// ------------------------------------------------------------
function curvaHistorica(){
  const anios = [];
  for (let a = minimo; a <= maximo; a++) anios.push(a);

  let acumulado = 0;
  const puntosAcumulados = anios.map(anio => {
    acumulado += (conteoAnios[anio] || 0);
    return acumulado;
  });

  const maxAcumulado = Math.max(...puntosAcumulados, 1);
  const ancho = 500, alto = 180, margen = 30;

  const puntosSVG = anios.map((anio, i) => {
    const x = margen + (i / (anios.length - 1 || 1)) * (ancho - margen * 2);
    const y = alto - margen - (puntosAcumulados[i] / maxAcumulado) * (alto - margen * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const bloque = crearBloqueFase2("📊 Curva Histórica de Cobertura Acumulada");
  bloque.innerHTML += `
    <p style="font-size:0.85rem;color:#555;">
      Número total de estudios acumulados en el catálogo, año a año, desde ${minimo} hasta ${maximo}.
    </p>
    <svg viewBox="0 0 ${ancho} ${alto}" width="100%" style="max-width:${ancho}px;background:#f9fafb;border-radius:8px;">
      <polyline points="${puntosSVG}" fill="none" stroke="#0b3d5c" stroke-width="2"></polyline>
      <text x="${margen}" y="${alto - 8}" font-size="10" fill="#555">${minimo}</text>
      <text x="${ancho - margen - 20}" y="${alto - 8}" font-size="10" fill="#555">${maximo}</text>
      <text x="${margen}" y="${margen}" font-size="10" fill="#555">${maxAcumulado} estudios</text>
    </svg>
  `;
  document.body.appendChild(bloque);
}

// ------------------------------------------------------------
// 4) PROYECCIÓN SIMPLE (regresión lineal ingenua)
// ------------------------------------------------------------
// ADVERTENCIA METODOLÓGICA: esto es una regresión lineal simple
// sobre el conteo acumulado de estudios por año. NO es un
// modelo epidemiológico ni una predicción validada: sirve solo
// como indicador orientativo de tendencia de producción
// científica, no de prevalencia ni de morbilidad futura.
function regresionLineal(puntosXY){
  const n = puntosXY.length;
  const sumX = puntosXY.reduce((s, p) => s + p[0], 0);
  const sumY = puntosXY.reduce((s, p) => s + p[1], 0);
  const sumXY = puntosXY.reduce((s, p) => s + p[0]*p[1], 0);
  const sumX2 = puntosXY.reduce((s, p) => s + p[0]*p[0], 0);
  const pendiente = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX);
  const intercepto = (sumY - pendiente*sumX) / n;
  return { pendiente, intercepto };
}

function prediccionSimple(){
  const anios = [];
  for (let a = minimo; a <= maximo; a++) anios.push(a);

  let acumulado = 0;
  const puntosXY = anios.map(anio => {
    acumulado += (conteoAnios[anio] || 0);
    return [anio, acumulado];
  });

  const { pendiente, intercepto } = regresionLineal(puntosXY);
  const anioSiguiente = maximo + 1;
  const proyeccion3 = maximo + 3;
  const valorSiguiente = Math.max(0, pendiente*anioSiguiente + intercepto);
  const valorProyeccion3 = Math.max(0, pendiente*proyeccion3 + intercepto);

  const bloque = crearBloqueFase2("🔮 Proyección Simple (tendencia lineal)");
  bloque.innerHTML += `
    <p style="font-size:0.85rem;color:#b45309;background:#fff7ed;padding:8px;border-radius:6px;">
      ⚠️ Esto es una regresión lineal ingenua sobre el conteo acumulado de estudios
      por año, con ${puntosXY.length} puntos de datos. NO es un modelo epidemiológico:
      solo estima la tendencia de producción científica del catálogo, no prevalencia
      futura de ningún trastorno.
    </p>
    <table border="1" cellpadding="6">
      <tr><td>Estudios acumulados proyectados para ${anioSiguiente}</td><td>${valorSiguiente.toFixed(1)}</td></tr>
      <tr><td>Estudios acumulados proyectados para ${proyeccion3}</td><td>${valorProyeccion3.toFixed(1)}</td></tr>
      <tr><td>Pendiente (estudios nuevos por año, promedio)</td><td>${pendiente.toFixed(3)}</td></tr>
    </table>
  `;
  document.body.appendChild(bloque);
}

// ------------------------------------------------------------
// Ejecutar Fase II
// ------------------------------------------------------------
mapaEsquematico();
serieTemporal();
curvaHistorica();
prediccionSimple();

console.log("MOTOR FASE II CARGADO");
