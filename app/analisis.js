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

const listaRegiones =
  document.getElementById("lista-regiones");

listaRegiones.innerHTML =
  Object.entries(conteoRegiones)
    .sort((a,b) => b[1] - a[1])
    .map(([region,cantidad]) =>
      `<p>${region}: ${cantidad}</p>`
    )
    .join("");
