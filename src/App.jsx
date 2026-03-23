import { useState, useMemo, useEffect, useCallback } from ‘react’;
import { loadAllData } from ‘./data’;
import { CATEGORIAS, CONDICOES, PERFIS, ROBERTO_EMAIL, SHEETS_ID, EMPRESA } from ‘./config’;

const SHEETS_URL = `https://docs.google.com/spreadsheets/d/${SHEETS_ID}/edit`;
const fmt = v => v != null ? v.toLocaleString(‘pt-BR’,{style:‘currency’,currency:‘BRL’}) : ‘—’;
const agoraF = () => new Date().toLocaleString(‘pt-BR’);

const getNome = i => {
const e = i.especie||’’, p = i.produto||’’, d = i.dimensoes||’’;
if(e&&p) return `${e} — ${p}`;
if(e&&d) return `${e} — ${d}`;
return e||p||d||’—’;
};
const getPreco = (i,t=‘vista’) => {
if(t===‘vista’) return i.precoVista||i.precoBase||i.precoTotal||null;
if(t===‘medio’) return i.precoMedio||i.precoPrazo||null;
return i.precoLongo||null;
};
const pExibir = (i,usr,t=‘vista’) => {
const p = getPreco(i,t);
if(!p) return null;
if(usr.tipo===‘admin’) return p;
return Math.round(p*(1+(usr.margemPadrao||8)/100));
};
const gF = i => i.fornecedor||’’;
const gD = i => i.disponivel||i.qtdDisp||i.m2Disp||’’;
const gC = i => i.condicao||’’;
const gT = i => i.tipo||’’;
const gO = i => i.obs||’’;
const gU = i => i.unidade||‘m²’;

const S={bg:’#F5F0E8’,dk:’#2C2416’,da:’#4A3728’,cr:’#E8DCC8’,mu:’#8B7D6B’,ml:’#A89878’,bd:’#DDD5C8’,bk:’#C4BBAA’,go:’#D4A843’,gn:’#2D5016’,gl:’#E8F5E0’,sf:’#EDE6D8’,wh:’#FFF’,wa:’#25D366’,rd:’#C0392B’};
const B={border:‘none’,cursor:‘pointer’,fontFamily:‘inherit’,transition:‘all 0.15s’};
const I={width:‘100%’,padding:‘8px 10px’,border:`1px solid ${S.bk}`,borderRadius:6,fontSize:13,fontFamily:‘inherit’,background:S.wh,color:S.dk,boxSizing:‘border-box’};
const L={fontSize:10,fontWeight:700,color:S.mu,textTransform:‘uppercase’,letterSpacing:0.5,marginBottom:3,display:‘block’};

const gerarPDF = (ped,usr) => {
const i=ped.item, its=ped.itensPedido||[];
const tF=its.reduce((s,x)=>s+(parseFloat(x.pForn||0)*parseFloat(x.qtd||0)),0);
const tC=its.reduce((s,x)=>s+(parseFloat(x.pCli||0)*parseFloat(x.qtd||0)),0);
const h=`<!DOCTYPE html><html><head><meta charset="utf-8"><style>@page{size:A4;margin:15mm}*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#222;font-size:10pt}.pg{max-width:700px;margin:0 auto}.hd{display:flex;justify-content:space-between;border-bottom:3px solid #2C2416;padding-bottom:10px;margin-bottom:14px}.lg{font-family:Georgia,serif;font-size:22pt;font-weight:bold;color:#2C2416}.ls{font-size:8pt;color:#999;letter-spacing:3px;text-transform:uppercase}.ei{text-align:right;font-size:8pt;color:#888}.tt{background:#2C2416;color:#E8DCC8;text-align:center;font-size:14pt;font-weight:bold;padding:8px;margin-bottom:14px}.ib{border:1px solid #ccc;padding:10px 12px;margin-bottom:12px;border-radius:4px}.ig{display:grid;grid-template-columns:1fr 1fr;gap:6px 30px}.il{font-size:8pt;color:#888;text-transform:uppercase;font-weight:bold}.iv{font-size:10pt;font-weight:600}table{width:100%;border-collapse:collapse;margin:10px 0}th{background:#F5F0E8;padding:7px;text-align:left;font-size:8pt;text-transform:uppercase;color:#666;border-bottom:2px solid #2C2416;border-top:2px solid #2C2416}td{padding:6px 7px;border-bottom:1px solid #ddd;font-size:9pt}.tb{display:flex;justify-content:flex-end}.tw{width:240px}.tr{display:flex;justify-content:space-between;padding:4px 0;font-size:9pt;border-bottom:1px solid #eee}.tf{font-size:11pt;font-weight:bold;border-top:2px solid #2C2416;padding:6px 0}.pb{border:1px solid #ccc;padding:10px;margin:12px 0;text-align:center;font-weight:bold}.ft{margin-top:30px;border-top:1px solid #ccc;padding-top:8px;font-size:8pt;color:#999;text-align:center}.as{margin-top:40px;display:flex;gap:40px}.ac{flex:1;padding-top:6px;border-top:1px solid #666;font-size:8pt;color:#666;text-align:center}@media print{body{-webkit-print-color-adjust:exact}}</style></head><body><div class="pg"><div class="hd"><div><div class="lg">${EMPRESA.nome}</div><div class="ls">Representações Comerciais</div></div><div class="ei">${EMPRESA.site}<br>${EMPRESA.telefone}<br>${EMPRESA.email}</div></div><div class="tt">PEDIDO DE VENDA</div><div class="ib"><div class="ig"><div><div class="il">Cliente</div><div class="iv">${ped.cliente||'—'}</div></div><div><div class="il">Data</div><div class="iv">${agoraF()}</div></div><div><div class="il">Telefone</div><div class="iv">${ped.clienteTel||'—'}</div></div><div><div class="il">Perfil</div><div class="iv">${usr.nome}</div></div></div></div><div class="ib"><div class="ig"><div><div class="il">Produto</div><div class="iv">${getNome(i)}</div></div><div><div class="il">Fornecedor</div><div class="iv">${ped.fornecedor||gF(i)}</div></div></div></div>${its.length?`<table><thead><tr><th>#</th><th>Qtd</th><th>Medidas</th><th style="text-align:right">Forn.</th><th style="text-align:right">Cli.</th></tr></thead><tbody>${its.map((x,j)=>`<tr><td>${j+1}</td><td>${x.qtd||'—'} ${gU(i)}</td><td>${x.medida||'—'}</td><td style="text-align:right">${x.pForn?fmt(x.pForn):'—'}</td><td style="text-align:right">${x.pCli?fmt(x.pCli):'—'}</td></tr>`).join(’’)}</tbody></table><div class="tb"><div class="tw"><div class="tr">Total Forn.<span>${fmt(tF)}</span></div><div class="tr">Total Cli.<span>${fmt(tC)}</span></div><div class="tr tf">Margem<span>${fmt(tC-tF)}</span></div></div></div>`:''}<div class="pb">Condição: ${ped.condicao}</div>${ped.obs?`<div style="background:#FAFAF5;padding:8px;border-left:3px solid #D4A843;margin:10px 0;font-size:9pt"><b>Obs:</b> ${ped.obs}</div>`:''}<div class="as"><div class="ac">Ass. Cliente</div><div class="ac">Data ____/____/____</div></div><div class="ft">${EMPRESA.nome} — ${EMPRESA.endereco}</div></div></body></html>`;
const w=window.open(’’,’_blank’);if(w){w.document.write(h);w.document.close();setTimeout(()=>w.print(),600);}
};

export default function App() {
const[usr,setUsr]=useState(null);
const[allData,setAllData]=useState(null);
const[loading,setLoading]=useState(false);
const[erro,setErro]=useState(null);
const[cat,setCat]=useState(‘nativa’);
const[q,setQ]=useState(’’);
const[ff,setFF]=useState(‘Todos’);
const[exp,setExp]=useState(null);
const[ef,setEF]=useState(new Set());
const[sel,setSel]=useState(new Set());
const[fav,setFav]=useState(()=>{try{return new Set(JSON.parse(localStorage.getItem(‘fsr-fav’)||’[]’));}catch{return new Set();}});
const[onlyFav,setOnlyFav]=useState(false);
const[cp,setCp]=useState(false);
const[editItem,setEditItem]=useState(null);
const[pedido,setPedido]=useState(null);
const[quickUp,setQuickUp]=useState(false);
const[showNews,setShowNews]=useState(false);
const[seenNews,setSeenNews]=useState(new Set());
const adm=usr?.tipo===‘admin’;

useEffect(()=>{localStorage.setItem(‘fsr-fav’,JSON.stringify([…fav]));},[fav]);

const carregarDados=useCallback(async()=>{
setLoading(true);setErro(null);
try{const d=await loadAllData();setAllData(d);}
catch(e){console.error(e);setErro(‘Erro ao carregar. Verifique se a planilha está publicada e compartilhada.’);}
setLoading(false);
},[]);

useEffect(()=>{if(usr)carregarDados();},[usr]);
useEffect(()=>{if(usr)setCat(usr.catPadrao||‘nativa’);},[usr]);
useEffect(()=>{setFF(‘Todos’);setExp(null);setSel(new Set());setEF(new Set());},[cat]);

const getItems=useCallback(()=>{
if(!allData)return[];
const m={
nativa:allData.nativa||[],
beneficiada:(allData.beneficiada||[]).filter(i=>![‘compensado’,‘mdf’,‘mdp’,‘porta’].some(t=>gT(i).toLowerCase().includes(t))),
compensados:(allData.beneficiada||[]).filter(i=>[‘compensado’,‘mdf’,‘mdp’].some(t=>gT(i).toLowerCase().includes(t))),
portas:(allData.beneficiada||[]).filter(i=>gT(i).toLowerCase().includes(‘porta’)),
reflorestamento:allData.reflorestamento||[],
pisopronto:allData.pisosProntos||[],
};
return m[cat]||[];
},[allData,cat]);

const items=useMemo(()=>getItems(),[getItems]);
const filt=useMemo(()=>items.filter(i=>{
const t=q.toLowerCase();
const f=[i.especie,i.produto,i.fornecedor,i.obs,i.tipo,i.dimensoes,i.qualidade].filter(Boolean);
const mb=!q||f.some(x=>x.toLowerCase().includes(t));
const mf=ff===‘Todos’||gF(i)===ff;
const mfav=!onlyFav||fav.has(i.id);
return mb&&mf&&mfav;
}),[items,q,ff,onlyFav,fav]);

const grp=useMemo(()=>{const m=new Map();filt.forEach(i=>{const k=gF(i)||‘Outros’;if(!m.has(k))m.set(k,[]);m.get(k).push(i);});return[…m.entries()].sort((a,b)=>a[0].localeCompare(b[0]));},[filt]);
const forns=useMemo(()=>[‘Todos’,…new Set(items.map(gF).filter(Boolean))],[items]);

const newsItems=useMemo(()=>{
if(!allData)return[];
const all=[];
const add=(items,catId)=>{const ci=CATEGORIAS.find(c=>c.id===catId);(items||[]).forEach(i=>{if(i.destaque)all.push({…i,_catNome:ci?.nome||’’,_catIcon:ci?.icon||’’});});};
add(allData.nativa,‘nativa’);add(allData.beneficiada,‘beneficiada’);add(allData.reflorestamento,‘reflorestamento’);add(allData.pisosProntos,‘pisopronto’);
return all;
},[allData]);
const unseenNews=newsItems.filter(n=>!seenNews.has(n.id)).length;

const tSel=(id,e)=>{e.stopPropagation();setSel(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});};
const tFav=(id,e)=>{e.stopPropagation();setFav(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});};
const tEF=f=>setEF(p=>{const n=new Set(p);n.has(f)?n.delete(f):n.add(f);return n;});
const selAll=(its,e)=>{e.stopPropagation();setSel(p=>{const n=new Set(p);const a=its.every(x=>n.has(x.id));its.forEach(x=>a?n.delete(x.id):n.add(x.id));return n;});};
const copy=async(t,e)=>{if(e)e.stopPropagation();try{await navigator.clipboard.writeText(t);}catch{const a=document.createElement(‘textarea’);a.value=t;document.body.appendChild(a);a.select();document.execCommand(‘copy’);document.body.removeChild(a);}setCp(true);setTimeout(()=>setCp(false),2e3);};

const txtItem=i=>{const p=pExibir(i,usr);let t=`*${getNome(i)}*\n`;if(p)t+=`Preço: ${fmt(p)}/${gU(i)}\n`;const pm=pExibir(i,usr,‘medio’);if(pm)t+=`Prazo: ${fmt(pm)}\n`;if(gC(i))t+=`Cond: ${gC(i)}\n`;if(gD(i))t+=`Disp: ${gD(i)}\n`;if(gO(i))t+=`Obs: ${gO(i)}\n`;t+=`\n_${EMPRESA.nome}_`;return t;};
const txtSel=()=>{const its=filt.filter(i=>sel.has(i.id));const pf=new Map();its.forEach(i=>{const k=gF(i);if(!pf.has(k))pf.set(k,[]);pf.get(k).push(i);});let t=’’;pf.forEach((v,k)=>{t+=`*📦 ${k}*\n\n`;v.forEach(i=>{t+=`*${getNome(i)}*\n`;const p=pExibir(i,usr);if(p)t+=`  ${fmt(p)}/${gU(i)}\n`;if(gD(i))t+=`  Disp: ${gD(i)}\n`;t+=’\n’;});});t+=`_${EMPRESA.nome}_`;return t;};

// ═══ LOGIN ═══
if(!usr)return(
<div style={{minHeight:‘100vh’,background:`linear-gradient(160deg,${S.dk},#5A4A38)`,display:‘flex’,flexDirection:‘column’,alignItems:‘center’,justifyContent:‘center’,padding:24,fontFamily:”‘Source Sans 3’,sans-serif”}}>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
<div style={{marginBottom:32,textAlign:‘center’}}><h1 style={{fontFamily:”‘DM Serif Display’,serif”,fontSize:32,color:S.cr,margin:0}}>F. Silva Reis</h1><p style={{color:S.go,fontSize:12,fontWeight:700,textTransform:‘uppercase’,letterSpacing:2,marginTop:4}}>Central de Preços</p></div>
<div style={{width:‘100%’,maxWidth:300,display:‘grid’,gridTemplateColumns:‘1fr 1fr’,gap:8}}>
{PERFIS.map(p=><button key={p.id} onClick={()=>setUsr(p)} style={{…B,padding:‘14px 8px’,borderRadius:12,background:p.tipo===‘admin’?S.go:‘rgba(255,255,255,0.07)’,color:p.tipo===‘admin’?S.dk:S.cr,textAlign:‘center’,gridColumn:p.tipo===‘admin’?‘1/-1’:‘auto’}}><div style={{fontSize:24}}>{p.icon}</div><div style={{fontSize:14,fontWeight:800,marginTop:3}}>{p.nome}</div><div style={{fontSize:9,opacity:0.6}}>{p.desc}</div></button>)}
</div>
</div>
);

if(loading)return(<div style={{minHeight:‘100vh’,background:S.bg,display:‘flex’,alignItems:‘center’,justifyContent:‘center’,fontFamily:”‘Source Sans 3’”}}><link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;700&display=swap" rel="stylesheet"/><div style={{textAlign:‘center’}}><div style={{fontSize:40}}>🌳</div><p style={{color:S.mu,marginTop:8}}>Carregando preços da planilha…</p></div></div>);

if(erro)return(<div style={{minHeight:‘100vh’,background:S.bg,display:‘flex’,flexDirection:‘column’,alignItems:‘center’,justifyContent:‘center’,padding:24,fontFamily:”‘Source Sans 3’”}}><link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;700&display=swap" rel="stylesheet"/><p style={{color:S.rd,textAlign:‘center’,marginBottom:16}}>⚠️ {erro}</p><button onClick={carregarDados} style={{…B,background:S.dk,color:S.cr,padding:‘10px 24px’,borderRadius:8,fontWeight:700}}>Tentar novamente</button><button onClick={()=>setUsr(null)} style={{…B,color:S.mu,padding:10,fontSize:12,marginTop:8,background:‘none’}}>← Voltar</button></div>);

// ═══ EDIT OVERLAY (full screen = no focus bug) ═══
if(editItem)return(
<div style={{minHeight:‘100vh’,background:S.bg,fontFamily:”‘Source Sans 3’,sans-serif”,color:S.dk,maxWidth:480,margin:‘0 auto’}}>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
<div style={{background:`linear-gradient(135deg,${S.dk},${S.da})`,padding:16,position:‘sticky’,top:0,zIndex:100}}>
<div style={{display:‘flex’,alignItems:‘center’,gap:12}}><button onClick={()=>setEditItem(null)} style={{…B,background:‘none’,color:S.cr,fontSize:22}}>←</button><h2 style={{fontFamily:”‘DM Serif Display’,serif”,fontSize:18,color:S.cr,margin:0}}>✏️ Editar Item</h2></div>
</div>
<div style={{padding:16,display:‘grid’,gap:10}}>
<div style={{background:’#FFF8E7’,borderRadius:8,padding:10,fontSize:11,color:’#8B6914’}}>⚠️ Edições aqui são temporárias. Para permanentes, edite na planilha.</div>
<div style={{display:‘grid’,gridTemplateColumns:‘1fr 1fr’,gap:8}}>
<div><div style={L}>Fornecedor</div><input style={I} value={editItem.fornecedor||’’} onChange={e=>setEditItem({…editItem,fornecedor:e.target.value})}/></div>
<div><div style={L}>Espécie</div><input style={I} value={editItem.especie||’’} onChange={e=>setEditItem({…editItem,especie:e.target.value})}/></div>
</div>
<div style={{display:‘grid’,gridTemplateColumns:‘1fr 1fr’,gap:8}}>
<div><div style={L}>Produto</div><input style={I} value={editItem.produto||editItem.dimensoes||’’} onChange={e=>setEditItem({…editItem,produto:e.target.value})}/></div>
<div><div style={L}>Unidade</div><input style={I} value={editItem.unidade||’’} onChange={e=>setEditItem({…editItem,unidade:e.target.value})}/></div>
</div>
<div style={{display:‘grid’,gridTemplateColumns:‘1fr 1fr’,gap:8}}>
<div><div style={L}>Preço Custo</div><input style={I} type=“number” value={editItem.precoVista||’’} onChange={e=>setEditItem({…editItem,precoVista:Number(e.target.value)})}/></div>
<div><div style={L}>Disponível</div><input style={I} value={gD(editItem)} onChange={e=>setEditItem({…editItem,disponivel:e.target.value,qtdDisp:e.target.value,m2Disp:e.target.value})}/></div>
</div>
<div style={{display:‘grid’,gridTemplateColumns:‘1fr 1fr’,gap:8}}>
<div><div style={L}>Condição</div><select style={I} value={gC(editItem)} onChange={e=>setEditItem({…editItem,condicao:e.target.value})}><option value="">–</option>{CONDICOES.map(c=><option key={c}>{c}</option>)}</select></div>
<div><div style={L}>Obs</div><input style={I} value={gO(editItem)} onChange={e=>setEditItem({…editItem,obs:e.target.value})}/></div>
</div>
<div style={{display:‘grid’,gridTemplateColumns:‘1fr 1fr’,gap:8}}>
<button onClick={()=>setEditItem(null)} style={{…B,background:S.bk,color:S.dk,padding:‘12px 0’,borderRadius:8,fontWeight:700}}>Cancelar</button>
<button onClick={()=>setEditItem(null)} style={{…B,background:S.gn,color:S.wh,padding:‘12px 0’,borderRadius:8,fontWeight:700}}>✓ OK</button>
</div>
<button onClick={()=>window.open(SHEETS_URL,’_blank’)} style={{…B,width:‘100%’,background:S.dk,color:S.go,padding:‘12px 0’,borderRadius:8,fontWeight:700}}>📊 Abrir Planilha (edição permanente)</button>
</div>
</div>
);

// ═══ PEDIDO OVERLAY ═══
if(pedido){
const i=pedido.item,its=pedido.itensPedido||[];
const tF=its.reduce((s,x)=>s+(parseFloat(x.pForn||0)*parseFloat(x.qtd||0)),0);
const tC=its.reduce((s,x)=>s+(parseFloat(x.pCli||0)*parseFloat(x.qtd||0)),0);
const mg=tC-tF;
const txt=`📋 PEDIDO — ${EMPRESA.nome}\nPerfil: ${usr.nome}\nCliente: ${pedido.cliente}\nFornecedor: ${pedido.fornecedor||gF(i)}\n──────────\n${getNome(i)}\n${its.map((x,j)=>`${j+1}. ${x.qtd||’—’} ${gU(i)} ${x.medida?`(${x.medida})`:’’}\n   Forn: ${x.pForn?fmt(x.pForn):’-’} → Cli: ${x.pCli?fmt(x.pCli):’-’}`).join('\n')}\n\nForn: ${fmt(tF)} | Cli: ${fmt(tC)} | Margem: ${fmt(mg)}\nCond: ${pedido.condicao}${pedido.obs?`\nObs: ${pedido.obs}`:''}`;
return(
<div style={{minHeight:‘100vh’,background:S.bg,fontFamily:”‘Source Sans 3’,sans-serif”,color:S.dk,maxWidth:480,margin:‘0 auto’}}>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
<div style={{background:`linear-gradient(135deg,${S.dk},${S.da})`,padding:16,position:‘sticky’,top:0,zIndex:100}}>
<div style={{display:‘flex’,alignItems:‘center’,gap:12}}><button onClick={()=>setPedido(null)} style={{…B,background:‘none’,color:S.cr,fontSize:22}}>←</button><h2 style={{fontFamily:”‘DM Serif Display’,serif”,fontSize:18,color:S.cr,margin:0}}>Pedido</h2></div>
</div>
<div style={{padding:16,display:‘grid’,gap:10}}>
<div style={{display:‘grid’,gridTemplateColumns:‘1fr 1fr’,gap:8}}>
<div><div style={L}>Cliente *</div><input style={I} value={pedido.cliente} onChange={e=>setPedido({…pedido,cliente:e.target.value})}/></div>
<div><div style={L}>Telefone</div><input style={I} value={pedido.clienteTel||’’} onChange={e=>setPedido({…pedido,clienteTel:e.target.value})}/></div>
</div>
<div><div style={L}>Fornecedor</div><input style={I} value={pedido.fornecedor||’’} onChange={e=>setPedido({…pedido,fornecedor:e.target.value})} placeholder={gF(i)}/></div>
<div style={{background:S.sf,borderRadius:8,padding:12,border:`1px solid ${S.bd}`}}>
<div style={{...L,marginBottom:8}}>Itens — {getNome(i)}</div>
{its.map((x,j)=><div key={j} style={{background:S.wh,borderRadius:6,padding:10,marginBottom:8,border:`1px solid ${S.bd}`}}>
<div style={{display:‘flex’,justifyContent:‘space-between’,marginBottom:6}}><span style={{fontSize:11,fontWeight:700}}>Item {j+1}</span><button onClick={()=>setPedido({…pedido,itensPedido:its.filter((_,k)=>k!==j)})} style={{…B,background:‘none’,color:S.rd,fontSize:14}}>✕</button></div>
<div style={{display:‘grid’,gridTemplateColumns:‘1fr 1fr’,gap:6,marginBottom:6}}>
<div><div style={{...L,fontSize:9}}>Qtd</div><input style={I} value={x.qtd||’’} onChange={e=>{const n=[…its];n[j]={…n[j],qtd:e.target.value};setPedido({…pedido,itensPedido:n});}}/></div>
<div><div style={{...L,fontSize:9}}>Medidas</div><input style={I} value={x.medida||’’} onChange={e=>{const n=[…its];n[j]={…n[j],medida:e.target.value};setPedido({…pedido,itensPedido:n});}}/></div>
</div>
<div style={{display:‘grid’,gridTemplateColumns:‘1fr 1fr’,gap:6}}>
<div style={{background:’#FFF5F5’,borderRadius:4,padding:6}}><div style={{...L,fontSize:9,color:S.rd}}>💰 Fornecedor</div><input style={{…I,borderColor:’#e8aaaa’}} type=“number” value={x.pForn||’’} onChange={e=>{const n=[…its];n[j]={…n[j],pForn:Number(e.target.value)};setPedido({…pedido,itensPedido:n});}}/></div>
<div style={{background:S.gl,borderRadius:4,padding:6}}><div style={{...L,fontSize:9,color:S.gn}}>🏷️ Cliente</div><input style={{…I,borderColor:’#a8d8a8’}} type=“number” value={x.pCli||’’} onChange={e=>{const n=[…its];n[j]={…n[j],pCli:Number(e.target.value)};setPedido({…pedido,itensPedido:n});}}/></div>
</div>
{x.pForn>0&&x.pCli>0&&<div style={{marginTop:6,padding:‘4px 8px’,background:x.pCli>x.pForn?S.gl:’#FFF0F0’,borderRadius:4,fontSize:10,fontWeight:700,color:x.pCli>x.pForn?S.gn:S.rd,textAlign:‘center’}}>Margem: {fmt(x.pCli-x.pForn)} ({((x.pCli-x.pForn)/x.pForn*100).toFixed(1)}%)</div>}
</div>)}
<button onClick={()=>setPedido({…pedido,itensPedido:[…its,{qtd:’’,medida:’’,pForn:getPreco(i)||0,pCli:pExibir(i,usr)||0}]})} style={{…B,width:‘100%’,background:S.dk,color:S.cr,padding:‘8px 0’,borderRadius:6,fontSize:11,fontWeight:700}}>+ Item</button>
</div>
{tF>0&&<div style={{background:S.dk,borderRadius:8,padding:12,color:S.cr}}>
<div style={{display:‘flex’,justifyContent:‘space-between’,fontSize:11,marginBottom:4}}><span>Fornecedor:</span><b>{fmt(tF)}</b></div>
<div style={{display:‘flex’,justifyContent:‘space-between’,fontSize:11,marginBottom:4}}><span>Cliente:</span><b>{fmt(tC)}</b></div>
<div style={{borderTop:`1px solid ${S.da}`,paddingTop:6,display:‘flex’,justifyContent:‘space-between’,fontSize:13,fontWeight:900}}><span>Margem:</span><span style={{color:mg>=0?’#90EE90’:’#FF6B6B’}}>{fmt(mg)}</span></div>
</div>}
<div style={{display:‘grid’,gridTemplateColumns:‘1fr 1fr’,gap:8}}>
<div><div style={L}>Condição</div><select style={I} value={pedido.condicao} onChange={e=>setPedido({…pedido,condicao:e.target.value})}>{CONDICOES.map(c=><option key={c}>{c}</option>)}</select></div>
<div><div style={L}>Obs</div><input style={I} value={pedido.obs||’’} onChange={e=>setPedido({…pedido,obs:e.target.value})}/></div>
</div>
<div style={{display:‘grid’,gridTemplateColumns:‘1fr 1fr 1fr’,gap:6}}>
<button onClick={e=>copy(txt,e)} style={{…B,background:S.wa,color:S.wh,padding:‘12px 0’,borderRadius:8,fontSize:11,fontWeight:700}}>{cp?‘✓’:‘📋’} WA</button>
<button onClick={()=>window.open(`mailto:${ROBERTO_EMAIL}?subject=${encodeURIComponent('Pedido '+usr.nome+' - '+getNome(i))}&body=${encodeURIComponent(txt.replace(/\n/g,'\r\n'))}`)} style={{…B,background:S.dk,color:S.cr,padding:‘12px 0’,borderRadius:8,fontSize:11,fontWeight:700}}>✉️ Email</button>
<button onClick={()=>gerarPDF(pedido,usr)} style={{…B,background:’#8B2500’,color:S.wh,padding:‘12px 0’,borderRadius:8,fontSize:11,fontWeight:700}}>📄 PDF</button>
</div>
</div>
</div>
);
}

// ═══ NEWS OVERLAY ═══
if(showNews)return(
<div style={{minHeight:‘100vh’,background:S.bg,fontFamily:”‘Source Sans 3’,sans-serif”,color:S.dk,maxWidth:480,margin:‘0 auto’}}>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
<div style={{background:`linear-gradient(135deg,${S.dk},${S.da})`,padding:16,position:‘sticky’,top:0,zIndex:100}}>
<div style={{display:‘flex’,alignItems:‘center’,gap:12}}><button onClick={()=>{setShowNews(false);setSeenNews(new Set(newsItems.map(n=>n.id)));}} style={{…B,background:‘none’,color:S.cr,fontSize:22}}>←</button><h2 style={{fontFamily:”‘DM Serif Display’,serif”,fontSize:18,color:S.cr,margin:0}}>🔔 Novidades ({newsItems.length})</h2></div>
</div>
<div style={{padding:‘10px 16px’}}>
{newsItems.length===0?<div style={{textAlign:‘center’,padding:40,color:S.mu}}>Nenhuma novidade. Marque itens como “Destaque” na planilha.</div>:
newsItems.map(i=><div key={i.id} style={{background:S.wh,borderRadius:8,border:`1px solid ${S.bd}`,marginBottom:8,overflow:‘hidden’}}>
<div style={{background:`linear-gradient(90deg,${S.go},#E8C65A)`,padding:‘3px 12px’,display:‘flex’,justifyContent:‘space-between’}}>
<span style={{fontSize:9,fontWeight:700,color:S.dk,textTransform:‘uppercase’}}>⭐ Destaque</span>
<span style={{fontSize:9,color:’#5A4A38’}}>{i._catIcon} {i._catNome}</span>
</div>
<div style={{padding:‘10px 12px’}}>
<div style={{fontSize:13,fontWeight:700}}>{getNome(i)}</div>
<div style={{fontSize:10,color:S.mu}}>{gF(i)}</div>
{getPreco(i)&&<div style={{fontSize:14,fontWeight:900,color:S.gn,marginTop:4}}>{fmt(pExibir(i,usr))}<span style={{fontSize:9,color:S.mu,fontWeight:400}}>/{gU(i)}</span></div>}
</div>
</div>)}
</div>
</div>
);

// ═══ QUICK UPDATE ═══
if(quickUp)return(
<div style={{minHeight:‘100vh’,background:S.bg,fontFamily:”‘Source Sans 3’,sans-serif”,color:S.dk,maxWidth:480,margin:‘0 auto’}}>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
<div style={{background:`linear-gradient(135deg,${S.dk},${S.da})`,padding:16,position:‘sticky’,top:0,zIndex:100}}>
<div style={{display:‘flex’,alignItems:‘center’,gap:12}}><button onClick={()=>setQuickUp(false)} style={{…B,background:‘none’,color:S.cr,fontSize:22}}>←</button><h2 style={{fontFamily:”‘DM Serif Display’,serif”,fontSize:18,color:S.cr,margin:0}}>⚡ Atualização</h2></div>
</div>
<div style={{padding:16,display:‘grid’,gap:12}}>
<p style={{fontSize:12,color:S.mu}}>Para atualizar preços permanentemente, edite direto na planilha e depois recarregue os dados:</p>
<button onClick={()=>window.open(SHEETS_URL,’_blank’)} style={{…B,width:‘100%’,background:S.dk,color:S.go,padding:‘16px 0’,borderRadius:8,fontWeight:700,fontSize:16}}>📊 Abrir Planilha</button>
<button onClick={()=>{setQuickUp(false);carregarDados();}} style={{…B,width:‘100%’,background:S.gn,color:S.wh,padding:‘14px 0’,borderRadius:8,fontWeight:700,fontSize:14}}>🔄 Recarregar Dados</button>
<p style={{fontSize:10,color:S.mu,textAlign:‘center’}}>1. Edite na planilha → 2. Volte aqui → 3. Recarregar</p>
</div>
</div>
);

// ═══ CARD ═══
const Card=({item})=>{
const isE=exp===item.id,isF=fav.has(item.id),isS=sel.has(item.id);
const p=pExibir(item,usr);
return(
<div style={{display:‘flex’,marginBottom:5}}>
<div onClick={e=>tSel(item.id,e)} style={{width:28,display:‘flex’,alignItems:‘center’,justifyContent:‘center’,cursor:‘pointer’,background:isS?S.gn:’#EDE6D8’,borderRadius:‘6px 0 0 6px’}}><span style={{fontSize:12,color:isS?‘white’:S.bk,fontWeight:700}}>{isS?‘✓’:’’}</span></div>
<div onClick={()=>setExp(isE?null:item.id)} style={{flex:1,background:S.wh,borderRadius:‘0 6px 6px 0’,border:item.destaque?`2px solid ${S.go}`:`1px solid ${S.bd}`,borderLeft:‘none’,cursor:‘pointer’,overflow:‘hidden’}}>
{item.destaque&&<div style={{background:`linear-gradient(90deg,${S.go},#E8C65A)`,color:S.dk,fontSize:8,fontWeight:700,textTransform:‘uppercase’,letterSpacing:1,padding:‘1px 10px’,textAlign:‘center’}}>⭐ Destaque</div>}
<div style={{padding:‘8px 10px’}}>
<div style={{display:‘flex’,justifyContent:‘space-between’,alignItems:‘flex-start’}}>
<div style={{flex:1}}>
{gT(item)&&<div style={{fontSize:8,fontWeight:700,color:S.ml,textTransform:‘uppercase’}}>{gT(item)} {item.qualidade&&item.qualidade!==‘1ª’?`· ${item.qualidade}`:’’}</div>}
<div style={{fontSize:13,fontWeight:700,color:S.dk,lineHeight:1.2}}>{getNome(item)}</div>
</div>
<div style={{display:‘flex’,gap:4,alignItems:‘flex-start’}}>
<span onClick={e=>tFav(item.id,e)} style={{fontSize:12,cursor:‘pointer’,opacity:isF?1:0.2}}>{isF?‘❤️’:‘🤍’}</span>
{p&&<div style={{textAlign:‘right’}}><div style={{fontSize:14,fontWeight:900,color:S.gn}}>{fmt(p)}</div><div style={{fontSize:8,color:S.mu}}>{adm?‘custo’:‘venda’}/{gU(item)}</div></div>}
</div>
</div>
{pExibir(item,usr,‘medio’)&&<div style={{fontSize:9,color:S.mu,marginTop:2}}>Prazo: <b>{fmt(pExibir(item,usr,‘medio’))}</b></div>}
<div style={{display:‘flex’,justifyContent:‘space-between’,fontSize:9,color:’#888’,marginTop:4}}><span>{gC(item)}</span><span>{gD(item)}</span></div>
{isE&&<div style={{marginTop:6,paddingTop:6,borderTop:`1px dashed ${S.bd}`,fontSize:10}}>
{item.comprimento&&<div style={{color:’#6B5D4D’,marginBottom:2}}><b>Comp:</b> {item.comprimento}</div>}
{item.comprimentoPct&&<div style={{color:’#6B5D4D’,marginBottom:2}}><b>Comp %:</b> {item.comprimentoPct}</div>}
{gO(item)&&<div style={{color:’#6B5D4D’,marginBottom:3}}><b>Obs:</b> {gO(item)}</div>}
<div style={{display:‘flex’,gap:4,marginTop:6}}>
<button onClick={e=>{e.stopPropagation();copy(txtItem(item),e);}} style={{…B,flex:1,background:S.wa,color:‘white’,padding:‘6px 0’,borderRadius:5,fontWeight:700,fontSize:10}}>{cp?‘✓’:‘📋’} Copiar</button>
<button onClick={e=>{e.stopPropagation();setPedido({item,cliente:’’,clienteTel:’’,fornecedor:gF(item),condicao:gC(item)||‘À vista’,obs:’’,itensPedido:[]});}} style={{…B,flex:1,background:S.dk,color:S.cr,padding:‘6px 0’,borderRadius:5,fontWeight:700,fontSize:10}}>📝 Pedido</button>
{adm&&<button onClick={e=>{e.stopPropagation();setEditItem({…item});}} style={{…B,flex:1,background:’#5A4A38’,color:S.cr,padding:‘6px 0’,borderRadius:5,fontWeight:700,fontSize:10}}>✏️ Editar</button>}
</div>
</div>}
</div>
</div>
</div>
);
};

// ═══ MAIN ═══
const ct=CATEGORIAS.find(c=>c.id===cat);const ns=sel.size;
return(
<div style={{minHeight:‘100vh’,background:S.bg,fontFamily:”‘Source Sans 3’,sans-serif”,color:S.dk,maxWidth:480,margin:‘0 auto’,paddingBottom:80}}>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
<div style={{background:`linear-gradient(135deg,${S.dk},${S.da})`,padding:‘12px 16px 0’,position:‘sticky’,top:0,zIndex:100,boxShadow:‘0 4px 20px rgba(44,36,22,0.3)’}}>
<div style={{display:‘flex’,alignItems:‘center’,justifyContent:‘space-between’,marginBottom:8}}>
<div><h1 style={{fontFamily:”‘DM Serif Display’,serif”,fontSize:20,color:S.cr,margin:0}}>F. Silva Reis</h1><p style={{color:S.ml,fontSize:9,margin:0,fontWeight:600,textTransform:‘uppercase’,letterSpacing:1.5}}>Central de Preços</p></div>
<div style={{display:‘flex’,gap:4,alignItems:‘center’}}>
<button onClick={()=>setShowNews(true)} style={{…B,background:‘rgba(255,255,255,0.1)’,color:S.cr,fontSize:12,padding:‘4px 8px’,borderRadius:6,position:‘relative’}}>🔔{unseenNews>0&&<span style={{position:‘absolute’,top:-4,right:-4,background:S.rd,color:‘white’,fontSize:8,fontWeight:700,width:16,height:16,borderRadius:8,display:‘flex’,alignItems:‘center’,justifyContent:‘center’}}>{unseenNews}</span>}</button>
<button onClick={carregarDados} style={{…B,background:‘rgba(255,255,255,0.1)’,color:S.cr,fontSize:12,padding:‘4px 8px’,borderRadius:6}}>🔄</button>
<button onClick={()=>setUsr(null)} style={{…B,background:‘rgba(255,255,255,0.1)’,color:S.cr,fontSize:10,padding:‘4px 8px’,borderRadius:6,fontWeight:600}}>{usr.icon}</button>
</div>
</div>
<div style={{display:‘flex’,gap:3,overflowX:‘auto’,paddingBottom:10,scrollbarWidth:‘none’}}>
{CATEGORIAS.map(c=>{const a=cat===c.id;return<button key={c.id} onClick={()=>setCat(c.id)} style={{…B,display:‘flex’,flexDirection:‘column’,alignItems:‘center’,padding:‘5px 9px’,borderRadius:10,minWidth:60,background:a?c.cor:‘rgba(255,255,255,0.06)’,border:a?`2px solid ${S.go}`:‘2px solid transparent’,opacity:a?1:0.7}}><span style={{fontSize:17}}>{c.icon}</span><span style={{fontSize:8,fontWeight:700,color:S.cr,marginTop:1,whiteSpace:‘nowrap’}}>{c.nome}</span></button>;})}
</div>
</div>
<div style={{padding:‘8px 16px’,background:S.sf,borderBottom:`1px solid ${S.bd}`}}>
<div style={{position:‘relative’,marginBottom:6}}><input type=“text” placeholder={`Buscar em ${ct?.nome||''}...`} value={q} onChange={e=>setQ(e.target.value)} style={{width:‘100%’,padding:‘7px 10px 7px 28px’,border:`1px solid ${S.bk}`,borderRadius:8,background:S.wh,color:S.dk,fontSize:12,outline:‘none’,boxSizing:‘border-box’,fontFamily:‘inherit’}}/><span style={{position:‘absolute’,left:8,top:‘50%’,transform:‘translateY(-50%)’,fontSize:12,opacity:0.4}}>🔍</span></div>
<div style={{display:‘flex’,gap:5,alignItems:‘center’}}><select value={ff} onChange={e=>setFF(e.target.value)} style={{flex:1,padding:‘5px 6px’,borderRadius:5,border:`1px solid ${S.bk}`,background:S.wh,fontSize:10,color:S.dk,fontFamily:‘inherit’}}>{forns.map(f=><option key={f}>{f}</option>)}</select><button onClick={()=>setOnlyFav(!onlyFav)} style={{…B,padding:‘4px 7px’,borderRadius:5,border:onlyFav?`2px solid ${S.rd}`:`1px solid ${S.bk}`,background:onlyFav?’#FFF0F0’:S.wh,fontSize:10}}>❤️</button></div>
</div>
{ns>0&&<div style={{padding:‘8px 16px’,background:S.gn,display:‘flex’,justifyContent:‘space-between’,alignItems:‘center’,position:‘sticky’,top:110,zIndex:99}}><span style={{color:‘white’,fontSize:12,fontWeight:700}}>{ns} sel.</span><div style={{display:‘flex’,gap:6}}><button onClick={e=>copy(txtSel(),e)} style={{…B,background:S.wa,color:‘white’,padding:‘5px 12px’,borderRadius:6,fontSize:11,fontWeight:700}}>{cp?‘✓’:‘📋 WA’}</button><button onClick={()=>setSel(new Set())} style={{…B,background:‘rgba(255,255,255,0.2)’,color:‘white’,padding:‘5px 10px’,borderRadius:6,fontSize:11}}>Limpar</button></div></div>}
<div style={{padding:‘10px 16px’}}>
{grp.length===0?<div style={{textAlign:‘center’,padding:40,color:S.mu}}>{allData?`Nenhum item em ${ct?.nome}`:‘Carregando…’}</div>:
grp.map(([forn,its])=>{
const op=ef.has(forn)||ff!==‘Todos’||q;const aS=its.every(x=>sel.has(x.id));const sS=its.some(x=>sel.has(x.id));
return<div key={forn} style={{marginBottom:10}}>
<div onClick={()=>tEF(forn)} style={{display:‘flex’,alignItems:‘center’,gap:8,padding:‘8px 10px’,background:S.dk,borderRadius:8,cursor:‘pointer’,marginBottom:op?4:0}}>
<div onClick={e=>selAll(its,e)} style={{width:22,height:22,borderRadius:4,background:aS?S.go:sS?‘rgba(212,168,67,0.4)’:‘rgba(255,255,255,0.15)’,display:‘flex’,alignItems:‘center’,justifyContent:‘center’,cursor:‘pointer’}}><span style={{fontSize:11,color:aS?S.dk:S.cr,fontWeight:700}}>{aS?‘✓’:sS?’—’:’’}</span></div>
<div style={{flex:1}}><div style={{color:S.cr,fontSize:13,fontWeight:700}}>{forn}</div><div style={{color:S.ml,fontSize:10}}>{its.length} itens</div></div>
<span style={{color:S.ml,fontSize:14,transform:op?‘rotate(90deg)’:‘rotate(0)’,transition:‘transform 0.2s’}}>›</span>
</div>
{op&&its.map(item=><Card key={item.id} item={item}/>)}
</div>;
})}
</div>
<div style={{textAlign:‘center’,padding:‘12px 16px 20px’,fontSize:10,color:S.ml}}>{filt.length} itens · Dados do Google Sheets</div>
{adm&&<button onClick={()=>setQuickUp(true)} style={{…B,position:‘fixed’,bottom:24,right:24,width:56,height:56,borderRadius:28,background:`linear-gradient(135deg,${S.go},#E8C65A)`,color:S.dk,fontSize:22,display:‘flex’,alignItems:‘center’,justifyContent:‘center’,boxShadow:‘0 4px 16px rgba(44,36,22,0.4)’,zIndex:200}}>⚡</button>}
</div>
);
}