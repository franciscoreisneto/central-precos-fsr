import { useState, useMemo, useEffect } from "react";
import { loadAllData } from "./data";

const E={nome:"F. Silva Reis",site:"www.fsilvareis.com.br",ig:"@f.silvareis",tel:"(21) XXXX-XXXX",email:"contato@fsilvareis.com.br",end:"Rio de Janeiro — RJ"};
const SHEETS_URL="https://docs.google.com/spreadsheets/d/1hdSXJYd1D7pZ1CaFhVTPrzjn-Hf6yiLgaYdhoua7Usw/edit";
const PERFIS=[
  {id:"admin",nome:"Admin",tipo:"admin",icon:"👑",desc:"Custos + Edição",mg:0,cat:"nativa"},
  {id:"rj",nome:"RJ",tipo:"v",icon:"🏙️",desc:"Rio de Janeiro",mg:8,cat:"nativa"},
  {id:"sp",nome:"SP",tipo:"v",icon:"🏗️",desc:"São Paulo",mg:10,cat:"nativa"},
  {id:"matcon",nome:"MATCON",tipo:"v",icon:"🧱",desc:"Mat. Construção",mg:8,cat:"nativa"},
  {id:"marc",nome:"MARCENARIA",tipo:"v",icon:"🪚",desc:"Compensados",mg:10,cat:"compensados"},
];
const CATS=[
  {id:"nativa",n:"Nativa Bruta",i:"🌳",c:"#2D5016"},
  {id:"beneficiada",n:"Beneficiada",i:"🪵",c:"#6B4226"},
  {id:"compensados",n:"Compensados",i:"📦",c:"#8B6914"},
  {id:"reflorestamento",n:"Reflor.",i:"🌲",c:"#4A7C2E"},
  {id:"portas",n:"Portas",i:"🚪",c:"#6B3A2A"},
  {id:"pisopronto",n:"Piso Pronto",i:"🏠",c:"#5A4A38"},
];
const CONDS=["À vista","30 dias","30/60","30/60/90","Ent+30/45/60","Ent+30/45/60/75/90","Antecipado","A combinar"];
const now=()=>Date.now();

const initData={
  nativa:[
    {id:"n1",f:"Fernando (verificar)",e:"Pariri",p:"Prancha Bruta",d:"2-3 cargas",u:"m³",pv:2800,cd:"À vista/Prazo",ob:"Embarque 15-20d",ts:now()-1e5},
    {id:"n2",f:"Fernando (verificar)",e:"Cedrinho",p:"Prancha Bruta",d:"3-4 cargas",u:"m³",pv:2800,cd:"À vista/Prazo",ob:"",ts:now()-86400000*3},
    {id:"n3",f:"Fernando (verificar)",e:"Cambará Preto",p:"Prancha Bruta",d:"3-4 cargas",u:"m³",pv:2650,cd:"À vista/Prazo",ob:"",ts:now()-86400000*3},
    {id:"n4",f:"Fornecedor WA 1",e:"Jequitibá Carvão",p:"Prancha Bruta",d:"",u:"m³",pv:2400,cd:"À vista",ob:"1ª qualidade",ts:now()-1e5,dt:true},
    {id:"n5",f:"Fornecedor WA 1",e:"Muirapiranga",p:"Prancha Bruta",d:"",u:"m³",pv:2800,cd:"À vista",ob:"",ts:now()-86400000*5},
  ],
  beneficiada:[
    {id:"b1",f:"GTP Pisos",tp:"Assoalho",e:"Tauari",dm:"19x100",u:"m²",pv:150,pm:160,pl:170,d:"71 m²",cd:"Ent+30/45/60/75/90",ob:"FOB mín 200m²",ts:now()-86400000*3},
    {id:"b2",f:"GTP Pisos",tp:"Deck",e:"Cumaru Ferro F/F",dm:"1,9x10",u:"m²",pv:250,pm:260,pl:270,d:"424 m²",cd:"Ent+30/45/60/75/90",ob:"",ts:now()-86400000*3},
    {id:"b3",f:"GTP Pisos",tp:"Forro",e:"Cedrinho",dm:"1,0x100",u:"m²",pv:100,pm:110,pl:120,d:"314 m²",cd:"Ent+30/45/60/75/90",ob:"",ts:now()-1e5},
    {id:"b4",f:"Fornecedor WA 2",tp:"Deck",e:"Ipê 1ª",dm:"10/06cm",u:"m²",pv:280,d:"",cd:"",ob:"",ts:now()-86400000*5},
  ],
  compensados:[
    {id:"c1",f:"Compensados ABC",e:"Virola",p:"Compensado 2,20x1,60",u:"chapa",cd:"30 dias",ob:"Lote promocional",d:"300 chapas",ts:now()-1e5,dt:true,subs:[{med:"4mm",pv:32},{med:"6mm",pv:45},{med:"10mm",pv:68},{med:"15mm",pv:92},{med:"20mm",pv:125}]},
    {id:"c2",f:"Compensados ABC",e:"Virola Naval",p:"Comp. Naval 2,20x1,60",u:"chapa",cd:"30 dias",ob:"",d:"Disponível",ts:now()-86400000*4,subs:[{med:"4mm",pv:42},{med:"6mm",pv:58},{med:"10mm",pv:82},{med:"15mm",pv:108}]},
    {id:"c3",f:"Greenplac",e:"MDF Cru",p:"Chapa 2,75x1,84",u:"chapa",cd:"30/60",ob:"CIF RJ >50ch",d:"Disponível",ts:now()-86400000*3,subs:[{med:"6mm",pv:72},{med:"9mm",pv:88},{med:"12mm",pv:112},{med:"15mm",pv:142},{med:"18mm",pv:168},{med:"25mm",pv:215}]},
    {id:"c4",f:"Giben",e:"MDP Cru",p:"Chapa 2,75x1,84",u:"chapa",cd:"30/60/90",ob:"",d:"Disponível",ts:now()-86400000*3,subs:[{med:"12mm",pv:78},{med:"15mm",pv:98},{med:"18mm",pv:118},{med:"25mm",pv:155}]},
  ],
  reflorestamento:[
    {id:"r1",f:"Joeli",e:"Pinus",p:"Comp. 27mm",u:"chapa",pv:1250,cd:"Sem comissão",ob:"Frete R$170",d:"",ts:now()-86400000*5},
    {id:"r2",f:"Eucaflora",e:"Eucalipto Trat.",p:"Mourão 12cm",u:"un",pv:38,cd:"30 dias",ob:"Autoclave",d:"2.000 un",ts:now()-86400000*3},
  ],
  portas:[
    {id:"p1",f:"Portas Cruzeiro",e:"",p:"Porta Semi-Oca Verniz",u:"un",cd:"30/60",ob:"Prazo 20 dias",d:"100 un",ts:now()-86400000*3,subs:[{med:"60x210cm",pv:280},{med:"70x210cm",pv:300},{med:"80x210cm",pv:320},{med:"90x210cm",pv:350}]},
    {id:"p2",f:"Randa",e:"",p:"Porta Maciça Pivotante",u:"un",cd:"30/60/90",ob:"30-45 dias",d:"Sob encom.",ts:now()-86400000*5,subs:[{med:"80x210cm",pv:1650},{med:"90x210cm",pv:1850},{med:"100x210cm",pv:2100}]},
    {id:"p3",f:"Schlindwein",e:"",p:"Porta Balcão Madeira/Vidro",u:"un",pv:2400,cd:"30/60/90",ob:"Nova linha",d:"Sob encom.",dt:true,ts:now()-1e5},
  ],
  pisopronto:[
    {id:"pp1",f:"GTP Pisos",e:"Cumaru Ferro",dm:"19x101",u:"m²",pv:280,pm:290,pl:300,d:"1100 m²",cd:"Ent+30/45/60/75/90",ob:"FOB",ts:now()-86400000*3},
    {id:"pp2",f:"GTP Pisos",e:"Tauari",dm:"19x101",u:"m²",pv:200,pm:210,pl:220,d:"4700 m²",cd:"Ent+30/45/60/75/90",ob:"",ts:now()-86400000*5},
    {id:"pp3",f:"GTP Pisos",e:"Ipê",dm:"17x82",u:"m²",pv:135,pm:145,pl:155,d:"1900 m²",cd:"Ent+30/45/60/75/90",ob:"",ts:now()-1e5,dt:true},
  ],
};

const parseTS = (v) => {
  if (!v) return Date.now();
  const meses = {jan:0,fev:1,mar:2,abr:3,mai:4,jun:5,jul:6,ago:7,set:8,out:9,nov:10,dez:11};
  const m = String(v).toLowerCase().match(/^(\w{3})\/(\d{2,4})$/);
  if (m) {
    const mes = meses[m[1]];
    const ano = m[2].length === 2 ? 2000 + parseInt(m[2]) : parseInt(m[2]);
    if (mes !== undefined) return new Date(ano, mes, 15).getTime();
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? Date.now() : d.getTime();
};

const mapSheetsToV9 = (sheetsData) => {
  const keyMap = { pisosProntos: "pisopronto" };
  const result = {};
  Object.keys(sheetsData).forEach((catKey) => {
    if (catKey === "vendedores") return;
    const outKey = keyMap[catKey] || catKey;
    const items = sheetsData[catKey] || [];
    result[outKey] = items.map((item) => {
      const mapped = {
        id: item.id,
        f: item.fornecedor || "",
        e: item.especie || "",
        p: item.produto || "",
        u: item.unidade || "m\u00b2",
        cd: item.condicao || "",
        ob: item.obs || "",
        d: item.disponivel || item.qtdDisp || item.m2Disp || "",
        dt: item.destaque || false,
        ts: parseTS(item.atualizado),
      };
      if (catKey === "nativa") {
        mapped.pv = item.precoVista;
        mapped.pp = item.precoPrazo;
      } else if (catKey === "beneficiada") {
        mapped.tp = item.tipo;
        mapped.dm = item.dimensoes;
        mapped.pv = item.precoVista;
        mapped.pm = item.precoMedio;
        mapped.pl = item.precoLongo;
        mapped.d = item.qtdDisp || "";
      } else if (catKey === "compensados") {
        if (item.subs && item.subs.length > 0) { mapped.subs = item.subs; }
      } else if (catKey === "reflorestamento") {
        mapped.pv = item.precoTotal || item.precoBase;
      } else if (catKey === "portas") {
        if (item.subs && item.subs.length > 0) { mapped.subs = item.subs; }
      } else if (catKey === "pisosProntos") {
        mapped.dm = item.dimensoes;
        mapped.pv = item.precoVista;
        mapped.pm = item.precoMedio;
        mapped.pl = item.precoLongo;
        mapped.d = item.m2Disp || "";
      }
      return mapped;
    });
  });
  return result;
};
const fmt=v=>v!=null?v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}):"—";
const nm=i=>{if(i.e&&i.p)return`${i.e} — ${i.p}`;if(i.e&&i.dm)return`${i.e} — ${i.dm}`;return i.e||i.p||i.dm||"—";};
const pr=(i,u)=>{const p=i.pv;return!p?null:u.tipo==="admin"?p:Math.round(p*(1+u.mg/100));};
const prS=(pv,u)=>!pv?null:u.tipo==="admin"?pv:Math.round(pv*(1+u.mg/100));
const prM=(i,u)=>{const p=i.pm;return!p?null:u.tipo==="admin"?p:Math.round(p*(1+u.mg/100));};
const stop=e=>e.stopPropagation();
const agoraF=()=>new Date().toLocaleString("pt-BR");
const H48=48*60*60*1000;

const S={bg:"#F5F0E8",dk:"#2C2416",da:"#4A3728",cr:"#E8DCC8",mu:"#8B7D6B",ml:"#A89878",bd:"#DDD5C8",bk:"#C4BBAA",go:"#D4A843",gn:"#2D5016",gl:"#E8F5E0",sf:"#EDE6D8",wh:"#FFF",wa:"#25D366",rd:"#C0392B"};
const B={border:"none",cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"};
const I={width:"100%",padding:"7px 9px",border:`1px solid ${S.bk}`,borderRadius:6,fontSize:12,fontFamily:"inherit",background:S.wh,color:S.dk,boxSizing:"border-box"};
const L={fontSize:10,fontWeight:700,color:S.mu,textTransform:"uppercase",letterSpacing:0.5,marginBottom:2,display:"block"};

const gerarPDF=(ped,usr)=>{const i=ped.item;const its=ped.its||[];const tF=its.reduce((s,x)=>s+(parseFloat(x.pF||0)*parseFloat(x.q||0)),0);const tC=its.reduce((s,x)=>s+(parseFloat(x.pC||0)*parseFloat(x.q||0)),0);
const h=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pedido ${E.nome}</title><style>@page{size:A4;margin:15mm}*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#222;font-size:10pt}.pg{max-width:700px;margin:0 auto}.hd{display:flex;justify-content:space-between;border-bottom:3px solid #2C2416;padding-bottom:10px;margin-bottom:14px}.lg{font-family:Georgia,serif;font-size:22pt;font-weight:bold;color:#2C2416}.ls{font-size:8pt;color:#999;letter-spacing:3px;text-transform:uppercase}.ei{text-align:right;font-size:8pt;color:#888}.tt{background:#2C2416;color:#E8DCC8;text-align:center;font-size:14pt;font-weight:bold;padding:8px;margin-bottom:14px}.ib{border:1px solid #ccc;padding:10px 12px;margin-bottom:12px;border-radius:4px}.ig{display:grid;grid-template-columns:1fr 1fr;gap:6px 30px}.il{font-size:8pt;color:#888;text-transform:uppercase;font-weight:bold}.iv{font-size:10pt;font-weight:600}table{width:100%;border-collapse:collapse;margin:10px 0}th{background:#F5F0E8;padding:7px 8px;text-align:left;font-size:8pt;text-transform:uppercase;color:#666;border-bottom:2px solid #2C2416;border-top:2px solid #2C2416}td{padding:6px 8px;border-bottom:1px solid #ddd;font-size:9pt}.tb{display:flex;justify-content:flex-end}.tw{width:250px}.tr{display:flex;justify-content:space-between;padding:4px 0;font-size:9pt;border-bottom:1px solid #eee}.tf{font-size:11pt;font-weight:bold;border-top:2px solid #2C2416;padding:6px 0}.pb{border:1px solid #ccc;padding:10px;margin:12px 0;text-align:center;font-weight:bold;font-size:10pt}.ft{margin-top:30px;border-top:1px solid #ccc;padding-top:8px;font-size:8pt;color:#999;text-align:center}.as{margin-top:40px;display:flex;gap:40px}.ac{flex:1;padding-top:6px;border-top:1px solid #666;font-size:8pt;color:#666;text-align:center}@media print{body{-webkit-print-color-adjust:exact}}</style></head><body><div class="pg"><div class="hd"><div><div class="lg">${E.nome}</div><div class="ls">Representações Comerciais</div></div><div class="ei">${E.site}<br>${E.tel}<br>${E.email}</div></div><div class="tt">PEDIDO DE VENDA</div><div class="ib"><div class="ig"><div><div class="il">Cliente</div><div class="iv">${ped.cli||"—"}</div></div><div><div class="il">Data</div><div class="iv">${agoraF()}</div></div><div><div class="il">Telefone</div><div class="iv">${ped.tel||"—"}</div></div><div><div class="il">Perfil</div><div class="iv">${usr.nome}</div></div></div></div><div class="ib"><div class="ig"><div><div class="il">Produto</div><div class="iv">${nm(i)}</div></div><div><div class="il">Fornecedor</div><div class="iv">${ped.forn||i.f}</div></div></div></div>${its.length?`<table><thead><tr><th>#</th><th>Qtd</th><th>Medidas</th><th style="text-align:right">Forn.</th><th style="text-align:right">Cli.</th></tr></thead><tbody>${its.map((x,j)=>`<tr><td>${j+1}</td><td>${x.q||"—"} ${i.u||""}</td><td>${x.m||"—"}</td><td style="text-align:right">${x.pF?fmt(x.pF):"—"}</td><td style="text-align:right">${x.pC?fmt(x.pC):"—"}</td></tr>`).join("")}</tbody></table><div class="tb"><div class="tw"><div class="tr">Total Forn.<span>${fmt(tF)}</span></div><div class="tr">Total Cli.<span>${fmt(tC)}</span></div><div class="tr tf">Margem<span>${fmt(tC-tF)}</span></div></div></div>`:""}<div class="pb">Condição: ${ped.cd}</div>${ped.ob?`<div style="background:#FAFAF5;padding:8px 12px;border-left:3px solid #D4A843;margin:10px 0;font-size:9pt"><b>Obs:</b> ${ped.ob}</div>`:""}<div class="as"><div class="ac">Ass. Cliente</div><div class="ac">Data ____/____/____</div></div><div class="ft">${E.nome} — ${E.end}</div></div></body></html>`;
const w=window.open("","_blank");if(w){w.document.write(h);w.document.close();setTimeout(()=>w.print(),600);}};

export default function App(){
  const[usr,setUsr]=useState(null);
  const[data,setData]=useState(initData);
  const[loading,setLoading]=useState(false);
  const[cat,setCat]=useState("nativa");
  const[q,setQ]=useState("");
  const[ff,setFF]=useState("Todos");
  const[exp,setExp]=useState(null);
  const[ef,setEF]=useState(new Set());
  const[sel,setSel]=useState(new Set());
  const[fav,setFav]=useState(new Set());
  const[onlyFav,setOnlyFav]=useState(false);
  const[ped,setPed]=useState(null);
  const[edit,setEdit]=useState(null);
  const[editD,setEditD]=useState(null);
  const[addM,setAddM]=useState(false);
  const[newI,setNewI]=useState(null);
  const[cp,setCp]=useState(false);
  const[quickUp,setQuickUp]=useState(false);
  const[quCat,setQuCat]=useState("nativa");
  const[quItem,setQuItem]=useState("");
  const[quPrice,setQuPrice]=useState("");
  const[quDisp,setQuDisp]=useState("");
  const[showNews,setShowNews]=useState(false);
  const[seenNews,setSeenNews]=useState(new Set());

  const adm=usr?.tipo==="admin";

  useEffect(() => {
    if (!usr) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const sheetsData = await loadAllData();
        const mappedData = mapSheetsToV9(sheetsData);
        setData(mappedData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [usr]);

  useEffect(()=>{if(usr)setCat(usr.cat||"nativa");},[usr]);
  useEffect(()=>{setFF("Todos");setExp(null);setSel(new Set());setEF(new Set());setEdit(null);setAddM(false);},[cat]);

  const newsItems=useMemo(()=>{
    if(!usr)return[];
    const cutoff=now()-H48;
    const all=[];
    Object.entries(data).forEach(([catId,items])=>{
      items.forEach(i=>{
        if((i.ts&&i.ts>cutoff)||i.dt){
          const catInfo=CATS.find(c=>c.id===catId);
          all.push({...i,_cat:catId,_catNome:catInfo?.n||catId,_catIcon:catInfo?.i||"📋",_isNew:i.ts&&i.ts>cutoff,_isDest:!!i.dt});
        }
      });
    });
    return all.sort((a,b)=>(b.ts||0)-(a.ts||0));
  },[data,usr]);
  const unseenNews=newsItems.filter(n=>!seenNews.has(n.id)).length;

  const items=useMemo(()=>data[cat]||[],[data,cat]);
  const filt=useMemo(()=>items.filter(i=>{const t=q.toLowerCase();const mb=!q||[i.e,i.p,i.f,i.ob,i.tp,i.dm].filter(Boolean).some(x=>x.toLowerCase().includes(t));return mb&&(ff==="Todos"||i.f===ff)&&(!onlyFav||fav.has(i.id));}),[items,q,ff,onlyFav,fav]);
  const grp=useMemo(()=>{const m=new Map();filt.forEach(i=>{const k=i.f||"Outros";if(!m.has(k))m.set(k,[]);m.get(k).push(i);});return[...m.entries()].sort((a,b)=>a[0].localeCompare(b[0]));},[filt]);
  const forns=useMemo(()=>["Todos",...new Set(items.map(x=>x.f).filter(Boolean))],[items]);
  const allItems=useMemo(()=>data[quCat]||[],[data,quCat]);

  const tSel=(id,e)=>{e.stopPropagation();setSel(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});};
  const tFav=(id,e)=>{e.stopPropagation();setFav(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});};
  const tEF=f=>setEF(p=>{const n=new Set(p);n.has(f)?n.delete(f):n.add(f);return n;});
  const selAll=(its,e)=>{e.stopPropagation();setSel(p=>{const n=new Set(p);const a=its.every(x=>n.has(x.id));its.forEach(x=>a?n.delete(x.id):n.add(x.id));return n;});};
  const copy=async(t,e)=>{if(e)e.stopPropagation();try{await navigator.clipboard.writeText(t);}catch{const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();document.execCommand("copy");document.body.removeChild(a);}setCp(true);setTimeout(()=>setCp(false),2e3);};
  const txtItem=i=>{let t=`*${nm(i)}*\n`;if(i.subs?.length){t+=`${i.p}\n\n`;i.subs.forEach(s=>{t+=`  ${s.med}: ${fmt(prS(s.pv,usr))}/${i.u||"un"}\n`;});}else{const p=pr(i,usr);if(p)t+=`Preço: ${fmt(p)}/${i.u||"m²"}\n`;if(i.pm)t+=`Prazo: ${fmt(prM(i,usr))}\n`;}if(i.cd)t+=`\nCond: ${i.cd}\n`;if(i.d)t+=`Disp: ${i.d}\n`;if(i.ob)t+=`Obs: ${i.ob}\n`;t+=`\n_${E.nome}_`;return t;};
  const txtSel=()=>{const its=filt.filter(i=>sel.has(i.id));const pf=new Map();its.forEach(i=>{const k=i.f;if(!pf.has(k))pf.set(k,[]);pf.get(k).push(i);});let t="";pf.forEach((v,k)=>{t+=`*📦 ${k}*\n\n`;v.forEach(i=>{t+=`*${nm(i)}*\n`;if(i.subs?.length){i.subs.forEach(s=>{t+=`  ${s.med}: ${fmt(prS(s.pv,usr))}\n`;});}else{const p=pr(i,usr);if(p)t+=`  ${fmt(p)}/${i.u||"m²"}\n`;}if(i.d)t+=`  Disp: ${i.d}\n`;t+="\n";});});t+=`_${E.nome}_`;return t;};
  const saveEdit=(id,d)=>{setData(prev=>({...prev,[cat]:prev[cat].map(x=>x.id===id?{...x,...d,ts:now()}:x)}));setEdit(null);setEditD(null);};
  const addItem=d=>{setData(prev=>({...prev,[cat]:[{...d,id:"new_"+Date.now(),ts:now()},...prev[cat]]}));setAddM(false);setNewI(null);};

  const quickSave=()=>{
    if(!quItem)return;
    const newPrice=parseFloat(quPrice);
    setData(prev=>{
      const catItems=[...prev[quCat]];
      const idx=catItems.findIndex(x=>x.id===quItem);
      if(idx>=0){
        catItems[idx]={...catItems[idx],ts:now()};
        if(newPrice)catItems[idx].pv=newPrice;
        if(quDisp)catItems[idx].d=quDisp;
      }
      return{...prev,[quCat]:catItems};
    });
    setQuItem("");setQuPrice("");setQuDisp("");setQuickUp(false);
  };

  if(!usr)return(
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${S.dk},#5A4A38)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Source Sans 3',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
      <div style={{marginBottom:32,textAlign:"center"}}><h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:32,color:S.cr,margin:0}}>F. Silva Reis</h1><p style={{color:S.go,fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:2,marginTop:4}}>Central de Preços</p></div>
      <div style={{width:"100%",maxWidth:300,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {PERFIS.map(p=><button key={p.id} onClick={()=>setUsr(p)} style={{...B,padding:"14px 8px",borderRadius:12,background:p.tipo==="admin"?S.go:"rgba(255,255,255,0.07)",color:p.tipo==="admin"?S.dk:S.cr,textAlign:"center",gridColumn:p.tipo==="admin"?"1/-1":"auto"}}><div style={{fontSize:24}}>{p.icon}</div><div style={{fontSize:14,fontWeight:800,marginTop:3}}>{p.nome}</div><div style={{fontSize:9,opacity:0.6}}>{p.desc}</div></button>)}
      </div>
    </div>
  );

  if(loading)return(
    <div style={{minHeight:"100vh",background:S.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Source Sans 3',sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:16}}>⏳</div>
        <div style={{color:S.dk,fontSize:14,fontWeight:700}}>Carregando dados...</div>
        <div style={{color:S.mu,fontSize:12,marginTop:8}}>Buscando informações do Google Sheets</div>
      </div>
    </div>
  );

  const EF=({d,setD,onSave,onCancel,title})=>(
    <div onClick={stop} style={{background:S.wh,borderRadius:8,border:`2px solid ${S.go}`,padding:12,marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontWeight:700,fontSize:13}}>{title}</span><button onClick={e=>{stop(e);onCancel();}} style={{...B,background:"none",color:S.mu,fontSize:18}}>✕</button></div>
      <div style={{display:"grid",gap:8}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          <div><div style={L}>Fornecedor</div><input onClick={stop} style={I} value={d.f||""} onChange={e=>setD({...d,f:e.target.value})}/></div>
          <div><div style={L}>Espécie</div><input onClick={stop} style={I} value={d.e||""} onChange={e=>setD({...d,e:e.target.value})}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          <div><div style={L}>Produto</div><input onClick={stop} style={I} value={d.p||d.dm||""} onChange={e=>setD({...d,p:e.target.value,dm:e.target.value})}/></div>
          <div><div style={L}>Unidade</div><input onClick={stop} style={I} value={d.u||""} onChange={e=>setD({...d,u:e.target.value})}/></div>
        </div>
        {!d.subs&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          <div><div style={L}>Preço Custo</div><input onClick={stop} style={I} type="number" value={d.pv||""} onChange={e=>setD({...d,pv:Number(e.target.value)})}/></div>
          <div><div style={L}>Disponível</div><input onClick={stop} style={I} value={d.d||""} onChange={e=>setD({...d,d:e.target.value})}/></div>
        </div>}
        {d.subs&&<div style={{background:S.sf,borderRadius:6,padding:10,border:`1px solid ${S.bd}`}}>
          <div style={{...L,marginBottom:6}}>Medidas e preços</div>
          {d.subs.map((s,j)=><div key={j} style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:6,marginBottom:4,alignItems:"end"}}>
            <input onClick={stop} style={I} value={s.med||""} onChange={e=>{const n=[...d.subs];n[j]={...n[j],med:e.target.value};setD({...d,subs:n});}}/>
            <input onClick={stop} style={I} type="number" value={s.pv||""} onChange={e=>{const n=[...d.subs];n[j]={...n[j],pv:Number(e.target.value)};setD({...d,subs:n});}}/>
            <button onClick={e=>{stop(e);setD({...d,subs:d.subs.filter((_,k)=>k!==j)});}} style={{...B,background:"none",color:S.rd,fontSize:14}}>✕</button>
          </div>)}
          <button onClick={e=>{stop(e);setD({...d,subs:[...d.subs,{med:"",pv:0}]});}} style={{...B,background:S.dk,color:S.cr,fontSize:10,padding:"4px 10px",borderRadius:4,fontWeight:600,marginTop:4}}>+ Medida</button>
        </div>}
        <label onClick={stop} style={{fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}><input type="checkbox" checked={!!d.subs} onChange={e=>{if(e.target.checked)setD({...d,subs:[{med:"",pv:0}],pv:null});else setD({...d,subs:undefined,pv:0});}}/> Sub-itens</label>
        <label onClick={stop} style={{fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}><input type="checkbox" checked={!!d.dt} onChange={e=>setD({...d,dt:e.target.checked})}/> ⭐ Destaque</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          <div><div style={L}>Condição</div><select onClick={stop} style={I} value={d.cd||""} onChange={e=>setD({...d,cd:e.target.value})}><option value="">--</option>{CONDS.map(c=><option key={c}>{c}</option>)}</select></div>
          <div><div style={L}>Obs</div><input onClick={stop} style={I} value={d.ob||""} onChange={e=>setD({...d,ob:e.target.value})}/></div>
        </div>
        <button onClick={e=>{stop(e);onSave();}} style={{...B,background:S.gn,color:S.wh,padding:"10px 0",borderRadius:6,fontSize:13,fontWeight:700,width:"100%"}}>✓ Salvar</button>
      </div>
    </div>
  );

  if(ped){
    const i=ped.item;const tF=ped.its?.reduce((s,x)=>s+(parseFloat(x.pF||0)*parseFloat(x.q||0)),0)||0;const tC=ped.its?.reduce((s,x)=>s+(parseFloat(x.pC||0)*parseFloat(x.q||0)),0)||0;const mg=tC-tF;
    const txt=`📋 PEDIDO — ${E.nome}\nPerfil: ${usr.nome}\nCliente: ${ped.cli}\nFornecedor: ${ped.forn||i.f}\n──────────\n${nm(i)}\n${(ped.its||[]).map((x,j)=>`${j+1}. ${x.q||"—"} ${i.u||""} ${x.m?`(${x.m})`:""}\n   Forn: ${x.pF?fmt(x.pF):"-"} → Cli: ${x.pC?fmt(x.pC):"-"}`).join("\n")}\n\nForn: ${fmt(tF)} | Cli: ${fmt(tC)} | Margem: ${fmt(mg)}\nCond: ${ped.cd}${ped.ob?`\nObs: ${ped.ob}`:""}`;
    return(
      <div style={{minHeight:"100vh",background:S.bg,fontFamily:"'Source Sans 3',sans-serif",color:S.dk,maxWidth:480,margin:"0 auto"}}>
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
        <div style={{background:`linear-gradient(135deg,${S.dk},${S.da})`,padding:16,position:"sticky",top:0,zIndex:100}}><div style={{display:"flex",alignItems:"center",gap:12}}><button onClick={()=>setPed(null)} style={{...B,background:"none",color:S.cr,fontSize:22}}>←</button><h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:S.cr,margin:0}}>Pedido</h2></div></div>
        <div style={{padding:16,display:"grid",gap:10}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div><div style={L}>Cliente *</div><input style={I} value={ped.cli} onChange={e=>setPed({...ped,cli:e.target.value})}/></div>
            <div><div style={L}>Telefone</div><input style={I} value={ped.tel||""} onChange={e=>setPed({...ped,tel:e.target.value})}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div><div style={L}>Fornecedor</div><input style={I} value={ped.forn||""} onChange={e=>setPed({...ped,forn:e.target.value})} placeholder={i.f}/></div>
            <div><div style={L}>Produto</div><div style={{fontSize:12,fontWeight:700,padding:"7px 0"}}>{nm(i)}</div></div>
          </div>
          <div style={{background:S.sf,borderRadius:8,padding:12,border:`1px solid ${S.bd}`}}>
            <div style={{...L,marginBottom:8,fontSize:11}}>Itens</div>
            {(ped.its||[]).map((x,j)=><div key={j} style={{background:S.wh,borderRadius:6,padding:10,marginBottom:8,border:`1px solid ${S.bd}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:11,fontWeight:700}}>Item {j+1}</span><button onClick={()=>setPed({...ped,its:ped.its.filter((_,k)=>k!==j)})} style={{...B,background:"none",color:S.rd,fontSize:14}}>✕</button></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
                <div><div style={{...L,fontSize:9}}>Qtd</div><input style={I} value={x.q||""} onChange={e=>{const n=[...ped.its];n[j]={...n[j],q:e.target.value};setPed({...ped,its:n});}}/></div>
                <div><div style={{...L,fontSize:9}}>Medidas</div><input style={I} value={x.m||""} onChange={e=>{const n=[...ped.its];n[j]={...n[j],m:e.target.value};setPed({...ped,its:n});}}/></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                <div style={{background:"#FFF5F5",borderRadius:4,padding:6}}><div style={{...L,fontSize:9,color:S.rd}}>💰 Forn.</div><input style={{...I,borderColor:"#e8aaaa"}} type="number" value={x.pF||""} onChange={e=>{const n=[...ped.its];n[j]={...n[j],pF:Number(e.target.value)};setPed({...ped,its:n});}}/></div>
                <div style={{background:S.gl,borderRadius:4,padding:6}}><div style={{...L,fontSize:9,color:S.gn}}>🏷️ Cli.</div><input style={{...I,borderColor:"#a8d8a8"}} type="number" value={x.pC||""} onChange={e=>{const n=[...ped.its];n[j]={...n[j],pC:Number(e.target.value)};setPed({...ped,its:n});}}/></div>
              </div>
              {x.pF>0&&x.pC>0&&<div style={{marginTop:6,padding:"4px 8px",background:x.pC>x.pF?S.gl:"#FFF0F0",borderRadius:4,fontSize:10,fontWeight:700,color:x.pC>x.pF?S.gn:S.rd,textAlign:"center"}}>Margem: {fmt(x.pC-x.pF)} ({((x.pC-x.pF)/x.pF*100).toFixed(1)}%)</div>}
            </div>)}
            <button onClick={()=>setPed({...ped,its:[...(ped.its||[]),{q:"",m:"",pF:i.pv||0,pC:pr(i,usr)||0}]})} style={{...B,width:"100%",background:S.dk,color:S.cr,padding:"8px 0",borderRadius:6,fontSize:11,fontWeight:700}}>+ Item</button>
          </div>
          {tF>0&&<div style={{background:S.dk,borderRadius:8,padding:12,color:S.cr}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}><span>Fornecedor:</span><b>{fmt(tF)}</b></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}><span>Cliente:</span><b>{fmt(tC)}</b></div>
            <div style={{borderTop:`1px solid ${S.da}`,paddingTop:6,display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:900}}><span>Margem:</span><span style={{color:mg>=0?"#90EE90":"#FF6B6B"}}>{fmt(mg)}</span></div>
          </div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div><div style={L}>Condição</div><select style={I} value={ped.cd} onChange={e=>setPed({...ped,cd:e.target.value})}>{CONDS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><div style={L}>Obs</div><input style={I} value={ped.ob||""} onChange={e=>setPed({...ped,ob:e.target.value})}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
            <button onClick={e=>copy(txt,e)} style={{...B,background:S.wa,color:S.wh,padding:"12px 0",borderRadius:8,fontSize:11,fontWeight:700}}>{cp?"✓":"📋"} WA</button>
            <button onClick={()=>{window.open(`mailto:roberto@fsilvareis.com.br?subject=${encodeURIComponent("Pedido "+usr.nome)}&body=${encodeURIComponent(txt.replace(/\n/g,"\r\n"))}`);}} style={{...B,background:S.dk,color:S.cr,padding:"12px 0",borderRadius:8,fontSize:11,fontWeight:700}}>✉️ Email</button>
            <button onClick={()=>gerarPDF(ped,usr)} style={{...B,background:"#8B2500",color:S.wh,padding:"12px 0",borderRadius:8,fontSize:11,fontWeight:700}}>📄 PDF</button>
          </div>
        </div>
      </div>
    );
  }

  const Card=({item:i})=>{
    const isE=exp===i.id,isF=fav.has(i.id),isS=sel.has(i.id),p=pr(i,usr),hasSubs=i.subs?.length>0;
    const isNew=i.ts&&i.ts>(now()-H48);
    if(edit===i.id&&editD)return<EF d={editD} setD={setEditD} onSave={()=>saveEdit(i.id,editD)} onCancel={()=>{setEdit(null);setEditD(null);}} title="✏️ Editar"/>;
    return<div style={{display:"flex",marginBottom:5}}>
      <div onClick={e=>tSel(i.id,e)} style={{width:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:isS?S.gn:"#EDE6D8",borderRadius:"6px 0 0 6px"}}><span style={{fontSize:12,color:isS?"white":S.bk,fontWeight:700}}>{isS?"✓":""}</span></div>
      <div onClick={()=>setExp(isE?null:i.id)} style={{flex:1,background:S.wh,borderRadius:"0 6px 6px 0",border:i.dt?`2px solid ${S.go}`:`1px solid ${S.bd}`,borderLeft:"none",cursor:"pointer",overflow:"hidden"}}>
        {(i.dt||isNew)&&<div style={{background:i.dt?`linear-gradient(90deg,${S.go},#E8C65A)`:`linear-gradient(90deg,${S.gn},#4A9C3E)`,color:i.dt?S.dk:"white",fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:1,padding:"1px 10px",textAlign:"center"}}>{i.dt?"⭐ Oportunidade":"🆕 Novo"}</div>}
        <div style={{padding:"8px 10px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>{i.tp&&<div style={{fontSize:8,fontWeight:700,color:S.ml,textTransform:"uppercase"}}>{i.tp}</div>}<div style={{fontSize:13,fontWeight:700,color:S.dk,lineHeight:1.2}}>{nm(i)}</div></div>
            <div style={{display:"flex",gap:4,alignItems:"flex-start"}}>
              <span onClick={e=>tFav(i.id,e)} style={{fontSize:12,cursor:"pointer",opacity:isF?1:0.2}}>{isF?"❤️":"🤍"}</span>
              {!hasSubs&&p&&<div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:900,color:S.gn}}>{fmt(p)}</div><div style={{fontSize:8,color:S.mu}}>{adm?"custo":"venda"}/{i.u||"m²"}</div></div>}
            </div>
          </div>
          {hasSubs&&<div style={{marginTop:6,borderTop:`1px solid ${S.bd}`,paddingTop:6}}>{i.subs.map((s,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:j<i.subs.length-1?`0.5px solid ${S.bd}`:"none"}}><span style={{fontSize:12,color:S.dk}}>{s.med}</span><span style={{fontSize:13,fontWeight:700,color:S.gn}}>{fmt(prS(s.pv,usr))}</span></div>)}</div>}
          {!hasSubs&&i.pm&&<div style={{fontSize:9,color:S.mu,marginTop:2}}>Prazo: <b>{fmt(prM(i,usr))}</b></div>}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#888",marginTop:4}}><span>{i.cd}</span><span>{i.d||""}</span></div>
          {isE&&<div style={{marginTop:6,paddingTop:6,borderTop:`1px dashed ${S.bd}`,fontSize:10}}>
            {i.ob&&<div style={{color:"#6B5D4D",marginBottom:3}}><b>Obs:</b> {i.ob}</div>}
            <div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap"}}>
              <button onClick={e=>{stop(e);copy(txtItem(i),e);}} style={{...B,flex:1,background:S.wa,color:"white",padding:"6px 0",borderRadius:5,fontWeight:700,fontSize:10}}>{cp?"✓":"📋"}</button>
              <button onClick={e=>{stop(e);setPed({item:i,cli:"",tel:"",forn:i.f,cd:i.cd||"À vista",ob:"",its:[]});}} style={{...B,flex:1,background:S.dk,color:S.cr,padding:"6px 0",borderRadius:5,fontWeight:700,fontSize:10}}>📝 Pedido</button>
              {adm&&<button onClick={e=>{stop(e);setEdit(i.id);setEditD({...i,subs:i.subs?i.subs.map(s=>({...s})):undefined});}} style={{...B,flex:1,background:"#5A4A38",color:S.cr,padding:"6px 0",borderRadius:5,fontWeight:700,fontSize:10}}>✏️</button>}
            </div>
          </div>}
        </div>
      </div>
    </div>;
  };

  const ct=CATS.find(c=>c.id===cat);const ns=sel.size;

  if(showNews)return(
    <div style={{minHeight:"100vh",background:S.bg,fontFamily:"'Source Sans 3',sans-serif",color:S.dk,maxWidth:480,margin:"0 auto"}}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
      <div style={{background:`linear-gradient(135deg,${S.dk},${S.da})`,padding:16,position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}><button onClick={()=>{setShowNews(false);setSeenNews(new Set(newsItems.map(n=>n.id)));}} style={{...B,background:"none",color:S.cr,fontSize:22}}>←</button><h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:S.cr,margin:0}}>🔔 Novidades</h2><span style={{color:S.ml,fontSize:12}}>{newsItems.length} itens</span></div>
      </div>
      <div style={{padding:"10px 16px"}}>
        {newsItems.length===0?<div style={{textAlign:"center",padding:40,color:S.mu}}>Nenhuma novidade no momento</div>:
        newsItems.map(i=>{
          const p=pr(i,usr);
          return<div key={i.id} style={{background:S.wh,borderRadius:8,border:`1px solid ${S.bd}`,marginBottom:8,overflow:"hidden"}}>
            <div style={{background:i._isDest?`linear-gradient(90deg,${S.go},#E8C65A)`:`linear-gradient(90deg,${S.gn},#4A9C3E)`,padding:"3px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:9,fontWeight:700,color:i._isDest?S.dk:"white",textTransform:"uppercase",letterSpacing:1}}>{i._isDest?"⭐ Oportunidade":"🆕 Novo"}</span>
              <span style={{fontSize:9,color:i._isDest?"#5A4A38":"rgba(255,255,255,0.7)"}}>{i._catIcon} {i._catNome}</span>
            </div>
            <div style={{padding:"10px 12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div><div style={{fontSize:13,fontWeight:700}}>{nm(i)}</div><div style={{fontSize:10,color:S.mu}}>{i.f}</div></div>
                {p&&<div style={{fontSize:15,fontWeight:900,color:S.gn}}>{fmt(p)}<span style={{fontSize:9,color:S.mu,fontWeight:400}}>/{i.u||"m²"}</span></div>}
              </div>
              {i.subs?.length>0&&<div style={{marginTop:6}}>{i.subs.slice(0,4).map((s,j)=><span key={j} style={{fontSize:10,color:S.mu,marginRight:8}}>{s.med}: <b style={{color:S.gn}}>{fmt(prS(s.pv,usr))}</b></span>)}{i.subs.length>4&&<span style={{fontSize:10,color:S.ml}}>+{i.subs.length-4} mais</span>}</div>}
              {i.ob&&<div style={{fontSize:10,color:S.mu,marginTop:4}}>{i.ob}</div>}
            </div>
          </div>;
        })}
      </div>
    </div>
  );

  if(quickUp)return(
    <div style={{minHeight:"100vh",background:S.bg,fontFamily:"'Source Sans 3',sans-serif",color:S.dk,maxWidth:480,margin:"0 auto"}}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
      <div style={{background:`linear-gradient(135deg,${S.dk},${S.da})`,padding:16,position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}><button onClick={()=>setQuickUp(false)} style={{...B,background:"none",color:S.cr,fontSize:22}}>←</button><h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:S.cr,margin:0}}>⚡ Atualização Rápida</h2></div>
      </div>
      <div style={{padding:16,display:"grid",gap:12}}>
        <div><div style={L}>Categoria</div><select style={I} value={quCat} onChange={e=>setQuCat(e.target.value)}>{CATS.map(c=><option key={c.id} value={c.id}>{c.i} {c.n}</option>)}</select></div>
        <div><div style={L}>Produto</div><select style={I} value={quItem} onChange={e=>setQuItem(e.target.value)}>
          <option value="">Selecione o produto...</option>
          {allItems.map(i=><option key={i.id} value={i.id}>{nm(i)} ({i.f})</option>)}
        </select></div>
        {quItem&&<>
          <div style={{background:S.sf,borderRadius:8,padding:12,border:`1px solid ${S.bd}`}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>{nm(allItems.find(x=>x.id===quItem)||{})}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div><div style={L}>Novo Preço</div><input style={{...I,fontSize:16,fontWeight:700,padding:"10px"}} type="number" value={quPrice} onChange={e=>setQuPrice(e.target.value)} placeholder={String(allItems.find(x=>x.id===quItem)?.pv||"")}/></div>
              <div><div style={L}>Disponibilidade</div><input style={{...I,fontSize:14,padding:"10px"}} value={quDisp} onChange={e=>setQuDisp(e.target.value)} placeholder={allItems.find(x=>x.id===quItem)?.d||"Qtd..."}/></div>
            </div>
          </div>
          <button onClick={quickSave} style={{...B,background:S.gn,color:S.wh,padding:"14px 0",borderRadius:8,fontSize:15,fontWeight:700,width:"100%"}}>✓ Atualizar Preço</button>
        </>}
        <p style={{fontSize:10,color:S.mu,textAlign:"center"}}>Selecione o produto, digite o novo preço e salve. Rápido e prático.</p>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:S.bg,fontFamily:"'Source Sans 3',sans-serif",color:S.dk,maxWidth:480,margin:"0 auto",paddingBottom:80}}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
      <div style={{background:`linear-gradient(135deg,${S.dk},${S.da})`,padding:"12px 16px 0",position:"sticky",top:0,zIndex:100,boxShadow:"0 4px 20px rgba(44,36,22,0.3)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div><h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:S.cr,margin:0}}>F. Silva Reis</h1><p style={{color:S.ml,fontSize:9,margin:0,fontWeight:600,textTransform:"uppercase",letterSpacing:1.5}}>Central de Preços</p></div>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <button onClick={()=>setShowNews(true)} style={{...B,background:"rgba(255,255,255,0.1)",color:S.cr,fontSize:12,padding:"4px 8px",borderRadius:6,position:"relative"}}>
              🔔{unseenNews>0&&<span style={{position:"absolute",top:-4,right:-4,background:S.rd,color:"white",fontSize:8,fontWeight:700,width:16,height:16,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>{unseenNews}</span>}
            </button>
            {adm&&<button onClick={()=>window.open(SHEETS_URL,"_blank")} style={{...B,background:"rgba(255,255,255,0.15)",color:S.cr,fontSize:9,padding:"4px 8px",borderRadius:6}}>📊</button>}
            {adm&&<button onClick={()=>{setAddM(true);setNewI({f:"",e:"",p:"",u:"chapa",pv:0,cd:"",d:"",ob:""});}} style={{...B,background:S.go,color:S.dk,fontSize:10,padding:"4px 8px",borderRadius:6,fontWeight:700}}>＋</button>}
            <button onClick={()=>setUsr(null)} style={{...B,background:"rgba(255,255,255,0.1)",color:S.cr,fontSize:10,padding:"4px 8px",borderRadius:6,fontWeight:600}}>{usr.icon}</button>
          </div>
        </div>
        <div style={{display:"flex",gap:3,overflowX:"auto",paddingBottom:10,scrollbarWidth:"none"}}>
          {CATS.map(c=>{const a=cat===c.id;return<button key={c.id} onClick={()=>setCat(c.id)} style={{...B,display:"flex",flexDirection:"column",alignItems:"center",padding:"5px 9px",borderRadius:10,minWidth:60,background:a?c.c:"rgba(255,255,255,0.06)",border:a?`2px solid ${S.go}`:"2px solid transparent",opacity:a?1:0.7}}><span style={{fontSize:17}}>{c.i}</span><span style={{fontSize:8,fontWeight:700,color:S.cr,marginTop:1,whiteSpace:"nowrap"}}>{c.n}</span></button>;})}
        </div>
      </div>

      <div style={{padding:"8px 16px",background:S.sf,borderBottom:`1px solid ${S.bd}`}}>
        <div style={{position:"relative",marginBottom:6}}><input type="text" placeholder={`Buscar em ${ct?.n||""}...`} value={q} onChange={e=>setQ(e.target.value)} style={{width:"100%",padding:"7px 10px 7px 28px",border:`1px solid ${S.bk}`,borderRadius:8,background:S.wh,color:S.dk,fontSize:12,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/><span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",fontSize:12,opacity:0.4}}>🔍</span></div>
        <div style={{display:"flex",gap:5,alignItems:"center"}}><select value={ff} onChange={e=>setFF(e.target.value)} style={{flex:1,padding:"5px 6px",borderRadius:5,border:`1px solid ${S.bk}`,background:S.wh,fontSize:10,color:S.dk,fontFamily:"inherit"}}>{forns.map(f=><option key={f}>{f}</option>)}</select><button onClick={()=>setOnlyFav(!onlyFav)} style={{...B,padding:"4px 7px",borderRadius:5,border:onlyFav?`2px solid ${S.rd}`:`1px solid ${S.bk}`,background:onlyFav?"#FFF0F0":S.wh,fontSize:10}}>❤️</button></div>
      </div>

      {ns>0&&<div style={{padding:"8px 16px",background:S.gn,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:110,zIndex:99}}>
        <span style={{color:"white",fontSize:12,fontWeight:700}}>{ns} sel.</span>
        <div style={{display:"flex",gap:6}}><button onClick={e=>copy(txtSel(),e)} style={{...B,background:S.wa,color:"white",padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:700}}>{cp?"✓":"📋 WA"}</button><button onClick={()=>setSel(new Set())} style={{...B,background:"rgba(255,255,255,0.2)",color:"white",padding:"5px 10px",borderRadius:6,fontSize:11}}>Limpar</button></div>
      </div>}

      <div style={{padding:"10px 16px"}}>
        {addM&&newI&&<EF d={newI} setD={setNewI} onSave={()=>addItem(newI)} onCancel={()=>{setAddM(false);setNewI(null);}} title="➕ Novo Item"/>}
        {grp.length===0?<div style={{textAlign:"center",padding:40,color:S.mu}}>Nenhum item</div>:
        grp.map(([f,its])=>{
          const op=ef.has(f)||ff!=="Todos"||q;const aS=its.every(x=>sel.has(x.id));const sS=its.some(x=>sel.has(x.id));
          return<div key={f} style={{marginBottom:10}}>
            <div onClick={()=>tEF(f)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:S.dk,borderRadius:8,cursor:"pointer",marginBottom:op?4:0}}>
              <div onClick={e=>selAll(its,e)} style={{width:22,height:22,borderRadius:4,background:aS?S.go:sS?"rgba(212,168,67,0.4)":"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><span style={{fontSize:11,color:aS?S.dk:S.cr,fontWeight:700}}>{aS?"✓":sS?"—":""}</span></div>
              <div style={{flex:1}}><div style={{color:S.cr,fontSize:13,fontWeight:700}}>{f}</div><div style={{color:S.ml,fontSize:10}}>{its.length} itens</div></div>
              <span style={{color:S.ml,fontSize:14,transform:op?"rotate(90deg)":"rotate(0)",transition:"transform 0.2s"}}>›</span>
            </div>
            {op&&its.map(i=><Card key={i.id} item={i}/>)}
          </div>;
        })}
      </div>
      <div style={{textAlign:"center",padding:"12px 16px 20px",fontSize:10,color:S.ml}}>{filt.length} itens</div>

      {adm&&<button onClick={()=>setQuickUp(true)} style={{...B,position:"fixed",bottom:24,right:24,width:56,height:56,borderRadius:28,background:`linear-gradient(135deg,${S.go},#E8C65A)`,color:S.dk,fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(44,36,22,0.4)",zIndex:200}}>⚡</button>}
    </div>
  );
}
