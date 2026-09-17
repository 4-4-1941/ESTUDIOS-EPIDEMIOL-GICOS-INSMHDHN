// =====================================
// FÓRMULAS EPIDEMIOLÓGICAS
// =====================================

function sonConteosValidos(...valores) {
  return valores.every(
    valor => Number.isFinite(valor) && valor >= 0
  );
}

/**
 * Calcula una proporción expresada como porcentaje.
 * n: número de eventos o personas con la característica.
 * N: población total evaluada.
 */
function frecuencia(n, N) {
  if (!sonConteosValidos(n, N) || N <= 0 || n > N) {
    return null;
  }

  return (n / N) * 100;
}

/**
 * Tabla 2×2:
 *
 *                    Evento +    Evento -
 * Exposición +           a           b
 * Exposición -           c           d
 *
 * RP = [a / (a + b)] / [c / (c + d)]
 */
function razonPrevalencias(a, b, c, d) {
  if (!sonConteosValidos(a, b, c, d)) {
    return null;
  }

  const totalExpuestos = a + b;
  const totalNoExpuestos = c + d;

  if (totalExpuestos <= 0 || totalNoExpuestos <= 0) {
    return null;
  }

  const prevalenciaExpuestos = a / totalExpuestos;
  const prevalenciaNoExpuestos = c / totalNoExpuestos;

  if (prevalenciaNoExpuestos === 0) {
    return null;
  }

  return prevalenciaExpuestos / prevalenciaNoExpuestos;
}

/**
 * OR = (a × d) / (b × c)
 */
function oddsRatio(a, b, c, d) {
  if (!sonConteosValidos(a, b, c, d)) {
    return null;
  }

  const denominador = b * c;

  if (denominador === 0) {
    return null;
  }

  return (a * d) / denominador;
}

/**
 * Calcula eventos por una constante poblacional.
 * Ejemplos de factor: 100, 1 000, 10 000 o 100 000.
 */
function tasa(casos, denominador, factor = 1000) {
  if (
    !sonConteosValidos(casos, denominador) ||
    denominador <= 0 ||
    !Number.isFinite(factor) ||
    factor <= 0
  ) {
    return null;
  }

  return (casos / denominador) * factor;
}
