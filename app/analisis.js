const totalEstudios = data.length;

document.getElementById("total-estudios").textContent = totalEstudios;

const anios = data.map(d => d.anio_pub).filter(Boolean);

const minimo = Math.min(...anios);
const maximo = Math.max(...anios);

document.getElementById("cobertura").textContent =
`${minimo} - ${maximo}`;
const regiones = new Set(
  data.map(d => d.region).filter(Boolean)
);

document.getElementById("regiones").textContent =
regiones.size;

const temas = new Set(
  data.map(d => d.tema).filter(Boolean)
);

document.getElementById("temas").textContent =
temas.size;

document.getElementById("ultimo-anio").textContent =
maximo;
const conteoRegiones = {};

data.forEach(estudio => {
  if (!estudio.region) return;

  conteoRegiones[estudio.region] =
    (conteoRegiones[estudio.region] || 0) + 1;
});
const conteoTemas = {};

data.forEach(estudio => {
  if (!estudio.tema) return;

  conteoTemas[estudio.tema] =
    (conteoTemas[estudio.tema] || 0) + 1;
});

const listaTemas =
  document.getElementById("lista-temas");

listaTemas.innerHTML =
  Object.entries(conteoTemas)
    .sort((a,b) => b[1] - a[1])
    .map(([tema,cantidad]) =>
      `<p>${tema}: ${cantidad}</p>`
    )
    .join("");

const listaRegiones =
  document.getElementById("lista-regiones");

listaRegiones.innerHTML =
  Object.entries(conteoRegiones)
    .sort((a,b) => b[1] - a[1])
    .map(([region,cantidad]) =>
      `<p>${region}: ${cantidad}</p>`
    )
    .join("");
const conteoAnios = {};

data.forEach(estudio => {
  if (!estudio.anio_pub) return;

  conteoAnios[estudio.anio_pub] =
    (conteoAnios[estudio.anio_pub] || 0) + 1;
});

const listaAnios =
  document.getElementById("lista-anios");

listaAnios.innerHTML =
  Object.entries(conteoAnios)
    .sort((a,b) => Number(a[0]) - Number(b[0]))
    .map(([anio,cantidad]) =>
      `<p>${anio}: ${cantidad}</p>`
    )
    .join("");
