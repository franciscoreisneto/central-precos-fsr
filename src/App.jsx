import { useState, useMemo, useEffect } from "react";

const E={nome:"F. Silva Reis"};
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

const initData={
  nativa:[
    {id:"n1",f:"Fernando (verificar)",e:"Pariri",p:"Prancha Bruta",d:"2-3 cargas",u:"m³",pv:2800,cd:"À vista/Prazo",ob:"Embarque 15-20d"},
    {id:"n2",f:"Fernando (verificar)",e:"Cedrinho",p:"Prancha Bruta",d:"3-4 cargas",u:"m³",pv:2800,cd:"À vista/Prazo",ob:""},
    {id:"n3",f:"Fernando (verificar)",e:"Cambará Preto",p:"Prancha Bruta",d:"3-4 cargas",u:"m³",pv:2650,cd:"À vista/Prazo",ob:""},
    {id:"n4",f:"Fornecedor WA 1",e:"Jequitibá Carvão",p:"Prancha Bruta",d:"",u:"m³",pv:2400,cd:"À vista",ob:"1ª qualidade"},
    {id:"n5",f:"Fornecedor WA 1",e:"Muirapiranga",p:"Prancha Bruta",d:"",u:"m³",pv:2800,cd:"À vista",ob:""},
  ],
  beneficiada:[
    {id:"b1",f:"GTP Pisos",tp:"Assoalho",e:"Tauari",dm:"19x100",u:"m²",pv:150,pm:160,pl:170,d:"71 m²",cd:"Ent+30/45/60/75/90",ob:"FOB mín 200m²"},
    {id:"b2",f:"GTP Pisos",tp:"Deck",e:"Cumaru Ferro F/F",dm:"1,9x10",u:"m²",pv:250,pm:260,pl:270,d:"424 m²",cd:"Ent+30/45/60/75/90",ob:""},
    {id:"b3",f:"GTP Pisos",tp:"Forro",e:"Cedrinho",dm:"1,0x100",u:"m²",pv:100,pm:110,pl:120,d:"314 m²",cd:"Ent+30/45/60/75/90",ob:""},
    {id:"b4",f:"Fornecedor WA 2",tp:"Deck",e:"Ipê 1ª",dm:"10/06cm",u:"m²",pv:280,d:"",cd:"",ob:""},
  ],
  compensados:[
    {id:"c1",f:"Compensados ABC",e:"Virola",p:"Compensado 2,20x1,60",u:"chapa",cd:"30 dias",ob:"Lote promocional",d:"300 chapas",
      subs:[{med:"4mm",pv:32},{med:"6mm",pv:45},{med:"10mm",pv:68},{med:"15mm",pv:92},{med:"20mm",pv:125}]},
    {id:"c2",f:"Compensados ABC",e:"Virola Naval",p:"Compensado Naval 2,20x1,60",u:"chapa",cd:"30 dias",ob:"",d:"Disponível",
      subs:[{med:"4mm",pv:42},{med:"6mm",pv:58},{med:"10mm",pv:82},{med:"15mm",pv:108}]},
    {id:"c3",f:"Compensados ABC",e:"Copaíba",p:"Compensado 2,20x1,60",u:"chapa",cd:"30 dias",ob:"",d:"200 chapas",
      subs:[{med:"4mm",pv:38},{med:"6mm",pv:52},{med:"10mm",pv:75},{med:"15mm",pv:98}]},
    {id:"c4",f:"Greenplac",e:"MDF Cru",p:"Chapa 2,75x1,84",u:"chapa",cd:"30/60",ob:"CIF RJ >50ch",d:"Disponível",
      subs:[{med:"6mm",pv:72},{med:"9mm",pv:88},{med:"12mm",pv:112},{med:"15mm",pv:142},{med:"18mm",pv:168},{med:"25mm",pv:215}]},
    {id:"c5",f:"Greenplac",e:"MDF Branco TX",p:"Chapa 2,75x1,84",u:"chapa",cd:"30/60",ob:"",d:"Disponível",
      subs:[{med:"6mm",pv:95},{med:"15mm",pv:175},{med:"18mm",pv:198},{med:"25mm",pv:260}]},
    {id:"c6",f:"Giben",e:"MDP Cru",p:"Chapa 2,75x1,84",u:"chapa",cd:"30/60/90",ob:"",d:"Disponível",
      subs:[{med:"12mm",pv:78},{med:"15mm",pv:98},{med:"18mm",pv:118},{med:"25mm",pv:155}]},
  ],
  reflorestamento:[
    {id:"r1",f:"Joeli",e:"Pinus",p:"Comp. 27mm",u:"chapa",pv:1250,cd:"Sem comissão",ob:"Frete R$170",d:""},
    {id:"r2",f:"Eucaflora",e:"Eucalipto Trat.",p:"Mourão 12cm",u:"un",pv:38,cd:"30 dias",ob:"Autoclave",d:"2.000 un"},
  ],
  portas:[
    {id:"p1",f:"Portas Cruzeiro",e:"",p:"Porta Semi-Oca Verniz",u:"un",cd:"30/60",ob:"Prazo 20 dias",d:"100 un",
      subs:[{med:"60x210cm",pv:280},{med:"70x210cm",pv:300},{med:"80x210cm",pv:320},{med:"90x210cm",pv:350}]},
    {id:"p2",f:"Portas Cruzeiro",e:"",p:"Kit Porta Completo",u:"un",cd:"30/60",ob:"Inclui batente",d:"50 kits",
      subs:[{med:"70x210cm",pv:450},{med:"80x210cm",pv:480},{med:"90x210cm",pv:520}]},
    {id:"p3",f:"Randa",e:"",p:"Porta Maciça Pivotante",u:"un",cd:"30/60/90",ob:"30-45 dias",d:"Sob encom.",
      subs:[{med:"80x210cm",pv:1650},{med:"90x210cm",pv:1850},{med:"100x210cm",pv:2100}]},
    {id:"p4",f:"Schlindwein",e:"",p:"Porta Balcão Madeira/Vidro",u:"un",pv:2400,cd:"30/60/90",ob:"Nova linha",d:"Sob encom.",dt:true},
  ],
  pisopronto:[
    {id:"pp1",f:"GTP Pisos",e:"Cumaru Ferro",dm:"19x101",u:"m²",pv:280,pm:290,pl:300,d:"1100 m²",cd:"Ent+30/45/60/75/90",ob:"FOB"},
    {id:"pp2",f:"GTP Pisos",e:"Tauari",dm:"19x101",u:"m²",pv:200,pm:210,pl:220,d:"4700 m²",cd:"Ent+30/45/60/75/90",ob:""},
    {id:"pp3",f:"GTP Pisos",e:"Ipê",dm:"17x82",u:"m²",pv:135,pm:145,pl:155,d:"1900 m²",cd:"Ent+30/45/60/75/90",ob:""},
  ],
};

const fmt=v=>v!=null?v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}):"—";
const nm=i=>{if(i.e&&i.p)return`${i.e} — ${i.p}`;if(i.e&&i.dm)return`${i.e} — ${i.dm}`;return i.e||i.p||i.dm||"—";};
const pr=(i,u)=>{const p=i.pv;return!p?null:u.tipo==="admin"?p:Math.round(p*(1+u.mg/100));};
const prS=(pv,u)=>!pv?null:u.tipo==="admin"?pv:Math.round(pv*(1+u.mg/100));
const prM=(i,u)=>{const p=i.pm;return!p?null:u.tipo==="admin"?p:Math.round(p*(1+u.mg/100));};

const S={bg:"#F5F0E8",dk:"#2C2416",da:"#4A3728",cr:"#E8DCC8",mu:"#8B7D6B",ml:"#A89878",bd:"#DDD5C8",bk:"#C4BBAA",go:"#D4A843",gn:"#2D5016",gl:"#E8F5E0",sf:"#EDE6D8",wh:"#FFF",wa:"#25D366",rd:"#C0392B"};
const B={border:"none",cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"};
const I={width:"100%",padding:"7px 9px",border:`1px solid ${S.bk}`,borderRadius:6,fontSize:12,fontFamily:"inherit",background:S.wh,color:S.dk,boxSizing:"border-box"};
const L={fontSize:10,fontWeight:700,color:S.mu,textTransform:"uppercase",letterSpacing:0.5,marginBottom:2,display:"block"};

export default function App(){
  const[usr,setUsr]=useState(null);
  const[data,setData]=useState(initData);
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

  const adm=usr?.tipo==="admin";
  useEffect(()=>{if(usr)setCat(usr.cat||"nativa");},[usr]);
  useEffect(()=>{setFF("Todos");setExp(null);setSel(new Set());setEF(new Set());setEdit(null);setAddM(false);},[cat]);

  const items=useMemo(()=>data[cat]||[],[data,cat]);
  const filt=useMemo(()=>items.filter(i=>{const t=q.toLowerCase();const mb=!q||[i.e,i.p,i.f,i.ob,i.tp,i.dm].filter(Boolean).some(x=>x.toLowerCase().includes(t));return mb&&(ff==="Todos"||i.f===ff)&&(!onlyFav||fav.has(i.id));}),[items,q,ff,onlyFav,fav]);
  const grp=useMemo(()=>{const m=new Map();filt.forEach(i=>{const k=i.f||"Outros";if(!m.has(k))m.set(k,[]);m.get(k).push(i);});return[...m.entries()].sort((a,b)=>a[0].localeCompare(b[0]));},[filt]);
  const forns=useMemo(()=>["Todos",...new Set(items.map(x=>x.f).filter(Boolean))],[items]);

  const tSel=(id,e)=>{e.stopPropagation();setSel(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});};
  const tFav=(id,e)=>{e.stopPropagation();setFav(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});};
  const tEF=f=>setEF(p=>{const n=new Set(p);n.has(f)?n.delete(f):n.add(f);return n;});
  const selAll=(its,e)=>{e.stopPropagation();setSel(p=>{const n=new Set(p);const a=its.every(x=>n.has(x.id));its.forEach(x=>a?n.delete(x.id):n.add(x.id));return n;});};

  const copy=async(t,e)=>{if(e)e.stopPropagation();try{await navigator.clipboard.writeText(t);}catch{const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();document.execCommand("copy");document.body.removeChild(a);}setCp(true);setTimeout(()=>setCp(false),2e3);};

  const txtItem=(i)=>{
    let t=`*${nm(i)}*\n`;
    if(i.subs&&i.subs.length>0){
      t+=`${i.p}\n\n`;
      i.subs.forEach(s=>{const p=prS(s.pv,usr);t+=`  ${s.med}: ${p?fmt(p):"—"}/${i.u||"un"}\n`;});
    } else {
      const p=pr(i,usr);if(p)t+=`Preço: ${fmt(p)}/${i.u||"m²"}\n`;
      if(i.pm)t+=`Prazo: ${fmt(prM(i,usr))}\n`;
    }
    if(i.cd)t+=`\nCond: ${i.cd}\n`;if(i.d)t+=`Disp: ${i.d}\n`;if(i.ob)t+=`Obs: ${i.ob}\n`;
    t+=`\n_${E.nome}_`;return t;
  };

  const txtSel=()=>{
    const its=filt.filter(i=>sel.has(i.id));
    const pf=new Map();its.forEach(i=>{const k=i.f;if(!pf.has(k))pf.set(k,[]);pf.get(k).push(i);});
    let t="";pf.forEach((v,k)=>{t+=`*📦 ${k}*\n\n`;v.forEach(i=>{
      t+=`*${nm(i)}*\n`;
      if(i.subs&&i.subs.length>0){i.subs.forEach(s=>{const p=prS(s.pv,usr);t+=`  ${s.med}: ${p?fmt(p):"—"}\n`;});}
      else{const p=pr(i,usr);if(p)t+=`  ${fmt(p)}/${i.u||"m²"}\n`;}
      if(i.d)t+=`  Disp: ${i.d}\n`;t+="\n";
    });});
    t+=`_${E.nome}_`;return t;
  };

  const saveEdit=(id,d)=>{setData(prev=>({...prev,[cat]:prev[cat].map(x=>x.id===id?{...x,...d}:x)}));setEdit(null);setEditD(null);};
  const addItem=d=>{setData(prev=>({...prev,[cat]:[{...d,id:"new_"+Date.now()},...prev[cat]]}));setAddM(false);setNewI(null);};

  // LOGIN
  if(!usr)return(
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${S.dk},#5A4A38)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Source Sans 3',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
      <div style={{marginBottom:32,textAlign:"center"}}><h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:32,color:S.cr,margin:0}}>F. Silva Reis</h1><p style={{color:S.go,fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:2,marginTop:4}}>Central de Preços</p></div>
      <div style={{width:"100%",maxWidth:300,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {PERFIS.map(p=><button key={p.id} onClick={()=>setUsr(p)} style={{...B,padding:"14px 8px",borderRadius:12,background:p.tipo==="admin"?S.go:"rgba(255,255,255,0.07)",color:p.tipo==="admin"?S.dk:S.cr,textAlign:"center",gridColumn:p.tipo==="admin"?"1/-1":"auto"}}><div style={{fontSize:24}}>{p.icon}</div><div style={{fontSize:14,fontWeight:800,marginTop:3}}>{p.nome}</div><div style={{fontSize:9,opacity:0.6}}>{p.desc}</div></button>)}
      </div>
    </div>
  );

  // EDIT FORM
  const EF=({d,setD,onSave,onCancel,title})=>(
    <div style={{background:S.wh,borderRadius:8,border:`2px solid ${S.go}`,padding:12,marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontWeight:700,fontSize:13}}>{title}</span><button onClick={onCancel} style={{...B,background:"none",color:S.mu,fontSize:18}}>✕</button></div>
      <div style={{display:"grid",gap:8}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          <div><div style={L}>Fornecedor</div><input style={I} value={d.f||""} onChange={e=>setD({...d,f:e.target.value})}/></div>
          <div><div style={L}>Espécie</div><input style={I} value={d.e||""} onChange={e=>setD({...d,e:e.target.value})}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          <div><div style={L}>Produto</div><input style={I} value={d.p||d.dm||""} onChange={e=>setD({...d,p:e.target.value,dm:e.target.value})}/></div>
          <div><div style={L}>Unidade</div><input style={I} value={d.u||""} onChange={e=>setD({...d,u:e.target.value})} placeholder="m³, chapa, un"/></div>
        </div>
        {!d.subs&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          <div><div style={L}>Preço Custo</div><input style={I} type="number" value={d.pv||""} onChange={e=>setD({...d,pv:Number(e.target.value)})}/></div>
          <div><div style={L}>Disponível</div><input style={I} value={d.d||""} onChange={e=>setD({...d,d:e.target.value})}/></div>
        </div>}
        {/* SUB-ITEMS EDITOR */}
        {d.subs&&<div style={{background:S.sf,borderRadius:6,padding:10,border:`1px solid ${S.bd}`}}>
          <div style={{...L,marginBottom:6}}>Medidas e preços</div>
          {d.subs.map((s,j)=><div key={j} style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:6,marginBottom:4,alignItems:"end"}}>
            <input style={I} value={s.med||""} onChange={e=>{const n=[...d.subs];n[j]={...n[j],med:e.target.value};setD({...d,subs:n});}} placeholder="15mm / 80x210cm"/>
            <input style={I} type="number" value={s.pv||""} onChange={e=>{const n=[...d.subs];n[j]={...n[j],pv:Number(e.target.value)};setD({...d,subs:n});}} placeholder="Preço"/>
            <button onClick={()=>{const n=d.subs.filter((_,k)=>k!==j);setD({...d,subs:n});}} style={{...B,background:"none",color:S.rd,fontSize:14}}>✕</button>
          </div>)}
          <button onClick={()=>setD({...d,subs:[...d.subs,{med:"",pv:0}]})} style={{...B,background:S.dk,color:S.cr,fontSize:10,padding:"4px 10px",borderRadius:4,fontWeight:600,marginTop:4}}>+ Medida</button>
        </div>}
        <label style={{fontSize:12,display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
          <input type="checkbox" checked={!!d.subs} onChange={e=>{if(e.target.checked)setD({...d,subs:[{med:"",pv:0}],pv:null});else setD({...d,subs:undefined,pv:0});}}/>
          Produto com sub-itens (medidas/bitolas)
        </label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          <div><div style={L}>Condição</div><select style={I} value={d.cd||""} onChange={e=>setD({...d,cd:e.target.value})}><option value="">--</option>{CONDS.map(c=><option key={c}>{c}</option>)}</select></div>
          <div><div style={L}>Obs</div><input style={I} value={d.ob||""} onChange={e=>setD({...d,ob:e.target.value})}/></div>
        </div>
        <button onClick={onSave} style={{...B,background:S.gn,color:S.wh,padding:"10px 0",borderRadius:6,fontSize:13,fontWeight:700,width:"100%"}}>✓ Salvar</button>
      </div>
    </div>
  );

  // PEDIDO
  if(ped){
    const i=ped.item;const tF=ped.its?.reduce((s,x)=>s+(parseFloat(x.pF||0)*parseFloat(x.q||0)),0)||0;const tC=ped.its?.reduce((s,x)=>s+(parseFloat(x.pC||0)*parseFloat(x.q||0)),0)||0;const mg=tC-tF;
    const txt=`📋 PEDIDO — ${E.nome}\nPerfil: ${usr.nome}\nCliente: ${ped.cli}\n──────────\n${nm(i)} (${i.f})\n${(ped.its||[]).map((x,j)=>`${j+1}. ${x.q||"—"} ${i.u||""} ${x.m?`(${x.m})`:""}\n   Forn: ${x.pF?fmt(x.pF):"-"} → Cli: ${x.pC?fmt(x.pC):"-"}`).join("\n")}\n\nTotal Forn: ${fmt(tF)} | Cli: ${fmt(tC)} | Margem: ${fmt(mg)}\nCond: ${ped.cd}`;
    return(
      <div style={{minHeight:"100vh",background:S.bg,fontFamily:"'Source Sans 3',sans-serif",color:S.dk,maxWidth:480,margin:"0 auto"}}>
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
        <div style={{background:`linear-gradient(135deg,${S.dk},${S.da})`,padding:16,position:"sticky",top:0,zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}><button onClick={()=>setPed(null)} style={{...B,background:"none",color:S.cr,fontSize:22}}>←</button><h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:18,color:S.cr,margin:0}}>Pedido — {nm(i)}</h2></div>
        </div>
        <div style={{padding:16,display:"grid",gap:10}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div><div style={L}>Cliente *</div><input style={I} value={ped.cli} onChange={e=>setPed({...ped,cli:e.target.value})}/></div>
            <div><div style={L}>Telefone</div><input style={I} value={ped.tel||""} onChange={e=>setPed({...ped,tel:e.target.value})}/></div>
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
                <div style={{background:"#FFF5F5",borderRadius:4,padding:6}}><div style={{...L,fontSize:9,color:S.rd}}>💰 Fornecedor</div><input style={{...I,borderColor:"#e8aaaa"}} type="number" value={x.pF||""} onChange={e=>{const n=[...ped.its];n[j]={...n[j],pF:Number(e.target.value)};setPed({...ped,its:n});}}/></div>
                <div style={{background:S.gl,borderRadius:4,padding:6}}><div style={{...L,fontSize:9,color:S.gn}}>🏷️ Cliente</div><input style={{...I,borderColor:"#a8d8a8"}} type="number" value={x.pC||""} onChange={e=>{const n=[...ped.its];n[j]={...n[j],pC:Number(e.target.value)};setPed({...ped,its:n});}}/></div>
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
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            <div><div style={L}>Condição</div><select style={I} value={ped.cd} onChange={e=>setPed({...ped,cd:e.target.value})}>{CONDS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><div style={L}>Obs</div><input style={I} value={ped.ob||""} onChange={e=>setPed({...ped,ob:e.target.value})}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
            <button onClick={e=>copy(txt,e)} style={{...B,background:S.wa,color:S.wh,padding:"12px 0",borderRadius:8,fontSize:11,fontWeight:700}}>{cp?"✓":"📋"} WA</button>
            <button style={{...B,background:S.dk,color:S.cr,padding:"12px 0",borderRadius:8,fontSize:11,fontWeight:700}}>✉️ Email</button>
            <button style={{...B,background:"#8B2500",color:S.wh,padding:"12px 0",borderRadius:8,fontSize:11,fontWeight:700}}>📄 PDF</button>
          </div>
        </div>
      </div>
    );
  }

  // CARD
  const Card=({item:i})=>{
    const isE=exp===i.id,isF=fav.has(i.id),isS=sel.has(i.id),p=pr(i,usr);
    const hasSubs=i.subs&&i.subs.length>0;
    if(edit===i.id&&editD)return<EF d={editD} setD={setEditD} onSave={()=>saveEdit(i.id,editD)} onCancel={()=>{setEdit(null);setEditD(null);}} title="✏️ Editar"/>;

    return<div style={{display:"flex",marginBottom:5}}>
      <div onClick={e=>tSel(i.id,e)} style={{width:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:isS?S.gn:"#EDE6D8",borderRadius:"6px 0 0 6px"}}><span style={{fontSize:12,color:isS?"white":S.bk,fontWeight:700}}>{isS?"✓":""}</span></div>
      <div onClick={()=>setExp(isE?null:i.id)} style={{flex:1,background:S.wh,borderRadius:"0 6px 6px 0",border:`1px solid ${S.bd}`,borderLeft:"none",cursor:"pointer",overflow:"hidden"}}>
        {i.dt&&<div style={{background:`linear-gradient(90deg,${S.go},#E8C65A)`,color:S.dk,fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:1,padding:"1px 10px",textAlign:"center"}}>⭐ Oportunidade</div>}
        <div style={{padding:"8px 10px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              {i.tp&&<div style={{fontSize:8,fontWeight:700,color:S.ml,textTransform:"uppercase"}}>{i.tp}</div>}
              <div style={{fontSize:13,fontWeight:700,color:S.dk,lineHeight:1.2}}>{nm(i)}</div>
            </div>
            <div style={{display:"flex",gap:4,alignItems:"flex-start"}}>
              <span onClick={e=>tFav(i.id,e)} style={{fontSize:12,cursor:"pointer",opacity:isF?1:0.2}}>{isF?"❤️":"🤍"}</span>
              {!hasSubs&&p&&<div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:900,color:S.gn}}>{fmt(p)}</div><div style={{fontSize:8,color:S.mu}}>{adm?"custo":"venda"}/{i.u||"m²"}</div></div>}
            </div>
          </div>

          {/* SUB-ITEMS LIST */}
          {hasSubs&&<div style={{marginTop:6,borderTop:`1px solid ${S.bd}`,paddingTop:6}}>
            {i.subs.map((s,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:j<i.subs.length-1?`0.5px solid ${S.bd}`:"none"}}>
              <span style={{fontSize:12,color:S.dk}}>{s.med}</span>
              <span style={{fontSize:13,fontWeight:700,color:S.gn}}>{fmt(prS(s.pv,usr))}</span>
            </div>)}
          </div>}

          {!hasSubs&&(i.pm||i.pl)&&<div style={{fontSize:9,color:S.mu,marginTop:2}}>{i.pm&&<span>30/60: <b>{fmt(prM(i,usr))}</b></span>}</div>}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#888",marginTop:4}}><span>{i.cd}</span><span>{i.d||""}</span></div>

          {isE&&<div style={{marginTop:6,paddingTop:6,borderTop:`1px dashed ${S.bd}`,fontSize:10}}>
            {i.ob&&<div style={{color:"#6B5D4D",marginBottom:3}}><b>Obs:</b> {i.ob}</div>}
            <div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap"}}>
              <button onClick={e=>{e.stopPropagation();copy(txtItem(i),e);}} style={{...B,flex:1,background:S.wa,color:"white",padding:"6px 0",borderRadius:5,fontWeight:700,fontSize:10}}>{cp?"✓":"📋"} Copiar</button>
              <button onClick={e=>{e.stopPropagation();setPed({item:i,cli:"",tel:"",cd:i.cd||"À vista",ob:"",its:[]});}} style={{...B,flex:1,background:S.dk,color:S.cr,padding:"6px 0",borderRadius:5,fontWeight:700,fontSize:10}}>📝 Pedido</button>
              {adm&&<button onClick={e=>{e.stopPropagation();setEdit(i.id);setEditD({...i,subs:i.subs?i.subs.map(s=>({...s})):undefined});}} style={{...B,flex:1,background:"#5A4A38",color:S.cr,padding:"6px 0",borderRadius:5,fontWeight:700,fontSize:10}}>✏️ Editar</button>}
            </div>
          </div>}
        </div>
      </div>
    </div>;
  };

  const ct=CATS.find(c=>c.id===cat);const ns=sel.size;

  return(
    <div style={{minHeight:"100vh",background:S.bg,fontFamily:"'Source Sans 3',sans-serif",color:S.dk,maxWidth:480,margin:"0 auto"}}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
      <div style={{background:`linear-gradient(135deg,${S.dk},${S.da})`,padding:"12px 16px 0",position:"sticky",top:0,zIndex:100,boxShadow:"0 4px 20px rgba(44,36,22,0.3)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div><h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:S.cr,margin:0}}>F. Silva Reis</h1><p style={{color:S.ml,fontSize:9,margin:0,fontWeight:600,textTransform:"uppercase",letterSpacing:1.5}}>Central de Preços</p></div>
          <div style={{display:"flex",gap:5}}>
            {adm&&<button onClick={()=>{setAddM(true);setNewI({f:"",e:"",p:"",u:"chapa",pv:0,cd:"",d:"",ob:""});}} style={{...B,background:S.go,color:S.dk,fontSize:10,padding:"4px 10px",borderRadius:6,fontWeight:700}}>＋ Novo</button>}
            <button onClick={()=>setUsr(null)} style={{...B,background:"rgba(255,255,255,0.1)",color:S.cr,fontSize:10,padding:"4px 10px",borderRadius:6,fontWeight:600}}>{usr.icon} {usr.nome}</button>
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
        <span style={{color:"white",fontSize:12,fontWeight:700}}>{ns} selecionado{ns>1?"s":""}</span>
        <div style={{display:"flex",gap:6}}><button onClick={e=>copy(txtSel(),e)} style={{...B,background:S.wa,color:"white",padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:700}}>{cp?"✓ Copiado!":"📋 Copiar WA"}</button><button onClick={()=>setSel(new Set())} style={{...B,background:"rgba(255,255,255,0.2)",color:"white",padding:"5px 10px",borderRadius:6,fontSize:11}}>Limpar</button></div>
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
      <div style={{textAlign:"center",padding:"12px 16px 40px",fontSize:10,color:S.ml}}>{filt.length} itens</div>
    </div>
  );
}
