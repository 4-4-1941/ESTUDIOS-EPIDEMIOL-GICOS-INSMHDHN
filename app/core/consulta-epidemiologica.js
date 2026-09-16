(function(){
"use strict";
const norm=v=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cifras=()=>Array.isArray(window.INDICADORES_EPIDEMIOLOGICOS)?window.INDICADORES_EPIDEMIOLOGICOS:[];
const docs=()=>Array.isArray(window.INDICE_ESTUDIOS_EPIDEMIOLOGICOS)?window.INDICE_ESTUDIOS_EPIDEMIOLOGICOS:[];

function indicador(q){
 q=norm(q);
 if(q.includes("depres")) return "episodio depresivo";
 if(q.includes("trastorno")||q.includes("salud mental")||q.includes("prevalencia")) return "cualquier trastorno mental";
 return "";
}
function territorios(q){
 q=norm(q);
 const todos=[...new Set([...cifras().map(x=>x.territorio),...docs().map(x=>x.territorio)])];
 return todos.filter(t=>q.includes(norm(t)));
}
function periodo(q){
 q=norm(q);
 if(q.includes("12 meses")||q.includes("anual")) return "12 meses";
 if(q.includes("actual")) return "actual";
 if(q.includes("vida")) return "vida";
 return "";
}
function compatible(a,b){
 const razones=[];
 for(const [k,label] of [["indicador_canonico","indicador"],["periodo_prevalencia","período"],["poblacion","población"],["criterio","criterio diagnóstico"]])
   if(norm(a[k])!==norm(b[k])) razones.push(`Diferente ${label}`);
 return {ok:!razones.length,razones};
}
function metricas(a,b){
 const c=compatible(a,b);
 if(!c.ok)return {comparabilidad:"NO_COMPARABLE",razones:c.razones};
 const p1=Number(a.valor),p2=Number(b.valor),dt=Math.abs(Number(b.anio_ejecucion)-Number(a.anio_ejecucion));
 return {comparabilidad:"DIRECTA",diferencia_pp:p2-p1,cambio_relativo:p1?((p2-p1)/p1)*100:null,razon:p1?p2/p1:null,cambio_anual:dt?(p2-p1)/dt:null};
}
function consultar(texto){
 const ind=indicador(texto),ts=territorios(texto),per=periodo(texto);
 let rs=cifras().filter(x=>(!ind||norm(x.indicador_canonico)===norm(ind))&&(!ts.length||ts.some(t=>norm(t)===norm(x.territorio)))&&(!per||norm(x.periodo_prevalencia)===norm(per)));
 let ds=docs().filter(x=>!ts.length||ts.some(t=>norm(t)===norm(x.territorio)));
 const comps=[];
 if(ts.length>=2){
   const A=rs.filter(x=>norm(x.territorio)===norm(ts[0])),B=rs.filter(x=>norm(x.territorio)===norm(ts[1]));
   for(const a of A)for(const b of B){const m=metricas(a,b);if(m.comparabilidad==="DIRECTA")comps.push({a,b,...m});}
 }
 if(ts.length===1){
   const serie=rs.filter(x=>norm(x.territorio)===norm(ts[0])).sort((a,b)=>a.anio_ejecucion-b.anio_ejecucion);
   for(let i=1;i<serie.length;i++){const m=metricas(serie[i-1],serie[i]);if(m.comparabilidad==="DIRECTA")comps.push({a:serie[i-1],b:serie[i],...m});}
 }
 return {rs,ds,comps,ts,ind,per};
}
function render(r,n){
 if(!n)return;
 let h="";
 if(r.rs.length) h+=r.rs.map(x=>`<article class="epi-resultado"><h3>${esc(x.territorio)} · ${esc(x.indicador)}</h3><div class="epi-valor">${x.valor}%</div><p>${esc(x.periodo_prevalencia)} · ${esc(x.poblacion)} · ${esc(x.anio_ejecucion)}</p><p><a href="${esc(x.fuente_url)}" target="_blank" rel="noopener noreferrer">Fuente INSM</a> · ${esc(x.estudio_id)} · ${esc(x.referencia)}</p></article>`).join("");
 if(r.comps.length) h+=r.comps.map(c=>`<div class="epi-comparacion"><strong>Comparación descriptiva compatible:</strong> ${esc(c.a.territorio)} ${c.a.valor}% (${c.a.anio_ejecucion}) → ${esc(c.b.territorio)} ${c.b.valor}% (${c.b.anio_ejecucion}). Diferencia ${c.diferencia_pp.toFixed(1)} pp; cambio relativo ${c.cambio_relativo.toFixed(1)}%; razón ${c.razon.toFixed(2)}${c.cambio_anual!==null?`; cambio medio ${c.cambio_anual.toFixed(2)} pp/año`:""}.</div>`).join("");
 if(!r.rs.length&&r.ds.length) h+=`<div class="epi-aviso"><strong>Hay estudios para el territorio, pero no una cifra normalizada para esa consulta.</strong> No se inventará una prevalencia.</div>`;
 if(r.ds.length) h+=`<details class="epi-documentos"><summary>Estudios relacionados (${r.ds.length})</summary>${r.ds.map(d=>`<p><strong>${esc(d.estudio_id)}</strong> · ${esc(d.territorio)} · ${esc(d.titulo)}${d.fuente_url?` · <a href="${esc(d.fuente_url)}" target="_blank" rel="noopener noreferrer">fuente</a>`:""}</p>`).join("")}</details>`;
 if(!h)h='<div class="epi-aviso">No se encontraron datos documentados para esa consulta.</div>';
 n.innerHTML=h;
}
function init(){
 const i=document.getElementById("epi-consulta"),b=document.getElementById("epi-buscar"),o=document.getElementById("epi-respuesta");
 if(!i||!b||!o)return;
 const run=()=>render(consultar(i.value),o);
 b.addEventListener("click",run);i.addEventListener("keydown",e=>{if(e.key==="Enter")run();});
}
window.SIPEpidemiologia={consultar,metricas,compatible,render};
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();
