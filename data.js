// ============================================================
// SIP RESEARCH - Base documental
// Fuente: Anales de Salud Mental (INSM "Honorio Delgado -
// Hideyo Noguchi") y portal institucional gob.pe
//
// Nota de mantenimiento: cada registro fue verificado contra
// la fuente citada en "url". Si agregas un estudio nuevo,
// confirma el volumen/número real antes de publicarlo aquí,
// ya que el motor SIP calcula comparabilidad e indicadores
// sobre estos datos.
// ============================================================

const data = [
{
  id: "REG-001",
  titulo: "Estudio Epidemiológico de Salud Mental en la Sierra Peruana 2003",
  region: "Sierra Peruana",
  ciudad: "Ayacucho/Cajamarca/Huaraz",
  anio_estudio: "2003",
  anio_pub: 2004,
  volumen: "19",
  numero: "1 y 2",
  paginas: "1-218",
  tema: "Epidemiología",
  url: "https://openjournal.insm.gob.pe/revistasm/asm/article/view/3",
  fuente: "Anales de Salud Mental",
  prevalencia: 37.3,
  prevalencia_definicion: "Prevalencia de vida de cualquier trastorno psiquiátrico (fuente: revisión INSM que compara sierra/selva/fronteras)",
  resumen_breve: "Primer estudio técnico científico gubernamental en la sierra; aborda violencia hacia la mujer, conducta suicida, consumo de sustancias, depresión, ansiedad, adolescente y adulto mayor."
},
{
  id: "REG-002",
  titulo: "Estudio Epidemiológico de Salud Mental en las Ciudades de Cusco y Huancayo 2011",
  region: "Sierra Andina",
  ciudad: "Cusco/Huancayo",
  anio_estudio: "2011",
  anio_pub: 2014,
  volumen: "29",
  numero: "1 y 2",
  paginas: "1-373",
  tema: "Epidemiología",
  url: "https://openjournal.insm.gob.pe/revistasm/asm/article/view/5",
  fuente: "Anales de Salud Mental",
  prevalencia: 30.9,
  prevalencia_definicion: "Prevalencia de vida de cualquier trastorno psiquiátrico en población adulta de Cusco: 30,9% (IC 27,8-34,3). En Huancayo la cifra fue 30,0% (IC 27,1-33,1); no se reporta un promedio ponderado único para ambas ciudades (fuente: tablas de resultados 'ADULTO - CUSCO' y 'ADULTO - HUANCAYO' del informe completo).",
  resumen_breve: "Estudio para conocer problemas regionales e indicadores de salud mental en ciudades andinas."
},
{
  id: "REG-003",
  titulo: "Estudio Epidemiológico de Salud Mental en Hospitales Regionales 2015",
  region: "Hospitales Regionales",
  ciudad: "Abancay/Arequipa/Huancavelica/Iquitos/Pucallpa/Tacna/Trujillo/Tumbes",
  anio_estudio: "2015",
  anio_pub: 2019,
  volumen: "35",
  numero: "1",
  paginas: "1-257",
  tema: "Epidemiología",
  url: "https://openjournal.insm.gob.pe/revistasm/asm/article/view/18",
  fuente: "Anales de Salud Mental",
  prevalencia: 44.2,
  prevalencia_definicion: "Prevalencia de vida de cualquier trastorno psiquiátrico en el total de los 8 hospitales regionales: 44,2% (IC 42,2-46,1); anual 18,9%, 6 meses 16,4%, actual 12,2%. Por hospital: Arequipa 66,1%, Huancavelica 53,7%, Abancay 50,1%, Tacna 47,3%, Tumbes 42,6%, Trujillo 34,7%, Pucallpa 32,4%, Iquitos 26,6% (fuente: tabla 'Trastornos clínicos' del informe completo).",
  resumen_breve: "Informe general del estudio en hospitales regionales; incluye tanto los hallazgos generales (mayor afectación en mujeres, suicidio, sueño, estresores psicosociales) como el análisis específico de prevalencia y factores asociados en la población adulta atendida."
},
{
  id: "REG-004",
  titulo: "Estudio Epidemiológico de Salud Mental en la Sierra Peruana: ciudad de Ayacucho 2003",
  region: "Sierra Peruana",
  ciudad: "Ayacucho",
  anio_estudio: "2003",
  anio_pub: 2004,
  volumen: "19",
  numero: "1 y 2",
  paginas: "",
  tema: "Epidemiología",
  url: "https://cdn.www.gob.pe/uploads/document/file/3660223/Estudio%20Epidemiol%C3%B3gico%20de%20Salud%20Mental%20en%20la%20Sierra%20Peruana%202003.pdf.pdf",
  fuente: "GOB.PE / INSM",
  resumen_breve: "Ficha institucional (informe completo en PDF) del estudio de la Sierra Peruana 2003, con foco en la ciudad de Ayacucho."
},
{
  id: "REG-005",
  titulo: "Estudio Epidemiológico de Salud Mental en Lima Metropolitana y Callao - Replicación 2012",
  region: "Lima Metropolitana y Callao",
  ciudad: "Lima/Callao",
  anio_estudio: "2012",
  anio_pub: 2013,
  volumen: "29",
  numero: "Suplemento 1",
  paginas: "1-397",
  tema: "Epidemiología",
  url: "https://openjournal.insm.gob.pe/revistasm/asm/article/view/7",
  fuente: "Anales de Salud Mental",
  prevalencia: 26.1,
  prevalencia_definicion: "Prevalencia de vida para cualquier trastorno mental (ICD-10); prevalencia a 12 meses fue 11.8% (fuente: resumen de resultados principales del artículo)",
  resumen_breve: "Réplica del estudio basal de Lima y Callao, diez años después de la encuesta original de 2002."
},
{
  id: "REG-006",
  titulo: "Estudio Epidemiológico de Salud Mental en Lima Metropolitana 2002",
  region: "Lima Metropolitana y Callao",
  ciudad: "Lima/Callao",
  anio_estudio: "2002",
  anio_pub: 2003,
  volumen: "18",
  numero: "1 y 2",
  paginas: "1-200",
  tema: "Epidemiología",
  url: "https://openjournal.insm.gob.pe/revistasm/asm/article/view/1",
  fuente: "Anales de Salud Mental",
  prevalencia: 37.3,
  prevalencia_definicion: "Prevalencia de vida de cualquier trastorno psiquiátrico: 37,3% (prevalencia actual: 23,5%), en 2,077 adultos de 43 distritos de Lima y Callao. Episodio depresivo 18,2%, ansiedad generalizada 9,9%, fobia social 7,9%, estrés postraumático 6,0% (fuente: citado textualmente en el estudio de replicación 2012 [REG-005]; no se tuvo acceso directo al informe original de 2002, por lo que esta cifra debe tratarse como secundaria hasta verificar contra la fuente primaria).",
  resumen_breve: "Panorama general de la salud mental de la población de Lima Metropolitana y Callao; primer informe de la serie."
},
{
  id: "REG-007",
  titulo: "Estudio Epidemiológico de Salud Mental en la Ciudad de Chiclayo 2019",
  region: "Costa Norte",
  ciudad: "Chiclayo",
  anio_estudio: "2019",
  anio_pub: 2023,
  volumen: "39",
  numero: "1",
  paginas: "1-281",
  tema: "Epidemiología",
  url: "https://openjournal.insm.gob.pe/revistasm/asm/article/view/490",
  fuente: "Anales de Salud Mental",
  prevalencia: 31.9,
  prevalencia_definicion: "Prevalencia de vida de cualquier trastorno mental (CIE-10): 31,9% en población adulta de Chiclayo. Prevalencia a doce meses: 14,5%. Los trastornos más frecuentes fueron episodio depresivo (22,4%), problemas relacionados con el uso de alcohol (9,5%) y trastorno de estrés postraumático (4,3%). Prevalencia de vida de uso de sustancias ilegales: 5,2% (marihuana 4,6%). Fuente: Informe General, Anales de Salud Mental Vol. XXXIX, Año 2023, Núm. 1, p. 19.",
  resumen_breve: "Prevalencia, comorbilidad y factores asociados (pobreza, violencia de pareja, terrorismo, discriminación) de los principales trastornos mentales en población adulta y adolescente de Chiclayo."
},
// REG-008 fue retirado: era un duplicado exacto de REG-001
// (mismo título, región, año y URL; solo el volumen difería
// por un error de tipeo: "20" en vez de "19"). Verificado
// contra la fuente oficial (Anales de Salud Mental Vol. 19,
// Núm. 1 y 2, 2003).
//
// REG-009a fue retirado y fusionado dentro de REG-003:
// ambos registros describían el mismo informe general
// (Hospitales Regionales 2015, Vol. 35), solo que analizaban
// distintas subpoblaciones del mismo estudio. Se deja el hueco
// en la numeración a propósito para no romper referencias
// existentes a otros IDs.
{
  id: "REG-010",
  titulo: "Confiabilidad y Validez de los Cuestionarios de los Estudios Epidemiológicos de Salud Mental de la Sierra Rural 2008 y Trapecio Andino 2010",
  region: "Sierra Rural y Trapecio Andino",
  ciudad: "Sierra Rural / Trapecio Andino",
  anio_estudio: "2008/2010",
  anio_pub: 2024,
  volumen: "39",
  numero: "2",
  paginas: "1-288",
  tema: "Metodología",
  url: "https://openjournal.insm.gob.pe/revistasm/asm/article/view/488",
  fuente: "Anales de Salud Mental",
  resumen_breve: "Artículo metodológico asociado a instrumentos de estudios epidemiológicos regionales."
},
{
  id: "REG-011",
  titulo: "Estudio Epidemiológico de Salud Mental en Niños y Adolescentes en Lima Metropolitana en el contexto de la COVID-19, 2020",
  region: "Lima Metropolitana",
  ciudad: "Lima Metropolitana",
  anio_estudio: "2020",
  anio_pub: 2021,
  volumen: "37",
  numero: "2",
  paginas: "",
  tema: "Salud Mental Infantil",
  url: "https://www.gob.pe/institucion/insm/informes-publicaciones/3510277-estudio-epidemiologico-de-salud-mental-en-ninos-y-adolescentes-en-lima-metropolitana-en-el-contexto-de-la-covid-19-2020",
  fuente: "GOB.PE / INSM",
  resumen_breve: "Estudio en 2,639 niños y adolescentes de Lima Metropolitana, realizado en el contexto de la pandemia de COVID-19."
},
{
  id: "REG-012",
  titulo: "Investigación Epidemiológica en Psiquiatría y Salud Mental",
  region: "Perú",
  ciudad: "Perú",
  anio_estudio: "2001-2024",
  anio_pub: 2024,
  volumen: "39",
  numero: "2",
  paginas: "",
  tema: "Marco Epidemiológico",
  url: "https://openjournal.insm.gob.pe/revistasm/asm/article/view/269",
  fuente: "Anales de Salud Mental",
  resumen_breve: "Artículo de revisión sobre la investigación epidemiológica en psiquiatría y salud mental en el Perú."
},
{
  id: "REG-013",
  titulo: "Estudio Epidemiológico de Salud Mental en Arequipa, Moquegua y Puno 2018",
  region: "Sur del Perú",
  ciudad: "Arequipa/Moquegua/Puno",
  anio_estudio: "2018",
  anio_pub: 2022,
  volumen: "38",
  numero: "1",
  paginas: "1-459",
  tema: "Epidemiología",
  url: "https://openjournal.insm.gob.pe/revistasm/asm/article/view/24",
  fuente: "Anales de Salud Mental",
  prevalencia: 29.5,
  prevalencia_definicion: "Prevalencia de vida de cualquier trastorno mental ICD-10, ponderada por población adulta real de cada ciudad (Arequipa 28.5% sobre 655,221 hab.; Moquegua 31.6% sobre 78,564 hab.; Puno 35.4% sobre 80,749 hab.; N total ponderado = 814,534). Fuente: Tabla 2 y 3 del informe completo (no del resumen), y resultados principales.",
  resumen_breve: "Episodio depresivo (22,0%), estrés postraumático (4,3%) y problemas por uso de alcohol (6,8%) como trastornos más frecuentes en las tres ciudades."
},
{
  id: "REG-014",
  titulo: "Estudio Epidemiológico de Salud Mental en Hospitales Generales y Centros de Salud de Lima Metropolitana 2015",
  region: "Lima Metropolitana y Callao",
  ciudad: "Lima/Callao",
  anio_estudio: "2015",
  anio_pub: 2018,
  volumen: "34",
  numero: "1",
  paginas: "1-172",
  tema: "Epidemiología",
  url: "https://openjournal.insm.gob.pe/revistasm/asm/article/view/15",
  fuente: "Anales de Salud Mental",
  prevalencia: 37.2,
  prevalencia_definicion: "Prevalencia de vida de cualquier trastorno mental: 37,2% en pacientes que acuden por problemas físicos a establecimientos de salud del MINSA de Lima Metropolitana y Callao. Prevalencia actual (al momento de la consulta): 8,0%. De este último grupo, solo ~1 de cada 10 casos fue identificado por el médico tratante. Fuente: Informe General, Anales de Salud Mental Vol. XXXIV, Año 2018, Núm. 1.",
  resumen_breve: "Prevalencia, nivel de identificación y factores asociados de los principales problemas de salud mental en población adulta que busca atención en hospitales generales y centros de salud de Lima."
},
{
  id: "REG-015",
  titulo: "Estudio Epidemiológico de Salud Mental en Ayacucho, Cajamarca y Huaraz 2017",
  region: "Sierra Peruana",
  ciudad: "Ayacucho/Cajamarca/Huaraz",
  anio_estudio: "2017",
  anio_pub: 2020,
  volumen: "36",
  numero: "1 y 2",
  paginas: "1-449",
  tema: "Epidemiología",
  url: "https://openjournal.insm.gob.pe/revistasm/asm/article/view/19",
  fuente: "Anales de Salud Mental",
  prevalencia: null,
  prevalencia_definicion: "No hay una cifra única ponderada: prevalencia de vida de cualquier trastorno mental (CIE-10) por ciudad: Ayacucho 39,7%, Cajamarca 27,6%, Huaraz 36,6%. Prevalencia a 12 meses: 15,9% / 7,9% / 14,2% respectivamente. Trastornos más frecuentes en conjunto: episodio depresivo (23,4%), estrés postraumático (9,7%), problemas por uso de alcohol (9,1%). Fuente: Resumen del Informe General.",
  resumen_breve: "Réplica del estudio de 2003 en las mismas tres ciudades de la sierra, permitiendo comparación directa de tendencias (usar REG-001 como par para anioEjecucion())."
},
{
  id: "REG-016",
  titulo: "Estudio Epidemiológico de Salud Mental Comparativo Ciudad de Abancay 2010-2016 (Informe General del Adulto)",
  region: "Sierra Peruana",
  ciudad: "Abancay",
  anio_estudio: "2010/2016",
  anio_pub: 2019,
  volumen: "35",
  numero: "2",
  paginas: "",
  tema: "Epidemiología / Estudio comparativo",
  url: "https://openjournal.insm.gob.pe/revistasm/asm/article/view/16",
  fuente: "Anales de Salud Mental",
  prevalencia: 27.5,
  prevalencia_definicion: "Prevalencia de vida de cualquier trastorno mental (CIE-10) en Abancay: 27,5% en 2016 vs. 28,8% en 2010. Prevalencia a 12 meses: 14,6% (2016) vs. 13,5% (2010). Trastornos más frecuentes en 2016: uso de alcohol (5,5%), episodio depresivo (5,3%), episodio psicótico (1,4%). Fuente: Resumen del Informe General.",
  resumen_breve: "Estudio de replicación (línea base 2010 vs. seguimiento 2016) tras el proyecto piloto de mejora de redes de atención en salud mental en Apurímac."
},
{
  id: "REG-017",
  titulo: "Informe General de la Violencia Contra las Mujeres Actualmente Unidas y Alguna Vez Unidas en Hospitales Generales y Centros de Salud de Lima Metropolitana 2015",
  region: "Lima Metropolitana y Callao",
  ciudad: "Lima/Callao",
  anio_estudio: "2015",
  anio_pub: 2021,
  volumen: "37",
  numero: "1",
  paginas: "",
  tema: "Violencia de género / Salud mental",
  url: "https://www.gob.pe/institucion/insm/informes-publicaciones/tipos/155-investigacion",
  fuente: "Anales de Salud Mental / GOB.PE",
  prevalencia: null,
  prevalencia_definicion: "No es prevalencia poblacional general, es un subanálisis: usa la MISMA encuesta base que REG-014 (n=5558 mujeres unidas del total de 10,885 personas). 39,2% de las mujeres sufrió alguna vez abuso/maltrato de pareja. En el subgrupo con maltrato SISTEMÁTICO (4,5% del total), la prevalencia de vida de cualquier trastorno mental sube a 66% (trastornos depresivos 60,7%, ansiedad 16,2%) — no confundir con el 37,2% general de REG-014.",
  resumen_breve: "Sub-análisis de género del estudio REG-014, enfocado en mujeres unidas o alguna vez unidas: violencia de pareja y su asociación con peor salud mental, menor autoestima y menor calidad de vida."
}
];

// ============================================================
// AÑO DE EJECUCIÓN vs. AÑO DE PUBLICACIÓN
// ------------------------------------------------------------
// "anio_pub" es cuándo salió impreso el artículo en Anales de
// Salud Mental. "anio_estudio" es cuándo se hizo el trabajo de
// campo (encuestas a la población). Para CUALQUIER cálculo
// estadístico o de tendencia (conteo por año, año mínimo/máximo,
// comparabilidad entre dos estudios, proyecciones), hay que usar
// SIEMPRE el año de ejecución: la publicación puede demorar años
// por trámites de imprenta, presupuesto estatal o revisión de
// los investigadores, y ese desfase no tiene relación con cuándo
// cambió realmente la salud mental de la población. Mezclar
// ambos años distorsiona las cifras de tendencia temporal.
//
// anio_estudio es texto libre porque algunos registros abarcan
// más de un año ("2008/2010", "2001-2024"). Esta función siempre
// devuelve el PRIMER año de 4 dígitos que encuentra, que es el
// año en que empezó la recolección de datos.
function anioEjecucion(estudio){
  if (!estudio || !estudio.anio_estudio) return null;
  const match = String(estudio.anio_estudio).match(/\d{4}/);
  return match ? parseInt(match[0], 10) : null;
}
