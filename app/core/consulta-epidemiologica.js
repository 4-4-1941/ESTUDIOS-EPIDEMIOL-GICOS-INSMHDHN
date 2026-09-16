(function(){
"use strict";
const norm=v=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cifras=()=>Array.isArray(window.INDICADORES_EPIDEMIOLOGICOS)?window.INDICADORES_EPIDEMIOLOGICOS:[];
const docs=()=>Array.isArray(window.INDICE_ESTUDIOS_EPIDEMIOLOGICOS)?window.INDICE_ESTUDIOS_EPIDEMIOLOGICOS:[];
const aliases=[
 ["cualquier trastorno mental",["cualquier trastorno","trastorno mental","salud mental general"]],
 ["consumo perjudicial o dependencia de alcohol",["alcohol","alcoholismo","dependencia de alcohol","abuso de alcohol","consumo perjudicial"]],
 ["episodio depresivo",["depresion","depresivo","episodio depresivo"]],
 ["trastornos depresivos en general",["trastornos depresivos"]],
 ["trastorno de ansiedad generalizada",["ansiedad generalizada","tag"]],
 ["trastornos de ansiedad en general",["trastornos de ansiedad"]],
 ["trastorno de estrés postraumático",["estres postraumatico","tept","ptsd"]],
 ["episodio psicótico",["psicosis","psicotico","episodio psicotico"]],
 ["fobia social",["fobia social"]],
 ["agorafobia",["agorafobia"]],
 ["distimia",["distimia"]],
 ["trastorno bipolar",["bipolar"]],
 ["cualquier abuso violencia o maltrato",["violencia contra la mujer","maltrato a la mujer","abuso contra la mujer","violencia de pareja"]],
 ["deterioro cognoscitivo y funcional sospechoso de demencia",["demencia","deterioro cognitivo","deterioro cognoscitivo"]],
 ["mala o muy mala calidad del sueño",["calidad del sueno","problemas de sueno","sueño"]],
 ["satisfacción con la vida",["satisfaccion con la vida"]]
];
function detectarIndicador(q){
 q=norm(q);
 for(const [canon,as] of aliases) if(as.some(a=>q.includes(norm(a)))) return canon;
 return "";
}
function detectarPoblacion(q){
 q=norm(q);
 if(q.includes("adolesc")) return "Adolescentes 12-17";
 if(q.includes("adulto mayor")||q.includes("mayores")) return "Adultos mayores 60+";
 if(q.includes("mujer")) return "Mujeres unidas o alguna vez unidas";
 if(q.includes("adult")) return "Adultos";
 return "";
}
function detectarPeriodo(q){
 q=norm(q);
 if(q.includes("vida")) return "vida";
 if(q.includes("anual")||q.includes("12 meses")||q.includes("ultimo ano")) return "12 meses";
 if(q.includes("6 meses")||q.includes("seis meses")) return "6 meses";
 if(q.includes("actual")) return "actual";
 return "";
}
function detectarAnos(q){ return [...norm(q).matchAll(/\b(19|20)\d{2}\b/g)].map(m=>Number(m[0])); }
function detectarEstudios(q){
 q=norm(q); return docs().filter(d=>q.includes(norm(d.estudio_id))||q.includes(norm(d.titulo))||
   (d.anio_ejecucion&&q.includes(String(d.anio_ejecucion))&&String(d.territorio||"").split(/[\/,]/).some(t=>q.includes(norm(t.trim())))));
}
function detectarTerritorios(q){
 q=norm(q); const ts=new Set();
 cifras().forEach(x=>{if(x.territorio&&x.territorio!=="Total"&&q.includes(norm(x.territorio)))ts.add(x.territorio)});
 ["Ayacucho","Cajamarca","Huaraz","Chiclayo","Cusco","Huancayo","Abancay","Arequipa","Moquegua","Puno","Lima/Callao"].forEach(t=>{
   if(q.includes(norm(t.split("/")[0]))) ts.add(t);
 });
 return [...ts];
}
function geografiaCompatible(a,b){return norm(a.unidad_geografica||"")===norm(b.unidad_geografica||"") || (!a.unidad_geografica&&!b.unidad_geografica);}
function comparabilidad(a,b){
 const razones=[]; let nivel="DIRECTA";
 [["indicador_canonico","indicador"],["periodo_prevalencia","período"],["poblacion","población"],["criterio","criterio/instrumento"]].forEach(([k,l])=>{
   if(norm(a[k])!==norm(b[k])) razones.push(`Diferente ${l}`);
 });
 if(!geografiaCompatible(a,b)) razones.push("Diferente unidad geográfica");
 if(razones.length) nivel="NO_COMPARABLE";
 else if((a.fuente||"").includes("secundar")||(b.fuente||"").includes("secundar")) nivel="LIMITADA";
 return {nivel,razones};
}
function metricas(a,b){
 const c=comparabilidad(a,b),p1=Number(a.valor),p2=Number(b.valor),dt=Math.abs(Number(b.anio_ejecucion)-Number(a.anio_ejecucion));
 if(c.nivel==="NO_COMPARABLE") return {...c};
 return {...c,diferencia_pp:p2-p1,cambio_relativo:p1?((p2-p1)/p1)*100:null,razon_prevalencias:p1?p2/p1:null,
   delta_t:dt||0,cambio_medio_anual:dt?(p2-p1)/dt:null,cambio_relativo_anualizado:(dt&&p1>0&&p2>0)?(Math.pow(p2/p1,1/dt)-1)*100:null};
}
function estudioDetalle(d){
 const corpus=window.SIP_CORPUS_CIENTIFICO?.[d.estudio_id];
 const rs=cifras().filter(x=>x.estudio_id===d.estudio_id);
 return {documento:d,metodologia:corpus?.metodologia||null,instrumentos:corpus?.instrumentos||[],resultados:rs};
}
function consultar(texto){
 const q=norm(texto),ind=detectarIndicador(q),pop=detectarPoblacion(q),per=detectarPeriodo(q),anos=detectarAnos(q),ts=detectarTerritorios(q),eds=detectarEstudios(q);
 let rs=cifras().filter(x=>(!ind||norm(x.indicador_canonico)===norm(ind))&&(!pop||norm(x.poblacion)===norm(pop))&&(!per||norm(x.periodo_prevalencia)===norm(per))&&(!anos.length||anos.includes(Number(x.anio_ejecucion)))&&(!ts.length||ts.some(t=>norm(t)===norm(x.territorio))));
 if(eds.length) rs=rs.filter(x=>eds.some(d=>d.estudio_id===x.estudio_id));
 const pideEstudio=/resultados|hallazgos|instrumentos|metodolog|muestra|diseno|estudio/.test(q);
 const estudios=pideEstudio?(eds.length?eds:docs().filter(d=>ts.some(t=>norm(d.territorio).includes(norm(t))))).map(estudioDetalle):[];
 const comps=[];
 const orden=[...rs].sort((a,b)=>Number(a.anio_ejecucion)-Number(b.anio_ejecucion));
 for(let i=0;i<orden.length;i++)for(let j=i+1;j<orden.length;j++){
   const a=orden[i],b=orden[j]; if(a.estudio_id===b.estudio_id&&a.territorio===b.territorio&&a.anio_ejecucion===b.anio_ejecucion)continue;
   const m=metricas(a,b); if(m.nivel!=="NO_COMPARABLE") comps.push({a,b,...m});
 }
 return {texto,ind,pop,per,anos,ts,rs,estudios,comps};
}
const fmt=x=>x==null?"NR":Number(x).toFixed(1);
function render(r,n){
 if(!n)return; let h="";
 r.estudios.forEach(s=>{
  const m=s.metodologia;
  h+=`<article class="epi-estudio"><h3>${esc(s.documento.titulo)}</h3><p><strong>${esc(s.documento.estudio_id)}</strong> · ejecución ${esc(s.documento.anio_ejecucion)} · ${esc(s.documento.fuente)}</p>`;
  if(m)h+=`<p><strong>Diseño:</strong> ${esc(m.diseno)} <strong>Muestreo:</strong> ${esc(m.muestreo)}</p><p><strong>Muestra:</strong> ${Object.entries(m.muestra).map(([k,v])=>`${esc(k)} ${v}`).join(" · ")}</p>`;
  if(s.instrumentos.length)h+=`<details><summary>Instrumentos (${s.instrumentos.length})</summary><p>${s.instrumentos.map(esc).join(" · ")}</p></details>`;
  h+=`<p><strong>Resultados normalizados disponibles:</strong> ${s.resultados.length}</p></article>`;
 });
 if(r.rs.length)h+=r.rs.slice(0,120).map(x=>`<article class="epi-resultado"><h3>${esc(x.indicador)} · ${esc(x.territorio)}</h3><div class="epi-valor">${fmt(x.valor)}${esc(x.unidad||"%")}</div><p>${esc(x.poblacion)} · ${esc(x.periodo_prevalencia)} · ${esc(x.anio_ejecucion)}${x.ic95_inferior!=null?` · IC95% ${fmt(x.ic95_inferior)}–${fmt(x.ic95_superior)}`:""}</p><p>${esc(x.tabla||x.referencia||"")}${x.pagina?` · p. ${x.pagina}`:""} · <a href="${esc(x.fuente_url)}" target="_blank" rel="noopener">fuente</a></p></article>`).join("");
 if(r.comps.length){
   const c=r.comps[0];
   h+=`<section class="epi-comparacion"><strong>Comparación ${esc(c.nivel)}:</strong> ${esc(c.a.territorio)} ${c.a.anio_ejecucion}: ${fmt(c.a.valor)}% → ${esc(c.b.territorio)} ${c.b.anio_ejecucion}: ${fmt(c.b.valor)}%. Diferencia ${fmt(c.diferencia_pp)} pp; cambio relativo ${fmt(c.cambio_relativo)}%; razón de prevalencias ${c.razon_prevalencias?.toFixed(2)}${c.delta_t?`; Δt ${c.delta_t} años; cambio medio ${c.cambio_medio_anual.toFixed(2)} pp/año; cambio relativo anualizado ${c.cambio_relativo_anualizado.toFixed(2)}%/año`:""}.</section>`;
 }
 if(!h)h='<div class="epi-aviso">No se encontró una observación normalizada que responda exactamente a la consulta. Revise los estudios relacionados desde el buscador documental.</div>';
 n.innerHTML=h;
}
function init(){
 const i=document.getElementById("epi-consulta"),b=document.getElementById("epi-buscar"),o=document.getElementById("epi-respuesta");
 if(!i||!b||!o)return; const run=()=>render(consultar(i.value),o); b.addEventListener("click",run); i.addEventListener("keydown",e=>{if(e.key==="Enter")run()});
}
window.SIPEpidemiologia={consultar,metricas,comparabilidad,estudioDetalle,render};
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();
