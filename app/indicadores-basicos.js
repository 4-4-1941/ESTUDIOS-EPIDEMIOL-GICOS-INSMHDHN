// ============================================
// INDICADORES EPIDEMIOLÓGICOS BÁSICOS
// Cálculos: prevalencia, magnitud, comparaciones
// Autor: Claude | Licencia: MIT
// ============================================

class IndicadoresBasicos {
  
  // Calcula prevalencia (n/N * 100)
  static prevalencia(casos, total) {
    if (total === 0 || !Number.isFinite(casos) || !Number.isFinite(total)) {
      return 0;
    }
    return (casos / total * 100).toFixed(2);
  }

  // Clasifica magnitud epidemiológica
  static magnitud(prevalencia) {
    const p = Number(prevalencia);
    if (isNaN(p)) return { nivel: "indefinida", color: "gray" };
    
    if (p < 5) {
      return { nivel: "baja", color: "green", icono: "↓" };
    }
    if (p <= 15) {
      return { nivel: "media", color: "orange", icono: "→" };
    }
    return { nivel: "alta", color: "red", icono: "↑" };
  }

  // Razón de prevalencias (RP)
  static razonPrevalencias(p1, p2) {
    const prev1 = Number(p1);
    const prev2 = Number(p2);
    
    if (prev2 === 0 || isNaN(prev1) || isNaN(prev2)) {
      return null;
    }
    
    return (prev1 / prev2).toFixed(2);
  }

  // Diferencia en puntos porcentuales
  static diferenciaPuntosPorcentuales(p1, p2) {
    const prev1 = Number(p1);
    const prev2 = Number(p2);
    
    if (isNaN(prev1) || isNaN(prev2)) {
      return null;
    }
    
    return (prev2 - prev1).toFixed(1);
  }

  // Cambio relativo (%)
  static cambioRelativo(p1, p2) {
    const prev1 = Number(p1);
    const prev2 = Number(p2);
    
    if (prev1 === 0 || isNaN(prev1) || isNaN(prev2)) {
      return null;
    }
    
    return (((prev2 - prev1) / prev1) * 100).toFixed(1);
  }

  // Cambio anual
  static cambioAnual(p1, p2, años) {
    const prev1 = Number(p1);
    const prev2 = Number(p2);
    const periodos = Number(años);
    
    if (periodos === 0 || isNaN(prev1) || isNaN(prev2) || isNaN(periodos)) {
      return null;
    }
    
    return ((prev2 - prev1) / periodos).toFixed(2);
  }

  // Interpretación simple de RP
  static interpretarRP(rp) {
    const razon = Number(rp);
    
    if (razon > 1.1) return "mayor en grupo 1";
    if (razon < 0.9) return "menor en grupo 1";
    return "similar";
  }

  // Interpretación de cambio
  static interpretarCambio(cambioRelativo) {
    const cambio = Number(cambioRelativo);
    
    if (cambio > 10) return "aumento importante";
    if (cambio > 0) return "aumento leve";
    if (cambio < -10) return "disminución importante";
    if (cambio < 0) return "disminución leve";
    return "sin cambio";
  }

  // Validación de datos epidemiológicos
  static esValido(n, N) {
    return (
      Number.isFinite(n) &&
      Number.isFinite(N) &&
      n >= 0 &&
      N > 0 &&
      n <= N
    );
  }

  // Formatea número con decimales
  static formatear(numero, decimales = 2) {
    const num = Number(numero);
    if (isNaN(num)) return "N/A";
    return num.toFixed(decimales);
  }
}

// Exporta para uso global
window.IndicadoresBasicos = IndicadoresBasicos;
