(function(){
"use strict";
const norm=v=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const datos=()=>Array.isArray(window.INDICADORES_EPIDEMIOLOGICOS)?window.INDICADORES_EPIDEMIOLOGICOS:[];

function detectarIndicador(q){
  q=norm(q);
  if(q.includes("depres")) return "episodio depresivo";
  if(q.includes("trastorno mental")||q.includes("salud mental")||q.includes("prevalencia")) return "cualquier trastorno mental";
  return "";
}
function detectarTerritorios(q){
  q=norm(q);
  return [...new Set(datos().map(x=>x.territorio))].filter(t=>q.includes(norm(t)));
}
function comparar(a,b){
  const razones=[];
  for(const [k,e] of [["indicador_canonico","indicador"],["poblacion","población"],["grupo_edad","grupo de edad"],["periodo_prevalencia","periodo"]]){
    if(norm(a[k])!==norm(b[k])) razones.push(`Diferente ${e}.`);
  }
  if(razones.length) return {calculable:false,nivel:"NO_COMPARABLE",razones};
  const p1=Number(a.valor),p2=Number(b.valor),dif=p2-p1;
  return {calculable:true,nivel:"DIRECTA",diferencia_pp:dif,cambio_relativo_pct:p1?dif/p1*100:null,razon_prevalencias:p1?p2/p1:null};
}
function consultar(texto){
  const indicador=detectarIndicador(texto), territorios=detectarTerritorios(texto);
  if(!indicador) return {ok:false,mensaje:"Indica un indicador: por ejemplo depresión o prevalencia de trastornos mentales."};
  if(!territorios.length) return {ok:false,mensaje:"No se identificó un territorio con datos normalizados."};
  const resultados=datos().filter(x=>norm(x.indicador_canonico)===norm(indicador)&&territorios.some(t=>norm(t)===norm(x.territorio)));
  const comparaciones=[];
  if(territorios.length>1){
    const A=resultados.filter(x=>norm(x.territorio)===norm(territorios[0]));
    const B=resultados.filter(x=>norm(x.territorio)===norm(territorios[1]));
    for(const a of A) for(const b of B) if(norm(a.periodo_prevalencia)===norm(b.periodo_prevalencia)) comparaciones.push({a,b,...comparar(a,b)});
  }
  return {ok:true,indicador,territorios,resultados,comparaciones};
}
function render(r,n){
  if(!n)return;
  if(!r.ok){n.innerHTML=`<div class="epi-aviso">${esc(r.mensaje)}</div>`;return;}
  if(!r.resultados.length){n.innerHTML='<div class="epi-aviso">No hay una cifra verificada para esa combinación. No se generará un valor estimado.</div>';return;}
  let h=r.resultados.map(x=>`<article class="epi-resultado"><h3>${esc(x.territorio)} · ${esc(x.indicador)}</h3><div class="epi-valor">${esc(x.valor)}${esc(x.unidad)}</div><p>${esc(x.periodo_prevalencia)} · ${esc(x.poblacion)} · ${esc(x.grupo_edad)} · ${esc(x.anio_ejecucion)}</p><p class="epi-fuente"><a href="${esc(x.fuente_url)}" target="_blank" rel="noopener noreferrer">Fuente INSM</a> · ${esc(x.referencia)}</p></article>`).join("");
  if(r.territorios.length>1){
    if(r.comparaciones.length){
      h += r.comparaciones.map(c =>
        c.calculable
          ? `<div class="epi-comparacion"><strong>Comparación descriptiva compatible:</strong> ${esc(c.a.territorio)} ${c.a.valor}% → ${esc(c.b.territorio)} ${c.b.valor}%; diferencia ${c.diferencia_pp.toFixed(1)} pp; cambio relativo ${c.cambio_relativo_pct.toFixed(1)}%; razón ${c.razon_prevalencias.toFixed(2)}.</div>`
          : `<div class="epi-aviso"><strong>No comparable:</strong> ${esc(c.razones.join(" "))}</div>`
      ).join("");
    } else {
      h += '<div class="epi-aviso">Hay resultados, pero no existe un par con el mismo período/población para compararlos directamente.</div>';
    }
  }
  n.innerHTML=h;
}
function init(){
 const input=document.getElementById("epi-consulta"),btn=document.getElementById("epi-buscar"),salida=document.getElementById("epi-respuesta");
 if(!input||!btn||!salida)return;
 const run=()=>render(consultar(input.value),salida);
 btn.addEventListener("click",run);
 input.addEventListener("keydown",e=>{if(e.key==="Enter")run();});
}
window.SIPEpidemiologia={consultar,comparar,render};
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();
