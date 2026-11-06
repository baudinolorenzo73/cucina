'use strict';
window.CucinaDataGuard=(()=>{
 const KEYS=['lollo-ricettario-v1','ricettario-menu-calendar-v1','ricettario-community-shopping-v2','ricettario-shopping-v2','ricettario-appearance-v2','ricettario-theme','turni_offline_state_v1'];
 const blocked=new Map(),obj=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
 const text=(v,n)=>typeof v==='string'&&v.length<=n;
 const date=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(new Date(v+'T00:00:00Z').getTime())&&new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v;
 const count=v=>Number.isFinite(v)&&v>0&&v<=10000;
 const unique=a=>new Set(a.map(i=>i.id)).size===a.length;
 function plan(p){return obj(p)&&text(p.notes??'',10000)&&Array.isArray(p.meals)&&p.meals.length<=30&&unique(p.meals)&&p.meals.every(m=>obj(m)&&text(m.id,200)&&text(m.slot,80)&&text(m.dish,200)&&count(m.servings)&&(!m.weeks||['all','odd13','even24','fifth'].includes(m.weeks))&&Array.isArray(m.ingredients)&&m.ingredients.length<=100&&unique(m.ingredients)&&m.ingredients.every(i=>obj(i)&&text(i.id,200)&&text(i.name,180)&&text(String(i.qty??''),40)&&text(i.unit,40)))}
 function validate(key,x){
  let ok=true;
  if(key==='ricettario-menu-calendar-v1')ok=obj(x)&&x.version===1&&['auto','winter','summer'].includes(x.seasonMode)&&/^\d{4}-(0[1-9]|1[0-2])$/.test(x.month)&&count(x.defaultPeople)&&obj(x.templates)&&['winter','summer'].every(s=>Array.isArray(x.templates[s])&&x.templates[s].length===7&&x.templates[s].every(plan))&&obj(x.overrides)&&Object.entries(x.overrides).every(([d,v])=>date(d)&&obj(v)&&count(v.people)&&plan(v.plan));
  if(key==='ricettario-community-shopping-v2')ok=obj(x)&&x.version===2&&date(x.activeDate)&&obj(x.days)&&Object.entries(x.days).every(([d,v])=>date(d)&&obj(v)&&text(v.other,20000)&&Array.isArray(v.items)&&v.items.length<=2000&&unique(v.items)&&v.items.every(i=>obj(i)&&text(i.id,200)&&text(i.name,180)&&text(i.department,100)&&text(i.qty,80)&&['Angelo','Eurospin','Altro'].includes(i.store)&&typeof i.selected==='boolean'));
  if(key==='ricettario-shopping-v2')ok=obj(x)&&Array.isArray(x.items)&&x.items.length<=2000&&unique(x.items)&&x.items.every(i=>obj(i)&&text(i.id,200)&&text(i.name,180)&&text(i.quantity,100)&&text(i.category,100)&&text(i.note??'',500)&&typeof i.done==='boolean')&&Array.isArray(x.selected)&&x.selected.every(i=>text(i,200))&&Array.isArray(x.notes)&&x.notes.every(i=>text(i,20000))&&count(x.people)&&text(x.pantry,100000)&&text(x.extra,100000);
  if(key==='ricettario-appearance-v2'){const hex=v=>/^#[\da-f]{6}$/i.test(v);ok=obj(x)&&hex(x.accent)&&hex(x.secondary)&&['light','dark'].every(k=>Array.isArray(x[k])&&x[k].length===2&&x[k].every(hex))}
  if(key==='ricettario-theme')ok=['light','dark','system'].includes(x);
  if(key==='lollo-ricettario-v1')ok=obj(x)&&Array.isArray(x.recipes);
  if(key==='turni_offline_state_v1')ok=obj(x)&&Array.isArray(x.persone)&&Number.isInteger(x.mese)&&x.mese>=1&&x.mese<=12;
  if(!ok)throw Error('Dati incompleti o non validi nella sezione '+key+'.');
  return x;
 }
 function block(key,message){blocked.set(key,message);show()}
 function show(){const box=document.getElementById('storageWarning');if(box){box.hidden=!blocked.size;box.textContent=blocked.size?'Salvataggio protetto: '+[...blocked.keys()].join(', ')+'. I dati originali sono conservati. Usa “Recupera salvataggi originali” nella sezione Turni, poi ripristina un backup valido.':''}}
 for(const k of KEYS){try{const raw=localStorage.getItem(k);if(raw!==null)validate(k,k==='ricettario-theme'?raw:JSON.parse(raw))}catch(e){blocked.set(k,e.message)}}
 return{KEYS,validate,date,isBlocked:k=>blocked.has(k),block,show,issues:()=>[...blocked.entries()]};
})();

