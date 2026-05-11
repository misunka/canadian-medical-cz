import { useState, useRef, useEffect, useCallback } from "react";

const T = {
  blue:"#1C3B8E", red:"#E8314A", bg:"#F4F6FA", white:"#FFFFFF",
  border:"#E8EAF2", text:"#1A1D2E", muted:"#6B7280", label:"#9CA3AF",
  green:"#22A06B", orange:"#D97706", redLight:"#FEE2E2", blueLight:"#EFF6FF",
};

const S = {
  phone:{ width:375, minHeight:780, background:T.bg, borderRadius:36, border:"8px solid #111827", overflow:"hidden", position:"relative", fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif", margin:"0 auto", display:"flex", flexDirection:"column" },
  sb:{ background:T.white, padding:"12px 20px 8px", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12, fontWeight:600, color:T.text },
  hdr:{ background:T.white, padding:"10px 20px 12px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${T.border}` },
  ht:{ fontSize:15, fontWeight:700, color:T.blue, letterSpacing:1.2, textTransform:"uppercase" },
  sc:{ flex:1, overflowY:"auto", padding:"16px", paddingBottom:90 },
  card:{ background:T.white, borderRadius:10, border:`1px solid ${T.border}`, padding:"16px", marginBottom:12 },
  btnP:{ width:"100%", padding:"14px", borderRadius:10, border:"none", background:T.blue, color:T.white, fontWeight:700, fontSize:15, cursor:"pointer" },
  btnR:{ width:"100%", padding:"14px", borderRadius:10, border:"none", background:T.red, color:T.white, fontWeight:700, fontSize:15, cursor:"pointer" },
  btnO:{ width:"100%", padding:"13px", borderRadius:10, border:`1.5px solid ${T.blue}`, background:"transparent", color:T.blue, fontWeight:700, fontSize:14, cursor:"pointer" },
  sl:{ fontSize:11, fontWeight:700, color:T.muted, letterSpacing:0.8, textTransform:"uppercase", marginBottom:10 },
  nav:{ position:"absolute", bottom:0, left:0, right:0, background:T.white, borderTop:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-around", padding:"10px 0 14px", height:64 },
  ni:(a)=>({ display:"flex", flexDirection:"column", alignItems:"center", gap:3, fontSize:10, fontWeight:a?700:400, color:a?T.red:T.muted, cursor:"pointer" }),
  fab:{ width:52, height:52, borderRadius:26, background:T.red, border:"none", color:T.white, fontSize:28, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", marginTop:-18, boxShadow:"0 2px 8px rgba(232,49,74,0.35)" },
  chip:(a)=>({ padding:"8px 14px", borderRadius:10, border:`1px solid ${a?T.blue:T.border}`, background:a?T.blue:T.white, color:a?T.white:T.muted, fontSize:13, fontWeight:a?700:400, cursor:"pointer" }),
  tag:(c)=>({ display:"inline-block", padding:"3px 9px", borderRadius:6, fontSize:11, fontWeight:600, background:c==="g"?"#D1FAE5":c==="o"?"#FEF3C7":c==="r"?T.redLight:T.blueLight, color:c==="g"?"#065F46":c==="o"?T.orange:c==="r"?T.red:T.blue }),
};

const Leaf=({size=22,color=T.red})=><svg width={size} height={size} viewBox="0 0 40 40" fill={color}><path d="M20 2 L22 12 L30 8 L26 16 L36 18 L28 22 L32 32 L22 26 L20 38 L18 26 L8 32 L12 22 L4 18 L14 16 L10 8 L18 12 Z"/></svg>;
const PulseIcon=({size=30})=>(<div style={{width:size,height:size,borderRadius:size/2,background:T.blue,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width={size*.6} height={size*.6} viewBox="0 0 24 24" fill="none" stroke={T.white} strokeWidth="2.5" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>);
const Back=({onClick})=>(<div onClick={onClick} style={{cursor:"pointer",padding:"4px 8px 4px 0"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg></div>);

function TypingDots(){
  const [f,setF]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setF(x=>(x+1)%4),400);return()=>clearInterval(t);},[]);
  return <div style={{display:"flex",gap:4,padding:"2px 0"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:f>i?T.blue:"#D1D5DB",transition:"background 0.15s"}}/>)}</div>;
}

function PDFChip({name,onRemove}){
  return(<div style={{display:"inline-flex",alignItems:"center",gap:6,background:T.redLight,border:`1px solid #FECACA`,borderRadius:8,padding:"5px 10px",fontSize:12}}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
    <span style={{color:T.text,fontWeight:600,maxWidth:110,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{name}</span>
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
    {onRemove&&<span onClick={onRemove} style={{cursor:"pointer",color:T.muted,fontSize:13,lineHeight:1}}>×</span>}
  </div>);
}

function AIChat({onClose,context,uploadedDoc,initialPrompt,quickActions}){
  const SYS=`You are a warm, empathetic AI health assistant for Canadian Medical clinic in Prague. ${context||""} ${uploadedDoc?`Patient uploaded: "${uploadedDoc}".`:""} Keep responses to 3–4 sentences. Bold the opening sentence. Never diagnose. For emergencies advise calling 155.`;
  const [msgs,setMsgs]=useState([{role:"ai",text:"Hello! I'm your CM Assistant. How can I help you today?",ts:new Date()}]);
  const [inp,setInp]=useState(initialPrompt||"");
  const [loading,setLoading]=useState(false);
  const [drag,setDrag]=useState(false);
  const [doc,setDoc]=useState(uploadedDoc||null);
  const ref=useRef(null);
  const fref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[msgs,loading]);
  useEffect(()=>{if(initialPrompt)setTimeout(()=>send(initialPrompt),300);},[]);
  const handleFile=f=>{if(!f)return;setDoc(f.name);setMsgs(m=>[...m,{role:"system",text:`Dokument nahrán: ${f.name}`,ts:new Date()}]);};
  const onDrop=useCallback(e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);},[]);
  const send=async(override)=>{
    const txt=(override||inp).trim();if(!txt||loading)return;
    if(!override)setInp("");
    setMsgs(m=>[...m,{role:"user",text:txt,ts:new Date()}]);setLoading(true);
    try{
      const hist=msgs.filter(m=>m.role!=="system").map(m=>({role:m.role==="ai"?"assistant":"user",content:m.text.replace(/\*\*/g,"")}));
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYS,messages:[...hist,{role:"user",content:txt}]})});
      const d=await res.json();
      setMsgs(m=>[...m,{role:"ai",text:d.content?.map(c=>c.text).join("")||"Zkuste to prosím znovu.",ts:new Date()}]);
    }catch{setMsgs(m=>[...m,{role:"ai",text:"Chyba připojení.",ts:new Date()}]);}
    setLoading(false);
  };
  const fmt=ts=>ts.toLocaleTimeString("cs-CZ",{hour:"2-digit",minute:"2-digit"});
  return(
    <div style={{display:"flex",flexDirection:"column",position:"absolute",inset:0,bottom:64,background:T.bg}}>
      <div style={S.hdr}><Back onClick={onClose}/><div style={{display:"flex",flexDirection:"column",alignItems:"center"}}><span style={S.ht}>CM Asistent</span><div style={{display:"flex",alignItems:"center",gap:4,marginTop:1}}><div style={{width:6,height:6,borderRadius:3,background:T.green}}/><span style={{fontSize:10,color:T.muted}}>AI Online</span></div></div><div style={{width:20}}/></div>
      {doc&&<div style={{background:"#FFFBEB",borderBottom:`1px solid #FDE68A`,padding:"7px 16px",display:"flex",alignItems:"center",gap:8}}><PDFChip name={doc}/><span style={{fontSize:11,color:T.orange,fontWeight:600}}>Aktivní kontext dokumentu</span></div>}
      <div ref={ref} style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:12,minHeight:0}}>
        {msgs.map((m,i)=>m.role==="system"?(
          <div key={i} style={{display:"flex",justifyContent:"center"}}><div style={{background:"#D1FAE5",border:`1px solid #6EE7B7`,borderRadius:20,padding:"4px 12px",fontSize:11,color:"#065F46",display:"flex",alignItems:"center",gap:5}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>{m.text}</div></div>
        ):(
          <div key={i} style={{display:"flex",flexDirection:m.role==="user"?"row-reverse":"row",gap:8,alignItems:"flex-end"}}>
            {m.role==="ai"?<PulseIcon size={30}/>:<div style={{width:30,height:30,borderRadius:15,background:T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>}
            <div style={{maxWidth:"76%"}}>
              <div style={{padding:"10px 14px",borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.role==="user"?T.blue:T.white,border:m.role==="ai"?`1px solid ${T.border}`:"none",color:m.role==="user"?T.white:T.text,fontSize:13.5,lineHeight:1.6}}>
                {m.text.split(/\*\*(.*?)\*\*/).map((p,pi)=>pi%2===1?<strong key={pi}>{p}</strong>:<span key={pi}>{p}</span>)}
              </div>
              <div style={{fontSize:10,color:T.label,marginTop:3,textAlign:m.role==="user"?"right":"left",paddingLeft:m.role==="ai"?4:0}}>{m.role==="ai"&&"CM Asistent · "}{fmt(m.ts)}</div>
            </div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",gap:8,alignItems:"flex-end"}}><PulseIcon size={30}/><div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:"14px 14px 14px 4px",padding:"10px 14px"}}><TypingDots/></div></div>}
      </div>
      <div onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={onDrop} onClick={()=>fref.current?.click()} style={{margin:"0 16px 8px",border:`1.5px dashed ${drag?T.blue:T.border}`,borderRadius:10,padding:"8px 12px",background:drag?T.blueLight:"transparent",display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={drag?T.blue:T.muted} strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        {doc?<><PDFChip name={doc}/><span style={{fontSize:11,color:T.muted}}>Nahradit</span></>:<span style={{fontSize:12,color:T.muted}}>Nahrát recept, sken nebo zprávu (PDF)</span>}
        <input ref={fref} type="file" accept=".pdf,.jpg,.png" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
      </div>
      <div style={{paddingLeft:16,paddingBottom:6,display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",flexShrink:0}}>
        {(quickActions||[]).map(qa=><button key={qa.label} onClick={()=>send(qa.prompt)} style={{padding:"7px 13px",borderRadius:20,border:`1px solid ${T.border}`,background:T.white,fontSize:11,color:T.blue,cursor:"pointer",whiteSpace:"nowrap",fontWeight:600,flexShrink:0}}>{qa.label}</button>)}
      </div>
      <div style={{padding:"6px 16px 8px",background:T.white,borderTop:`1px solid ${T.border}`,display:"flex",gap:8,flexShrink:0}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Zeptejte se na cokoli…" style={{flex:1,padding:"10px 14px",borderRadius:22,border:`1px solid ${T.border}`,fontSize:13.5,outline:"none",background:T.bg,color:T.text,fontFamily:"inherit"}}/>
        <button onClick={()=>send()} style={{width:42,height:42,borderRadius:21,background:inp.trim()?T.blue:"#D1D5DB",border:"none",cursor:inp.trim()?"pointer":"default",color:T.white,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.15s"}}>↑</button>
      </div>
    </div>
  );
}

function EmAlert({onDismiss}){
  return(
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:T.white,borderRadius:12,padding:24,border:`2px solid ${T.red}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <div style={{width:40,height:40,borderRadius:20,background:T.redLight,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
          <div><div style={{fontSize:15,fontWeight:700,color:T.red}}>Zjištěn kritický příznak</div><div style={{fontSize:12,color:T.muted}}>Může být potřeba okamžitá pomoc</div></div>
        </div>
        <p style={{fontSize:13,color:T.text,lineHeight:1.6,margin:"0 0 14px"}}>Uvedli jste příznak, který může vyžadovat <strong>okamžitou lékařskou pomoc</strong>. Nečekejte na svou schůzku.</p>
        <div style={{background:T.redLight,borderRadius:10,padding:"12px",marginBottom:14,textAlign:"center"}}><div style={{fontSize:12,fontWeight:600,color:"#991B1B"}}>Život ohrožující situace?</div><div style={{fontSize:20,fontWeight:700,color:T.red}}>Volejte 155 nebo 112</div></div>
        <button onClick={onDismiss} style={{...S.btnO,color:T.muted,borderColor:T.border,fontSize:13}}>Mé příznaky nejsou naléhavé — pokračovat</button>
      </div>
    </div>
  );
}

// ── FEATURE A ────────────────────────────────────────────────────────────────
function PBar({value,min,max,status}){
  const bc=status==="normal"?T.green:status==="high"?T.red:T.orange;
  const span=max*1.4-min*0.8, dot=Math.min(Math.round(((value-min*0.8)/span)*100),95);
  const rs=Math.round(((min-min*0.8)/span)*100), re=Math.round(((max-min*0.8)/span)*100);
  return(<div style={{marginTop:8,marginBottom:4}}>
    <div style={{position:"relative",height:7,background:"#E5E7EB",borderRadius:4}}>
      <div style={{position:"absolute",left:`${rs}%`,width:`${re-rs}%`,height:"100%",background:"#D1FAE5",borderRadius:4}}/>
      <div style={{position:"absolute",left:`${dot}%`,top:"50%",transform:"translate(-50%,-50%)",width:13,height:13,borderRadius:7,background:bc,border:"2px solid #fff"}}/>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.label,marginTop:4}}><span>Nízká</span><span style={{color:T.green,fontWeight:600}}>Normální rozsah</span><span>Vysoká</span></div>
  </div>);
}

const BM=[
  {name:"Glukóza (nalačno)",code:"S-S-GLU",value:5.4,unit:"mmol/L",min:3.9,max:5.5,status:"normal",note:"V normálním rozsahu. Udržujte stávající životosprávu."},
  {name:"LDL Cholesterol",code:"S-LDL",value:3.8,unit:"mmol/L",min:1.8,max:3.4,status:"high",note:"Mírně zvýšené. Zvažte omezení nasycených tuků a poraďte se s lékařem."},
  {name:"HDL Cholesterol",code:"S-HDL",value:1.3,unit:"mmol/L",min:1.2,max:2.5,status:"normal",note:"Dobrá hodnota. Pravidelná aerobní aktivita pomáhá HDL udržovat."},
];

function FeatureA({onBack}){
  const [tab,setTab]=useState("summary");
  const [chat,setChat]=useState(false);
  const [chatPrompt,setChatPrompt]=useState(null);
  const [doc,setDoc]=useState(null);
  const [drag,setDrag]=useState(false);
  const fref=useRef(null);
  const openChat=(p=null)=>{setChatPrompt(p);setChat(true);};
  if(chat) return <AIChat onClose={()=>{setChat(false);setChatPrompt(null);}} context="Pacient si prohlíží výsledky: Glukóza 5,4 mmol/L (norm.), LDL 3,8 mmol/L (mírně zvýšené), HDL 1,3 mmol/L (norm.)." uploadedDoc={doc} initialPrompt={chatPrompt} quickActions={[{label:"Vysvětlit pojmy",prompt:"Vysvětli mi lékařské pojmy srozumitelně."},{label:"Další kroky",prompt:"Co bych měl/a probrat s lékařem?"},{label:"Trendy",prompt:"Co sledovat pro zlepšení výsledků?"},{label:"Příprava na MRI",prompt:"Jak se připravit na MRI?"}]}/>;
  return(<>
    <div style={S.hdr}><Back onClick={onBack}/><span style={S.ht}>AI Výsledky</span><div style={{display:"flex",alignItems:"center",gap:4}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg><span style={{fontSize:11,color:T.red,fontWeight:600}}>28. 4. 2025</span></div></div>
    <div style={{background:T.white,borderBottom:`1px solid ${T.border}`,display:"flex"}}>
      {[["summary","Přehled"],["details","Biomarkery"],["ask","Zeptat se AI"]].map(([t,l])=>(
        <button key={t} onClick={()=>t==="ask"?openChat():setTab(t)} style={{flex:1,padding:"11px 0",border:"none",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:tab===t?700:400,color:tab===t?T.blue:T.muted,borderBottom:tab===t?`2px solid ${T.blue}`:"2px solid transparent"}}>{l}</button>
      ))}
    </div>
    <div style={S.sc}>
      <div onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)setDoc(f.name);}} onClick={()=>fref.current?.click()} style={{border:`1.5px dashed ${drag?T.blue:T.border}`,borderRadius:10,padding:"12px 14px",marginBottom:12,background:drag?T.blueLight:T.white,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
        {doc?<><PDFChip name={doc} onRemove={e=>{e.stopPropagation();setDoc(null);}}/><span style={{fontSize:12,color:T.muted}}>Klepnutím nahradit</span></>:<><div style={{width:34,height:34,borderRadius:8,background:T.bg,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div><div><div style={{fontSize:13,fontWeight:600,color:T.text}}>Nahrát zprávu</div><div style={{fontSize:11,color:T.muted}}>PDF, RTG nebo doporučení</div></div></>}
        <input ref={fref} type="file" accept=".pdf,.jpg,.png" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)setDoc(f.name);}}/>
      </div>
      {tab==="summary"&&<>
        <div style={{...S.card,background:T.blueLight,border:`1px solid #BFDBFE`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><div style={{width:36,height:36,borderRadius:18,background:T.blue,display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.white} strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg></div><div><div style={{fontSize:11,color:T.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>Celkový stav</div><div style={{fontSize:16,fontWeight:700,color:T.blue}}>Převážně stabilní</div></div></div>
          <p style={{fontSize:13,color:"#374151",lineHeight:1.6,margin:0}}>Vaše výsledky jsou převážně v normě. LDL cholesterol je mírně zvýšený — doporučujeme probrát při příští návštěvě.</p>
        </div>
        <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:0.8,textTransform:"uppercase",margin:"4px 0 8px"}}>Klíčové biomarkery</div>
        {BM.map((b,i)=>(
          <div key={i} style={{...S.card,cursor:"pointer"}} onClick={()=>openChat(`Řekni mi více o výsledku ${b.name}: ${b.value} ${b.unit}.`)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}><div><div style={{fontSize:14,fontWeight:700,color:T.text}}>{b.name}</div><div style={{fontSize:11,color:T.muted}}>{b.code}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:700,color:b.status==="high"?T.red:T.text}}>{b.value}</div><div style={{fontSize:11,color:T.muted}}>{b.unit}</div></div></div>
            <PBar {...b}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}><span style={S.tag(b.status==="normal"?"g":b.status==="high"?"r":"o")}>{b.status==="normal"?"✓ Normální":b.status==="high"?"↑ Nad rozsahem":"↓ Pod rozsahem"}</span><span style={{fontSize:11,color:T.blue,fontWeight:600}}>Zeptat se AI →</span></div>
          </div>
        ))}
        <button onClick={()=>openChat()} style={{...S.btnP,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:4}}><PulseIcon size={20}/>Otevřít AI Med-Explainer</button>
      </>}
      {tab==="details"&&<>
        <div style={{...S.card,background:"#FFFBEB",border:"1px solid #FDE68A"}}><p style={{margin:0,fontSize:13,color:"#92400E",lineHeight:1.5}}><strong>Důležité:</strong> Výsledky jsou pouze informativní. Vždy se poraďte s lékařem.</p></div>
        {BM.map((b,i)=>(
          <div key={i} style={{...S.card,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div><div style={{fontSize:15,fontWeight:700,color:T.text}}>{b.name}</div><div style={{fontSize:12,color:T.muted,marginTop:2}}>Reference: {b.min}–{b.max} {b.unit}</div></div><div style={{fontSize:22,fontWeight:700,color:b.status==="high"?T.red:T.text}}>{b.value} <span style={{fontSize:12,color:T.muted,fontWeight:400}}>{b.unit}</span></div></div>
            <PBar {...b}/>
            <div style={{marginTop:10,padding:"10px 12px",background:T.bg,borderRadius:8,fontSize:13,color:"#374151",lineHeight:1.5}}>{b.note}</div>
          </div>
        ))}
        <button onClick={()=>openChat()} style={{...S.btnP,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><PulseIcon size={20}/>Otevřít AI Med-Explainer</button>
      </>}
    </div>
  </>);
}

// ── FEATURE B ────────────────────────────────────────────────────────────────
// Steps: 0=Příprava, 1=Příznaky, 2=Anamnéza, 3=Předání
const BSTEPS=["Příprava","Příznaky","Anamnéza","Předání"];

function FeatureB({onBack}){
  const [step,setStep]=useState(0);
  const [chat,setChat]=useState(false);
  const [alert,setAlert]=useState(false);

  // Step 0 state
  const [fasting,setFasting]=useState(null);
  const [samples,setSamples]=useState({urine:false,stool:false,blood:false});
  const [docs,setDocs]=useState({vacc:false,child:false,id:false});
  const [concern,setConcern]=useState("");

  // Step 1 state — Symptoms
  const [hasSymptom,setHasSymptom]=useState(null);
  const [symptom,setSymptom]=useState("");
  const [location,setLocation]=useState("");
  const [duration,setDuration]=useState("");
  const [chars,setChars]=useState([]);
  const [aggravating,setAggravating]=useState([]);
  const [relieving,setRelieving]=useState([]);
  const [treatment,setTreatment]=useState("");
  const [severity,setSeverity]=useState(0);
  const [sleep,setSleep]=useState(6);
  const [stress,setStress]=useState(5);

  // Step 2 state — Medical
  const [meds,setMeds]=useState([{name:"Metformin 500mg"},{name:"Vitamin D 1000IU"}]);
  const [newMed,setNewMed]=useState("");
  const [noMedChg,setNoMedChg]=useState(false);
  const [allergies,setAllergies]=useState([{name:"Penicilin"}]);
  const [newAl,setNewAl]=useState("");

  const tog=(arr,set,v)=>set(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v]);
  const chkEmerg=v=>{if(["bolest na hrudi","dušnost","infarkt","mrtvice","chest pain","shortness of breath"].some(k=>v.toLowerCase().includes(k)))setAlert(true);};

  const SBar=()=>(
    <div style={{background:T.white,padding:"10px 16px 8px",borderBottom:`1px solid ${T.border}`}}>
      <div style={{display:"flex",alignItems:"center"}}>
        {BSTEPS.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",flex:i<BSTEPS.length-1?1:"none"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <div style={{width:22,height:22,borderRadius:11,background:step>i?T.green:step===i?T.blue:T.border,color:step>=i?T.white:T.muted,fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{step>i?"✓":i+1}</div>
              <div style={{fontSize:8,color:step===i?T.blue:T.muted,fontWeight:step===i?700:400,whiteSpace:"nowrap"}}>{s}</div>
            </div>
            {i<BSTEPS.length-1&&<div style={{flex:1,height:2,background:step>i?T.green:T.border,margin:"0 3px",marginBottom:14}}/>}
          </div>
        ))}
      </div>
    </div>
  );

  if(chat) return <AIChat onClose={()=>setChat(false)} context="Pacient se připravuje na návštěvu praktického lékaře." quickActions={[{label:"Co mě čeká",prompt:"Co se děje při návštěvě PL?"},{label:"Odběr nalačno",prompt:"Jak se připravit na odběr krve nalačno?"},{label:"O Metforminu",prompt:"K čemu se používá Metformin?"}]}/>;

  // Step 0 — Preparation
  if(step===0) return(<>
    {alert&&<EmAlert onDismiss={()=>setAlert(false)}/>}
    <div style={S.hdr}><Back onClick={onBack}/><span style={S.ht}>Digitální sestra</span><div style={{fontSize:11,color:T.muted}}>Návštěva PL</div></div>
    <SBar/>
    <div style={S.sc}>
      <div style={{...S.card,background:T.blueLight,border:`1px solid #BFDBFE`}}>
        <div style={{display:"flex",gap:10,alignItems:"center"}}><PulseIcon size={32}/><div><div style={{fontSize:14,fontWeight:700,color:T.blue}}>Dobré ráno, Lucie</div><div style={{fontSize:12,color:T.muted,marginTop:2}}>Vaše návštěva je za <strong style={{color:T.blue}}>2 hodiny</strong>. Připravíme se společně.</div></div></div>
      </div>
      <div style={S.card}>
        <div style={S.sl}>Hlavní důvod návštěvy</div>
        <textarea value={concern} onChange={e=>{setConcern(e.target.value);chkEmerg(e.target.value);}} placeholder="Co je hlavním cílem dnešní návštěvy?" style={{width:"100%",minHeight:72,padding:"10px 12px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:13,lineHeight:1.5,resize:"none",outline:"none",background:T.bg,boxSizing:"border-box",color:T.text,fontFamily:"inherit"}}/>
      </div>
      <div style={S.card}>
        <div style={S.sl}>Stav nalačno</div>
        <div style={{display:"flex",gap:8}}>
          {["Ano — jsem nalačno","Ne — jedl/a jsem"].map(opt=>(
            <button key={opt} onClick={()=>setFasting(opt.startsWith("Ano"))} style={{flex:1,padding:"9px 6px",borderRadius:10,border:`1px solid ${fasting===(opt.startsWith("Ano"))?T.blue:T.border}`,background:fasting===(opt.startsWith("Ano"))?T.blue:"transparent",color:fasting===(opt.startsWith("Ano"))?T.white:T.muted,fontWeight:700,fontSize:11,cursor:"pointer"}}>{opt}</button>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <div style={S.sl}>Připravené vzorky</div>
        {[["urine","🧪","Vzorek moče"],["stool","🟤","Vzorek stolice"],["blood","🩸","Odběr krve (v ordinaci)"]].map(([k,ic,lbl])=>(
          <label key={k} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}>
            <input type="checkbox" checked={samples[k]} onChange={e=>setSamples(s=>({...s,[k]:e.target.checked}))} style={{accentColor:T.blue,width:16,height:16}}/>
            <span style={{fontSize:13,color:T.text}}>{ic} {lbl}</span>
          </label>
        ))}
      </div>
      <div style={S.card}>
        <div style={S.sl}>Dokumenty</div>
        {[["vacc","💉","Očkovací průkaz"],["child","📗","Zdravotní knížka dítěte"],["id","🪪","Průkaz pojištěnce / OP"]].map(([k,ic,lbl])=>(
          <label key={k} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}>
            <input type="checkbox" checked={docs[k]} onChange={e=>setDocs(d=>({...d,[k]:e.target.checked}))} style={{accentColor:T.blue,width:16,height:16}}/>
            <span style={{fontSize:13,color:T.text}}>{ic} {lbl}</span>
          </label>
        ))}
      </div>
      <button onClick={()=>setStep(1)} style={S.btnP}>Pokračovat k příznakům</button>
    </div>
  </>);

  // Step 1 — Symptoms
  if(step===1) return(<>
    {alert&&<EmAlert onDismiss={()=>setAlert(false)}/>}
    <div style={S.hdr}><Back onClick={()=>setStep(0)}/><span style={S.ht}>Digitální sestra</span><div style={{fontSize:11,color:T.muted}}>Návštěva PL</div></div>
    <SBar/>
    <div style={S.sc}>
      <div style={S.card}>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:8}}>Máte nové nebo zhoršující se příznaky?</div>
        <div style={{display:"flex",gap:8}}>
          {["Ano","Ne — cítím se stabilně"].map(opt=>(
            <button key={opt} onClick={()=>setHasSymptom(opt==="Ano")} style={{flex:1,padding:"10px",borderRadius:10,border:`1px solid ${hasSymptom===(opt==="Ano")?T.blue:T.border}`,background:hasSymptom===(opt==="Ano")?T.blue:"transparent",color:hasSymptom===(opt==="Ano")?T.white:T.muted,fontWeight:700,fontSize:12,cursor:"pointer"}}>{opt}</button>
          ))}
        </div>
      </div>
      {hasSymptom===true&&<>
        <div style={{...S.card,border:`1.5px solid ${T.blue}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <div style={{width:4,height:26,borderRadius:2,background:T.blue,flexShrink:0}}/>
            <div><div style={{fontSize:14,fontWeight:700,color:T.blue}}>Triáž příznaků — OLD CARTS</div><div style={{fontSize:11,color:T.muted}}>Standardizovaný klinický dotazník</div></div>
          </div>
          {[
            {lbl:"Vznik — Hlavní příznak",ph:"např. Bolest dolní části zad",val:symptom,set:v=>{setSymptom(v);chkEmerg(v);}},
            {lbl:"Lokalizace — Kde přesně?",ph:"např. Levá dolní část zad, vyzařuje do nohy",val:location,set:setLocation},
            {lbl:"Trvání — Jak dlouho?",ph:"např. 3 dny, začalo náhle",val:duration,set:setDuration},
            {lbl:"Léčba — Vyzkoušeli jste něco?",ph:"např. Ibuprofen 400 mg, led",val:treatment,set:setTreatment},
          ].map(f=>(
            <div key={f.lbl} style={{marginBottom:10}}>
              <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:4}}>{f.lbl}</div>
              <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:13,outline:"none",background:T.bg,boxSizing:"border-box"}}/>
            </div>
          ))}
          <div style={{marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:6}}>Charakter — Jak bolest vypadá?</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{["Tupá","Ostrá","Pálení","Tepání","Křeče","Tlak","Píchání","Trhavá"].map(c=><button key={c} onClick={()=>tog(chars,setChars,c)} style={S.chip(chars.includes(c))}>{c}</button>)}</div>
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:6}}>Zhoršující faktory</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{["Pohyb","Sezení","Stání","Jídlo","Stres","Chlad","Teplo"].map(c=><button key={c} onClick={()=>tog(aggravating,setAggravating,c)} style={S.chip(aggravating.includes(c))}>{c}</button>)}</div>
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:6}}>Úlevné faktory</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{["Klid","Led","Teplo","Léky","Elevace","Masáž"].map(c=><button key={c} onClick={()=>tog(relieving,setRelieving,c)} style={S.chip(relieving.includes(c))}>{c}</button>)}</div>
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:8}}>Intenzita bolesti (1–10)</div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              {[1,2,3,4,5,6,7,8,9,10].map(n=>{const cs=["#22A06B","#22A06B","#22A06B","#F59E0B","#F59E0B","#F97316","#F97316","#EF4444","#DC2626","#B91C1C"];return <div key={n} onClick={()=>setSeverity(n)} style={{width:26,height:26,borderRadius:13,background:severity===n?cs[n-1]:T.bg,border:severity===n?`2px solid ${cs[n-1]}`:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,cursor:"pointer",color:severity===n?T.white:T.muted}}>{n}</div>;})}
            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:10,color:T.green,fontWeight:600}}>Bez bolesti</span><span style={{fontSize:10,color:"#B91C1C",fontWeight:600}}>Nejhorší bolest</span></div>
          </div>
        </div>
        <div style={S.card}>
          <div style={S.sl}>Životní styl</div>
          {[{lbl:"Kvalita spánku",val:sleep,set:setSleep,L:"Velmi špatná",R:"Výborná"},{lbl:"Úroveň stresu",val:stress,set:setStress,L:"Velmi nízká",R:"Extrémní"}].map(s=>(
            <div key={s.lbl} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,fontWeight:600,color:T.text}}>{s.lbl}</span><span style={{fontSize:13,fontWeight:700,color:T.blue}}>{s.val}/10</span></div>
              <input type="range" min="1" max="10" step="1" value={s.val} onChange={e=>s.set(Number(e.target.value))} style={{width:"100%",accentColor:T.blue}}/>
              <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:10,color:T.muted}}>{s.L}</span><span style={{fontSize:10,color:T.muted}}>{s.R}</span></div>
            </div>
          ))}
        </div>
      </>}
      <button onClick={()=>setStep(2)} style={{...S.btnP,opacity:hasSymptom!==null?1:0.4}}>Pokračovat na anamnézu</button>
    </div>
  </>);

  // Step 2 — Medical history
  if(step===2) return(<>
    <div style={S.hdr}><Back onClick={()=>setStep(1)}/><span style={S.ht}>Digitální sestra</span><div style={{fontSize:11,color:T.muted}}>Návštěva PL</div></div>
    <SBar/>
    <div style={S.sc}>
      <div style={S.card}>
        <div style={S.sl}>Současná medikace</div>
        {meds.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
            <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{m.name}</div><div style={{fontSize:11,color:T.muted}}>Dle předchozích záznamů</div></div>
            <span style={S.tag("g")}>✓ Potvrzeno</span>
          </div>
        ))}
        <label style={{display:"flex",alignItems:"center",gap:8,marginTop:10,marginBottom:8,cursor:"pointer"}}>
          <input type="checkbox" checked={noMedChg} onChange={e=>setNoMedChg(e.target.checked)} style={{accentColor:T.blue,width:16,height:16}}/>
          <span style={{fontSize:13,color:T.text}}>Od poslední návštěvy žádné změny</span>
        </label>
        {!noMedChg&&<div style={{display:"flex",gap:8}}>
          <input value={newMed} onChange={e=>setNewMed(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(setMeds(m=>[...m,{name:newMed.trim()}]),setNewMed(""))} placeholder="Přidat nový lék…" style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:13,outline:"none",background:T.bg}}/>
          <button onClick={()=>{if(newMed.trim()){setMeds(m=>[...m,{name:newMed.trim()}]);setNewMed("");}}} style={{padding:"8px 14px",borderRadius:8,background:T.blue,border:"none",color:T.white,fontWeight:700,fontSize:13,cursor:"pointer"}}>Přidat</button>
        </div>}
      </div>
      <div style={S.card}>
        <div style={S.sl}>Známé alergie</div>
        {allergies.map((a,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:13,fontWeight:600,color:T.text}}>{a.name}</span>
            <span style={S.tag("o")}>⚠ Alergie</span>
          </div>
        ))}
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <input value={newAl} onChange={e=>setNewAl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(setAllergies(a=>[...a,{name:newAl.trim()}]),setNewAl(""))} placeholder="Přidat alergii…" style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:13,outline:"none",background:T.bg}}/>
          <button onClick={()=>{if(newAl.trim()){setAllergies(a=>[...a,{name:newAl.trim()}]);setNewAl("");}}} style={{padding:"8px 14px",borderRadius:8,background:T.red,border:"none",color:T.white,fontWeight:700,fontSize:13,cursor:"pointer"}}>Přidat</button>
        </div>
      </div>
      <button onClick={()=>setStep(3)} style={S.btnP}>Vygenerovat předání lékaři</button>
    </div>
  </>);

  // Step 3 — Handover
  return(<>
    <div style={S.hdr}><Back onClick={()=>setStep(2)}/><span style={S.ht}>Digitální sestra</span><div style={{fontSize:11,color:T.muted}}>Návštěva PL</div></div>
    <SBar/>
    <div style={S.sc}>
      <div style={{...S.card,background:T.blueLight,border:`1px solid #BFDBFE`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><Leaf size={18}/><div><div style={{fontSize:13,fontWeight:700,color:T.blue}}>Předávací zpráva</div><div style={{fontSize:11,color:T.muted}}>MUDr. Vostradovská · dnes 10:00</div></div></div><span style={S.tag("g")}>✓ Odesláno</span></div>
      </div>
      {concern&&<div style={S.card}><div style={S.sl}>Hlavní důvod návštěvy</div><p style={{margin:0,fontSize:13,color:T.text,lineHeight:1.5}}>{concern}</p></div>}
      <div style={S.card}>
        <div style={S.sl}>Příprava</div>
        {fasting!==null&&<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontSize:13,color:T.text}}>Nalačno</span><span style={S.tag(fasting?"g":"o")}>{fasting?"Ano ✓":"Ne"}</span></div>}
        {Object.entries(samples).filter(([,v])=>v).map(([k])=><div key={k} style={{padding:"5px 0",fontSize:13,color:T.text}}>✓ {k==="urine"?"Vzorek moče":k==="stool"?"Vzorek stolice":"Odběr krve"}</div>)}
        {Object.entries(docs).filter(([,v])=>v).map(([k])=><div key={k} style={{padding:"5px 0",fontSize:13,color:T.text}}>✓ {k==="vacc"?"Očkovací průkaz":k==="child"?"Zdravotní knížka":"Průkaz pojištěnce"}</div>)}
      </div>
      {hasSymptom===true&&symptom&&<div style={{...S.card,border:`1px solid ${T.blue}`}}>
        <div style={S.sl}>Triáž příznaků — OLD CARTS</div>
        {[["Příznak",symptom],["Lokalizace",location],["Trvání",duration],["Charakter",chars.join(", ")],["Zhoršující",aggravating.join(", ")],["Úlevné",relieving.join(", ")],["Léčba",treatment],["Intenzita",severity?`${severity}/10`:""]].filter(([,v])=>v).map(([k,v])=>(
          <div key={k} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontSize:12,color:T.muted,fontWeight:600,minWidth:80}}>{k}</span><span style={{fontSize:13,color:k==="Intenzita"&&severity>=8?T.red:T.text,fontWeight:k==="Intenzita"&&severity>=8?700:400}}>{v}</span></div>
        ))}
      </div>}
      {hasSymptom===false&&<div style={S.card}><div style={S.sl}>Příznaky</div><div style={{fontSize:13,color:T.green,fontWeight:600}}>✓ Žádné nové příznaky</div></div>}
      <div style={S.card}><div style={S.sl}>Medikace</div>{meds.map((m,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontSize:13,color:T.text}}>{m.name}</span><span style={S.tag("g")}>Potvrzeno</span></div>)}{noMedChg&&<div style={{fontSize:12,color:T.green,marginTop:6,fontWeight:600}}>✓ Žádné změny potvrzeny</div>}</div>
      <div style={S.card}><div style={S.sl}>Alergie</div>{allergies.map((a,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontSize:13,color:T.text}}>{a.name}</span><span style={S.tag("o")}>⚠ Alergie</span></div>)}</div>
      <div style={{...S.card,background:"#D1FAE5",border:"1px solid #6EE7B7",marginBottom:12}}><div style={{display:"flex",gap:10,alignItems:"flex-start"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2" style={{flexShrink:0,marginTop:1}}><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg><p style={{margin:0,fontSize:13,color:"#065F46",lineHeight:1.5}}>Předání dokončeno. Lékař byl informován a zprávu si před návštěvou prostuduje.</p></div></div>
      <button onClick={()=>setChat(true)} style={{...S.btnO,marginBottom:10}}>Zeptat se CM Asistenta</button>
      <button style={S.btnP}>Potvrdit příchod</button>
    </div>
  </>);
}

// ── FEATURE C ────────────────────────────────────────────────────────────────
function FeatureC({onBack}){
  const [chat,setChat]=useState(false);
  const [tab,setTab]=useState("plan");
  const [rxR,setRxR]=useState({});
  const [rehab,setRehab]=useState({});
  const [diet,setDiet]=useState({});
  const rxList=[{name:"Amoxicilin 500 mg",dose:"1 kapsle",freq:"3× denně · 7 dní",urgency:"r"},{name:"Ibuprofen 400 mg",dose:"1 tableta",freq:"Dle potřeby · max 3×/den",urgency:"o"},{name:"Probiotikum (Linex)",dose:"1 kapsle",freq:"2× denně · 14 dní",urgency:"g"}];
  const refs=[{spec:"Ortopedie",reason:"Kontrola disku L5-S1",clinic:"Praha 5 — Waltrovka",priority:"Do 4 týdnů",urgency:"r"},{spec:"Fyzioterapie",reason:"Rehabilitace bederní páteře",clinic:"CM Rehabilitační centrum",priority:"Do 2 týdnů",urgency:"o"}];
  const rehabItems=["10 min ranní protažení","Cvičení kočka-kráva × 15 opakování","Mosty (glute bridges) × 20 opakování","30 min chůze denně","Nesedět déle než 45 minut v kuse"];
  const dietItems=["Zvýšit příjem vody na 2,5 l/den","Omezit průmyslově zpracované potraviny","Přidat Omega-3 (ryby, len)","Vyhýbat se alkoholu během antibiotik"];
  const daysLeft=18, prog=Math.round((30-daysLeft)/30*100);
  if(chat) return <AIChat onClose={()=>setChat(false)} context="Pacient absolvoval návštěvu PL. Léčebný plán: Amoxicilin, Ibuprofen, probiotikum. Doporučení: ortopedie a fyzioterapie. Kontrola za 18 dní." quickActions={[{label:"O Amoxicilinu",prompt:"K čemu slouží Amoxicilin a jaké jsou vedlejší účinky?"},{label:"Tipy na rehabilitaci",prompt:"Jak se motivovat k pravidelné domácí fyzioterapii?"},{label:"Příprava na ortopedii",prompt:"Na co se připravit před návštěvou ortopeda?"}]}/>;
  return(<>
    <div style={S.hdr}><Back onClick={onBack}/><span style={S.ht}>Plán péče</span><button onClick={()=>setChat(true)} style={{display:"flex",alignItems:"center",gap:5,background:T.blueLight,border:"none",borderRadius:8,padding:"5px 10px",cursor:"pointer"}}><PulseIcon size={16}/><span style={{fontSize:11,fontWeight:700,color:T.blue}}>Zeptat se AI</span></button></div>
    <div style={{background:T.white,borderBottom:`1px solid ${T.border}`,display:"flex"}}>
      {[["plan","Plán"],["rx","Recepty"],["referrals","Doporučení"]].map(([t,l])=>(
        <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"11px 0",border:"none",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:tab===t?700:400,color:tab===t?T.blue:T.muted,borderBottom:tab===t?`2px solid ${T.blue}`:"2px solid transparent"}}>{l}</button>
      ))}
    </div>
    <div style={S.sc}>
      {tab==="plan"&&<>
        <div style={{...S.card,background:T.blue,border:"none"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div><div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.65)",textTransform:"uppercase",letterSpacing:0.8}}>Příští schůzka</div><div style={{fontSize:26,fontWeight:700,color:T.white,marginTop:2,lineHeight:1}}>{daysLeft} <span style={{fontSize:14,fontWeight:400}}>dní</span></div><div style={{fontSize:12,color:"rgba(255,255,255,0.75)",marginTop:2}}>Kontrola PL · 23. 5. 2025</div></div>
            <div style={{width:52,height:52,borderRadius:26,background:"rgba(255,255,255,0.15)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{fontSize:16,fontWeight:700,color:T.white}}>{prog}%</div><div style={{fontSize:8,color:"rgba(255,255,255,0.65)"}}>uzdravení</div></div>
          </div>
          <div style={{height:4,background:"rgba(255,255,255,0.2)",borderRadius:2}}><div style={{height:"100%",background:T.white,borderRadius:2,width:`${prog}%`}}/></div>
        </div>
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={S.sl}>Denní rehabilitační cvičení</div><span style={S.tag("b")}>{Object.values(rehab).filter(Boolean).length}/{rehabItems.length} hotovo</span></div>
          {rehabItems.map((item,i)=>(
            <label key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}>
              <div onClick={()=>setRehab(r=>({...r,[i]:!r[i]}))} style={{width:20,height:20,borderRadius:5,border:`1.5px solid ${rehab[i]?T.blue:T.border}`,background:rehab[i]?T.blue:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,cursor:"pointer"}}>{rehab[i]&&<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.white} strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}</div>
              <span style={{fontSize:13,color:rehab[i]?T.muted:T.text,textDecoration:rehab[i]?"line-through":"none",lineHeight:1.4}}>{item}</span>
            </label>
          ))}
        </div>
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={S.sl}>Dietní doporučení</div><span style={S.tag("g")}>{Object.values(diet).filter(Boolean).length}/{dietItems.length} dodrženo</span></div>
          {dietItems.map((item,i)=>(
            <label key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}>
              <div onClick={()=>setDiet(d=>({...d,[i]:!d[i]}))} style={{width:20,height:20,borderRadius:5,border:`1.5px solid ${diet[i]?T.green:T.border}`,background:diet[i]?T.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,cursor:"pointer"}}>{diet[i]&&<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.white} strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}</div>
              <span style={{fontSize:13,color:diet[i]?T.muted:T.text,textDecoration:diet[i]?"line-through":"none",lineHeight:1.4}}>{item}</span>
            </label>
          ))}
        </div>
      </>}
      {tab==="rx"&&<>
        <div style={{...S.card,background:"#FFFBEB",border:`1px solid #FDE68A`,marginBottom:12}}><p style={{margin:0,fontSize:12,color:"#92400E",lineHeight:1.5}}><strong>Extrahováno ze záznamu návštěvy</strong> — 5. 5. 2025, MUDr. Vostradovská.</p></div>
        {rxList.map((rx,i)=>(
          <div key={i} style={{...S.card,marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}><div><div style={{fontSize:15,fontWeight:700,color:T.text}}>{rx.name}</div><div style={{fontSize:12,color:T.muted,marginTop:2}}>{rx.dose} · {rx.freq}</div></div><span style={S.tag(rx.urgency)}>{rx.urgency==="r"?"Prioritní":rx.urgency==="o"?"Pravidelný":"Podpůrný"}</span></div>
            <button onClick={()=>setRxR(r=>({...r,[i]:!r[i]}))} style={{width:"100%",padding:"9px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,border:`1px solid ${rxR[i]?T.green:T.blue}`,background:rxR[i]?"#D1FAE5":"transparent",color:rxR[i]?T.green:T.blue,transition:"all 0.15s"}}>{rxR[i]?"✓ Připomínka nastavena":"🔔 Nastavit připomínku"}</button>
          </div>
        ))}
      </>}
      {tab==="referrals"&&<>
        <div style={{...S.card,background:T.blueLight,border:`1px solid #BFDBFE`,marginBottom:12}}><p style={{margin:0,fontSize:12,color:"#1E40AF",lineHeight:1.5}}><strong>2 doporučení extrahována</strong> ze záznamu návštěvy.</p></div>
        {refs.map((r,i)=>(
          <div key={i} style={{...S.card,marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}><div style={{fontSize:15,fontWeight:700,color:T.text}}>{r.spec}</div><span style={S.tag(r.urgency)}>{r.priority}</span></div>
            <div style={{fontSize:13,color:T.muted,marginBottom:4}}>{r.reason}</div>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:12}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg><span style={{fontSize:12,color:T.muted}}>{r.clinic}</span></div>
            <button style={{...S.btnP,fontSize:13,padding:"10px"}}>Objednat se →</button>
          </div>
        ))}
      </>}
    </div>
  </>);
}

// ── HOME ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("home");
  const [navTab,setNavTab]=useState("Moje zdraví");
  const Nav=()=>(<div style={S.nav}>{[["🏠","Události"],["♥","Moje zdraví"],null,["✉","Novinky"],["👤","Profil"]].map((item,i)=>item===null?<button key="fab" style={S.fab} onClick={()=>setScreen("home")}>+</button>:<div key={i} onClick={()=>{setNavTab(item[1]);setScreen("home");}} style={S.ni(navTab===item[1])}><span style={{fontSize:16}}>{item[0]}</span><span>{item[1]}</span></div>)}</div>);
  const Shell=({children})=>(<div style={{background:"#111827",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}><div style={S.phone}><div style={S.sb}><span>9:41</span><span>▶ ◀ ■ 95%</span></div>{children}<Nav/></div></div>);
  if(screen==="A") return <Shell><FeatureA onBack={()=>setScreen("home")}/></Shell>;
  if(screen==="B") return <Shell><FeatureB onBack={()=>setScreen("home")}/></Shell>;
  if(screen==="C") return <Shell><FeatureC onBack={()=>setScreen("home")}/></Shell>;
  return(<Shell>
    <div style={{background:T.white,padding:"18px 20px 14px",borderBottom:`1px solid ${T.border}`,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
      <Leaf size={26}/><div style={{fontSize:13,fontWeight:700,color:T.blue,letterSpacing:1.2,textTransform:"uppercase"}}>Canadian Medical</div><div style={{fontSize:11,color:T.muted}}>Patient Engagement Suite</div>
    </div>
    <div style={{...S.sc,paddingBottom:90}}>
      <div style={{...S.card,background:T.blueLight,border:`1px solid #BFDBFE`,marginTop:4}}>
        <div style={{fontSize:15,fontWeight:700,color:T.blue}}>Dobré ráno, Lucie 👋</div>
        <div style={{fontSize:13,color:T.muted,marginTop:4,lineHeight:1.5}}>Máte <strong style={{color:T.blue}}>1 nadcházející návštěvu</strong> a aktivní plán péče.</div>
      </div>
      <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:0.8,textTransform:"uppercase",margin:"4px 0 10px"}}>Funkce</div>
      {[
        {key:"A",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,title:"AI výsledky",sub:"AI Med-Explainer",desc:"Vaše výsledky jsou připraveny. 1 hodnota vyžaduje pozornost — LDL cholesterol.",badge:"NOVÉ",badgeC:"r",meta:"28. 4. 2025"},
        {key:"B",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,title:"Nadcházející návštěva",sub:"Digitální sestra — příjem",desc:"Vyplňte příjmový dotazník pro návštěvu praktického lékaře v 10:00.",badge:"DNES",badgeC:"r",meta:"4 kroky"},
        {key:"C",icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.red} strokeWidth="2"><path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"/></svg>,title:"Plán péče",sub:"Péče po návštěvě",desc:"3 recepty, 2 doporučení a denní rehabilitační checklist.",badge:"18 dní zbývá",badgeC:"b",meta:"Kontrola: 23. 5."},
      ].map(f=>(
        <div key={f.key} onClick={()=>setScreen(f.key)} style={{...S.card,cursor:"pointer",marginBottom:10}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:44,height:44,borderRadius:10,background:T.bg,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{f.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6}}>
                <div><div style={{fontSize:14,fontWeight:700,color:T.text}}>{f.title}</div><div style={{fontSize:11,color:T.muted,marginTop:1}}>{f.sub}</div></div>
                <span style={{...S.tag(f.badgeC),flexShrink:0}}>{f.badge}</span>
              </div>
              <div style={{fontSize:13,color:T.muted,lineHeight:1.5,marginTop:6}}>{f.desc}</div>
            </div>
          </div>
          <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:11,color:T.label}}>{f.meta}</span>
            <div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:12,fontWeight:700,color:T.blue}}>Otevřít</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg></div>
          </div>
        </div>
      ))}
      <div style={{marginTop:8,textAlign:"center",padding:"10px 0"}}>
        <div style={{fontSize:11,color:T.muted}}>Život ohrožující situace:</div>
        <div style={{fontSize:14,fontWeight:700,color:T.text}}>Vždy volejte <span style={{color:T.red}}>112</span> nebo <span style={{color:T.red}}>155</span>!</div>
      </div>
    </div>
  </Shell>);
}