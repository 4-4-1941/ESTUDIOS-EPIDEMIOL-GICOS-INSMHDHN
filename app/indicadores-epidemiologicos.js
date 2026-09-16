const INDICADORES_EPIDEMIOLOGICOS = [];

function normalizarTextoEpi(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function numeroEpi(valor) {
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

function buscarIndicadoresEpi({
  indicador,
  territorios = [],
  poblacion = null,
  periodo = null
} = {}) {

  const qIndicador = normalizarTextoEpi(indicador);
  const qTerritorios = territorios
    .map(normalizarTextoEpi)
    .filter(Boolean);

  const qPoblacion = normalizarTextoEpi(poblacion);
  const qPeriodo = normalizarTextoEpi(periodo);

  return INDICADORES_EPIDEMIOLOGICOS.filter(registro => {

    const indicadorRegistro = normalizarTextoEpi(
      registro.indicador_canonico || registro.indicador
    );

    const territorioRegistro = normalizarTextoEpi([
      registro.territorio,
      registro.departamento,
      registro.provincia,
      registro.distrito
    ].filter(Boolean).join(" "));

    if (
      qIndicador &&
      !indicadorRegistro.includes(qIndicador)
    ) {
      return false;
    }

    if (
      qTerritorios.length &&
      !qTerritorios.some(
        territorio => territorioRegistro.includes(territorio)
      )
    ) {
      return false;
    }

    if (
      qPoblacion &&
      normalizarTextoEpi(registro.poblacion) !== qPoblacion
    ) {
      return false;
    }

    if (
      qPeriodo &&
      normalizarTextoEpi(registro.periodo_prevalencia) !== qPeriodo
    ) {
      return false;
    }

    return true;
  });
}

function evaluarComparabilidadEpi(a, b) {

  if (!a || !b) {
    return {
      comparable: false,
      nivel: "NO_COMPARABLE",
      razones: [
        "Falta uno de los indicadores."
      ]
    };
  }

  const razones = [];

  const iguales = campo =>
    normalizarTextoEpi(a[campo]) ===
    normalizarTextoEpi(b[campo]);

  if (!iguales("indicador_canonico")) {
    razones.push("Indicadores diferentes.");
  }

  if (!iguales("periodo_prevalencia")) {
    razones.push(
      "Periodos de prevalencia diferentes."
    );
  }

  if (!iguales("poblacion")) {
    razones.push("Poblaciones diferentes.");
  }

  if (
    a.grupo_edad &&
    b.grupo_edad &&
    !iguales("grupo_edad")
  ) {
    razones.push(
      "Grupos de edad diferentes."
    );
  }

  if (
    a.definicion_caso &&
    b.definicion_caso &&
    !iguales("definicion_caso")
  ) {
    razones.push(
      "Definiciones de caso diferentes."
    );
  }

  if (
    a.instrumento &&
    b.instrumento &&
    !iguales("instrumento")
  ) {
    razones.push(
      "Instrumentos o criterios diferentes."
    );
  }

  return razones.length
    ? {
        comparable: false,
        nivel: "NO_COMPARABLE",
        razones
      }
    : {
        comparable: true,
        nivel: "DIRECTA",
        razones: []
      };
}

function calcularComparacionEpi(a, b) {

  const comparabilidad =
    evaluarComparabilidadEpi(a, b);

  const p1 = numeroEpi(a?.valor);
  const p2 = numeroEpi(b?.valor);

  if (
    !comparabilidad.comparable ||
    p1 === null ||
    p2 === null
  ) {
    return {
      comparabilidad,
      calculable: false
    };
  }

  const diferencia_pp = p2 - p1;

  const cambio_relativo_pct =
    p1 === 0
      ? null
      : (diferencia_pp / p1) * 100;

  const razon_prevalencias =
    p1 === 0
      ? null
      : p2 / p1;

  const t1 = numeroEpi(
    a.anio_ejecucion
  );

  const t2 = numeroEpi(
    b.anio_ejecucion
  );

  const delta_anios =
    t1 !== null && t2 !== null
      ? t2 - t1
      : null;

  const cambio_medio_anual_pp =
    delta_anios &&
    delta_anios !== 0
      ? diferencia_pp /
        Math.abs(delta_anios)
      : null;

  const cambio_anualizado_pct =
    delta_anios &&
    delta_anios !== 0 &&
    p1 > 0 &&
    p2 >= 0
      ? (
          Math.pow(
            p2 / p1,
            1 / Math.abs(delta_anios)
          ) - 1
        ) * 100
      : null;

  return {
    comparabilidad,
    calculable: true,

    p1,
    p2,

    diferencia_pp,
    cambio_relativo_pct,
    razon_prevalencias,

    delta_anios,
    cambio_medio_anual_pp,
    cambio_anualizado_pct
  };
}

function consultarComparacionEpi(
  indicador,
  territorioA,
  territorioB
) {

  const resultados =
    buscarIndicadoresEpi({
      indicador,
      territorios: [
        territorioA,
        territorioB
      ]
    });

  const coincide = (
    registro,
    territorio
  ) => {

    const ubicacion =
      normalizarTextoEpi([
        registro.territorio,
        registro.departamento,
        registro.provincia,
        registro.distrito
      ].filter(Boolean).join(" "));

    return ubicacion.includes(
      normalizarTextoEpi(territorio)
    );
  };

  const A = resultados.find(
    registro =>
      coincide(
        registro,
        territorioA
      )
  );

  const B = resultados.find(
    registro =>
      coincide(
        registro,
        territorioB
      )
  );

  if (!A || !B) {

    return {
      encontrado: false,

      mensaje:
        `No hay todavía datos normalizados suficientes para comparar ${indicador} entre ${territorioA} y ${territorioB}.`,

      faltantes: [
        !A ? territorioA : null,
        !B ? territorioB : null
      ].filter(Boolean)
    };
  }

  return {
    encontrado: true,

    indicador,
    territorioA,
    territorioB,

    A,
    B,

    comparacion:
      calcularComparacionEpi(
        A,
        B
      )
  };
}

if (
  typeof window !== "undefined"
) {

  window.INDICADORES_EPIDEMIOLOGICOS =
    INDICADORES_EPIDEMIOLOGICOS;

  window.SIPEpidemiologia = {

    buscar:
      buscarIndicadoresEpi,

    evaluarComparabilidad:
      evaluarComparabilidadEpi,

    comparar:
      calcularComparacionEpi,

    consultarComparacion:
      consultarComparacionEpi
  };
}
