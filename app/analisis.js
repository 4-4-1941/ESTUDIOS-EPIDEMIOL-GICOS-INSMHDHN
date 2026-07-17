const totalEstudios = data.length;

document.getElementById("total-estudios").textContent = totalEstudios;

const anios = data.map(d => d.anio_pub).filter(Boolean);

const minimo = Math.min(...anios);
const maximo = Math.max(...anios);

document.getElementById("cobertura").textContent =
`${minimo} - ${maximo}`;
